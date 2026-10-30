import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Planner } from "@/components/planner/Planner";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { loadAllPlaceSummaries } from "@/lib/places";
import { enterLocale } from "@/lib/locale";
import { getCurrentUser } from "@/lib/session";
import { firstParam } from "@/lib/url";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "Planner",
  });
  return { title: t("title"), description: t("subtitle") };
};

export default async function PlannerPage({ params, searchParams }: PageProps) {
  await enterLocale(params);
  const t = await getTranslations("Planner");
  const [places, user, query] = await Promise.all([
    loadAllPlaceSummaries(),
    getCurrentUser().catch(() => null),
    searchParams,
  ]);
  const known = new Set(places.map((place) => place.id));
  // ?places= comes from "Add to day planner" and the map's "plan with these" button.
  const initialSelected = [
    ...new Set((firstParam(query.places) ?? "").split(",")),
  ].filter((id) => known.has(id));

  return (
    <Container className="pb-20">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Planner
        places={places}
        initialSelected={initialSelected}
        canSave={user !== null}
      />
    </Container>
  );
}
