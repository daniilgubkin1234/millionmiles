"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CarCard } from "@/components/car-card";
import { fetchCars, fetchFilters, formatShortNumber } from "@/lib/api";

function range(start: number, end: number): number[] {
  const items: number[] = [];
  for (let value = end; value >= start; value -= 1) {
    items.push(value);
  }
  return items;
}

function parseNumberInput(value: string): number | undefined {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : undefined;
}

function FilterField({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-[#e5dcc8] bg-white px-4 py-3 shadow-sm">{children}</div>;
}

export function CarsSection() {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  const filterParams = useMemo(
    () => ({
      query: query || undefined,
      brand: brand || undefined,
      yearFrom: parseNumberInput(yearFrom),
      yearTo: parseNumberInput(yearTo),
      priceFrom: parseNumberInput(priceFrom),
      priceTo: parseNumberInput(priceTo),
    }),
    [brand, priceFrom, priceTo, query, yearFrom, yearTo],
  );

  const filtersQuery = useQuery({
    queryKey: ["car-filters", filterParams],
    queryFn: () => fetchFilters(filterParams),
  });

  useEffect(() => {
    if (!model) return;
    const modelExists = filtersQuery.data?.models.some((item) => item.value === model);
    if (!modelExists) {
      setModel("");
    }
  }, [filtersQuery.data?.models, model]);

  const carsQuery = useQuery({
    queryKey: ["cars", filterParams, model],
    queryFn: () =>
      fetchCars({
        ...filterParams,
        model: model || undefined,
        page: 1,
        pageSize: 12,
      }),
  });

  const yearOptions = useMemo(() => {
    const minYear = filtersQuery.data?.min_year;
    const maxYear = filtersQuery.data?.max_year;
    if (!minYear || !maxYear) return [];
    return range(minYear, maxYear);
  }, [filtersQuery.data?.max_year, filtersQuery.data?.min_year]);

  const scrollToCatalog = () => {
    document.getElementById("catalog-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="mx-auto max-w-[1640px] px-4 pb-16 sm:px-6 lg:px-8">
      <div className="rounded-[36px] bg-[#f5f1ea] p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-black/45">Catalog</p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#111111] sm:text-5xl">
              Найдите автомобиль мечты
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-black/60 sm:text-base">
            Фильтрация по бренду, модели, году и цене.
          </p>
        </div>

        <div className="rounded-[30px] border border-[#ece3d1] bg-[#f1ede6] p-4 sm:p-5">
          <div className="grid gap-3 xl:grid-cols-[1.1fr_1.1fr_1fr_1fr_1fr_1fr_auto]">
            <FilterField>
              <select
                value={brand}
                onChange={(event) => {
                  setBrand(event.target.value);
                  setModel("");
                }}
                className="w-full bg-transparent text-sm font-medium text-[#151515] outline-none"
              >
                <option value="">Марка</option>
                {filtersQuery.data?.brands.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.value}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField>
              <select
                value={model}
                onChange={(event) => setModel(event.target.value)}
                className="w-full bg-transparent text-sm font-medium text-[#151515] outline-none disabled:text-black/35"
                disabled={!filtersQuery.data?.models.length}
              >
                <option value="">Модель</option>
                {filtersQuery.data?.models.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.value}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField>
              <select
                value={yearFrom}
                onChange={(event) => setYearFrom(event.target.value)}
                className="w-full bg-transparent text-sm font-medium text-[#151515] outline-none"
              >
                <option value="">Год от</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField>
              <select
                value={yearTo}
                onChange={(event) => setYearTo(event.target.value)}
                className="w-full bg-transparent text-sm font-medium text-[#151515] outline-none"
              >
                <option value="">Год до</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField>
              <div className="flex items-center gap-2">
                <input
                  value={priceFrom}
                  onChange={(event) => setPriceFrom(event.target.value.replace(/[^\d]/g, ""))}
                  placeholder={filtersQuery.data?.min_price_krw ? `От ${formatShortNumber(filtersQuery.data.min_price_krw)}` : "Цена от"}
                  className="w-full bg-transparent text-sm font-medium text-[#151515] outline-none placeholder:text-black/35"
                />
                <span className="text-xs uppercase tracking-[0.16em] text-black/45">KRW</span>
              </div>
            </FilterField>

            <FilterField>
              <div className="flex items-center gap-2">
                <input
                  value={priceTo}
                  onChange={(event) => setPriceTo(event.target.value.replace(/[^\d]/g, ""))}
                  placeholder={filtersQuery.data?.max_price_krw ? `До ${formatShortNumber(filtersQuery.data.max_price_krw)}` : "Цена до"}
                  className="w-full bg-transparent text-sm font-medium text-[#151515] outline-none placeholder:text-black/35"
                />
                <span className="text-xs uppercase tracking-[0.16em] text-black/45">KRW</span>
              </div>
            </FilterField>

            <button
              type="button"
              onClick={scrollToCatalog}
              className="min-h-[56px] rounded-2xl bg-[#c6ab6c] px-5 text-sm font-semibold text-[#151515] transition hover:brightness-95"
            >
              Показать {formatShortNumber(carsQuery.data?.total ?? 0)} авто
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {filtersQuery.data?.brands.slice(0, 15).map((item) => {
              const active = brand === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setBrand(active ? "" : item.value);
                    setModel("");
                  }}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                    active
                      ? "border-[#c6ab6c] bg-[#c6ab6c] text-[#151515]"
                      : "border-[#e5dcc8] bg-white text-[#151515] hover:border-[#d4c19b]"
                  }`}
                >
                  <span className="truncate text-sm font-semibold uppercase tracking-[0.04em]">{item.value}</span>
                  <span className="ml-3 text-sm text-black/55">{formatShortNumber(item.count)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-black/45">Results</p>
            <p className="mt-1 text-lg font-medium text-[#151515]">
              {carsQuery.isLoading ? "Загрузка каталога..." : `${formatShortNumber(carsQuery.data?.total)} найдено`}
            </p>
          </div>
          <div className="text-sm text-black/50">Обновление данных происходит раз в сутки, ручной запуск тоже доступен.</div>
        </div>

        {carsQuery.isLoading && (
          <div id="catalog-grid" className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[420px] animate-pulse rounded-[28px] border border-[#ece3d1] bg-white" />
            ))}
          </div>
        )}

        {carsQuery.isError && (
          <div className="mt-6 rounded-[28px] border border-rose-300 bg-rose-50 p-6 text-rose-700">
            Не удалось загрузить каталог. Проверь, что backend запущен и в базе есть данные.
          </div>
        )}

        {!carsQuery.isLoading && !carsQuery.isError && (
          <div id="catalog-grid" className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {carsQuery.data?.items.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
