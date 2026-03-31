from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import select

from app.db import SessionLocal
from app.models import Car


DEMO_CARS = [
    {
        "source_id": "41679686",
        "source_url": "https://fem.encar.com/cars/detail/41679686",
        "brand": "기아",
        "model": "올 뉴 K7 3.3 GDI 노블레스 스페셜",
        "title": "올 뉴 K7 3.3 GDI 노블레스 스페셜",
        "year": 2017,
        "mileage_km": 189126,
        "price_krw": 7500000,
        "price_display": "750 만원",
        "image_url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop",
    },
    {
        "source_id": "demo-2",
        "source_url": "https://fem.encar.com/cars/detail/demo-2",
        "brand": "현대",
        "model": "아이오닉5 롱레인지 AWD 익스클루시브",
        "title": "아이오닉5 롱레인지 AWD 익스클루시브",
        "year": 2023,
        "mileage_km": 192764,
        "price_krw": 21900000,
        "price_display": "2,190 만원",
        "image_url": "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop",
    },
    {
        "source_id": "demo-3",
        "source_url": "https://fem.encar.com/cars/detail/demo-3",
        "brand": "쉐보레",
        "model": "올 뉴 말리부 1.5 터보 LTZ",
        "title": "올 뉴 말리부 1.5 터보 LTZ",
        "year": 2017,
        "mileage_km": 185455,
        "price_krw": 4990000,
        "price_display": "499 만원",
        "image_url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
    },
    {
        "source_id": "demo-4",
        "source_url": "https://fem.encar.com/cars/detail/demo-4",
        "brand": "쉐보레",
        "model": "트레일블레이저 1.3 터보 2WD 프리미어",
        "title": "트레일블레이저 1.3 터보 2WD 프리미어",
        "year": 2021,
        "mileage_km": 193961,
        "price_krw": 9500000,
        "price_display": "950 만원",
        "image_url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    },
]


def main() -> None:
    now = datetime.now(timezone.utc)
    db = SessionLocal()
    try:
        for data in DEMO_CARS:
            existing = db.scalar(select(Car).where(Car.source_id == data["source_id"]))
            if existing:
                continue
            db.add(Car(**data, scraped_at=now, updated_at=now))
        db.commit()
        print("Demo cars inserted")
    finally:
        db.close()


if __name__ == "__main__":
    main()
