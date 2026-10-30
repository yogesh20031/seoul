import type { Metadata } from "next";
import { Award, UserSearch } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { GuideCard as GuideCardData, Paginated } from "@seoul/shared";
import { GuideCard } from "@/components/guides/GuideCard";
import {
  GuideFilters,
  type GuideFilterValues,
} from "@/components/guides/GuideFilters";
import { ButtonLink } from "@/components/ui/ButtonLink";
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
const REVALIDATE = 120;

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "Guides",
  });
  return { title: t("title"), description: t("subtitle") };
};

export default async function GuidesPage({ params, searchParams }: PageProps) {
  await enterLocale(params);
  const t = await getTranslations("Guides");
  const tCommon = await getTranslations("Common");
  const query = await searchParams;
  const filters: GuideFilterValues = {
    q: firstParam(query.q),
    language: firstParam(query.language),
    specialty: firstParam(query.specialty),
    minRating: firstParam(query.minRating),
    maxPrice: firstParam(query.maxPrice),
    sort: firstParam(query.sort),
  };
  const page = Math.max(1, Number(firstParam(query.page)) || 1);
  const filtering = Object.entries(filters).some(
    ([key, value]) => key !== "sort" && Boolean(value),
  );

  const [results, top, all] = await Promise.all([
    api<Paginated<GuideCardData>>("/guides", {
      withAuth: false,
      revalidate: REVALIDATE,
      query: { ...filters, page, pageSize: PAGE_SIZE },
    }),
    api<GuideCardData[]>("/guides/top", {
      withAuth: false,
      revalidate: REVALIDATE,
    }),
    // Every guide, only to build the language and specialty dropdowns.
    api<Paginated<GuideCardData>>("/guides", {
      withAuth: false,
      revalidate: REVALIDATE,
      query: { pageSize: 50 },
    }),
  ]);
  const languages = [...new Set(all.items.flatMap((g) => g.languages))].sort();
  const specialties = [
    ...new Set(all.items.flatMap((g) => g.specialties)),
  ].sort();

  return (
    <Container className="pb-20">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      {!filtering && page === 1 && top.length > 0 ? (
        <section className="mb-10 flex flex-col gap-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Award className="size-5 text-amber-500" />
            {t("topRated")}
          </h2>
          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {top.slice(0, 4).map((guide) => (
              <div key={guide.id} className="w-72 shrink-0 snap-start">
                <GuideCard guide={guide} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <GuideFilters
        values={filters}
        languages={languages}
        specialties={specialties}
      />

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {t("results", { count: results.total })}
        </p>
        {filtering ? (
          <ButtonLink href="/guides" variant="ghost" size="sm">
            {tCommon("clear")}
          </ButtonLink>
        ) : null}
      </div>

      <div className="mt-4">
        {results.items.length === 0 ? (
          <EmptyState icon={<UserSearch />} title={t("empty")} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.items.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        )}
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={results.total}
          hrefFor={(p) => withQuery("/guides", { ...filters, page: p })}
        />
      </div>
    </Container>
  );
}
