export type CatalogFilterState = {
  brand: string;
  model: string;
  yearFrom: string;
  yearTo: string;
  priceFrom: string;
  priceTo: string;
};

export const emptyCatalogFilters: CatalogFilterState = {
  brand: "",
  model: "",
  yearFrom: "",
  yearTo: "",
  priceFrom: "",
  priceTo: "",
};

export function parseNumberInput(value: string): number | undefined {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : undefined;
}

export function range(start: number, end: number): number[] {
  const items: number[] = [];
  for (let value = end; value >= start; value -= 1) {
    items.push(value);
  }
  return items;
}

export function normalizeNumericInput(value: string): string {
  return value.replace(/[^\d]/g, "");
}

export function createCatalogQueryString(filters: CatalogFilterState, page?: number): string {
  const params = new URLSearchParams();

  if (filters.brand) params.set("brand", filters.brand);
  if (filters.model) params.set("model", filters.model);
  if (filters.yearFrom) params.set("yearFrom", filters.yearFrom);
  if (filters.yearTo) params.set("yearTo", filters.yearTo);
  if (filters.priceFrom) params.set("priceFrom", filters.priceFrom);
  if (filters.priceTo) params.set("priceTo", filters.priceTo);
  if (page && page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `/catalog?${query}` : "/catalog";
}

export function parseFiltersFromSearchParams(searchParams: Record<string, string | string[] | undefined>): CatalogFilterState {
  const get = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] ?? "" : value ?? "";
  };

  return {
    brand: get("brand"),
    model: get("model"),
    yearFrom: get("yearFrom"),
    yearTo: get("yearTo"),
    priceFrom: get("priceFrom"),
    priceTo: get("priceTo"),
  };
}

export function parsePageFromSearchParams(searchParams: Record<string, string | string[] | undefined>): number {
  const raw = searchParams.page;
  const value = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 1;
}
