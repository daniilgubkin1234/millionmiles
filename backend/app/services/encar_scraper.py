from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Iterable

from bs4 import BeautifulSoup
from playwright.sync_api import Browser, BrowserContext, Page, sync_playwright
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.models import Car, ScrapeRun
from app.utils import absolute_url, normalize_whitespace, only_digits, parse_price_to_krw


DETAIL_URL_RE = re.compile(r"https?://fem\.encar\.com/cars/detail/(?P<id>\d+)")
YEAR_RE = re.compile(r"(?P<year>\d{2})(?:/\d{2})?식")
MILEAGE_RE = re.compile(r"([\d,]+)\s*km")
PRICE_RE = re.compile(r"([\d,]+)\s*만원")


@dataclass
class CarCandidate:
    source_id: str
    detail_url: str
    listing_text: str


@dataclass
class ParsedCar:
    source_id: str
    source_url: str
    brand: str
    model: str
    title: str
    year: int | None
    mileage_km: int | None
    price_krw: int | None
    price_display: str | None
    image_url: str | None


class EncarScraper:
    def __init__(self, max_cars: int | None = None) -> None:
        self.max_cars = max_cars or settings.scraper_max_cars
        self.max_pages = settings.scraper_max_pages

    def _open_browser(self) -> tuple[Browser, BrowserContext]:
        pw = sync_playwright().start()
        browser = pw.chromium.launch(headless=settings.scraper_headless)
        context = browser.new_context(
            locale="ko-KR",
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1440, "height": 1200},
        )
        context.set_default_timeout(30_000)
        context._playwright = pw  
        return browser, context

    def collect(self) -> list[ParsedCar]:
        browser, context = self._open_browser()
        try:
            candidates = self._extract_candidates(context)
            results: list[ParsedCar] = []
            for candidate in candidates[: self.max_cars]:
                detail_page = context.new_page()
                try:
                    detail_page.goto(candidate.detail_url, wait_until="domcontentloaded")
                    detail_page.wait_for_timeout(1_200)
                    parsed = self._parse_detail(detail_page, candidate)
                    if parsed:
                        results.append(parsed)
                finally:
                    detail_page.close()
            return results
        finally:
            context.close()
            browser.close()
            pw = getattr(context, "_playwright", None)
            if pw:
                pw.stop()

    def _extract_candidates(self, context: BrowserContext) -> list[CarCandidate]:
        candidates: list[CarCandidate] = []
        seen: set[str] = set()

        for page_number in range(1, self.max_pages + 1):
            if len(candidates) >= self.max_cars:
                break

            list_page = context.new_page()
            try:
                list_url = settings.scraper_list_url_template.format(page=page_number)
                list_page.goto(list_url, wait_until="domcontentloaded")
                list_page.wait_for_timeout(1_800)
                new_candidates = self._extract_candidates_from_page(list_page)
                if not new_candidates:
                    break

                added_this_page = 0
                for candidate in new_candidates:
                    if candidate.source_id in seen:
                        continue
                    seen.add(candidate.source_id)
                    candidates.append(candidate)
                    added_this_page += 1
                    if len(candidates) >= self.max_cars:
                        break

                if added_this_page == 0:
                    break
            finally:
                list_page.close()

        if not candidates:
            fallback_page = context.new_page()
            try:
                fallback_page.goto(settings.scraper_base_url, wait_until="domcontentloaded")
                fallback_page.wait_for_timeout(2_500)
                return self._extract_candidates_from_page(fallback_page)
            finally:
                fallback_page.close()

        return candidates

    def _extract_candidates_from_page(self, page: Page) -> list[CarCandidate]:
        html = page.content()
        soup = BeautifulSoup(html, "html.parser")

        candidates: list[CarCandidate] = []
        seen: set[str] = set()

        for anchor in soup.find_all("a", href=True):
            href = anchor.get("href", "")
            absolute = absolute_url(page.url, href) or href
            text = normalize_whitespace(anchor.get_text(" ", strip=True))
            match = DETAIL_URL_RE.search(absolute)

            if not match:
                continue

            source_id = match.group("id")
            if source_id in seen:
                continue

            if not text and anchor.parent:
                text = normalize_whitespace(anchor.parent.get_text(" ", strip=True))

            if not text:
                text = absolute

            seen.add(source_id)
            candidates.append(CarCandidate(source_id=source_id, detail_url=absolute, listing_text=text))

        return candidates

    def _parse_detail(self, page: Page, candidate: CarCandidate) -> ParsedCar | None:
        html = page.content()
        soup = BeautifulSoup(html, "html.parser")
        raw_text = normalize_whitespace(soup.get_text(" ", strip=True))

        title = self._extract_title(soup, raw_text, candidate.listing_text)
        if not title:
            return None

        year = self._extract_year(raw_text, candidate.listing_text)
        mileage = self._extract_mileage(raw_text, candidate.listing_text)
        price_display = self._extract_price_display(raw_text, candidate.listing_text)
        price_krw = parse_price_to_krw(price_display)
        image_url = self._extract_image_url(soup, page)

        brand, model = self._infer_brand_model(candidate.listing_text, title)

        return ParsedCar(
            source_id=candidate.source_id,
            source_url=candidate.detail_url,
            brand=brand,
            model=model,
            title=title,
            year=year,
            mileage_km=mileage,
            price_krw=price_krw,
            price_display=price_display,
            image_url=image_url,
        )

    def _extract_title(self, soup: BeautifulSoup, raw_text: str, listing_text: str) -> str:
        candidates = [
            soup.select_one("h3"),
            soup.select_one("h1"),
            soup.select_one("meta[property='og:title']"),
        ]
        for node in candidates:
            if not node:
                continue
            if getattr(node, "name", "") == "meta":
                content = normalize_whitespace(node.get("content"))
                if content:
                    return content.split("경남 중고차")[0].split("중고차")[0].strip(" :")
            else:
                text = normalize_whitespace(node.get_text(" ", strip=True))
                if text:
                    return text

        if listing_text:
            stripped = re.sub(r"\d{2}/\d{2}식.*$", "", listing_text).strip()
            if stripped:
                return stripped

        return ""

    def _extract_year(self, raw_text: str, listing_text: str) -> int | None:
        for text in (raw_text, listing_text):
            match = YEAR_RE.search(text)
            if match:
                year_2 = int(match.group("year"))
                return 2000 + year_2 if year_2 < 40 else 1900 + year_2
        return None

    def _extract_mileage(self, raw_text: str, listing_text: str) -> int | None:
        for text in (raw_text, listing_text):
            match = MILEAGE_RE.search(text)
            if match:
                return only_digits(match.group(1))
        return None

    def _extract_price_display(self, raw_text: str, listing_text: str) -> str | None:
        for text in (raw_text, listing_text):
            match = PRICE_RE.search(text)
            if match:
                return f"{match.group(1)} 만원"
        return None

    def _extract_image_url(self, soup: BeautifulSoup, page: Page) -> str | None:
        meta_selectors = [
            "meta[property='og:image']",
            "meta[name='twitter:image']",
        ]
        for selector in meta_selectors:
            node = soup.select_one(selector)
            if node and node.get("content"):
                return absolute_url(page.url, node.get("content"))

        for img in soup.find_all("img"):
            candidates = [
                img.get("src"),
                img.get("data-src"),
                img.get("data-original"),
                img.get("data-lazy"),
            ]

            for src in candidates:
                if not src:
                    continue

                src = absolute_url(page.url, src)
                if not src:
                    continue

                low = src.lower()
                if low.startswith("data:"):
                    continue
                if any(token in low for token in ["blank", "placeholder", "icon", "logo"]):
                    continue
                if not any(ext in low for ext in [".jpg", ".jpeg", ".png", ".webp"]):
                    continue
                return src

        try:
            script_url = page.eval_on_selector(
                "img",
                "el => el?.src || el?.getAttribute('data-src') || null",
            )
            if script_url:
                return absolute_url(page.url, script_url)
        except Exception:
            pass

        return None

    def _infer_brand_model(self, listing_text: str, title: str) -> tuple[str, str]:
        cleaned = normalize_whitespace(listing_text)
        if cleaned:
            cleaned = cleaned.replace("엔카진단", "").replace("엔카믿고", "").strip()
            parts = cleaned.split()
            if parts:
                brand = parts[0]
                if title and title in cleaned:
                    return brand, title
                model = " ".join(parts[1:]).strip()
                model = re.sub(r"\d{2}/\d{2}식.*$", "", model).strip()
                if model:
                    return brand, model

        title_parts = title.split()
        if title_parts:
            return title_parts[0], title
        return "Unknown", title

    def upsert_cars(self, db: Session, cars: Iterable[ParsedCar]) -> tuple[int, int]:
        created = 0
        updated = 0
        now = datetime.now(timezone.utc)

        for item in cars:
            existing = db.scalar(select(Car).where(Car.source_id == item.source_id))
            if existing:
                existing.source_url = item.source_url
                existing.brand = item.brand
                existing.model = item.model
                existing.title = item.title
                existing.year = item.year
                existing.mileage_km = item.mileage_km
                existing.price_krw = item.price_krw
                existing.price_display = item.price_display
                existing.image_url = item.image_url
                existing.scraped_at = now
                existing.updated_at = now
                updated += 1
            else:
                db.add(
                    Car(
                        source_id=item.source_id,
                        source_url=item.source_url,
                        brand=item.brand,
                        model=item.model,
                        title=item.title,
                        year=item.year,
                        mileage_km=item.mileage_km,
                        price_krw=item.price_krw,
                        price_display=item.price_display,
                        image_url=item.image_url,
                        scraped_at=now,
                        updated_at=now,
                    )
                )
                created += 1

        db.commit()
        return created, updated


def run_scrape(db: Session) -> ScrapeRun:
    run = ScrapeRun(status="running", started_at=datetime.now(timezone.utc))
    db.add(run)
    db.commit()
    db.refresh(run)

    scraper = EncarScraper()

    try:
        cars = scraper.collect()
        created, updated = scraper.upsert_cars(db, cars)
        run.status = "success"
        run.items_found = len(cars)
        run.items_created = created
        run.items_updated = updated
        run.finished_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(run)
        return run
    except Exception as exc:
        run.status = "failed"
        run.error_text = str(exc)
        run.finished_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(run)
        return run
