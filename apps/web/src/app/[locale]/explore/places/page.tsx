import type { Metadata } from "next";
import { MapPinOff } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Paginated, Place } from "@seoul/shared";
import { PlaceCard } from "@/components/places/PlaceCard";
import { PlaceFilters } from "@/components/places/PlaceFilters";
import { isPlaceTag } from "@/components/places/place-tags";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { api } from "@/lib/api";
import { enterLocale } from "@/lib/locale";
import { firstParam, withQuery } from "@/lib/url";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const PAGE_SIZE = 12;
const REVALIDATE = 3600;

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "Places",
  });
  return { title: t("title"), description: t("subtitle") };
};

export default async function PlacesPage({ params, searchParams }: PageProps) {
  await enterLocale(params);
  const t = await getTranslations("Places");
  const query = await searchParams;
  const tag = firstParam(query.tag);
  const filters = {
    q: firstParam(query.q),
    district: firstParam(query.district),
    // Ignore tags we don't have a chip for, so a stale link can't leave an unremovable filter.
    tag: isPlaceTag(tag) ? tag : undefined,
  };
  const page = Math.max(1, Number(firstParam(query.page)) || 1);

  const [places, districts] = await Promise.all([
    api<Paginated<Place>>("/places", {
      withAuth: false,
      revalidate: REVALIDATE,
      query: { category: "ATTRACTION", ...filters, page, pageSize: PAGE_SIZE },
    }),
    api<string[]>("/districts", { withAuth: false, revalidate: REVALIDATE }),
  ]);

  return (
    <Container className="pb-20">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <PlaceFilters
        filters={filters}
        districts={districts}
        total={places.total}
      />

      <div className="mt-6">
        {places.items.length === 0 ? (
          <EmptyState icon={<MapPinOff />} title={t("empty")} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {places.items.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={places.total}
          hrefFor={(p) => withQuery("/explore/places", { ...filters, page: p })}
        />
      </div>
    </Container>
  );
}
