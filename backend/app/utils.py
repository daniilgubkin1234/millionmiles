from __future__ import annotations

import re
from urllib.parse import urljoin


def only_digits(value: str | None) -> int | None:
    if not value:
        return None
    digits = re.sub(r"[^\d]", "", value)
    return int(digits) if digits else None


def normalize_whitespace(value: str | None) -> str:
    if not value:
        return ""
    return " ".join(value.split())


def absolute_url(base: str, maybe_url: str | None) -> str | None:
    if not maybe_url:
        return None
    return urljoin(base, maybe_url)


def parse_price_to_krw(price_text: str | None) -> int | None:
    if not price_text:
        return None
    match = re.search(r"([\d,]+)\s*만원", price_text)
    if not match:
        return only_digits(price_text)
    number = int(match.group(1).replace(",", ""))
    return number * 10_000
