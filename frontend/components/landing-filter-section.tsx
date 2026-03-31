"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCars, fetchFilters, formatShortNumber } from "@/lib/api";
import {
  createCatalogQueryString,
  emptyCatalogFilters,
  normalizeNumericInput,
  parseNumberInput,
  range,
} from "@/lib/catalog";
import { SearchableSelect } from "@/components/searchable-select";

export function LandingFilterSection() {
  const [filters, setFilters] = useState(emptyCatalogFilters);

  const filterParams = useMemo(
    () => ({
      brand: filters.brand || undefined,
      model: filters.model || undefined,
      yearFrom: parseNumberInput(filters.yearFrom),
      yearTo: parseNumberInput(filters.yearTo),
      priceFrom: parseNumberInput(filters.priceFrom),
      priceTo: parseNumberInput(filters.priceTo),
    }),
    [filters],
  );

  const filtersQuery = useQuery({
    queryKey: ["landing-filters", filterParams],
    queryFn: () => fetchFilters(filterParams),
  });

  const countQuery = useQuery({
    queryKey: ["landing-cars-count", filterParams],
    queryFn: () => fetchCars({ ...filterParams, page: 1, pageSize: 1 }),
  });

  useEffect(() => {
    if (!filters.model) return;
    const exists = filtersQuery.data?.models.some((item) => item.value === filters.model);
    if (!exists) {
      setFilters((current) => ({ ...current, model: "" }));
    }
  }, [filters.model, filtersQuery.data?.models]);

  const yearOptions = useMemo(() => {
    if (!filtersQuery.data?.min_year || !filtersQuery.data?.max_year) return [];
    return range(filtersQuery.data.min_year, filtersQuery.data.max_year);
  }, [filtersQuery.data?.min_year, filtersQuery.data?.max_year]);

  const href = createCatalogQueryString(filters);

  return (
    <section id="filters" className="mx-auto w-full max-w-[1840px] bg-white px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-3xl font-bold text-neutral-950 md:text-4xl">
        Найдите автомобиль мечты
      </h2>

      <div className="rounded-3xl bg-[#F7F5F6] p-4 md:p-6 lg:p-8">
        <div className="flex flex-col gap-3 xl:flex-row">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <div className="w-full">
              <SearchableSelect
                placeholder="Марка"
                value={filters.brand}
                options={(filtersQuery.data?.brands ?? []).map((item) => ({
                  label: item.value,
                  value: item.value,
                }))}
                onChange={(value) =>
                  setFilters((current) => ({
                    ...current,
                    brand: value,
                    model: "",
                  }))
                }
              />
            </div>

            <div className="w-full">
              <SearchableSelect
                placeholder="Модель"
                value={filters.model}
                options={(filtersQuery.data?.models ?? []).map((item) => ({
                  label: item.value,
                  value: item.value,
                }))}
                disabled={!filtersQuery.data?.models.length}
                onChange={(value) =>
                  setFilters((current) => ({
                    ...current,
                    model: value,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex flex-1 flex-row gap-3">
            <div className="w-1/2">
              <SearchableSelect
                placeholder="Год от"
                value={filters.yearFrom}
                options={yearOptions.map((year) => ({
                  label: String(year),
                  value: String(year),
                }))}
                onChange={(value) =>
                  setFilters((current) => ({
                    ...current,
                    yearFrom: value,
                  }))
                }
              />
            </div>

            <div className="w-1/2">
              <SearchableSelect
                placeholder="Год до"
                value={filters.yearTo}
                options={yearOptions.map((year) => ({
                  label: String(year),
                  value: String(year),
                }))}
                onChange={(value) =>
                  setFilters((current) => ({
                    ...current,
                    yearTo: value,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex flex-1 flex-row gap-3">
            <div className="w-1/2">
              <div className="relative">
                <input
                  value={filters.priceFrom}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      priceFrom: normalizeNumericInput(event.target.value),
                    }))
                  }
                  placeholder={
                    filtersQuery.data?.min_price_krw
                      ? `От ${formatShortNumber(filtersQuery.data.min_price_krw)}`
                      : "От"
                  }
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-white py-3 pl-3 pr-10 text-sm text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-400 hover:border-[#c6ab6c] focus:ring-2 focus:ring-[#c6ab6c]"
                />
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium uppercase text-neutral-400">
                  KRW
                </div>
              </div>
            </div>

            <div className="w-1/2">
              <div className="relative">
                <input
                  value={filters.priceTo}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      priceTo: normalizeNumericInput(event.target.value),
                    }))
                  }
                  placeholder={
                    filtersQuery.data?.max_price_krw
                      ? `До ${formatShortNumber(filtersQuery.data.max_price_krw)}`
                      : "До"
                  }
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-white py-3 pl-3 pr-10 text-sm text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-400 hover:border-[#c6ab6c] focus:ring-2 focus:ring-[#c6ab6c]"
                />
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium uppercase text-neutral-400">
                  KRW
                </div>
              </div>
            </div>
          </div>

          <div className="w-full xl:min-w-[220px] xl:w-auto">
            <Link
              href={href}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-[#c6ab6c] px-6 text-sm font-semibold text-black transition-all duration-300 hover:bg-white hover:shadow-md hover:ring-2 hover:ring-[#c6ab6c]"
            >
              Показать {formatShortNumber(countQuery.data?.total ?? 0)} авто
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}