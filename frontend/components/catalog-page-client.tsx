"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CarCard } from "@/components/car-card";
import { fetchCars, fetchFilters, formatShortNumber } from "@/lib/api";
import {
  type CatalogFilterState,
  createCatalogQueryString,
  normalizeNumericInput,
  parseNumberInput,
  range,
} from "@/lib/catalog";

type CatalogPageClientProps = {
  initialFilters: CatalogFilterState;
  initialPage: number;
};

type SortMode = "newest" | "price-asc" | "price-desc" | "mileage-asc";

const PAGE_SIZE = 15;

function Field({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-[#d8d3cb] bg-white px-4 py-3 shadow-sm">{children}</div>;
}

function buildPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: (number | string)[] = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) items.push("…");
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < totalPages - 1) items.push("…");
  items.push(totalPages);
  return items;
}

function sortCars<T extends { year: number | null; price_krw: number | null; mileage_km: number | null; updated_at: string }>(
  items: T[],
  sortMode: SortMode,
): T[] {
  const copy = [...items];
  switch (sortMode) {
    case "price-asc":
      return copy.sort((a, b) => (a.price_krw ?? Number.MAX_SAFE_INTEGER) - (b.price_krw ?? Number.MAX_SAFE_INTEGER));
    case "price-desc":
      return copy.sort((a, b) => (b.price_krw ?? 0) - (a.price_krw ?? 0));
    case "mileage-asc":
      return copy.sort((a, b) => (a.mileage_km ?? Number.MAX_SAFE_INTEGER) - (b.mileage_km ?? Number.MAX_SAFE_INTEGER));
    case "newest":
    default:
      return copy.sort((a, b) => {
        const yearDiff = (b.year ?? 0) - (a.year ?? 0);
        if (yearDiff !== 0) return yearDiff;
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
  }
}

export function CatalogPageClient({ initialFilters, initialPage }: CatalogPageClientProps) {
  const router = useRouter();
  const [draftFilters, setDraftFilters] = useState<CatalogFilterState>(initialFilters);
  const [page, setPage] = useState(initialPage);
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  const filterParams = useMemo(
    () => ({
      brand: draftFilters.brand || undefined,
      model: draftFilters.model || undefined,
      yearFrom: parseNumberInput(draftFilters.yearFrom),
      yearTo: parseNumberInput(draftFilters.yearTo),
      priceFrom: parseNumberInput(draftFilters.priceFrom),
      priceTo: parseNumberInput(draftFilters.priceTo),
    }),
    [draftFilters],
  );

  const filtersQuery = useQuery({
    queryKey: ["catalog-filters", filterParams],
    queryFn: () => fetchFilters(filterParams),
  });

  useEffect(() => {
    if (!draftFilters.model) return;
    const exists = filtersQuery.data?.models.some((item) => item.value === draftFilters.model);
    if (!exists) {
      setDraftFilters((current) => ({ ...current, model: "" }));
    }
  }, [draftFilters.model, filtersQuery.data?.models]);

  const carsQuery = useQuery({
    queryKey: ["catalog-cars", filterParams, page],
    queryFn: () => fetchCars({ ...filterParams, page, pageSize: PAGE_SIZE }),
  });

  const countQuery = useQuery({
    queryKey: ["catalog-count", filterParams],
    queryFn: () => fetchCars({ ...filterParams, page: 1, pageSize: 1 }),
  });

  const yearOptions = useMemo(() => {
    if (!filtersQuery.data?.min_year || !filtersQuery.data?.max_year) return [];
    return range(filtersQuery.data.min_year, filtersQuery.data.max_year);
  }, [filtersQuery.data?.max_year, filtersQuery.data?.min_year]);

  const totalPages = Math.max(1, Math.ceil((carsQuery.data?.total ?? 0) / PAGE_SIZE));
  const pageNumbers = buildPageNumbers(page, totalPages);
  const sortedItems = useMemo(() => sortCars(carsQuery.data?.items ?? [], sortMode), [carsQuery.data?.items, sortMode]);

  const applyFilters = (targetPage = 1) => {
    setPage(targetPage);
    router.push(createCatalogQueryString(draftFilters, targetPage), { scroll: false });
  };

  const resetFilters = () => {
    const cleared = { brand: "", model: "", yearFrom: "", yearTo: "", priceFrom: "", priceTo: "" };
    setDraftFilters(cleared);
    setPage(1);
    router.push("/catalog", { scroll: false });
  };

  return (
    <section className="mx-auto max-w-[1920px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="rounded-[34px] bg-[#f0eded] px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-base font-medium uppercase tracking-[0.18em] text-black/45">Каталог автомобилей</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black sm:text-5xl">Найдите автомобиль мечты</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => applyFilters(1)}
              className="inline-flex min-h-[58px] items-center justify-center rounded-2xl bg-[#c6ab6c] px-6 text-lg font-semibold text-black transition hover:brightness-95"
            >
              Показать {formatShortNumber(countQuery.data?.total ?? 0)} авто
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex min-h-[58px] items-center justify-center rounded-2xl border border-black/10 bg-white px-6 text-lg font-medium text-black transition hover:bg-black hover:text-white"
            >
              Сбросить
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-3 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr]">
          <Field>
            <select
              value={draftFilters.brand}
              onChange={(event) => setDraftFilters((current) => ({ ...current, brand: event.target.value, model: "" }))}
              className="w-full bg-transparent text-lg text-black outline-none"
            >
              <option value="">Марка</option>
              {filtersQuery.data?.brands.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <select
              value={draftFilters.model}
              onChange={(event) => setDraftFilters((current) => ({ ...current, model: event.target.value }))}
              className="w-full bg-transparent text-lg text-black outline-none disabled:text-black/35"
              disabled={!filtersQuery.data?.models.length}
            >
              <option value="">Модель</option>
              {filtersQuery.data?.models.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <select
              value={draftFilters.yearFrom}
              onChange={(event) => setDraftFilters((current) => ({ ...current, yearFrom: event.target.value }))}
              className="w-full bg-transparent text-lg text-black outline-none"
            >
              <option value="">Год от</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <select
              value={draftFilters.yearTo}
              onChange={(event) => setDraftFilters((current) => ({ ...current, yearTo: event.target.value }))}
              className="w-full bg-transparent text-lg text-black outline-none"
            >
              <option value="">Год до</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <div className="flex items-center gap-3">
              <input
                value={draftFilters.priceFrom}
                onChange={(event) => setDraftFilters((current) => ({ ...current, priceFrom: normalizeNumericInput(event.target.value) }))}
                placeholder={filtersQuery.data?.min_price_krw ? `От ${formatShortNumber(filtersQuery.data.min_price_krw)}` : "От"}
                className="w-full bg-transparent text-lg text-black outline-none placeholder:text-black/45"
              />
              <span className="text-sm uppercase tracking-[0.14em] text-black/45">KRW</span>
            </div>
          </Field>
          <Field>
            <div className="flex items-center gap-3">
              <input
                value={draftFilters.priceTo}
                onChange={(event) => setDraftFilters((current) => ({ ...current, priceTo: normalizeNumericInput(event.target.value) }))}
                placeholder={filtersQuery.data?.max_price_krw ? `До ${formatShortNumber(filtersQuery.data.max_price_krw)}` : "До"}
                className="w-full bg-transparent text-lg text-black outline-none placeholder:text-black/45"
              />
              <span className="text-sm uppercase tracking-[0.14em] text-black/45">KRW</span>
            </div>
          </Field>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
          Найдено автомобилей: {formatShortNumber(carsQuery.data?.total ?? 0)}
        </h2>

        <div className="flex items-center gap-4 self-start lg:self-auto">
          <label htmlFor="sort-mode" className="text-lg text-black/45">
            Сортировать по:
          </label>
          <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-sm">
            <select
              id="sort-mode"
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="min-w-[220px] bg-transparent text-lg font-medium text-black outline-none"
            >
              <option value="newest">Сначала новые</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
              <option value="mileage-asc">Меньший пробег</option>
            </select>
          </div>
        </div>
      </div>

      {carsQuery.isLoading && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="h-[460px] animate-pulse rounded-[28px] bg-[#ece8e1]" />
          ))}
        </div>
      )}

      {carsQuery.isError && (
        <div className="mt-8 rounded-[28px] border border-rose-300 bg-rose-50 p-6 text-lg text-rose-700">
          Не удалось загрузить каталог. Проверь backend и повтори запрос.
        </div>
      )}

      {!carsQuery.isLoading && !carsQuery.isError && (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {sortedItems.map((car) => (
              <CarCard key={car.id} car={car} compact />
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => applyFilters(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 text-base font-medium text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Назад
            </button>

            {pageNumbers.map((item, index) =>
              typeof item === "number" ? (
                <button
                  key={`${item}-${index}`}
                  type="button"
                  onClick={() => applyFilters(item)}
                  className={`inline-flex h-12 min-w-[48px] items-center justify-center rounded-2xl px-4 text-base font-semibold transition ${
                    item === page ? "bg-[#c6ab6c] text-black" : "border border-black/10 bg-white text-black hover:bg-black hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ) : (
                <span key={`${item}-${index}`} className="px-2 text-xl text-black/35">
                  {item}
                </span>
              ),
            )}

            <button
              type="button"
              onClick={() => applyFilters(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 text-base font-medium text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Вперед
            </button>
          </div>

          <div className="mt-5 text-center text-base text-black/45">
            Страница {page} из {totalPages}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/"
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-black/10 bg-white px-6 text-lg font-medium text-black transition hover:bg-black hover:text-white"
            >
              Вернуться на главную
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
