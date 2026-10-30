import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Dish, Paginated, Place } from "@seoul/shared";
import { DishCard } from "@/components/food/DishCard";
import { PlaceCard } from "@/components/places/PlaceCard";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { api } from "@/lib/api";
import { enterLocale } from "@/lib/locale";

type PageProps = { params: Promise<{ locale: string }> };

const REVALIDATE = 3600;

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "Food",
  });
  return { title: t("title"), description: t("subtitle") };
};

export default async function FoodPage({ params }: PageProps) {
  await enterLocale(params);
  const t = await getTranslations("Food");
  const [dishes, restaurants] = await Promise.all([
    api<Dish[]>("/dishes", { withAuth: false, revalidate: REVALIDATE }),
    api<Paginated<Place>>("/places", {
      withAuth: false,
      revalidate: REVALIDATE,
      query: { category: "RESTAURANT", pageSize: 100 },
    }),
  ]);

  return (
    <Container className="pb-20">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <section className="flex flex-col gap-6">
        <SectionHeader title={t("dishes")} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </section>
      <section className="mt-16 flex flex-col gap-6">
        <SectionHeader title={t("restaurants")} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {restaurants.items.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </section>
    </Container>
  );
}
