from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CarOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
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
    scraped_at: datetime
    updated_at: datetime


class CarsListOut(BaseModel):
    items: list[CarOut]
    total: int
    page: int
    page_size: int


class FilterOption(BaseModel):
    value: str
    count: int


class CarFiltersOut(BaseModel):
    brands: list[FilterOption]
    models: list[FilterOption]
    min_year: int | None
    max_year: int | None
    min_price_krw: int | None
    max_price_krw: int | None


class ScrapeRunOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    items_found: int
    items_created: int
    items_updated: int
    error_text: str | None
    started_at: datetime
    finished_at: datetime | None


class ScrapeTriggerResponse(BaseModel):
    status: str
    message: str
    run_id: int | None = None
