import type { Metadata } from "next";
import { CalendarSearch } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Paginated, TourCard as TourCardData } from "@seoul/shared";
import { TourCard } from "@/components/tours/TourCard";
import { TourDateFilter } from "@/components/tours/TourDateFilter";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { api } from "@/lib/api";
import { seoulToday } from "@/lib/format";
import { enterLocale } from "@/lib/locale";
import { firstParam, withQuery } from "@/lib/url";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const PAGE_SIZE = 12;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// Ignore malformed dates instead of letting the API reject the whole request.
const validDate = (value: string | undefined) =>
  value && ISO_DATE.test(value) ? value : undefined;

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "Tours",
  });
  return { title: t("title"), description: t("subtitle") };
};

export default async function ToursPage({ params, searchParams }: PageProps) {
  await enterLocale(params);
  const t = await getTranslations("Tours");
  const query = await searchParams;
  const filters = {
    from: validDate(firstParam(query.from)),
    to: validDate(firstParam(query.to)),
  };
  const page = Math.max(1, Number(firstParam(query.page)) || 1);

  const tours = await api<Paginated<TourCardData>>("/tours", {
    withAuth: false,
    revalidate: 60,
    query: { ...filters, page, pageSize: PAGE_SIZE },
  });

  return (
    <Container className="pb-20">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <TourDateFilter
        from={filters.from}
        to={filters.to}
        total={tours.total}
        today={seoulToday()}
      />

      {tours.items.length === 0 ? (
        <EmptyState icon={<CalendarSearch />} title={t("empty")} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tours.items.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}
      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={tours.total}
        hrefFor={(p) => withQuery("/tours", { ...filters, page: p })}
      />
    </Container>
  );
}
