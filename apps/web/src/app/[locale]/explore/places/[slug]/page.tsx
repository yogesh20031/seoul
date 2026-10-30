import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ExternalLink,
  MapPin,
  Route,
  Wallet,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Paginated, Place, TourCard as TourCardData } from "@seoul/shared";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { LazyPointMap } from "@/components/map/lazy";
import { DistrictCard } from "@/components/places/DistrictCard";
import { GettingThere } from "@/components/places/GettingThere";
import { KnowBeforeYouGo } from "@/components/places/KnowBeforeYouGo";
import { NearbyPlaces } from "@/components/places/NearbyPlaces";
import { PlaceHighlights } from "@/components/places/PlaceHighlights";
import { nearestPlaces } from "@/components/places/nearby";
import { TourCard } from "@/components/tours/TourCard";
import { api, ApiError } from "@/lib/api";
import { formatDuration, pick } from "@/lib/format";
import { enterLocale } from "@/lib/locale";
import { loadAllPlaceSummaries } from "@/lib/places";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

const REVALIDATE = 3600;
// Seats change often, so tour lists go stale faster than place content.
const TOURS_REVALIDATE = 300;
const TOURS_SHOWN = 3;

const BACK_PATH: Record<Place["category"], string> = {
  ATTRACTION: "/explore/places",
  RESTAURANT: "/explore/food",
  HOTEL: "/explore/hotels",
};

const loadPlace = async (slug: string) => {
  try {
    return await api<Place>(`/places/${encodeURIComponent(slug)}`, {
      withAuth: false,
      revalidate: REVALIDATE,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
};

// Tours are a nice extra here; if that call fails the rest of the page still renders.
const loadToursStoppingAt = async (placeId: string) => {
  try {
    const tours = await api<Paginated<TourCardData>>("/tours", {
      withAuth: false,
      revalidate: TOURS_REVALIDATE,
      query: { placeId, pageSize: TOURS_SHOWN },
    });
    return tours.items;
  } catch (error) {
    if (error instanceof ApiError) return [];
    throw error;
  }
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const locale = await enterLocale(params);
  const place = await loadPlace((await params).slug);
  return {
    title: pick(place, "name", locale),
    description: pick(place, "description", locale),
  };
};

export default async function PlaceDetailPage({ params }: PageProps) {
  const locale = await enterLocale(params);
  const place = await loadPlace((await params).slug);
  const [allPlaces, tours] = await Promise.all([
    loadAllPlaceSummaries(),
    loadToursStoppingAt(place.id),
  ]);
  const t = await getTranslations("Common");
  const tDetail = await getTranslations("PlaceDetail");
  const tFood = await getTranslations("Food");
  const tHotels = await getTranslations("Hotels");
  const name = pick(place, "name", locale);
  // Restaurants get their own "Eat nearby" row, so keep them out of the general one to avoid repeats.
  const nearby = nearestPlaces(place, allPlaces, {
    limit: 4,
    categories: ["ATTRACTION", "HOTEL"],
  });
  const eatNearby = nearestPlaces(place, allPlaces, {
    limit: 3,
    categories: ["RESTAURANT"],
  });
  const highlights = locale === "ko" ? place.highlightsKo : place.highlightsEn;
  const tips = locale === "ko" ? place.tipsKo : place.tipsEn;

  return (
    <Container className="pt-8 pb-20">
      <ButtonLink
        href={BACK_PATH[place.category]}
        variant="ghost"
        size="sm"
        className="-ml-3"
      >
        <ArrowLeft />
        {t("back")}
      </ButtonLink>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <figure className="flex flex-col gap-2">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-muted">
              <Image
                src={place.imageUrl}
                alt={name}
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption>
              <PhotoCredit credit={place.imageCredit} className="text-right" />
            </figcaption>
          </figure>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {name}
            </h1>
            <p className="text-lg text-muted-foreground">
              {locale === "ko" ? place.nameEn : place.nameKo}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {place.tags.map((tag) => (
              <Badge key={tag} tone="primary">
                #{tag}
              </Badge>
            ))}
          </div>
          <p className="text-base leading-relaxed text-text-secondary">
            {pick(place, "description", locale)}
          </p>
          <PlaceHighlights category={place.category} items={highlights} />
          <KnowBeforeYouGo
            admission={locale === "ko" ? place.admissionKo : place.admissionEn}
            bestTime={locale === "ko" ? place.bestTimeKo : place.bestTimeEn}
            tips={tips}
          />
        </div>

        <aside className="flex flex-col gap-4">
          <Card className="flex flex-col gap-4">
            <Fact
              icon={<MapPin />}
              label={t("address")}
              value={place.address}
            />
            {place.openHours ? (
              <Fact
                icon={<Clock />}
                label={t("openHours")}
                value={place.openHours}
              />
            ) : null}
            <Fact
              icon={<Route />}
              label={t("suggestedTime")}
              value={formatDuration(place.suggestedMinutes, locale)}
            />
            {/* The ₩ scale only means something for food and stays; sights list their admission instead. */}
            {place.priceLevel && place.category !== "ATTRACTION" ? (
              <Fact
                icon={<Wallet />}
                label={tFood("priceLevel")}
                value={"₩".repeat(place.priceLevel)}
              />
            ) : null}
            <div className="flex flex-wrap gap-2 pt-2">
              <ButtonLink href={`/planner?places=${place.id}`} size="sm">
                <Route />
                {t("addToPlanner")}
              </ButtonLink>
              {place.bookingUrl ? (
                <a
                  href={place.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: "secondary",
                    size: "sm",
                  })}
                >
                  {tHotels("book")}
                  <ExternalLink />
                </a>
              ) : null}
            </div>
          </Card>
          <LazyPointMap
            lat={place.lat}
            lng={place.lng}
            label={name}
            className="h-72"
          />
          <GettingThere
            nameKo={place.nameKo}
            lat={place.lat}
            lng={place.lng}
            station={place.nearestStation}
          />
        </aside>
      </div>

      <div className="mt-14 flex flex-col gap-12">
        {tours.length > 0 ? (
          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-xl font-semibold tracking-tight">
                {tDetail("tours")}
              </h2>
              <ButtonLink href="/tours" variant="ghost" size="sm">
                {tDetail("allTours")}
                <ArrowRight />
              </ButtonLink>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </section>
        ) : null}
        <NearbyPlaces title={tDetail("nearby")} items={nearby} />
        <NearbyPlaces title={tDetail("eatNearby")} items={eatNearby} />
        <DistrictCard district={place.district} />
      </div>
    </Container>
  );
}

type FactProps = { icon: ReactNode; label: string; value: string };

const Fact = ({ icon, label, value }: FactProps) => (
  <div className="flex gap-3">
    <span className="mt-0.5 text-primary [&_svg]:size-4">{icon}</span>
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  </div>
);
