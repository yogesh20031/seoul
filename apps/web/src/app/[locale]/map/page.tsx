import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LazyPlacesExplorer } from "@/components/map/lazy";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { loadAllPlaceSummaries } from "@/lib/places";
import { enterLocale } from "@/lib/locale";

type PageProps = { params: Promise<{ locale: string }> };

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "Map",
  });
  return { title: t("title"), description: t("subtitle") };
};

export default async function MapPage({ params }: PageProps) {
  await enterLocale(params);
  const t = await getTranslations("Map");
  const places = await loadAllPlaceSummaries();

  return (
    <Container className="pb-12">
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        className="pb-6"
      />
      <LazyPlacesExplorer places={places} />
    </Container>
  );
}
