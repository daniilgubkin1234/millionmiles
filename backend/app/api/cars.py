from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, func, or_, select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Car
from app.schemas import CarFiltersOut, CarOut, CarsListOut, FilterOption


router = APIRouter(prefix="/api/cars", tags=["cars"])


def apply_car_filters(
    stmt,
    *,
    brand: str | None = None,
    model: str | None = None,
    query: str | None = None,
    year_from: int | None = None,
    year_to: int | None = None,
    price_from: int | None = None,
    price_to: int | None = None,
):
    if brand:
        stmt = stmt.where(Car.brand == brand)

    if model:
        stmt = stmt.where(Car.model == model)

    if query:
        stmt = stmt.where(
            or_(
                Car.brand.ilike(f"%{query}%"),
                Car.model.ilike(f"%{query}%"),
                Car.title.ilike(f"%{query}%"),
            )
        )

    year_conditions = []
    if year_from is not None:
        year_conditions.append(Car.year >= year_from)
    if year_to is not None:
        year_conditions.append(Car.year <= year_to)
    if year_conditions:
        stmt = stmt.where(and_(*year_conditions))

    price_conditions = []
    if price_from is not None:
        price_conditions.append(Car.price_krw >= price_from)
    if price_to is not None:
        price_conditions.append(Car.price_krw <= price_to)
    if price_conditions:
        stmt = stmt.where(and_(*price_conditions))

    return stmt


@router.get("", response_model=CarsListOut)
def list_cars(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=60),
    brand: str | None = None,
    model: str | None = None,
    query: str | None = None,
    year_from: int | None = Query(default=None, ge=1900, le=2100),
    year_to: int | None = Query(default=None, ge=1900, le=2100),
    price_from: int | None = Query(default=None, ge=0),
    price_to: int | None = Query(default=None, ge=0),
    db: Session = Depends(get_db),
) -> CarsListOut:
    stmt = apply_car_filters(
        select(Car),
        brand=brand,
        model=model,
        query=query,
        year_from=year_from,
        year_to=year_to,
        price_from=price_from,
        price_to=price_to,
    )

    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0

    stmt = (
        stmt.order_by(Car.updated_at.desc(), Car.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )

    items = db.scalars(stmt).all()
    return CarsListOut(
        items=[CarOut.model_validate(item) for item in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/filters", response_model=CarFiltersOut)
def get_filters(
    brand: str | None = None,
    query: str | None = None,
    year_from: int | None = Query(default=None, ge=1900, le=2100),
    year_to: int | None = Query(default=None, ge=1900, le=2100),
    price_from: int | None = Query(default=None, ge=0),
    price_to: int | None = Query(default=None, ge=0),
    db: Session = Depends(get_db),
) -> CarFiltersOut:
    base_stmt = apply_car_filters(
        select(Car),
        query=query,
        year_from=year_from,
        year_to=year_to,
        price_from=price_from,
        price_to=price_to,
    )

    brand_rows = db.execute(
        apply_car_filters(
            select(Car.brand, func.count(Car.id))
            .group_by(Car.brand)
            .order_by(func.count(Car.id).desc(), Car.brand.asc()),
            query=query,
            year_from=year_from,
            year_to=year_to,
            price_from=price_from,
            price_to=price_to,
        )
    ).all()

    model_rows = db.execute(
        apply_car_filters(
            select(Car.model, func.count(Car.id))
            .group_by(Car.model)
            .order_by(func.count(Car.id).desc(), Car.model.asc()),
            brand=brand,
            query=query,
            year_from=year_from,
            year_to=year_to,
            price_from=price_from,
            price_to=price_to,
        )
    ).all()

    stats_stmt = base_stmt
    if brand:
        stats_stmt = stats_stmt.where(Car.brand == brand)

    stats_subquery = stats_stmt.subquery()
    stats = db.execute(
        select(
            func.min(stats_subquery.c.year),
            func.max(stats_subquery.c.year),
            func.min(stats_subquery.c.price_krw),
            func.max(stats_subquery.c.price_krw),
        )
    ).one()

    return CarFiltersOut(
        brands=[FilterOption(value=value, count=count) for value, count in brand_rows if value],
        models=[FilterOption(value=value, count=count) for value, count in model_rows if value],
        min_year=stats[0],
        max_year=stats[1],
        min_price_krw=stats[2],
        max_price_krw=stats[3],
    )


@router.get("/{car_id}", response_model=CarOut)
def get_car(car_id: int, db: Session = Depends(get_db)) -> CarOut:
    car = db.get(Car, car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return CarOut.model_validate(car)
