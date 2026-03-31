import { CatalogPageClient } from "@/components/catalog-page-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { parseFiltersFromSearchParams, parsePageFromSearchParams } from "@/lib/catalog";

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolvedSearchParams = await searchParams;
  const initialFilters = parseFiltersFromSearchParams(resolvedSearchParams);
  const initialPage = parsePageFromSearchParams(resolvedSearchParams);

  return (
    <main className="min-h-screen bg-white text-black pt-[60px] md:pt-20">
      <SiteHeader  />
      <CatalogPageClient initialFilters={initialFilters} initialPage={initialPage} />
      <SiteFooter />
    </main>
  );
}
