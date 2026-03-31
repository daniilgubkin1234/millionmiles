from __future__ import annotations

from apscheduler.schedulers.blocking import BlockingScheduler

from app.config import settings
from app.db import SessionLocal
from app.services.encar_scraper import run_scrape


def scheduled_job() -> None:
    db = SessionLocal()
    try:
        run_scrape(db)
    finally:
        db.close()


def main() -> None:
    scheduler = BlockingScheduler(timezone="UTC")
    scheduler.add_job(
        scheduled_job,
        "interval",
        hours=settings.scheduler_interval_hours,
        id="encar_daily_scrape",
        replace_existing=True,
    )

    if settings.scheduler_run_on_start:
        scheduled_job()

    scheduler.start()


if __name__ == "__main__":
    main()
