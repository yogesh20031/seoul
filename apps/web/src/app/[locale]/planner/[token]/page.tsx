import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Route } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Itinerary } from "@seoul/shared";
import { LazyRouteMap } from "@/components/map/lazy";
import { PlanTimeline } from "@/components/planner/PlanTimeline";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { api, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { enterLocale } from "@/lib/locale";

type PageProps = { params: Promise<{ locale: string; token: string }> };

const loadItinerary = async (token: string) => {
  try {
    return await api<Itinerary>(`/itineraries/${encodeURIComponent(token)}`, {
      withAuth: false,
      revalidate: 300,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  await enterLocale(params);
  const itinerary = await loadItinerary((await params).token);
  return { title: itinerary.title };
};

export default async function SharedPlanPage({ params }: PageProps) {
  const locale = await enterLocale(params);
  const itinerary = await loadItinerary((await params).token);
  const t = await getTranslations("Planner");

  return (
    <Container className="pb-20">
      <PageHeader
        eyebrow={t("sharedTitle")}
        title={itinerary.title}
        subtitle={
          itinerary.date ? formatDate(itinerary.date, locale) : undefined
        }
        action={
          <ButtonLink
            href={`/planner?places=${itinerary.stops.map((s) => s.place.id).join(",")}`}
            variant="secondary"
          >
            <Route />
            {t("order")}
          </ButtonLink>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card className="flex flex-col gap-4">
          {itinerary.date ? (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="size-4" />
              {formatDate(itinerary.date, locale)} · {itinerary.startTime}
            </span>
          ) : null}
          <PlanTimeline plan={itinerary} />
        </Card>
        <LazyRouteMap
          stops={itinerary.stops.map((stop) => stop.place)}
          className="h-96 lg:h-[32rem]"
        />
      </div>
    </Container>
  );
}
