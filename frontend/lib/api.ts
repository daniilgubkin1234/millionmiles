export type Car = {
  id: number;
  source_id: string;
  source_url: string;
  brand: string;
  model: string;
  title: string;
  year: number | null;
  mileage_km: number | null;
  price_krw: number | null;
  price_display: string | null;
  image_url: string | null;
  scraped_at: string;
  updated_at: string;
};

export type CarsResponse = {
  items: Car[];
  total: number;
  page: number;
  page_size: number;
};

export type FilterOption = {
  value: string;
  count: number;
};

export type CarFiltersResponse = {
  brands: FilterOption[];
  models: FilterOption[];
  min_year: number | null;
  max_year: number | null;
  min_price_krw: number | null;
  max_price_krw: number | null;
};

export type CarQueryParams = {
  query?: string;
  brand?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  priceFrom?: number;
  priceTo?: number;
  page?: number;
  pageSize?: number;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

function appendCarParams(url: URL, params?: CarQueryParams) {
  if (!params) return;
  if (params.query) url.searchParams.set("query", params.query);
  if (params.brand) url.searchParams.set("brand", params.brand);
  if (params.model) url.searchParams.set("model", params.model);
  if (params.yearFrom) url.searchParams.set("year_from", String(params.yearFrom));
  if (params.yearTo) url.searchParams.set("year_to", String(params.yearTo));
  if (params.priceFrom) url.searchParams.set("price_from", String(params.priceFrom));
  if (params.priceTo) url.searchParams.set("price_to", String(params.priceTo));
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.pageSize) url.searchParams.set("page_size", String(params.pageSize));
}

export async function fetchCars(params?: CarQueryParams): Promise<CarsResponse> {
  const url = new URL(`${API_BASE_URL}/api/cars`);
  appendCarParams(url, params);

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch cars");
  }
  return response.json();
}

export async function fetchFilters(params?: Omit<CarQueryParams, "model" | "page" | "pageSize">): Promise<CarFiltersResponse> {
  const url = new URL(`${API_BASE_URL}/api/cars/filters`);
  appendCarParams(url, params);

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch filters");
  }
  return response.json();
}

export function formatMileage(value: number | null): string {
  if (!value) return "—";
  return `${new Intl.NumberFormat("ru-RU").format(value)} км`;
}

export function formatPriceDisplay(car: Car): string {
  if (car.price_display) return car.price_display;
  if (!car.price_krw) return "Цена по запросу";
  return `${new Intl.NumberFormat("ru-RU").format(car.price_krw)} KRW`;
}

export function formatShortNumber(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("ru-RU").format(value);
}
