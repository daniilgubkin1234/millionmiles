from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import verify_admin_token
from app.db import get_db
from app.models import ScrapeRun
from app.schemas import ScrapeRunOut, ScrapeTriggerResponse
from app.services.encar_scraper import run_scrape


router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/scrape", response_model=ScrapeTriggerResponse, dependencies=[Depends(verify_admin_token)])
def trigger_scrape(db: Session = Depends(get_db)) -> ScrapeTriggerResponse:
    run = run_scrape(db)
    return ScrapeTriggerResponse(
        status=run.status,
        message="Scrape finished",
        run_id=run.id,
    )


@router.get("/scrape-status", response_model=ScrapeRunOut | None, dependencies=[Depends(verify_admin_token)])
def scrape_status(db: Session = Depends(get_db)) -> ScrapeRunOut | None:
    run = db.scalar(select(ScrapeRun).order_by(ScrapeRun.started_at.desc()))
    if not run:
        return None
    return ScrapeRunOut.model_validate(run)
