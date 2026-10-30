import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Paginated, Place } from "@seoul/shared";
import { PlaceCard } from "@/components/places/PlaceCard";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { api } from "@/lib/api";
import { enterLocale } from "@/lib/locale";

type PageProps = { params: Promise<{ locale: string }> };

// Keys of Hotels.areas in the message files.
const AREAS = ["jongno", "myeongdong", "hongdae", "gangnam"] as const;
const REVALIDATE = 3600;

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "Hotels",
  });
  return { title: t("title"), description: t("subtitle") };
};

export default async function HotelsPage({ params }: PageProps) {
  await enterLocale(params);
  const t = await getTranslations("Hotels");
  const hotels = await api<Paginated<Place>>("/places", {
    withAuth: false,
    revalidate: REVALIDATE,
    query: { category: "HOTEL", pageSize: 100 },
  });

  return (
    <Container className="pb-20">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <section className="flex flex-col gap-6">
        <SectionHeader title={t("areasTitle")} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AREAS.map((area, index) => (
            <Card key={area} className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-primary tabular-nums">
                0{index + 1}
              </span>
              <h3 className="text-base font-semibold">
                {t(`areas.${area}.name`)}
              </h3>
              <p className="text-sm text-text-secondary">
                {t(`areas.${area}.body`)}
              </p>
            </Card>
          ))}
        </div>
      </section>
      <section className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {hotels.items.map((hotel) => (
          <PlaceCard key={hotel.id} place={hotel} />
        ))}
      </section>
    </Container>
  );
}
