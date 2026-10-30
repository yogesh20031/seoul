import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { TourDetail } from "@seoul/shared";
import { TourForm } from "@/components/guide-dash/TourForm";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { api, ApiError } from "@/lib/api";
import { requireRole } from "@/lib/auth-guard";
import { seoulDateParts, seoulToday } from "@/lib/format";
import { enterLocale } from "@/lib/locale";
import { loadAllPlaceSummaries } from "@/lib/places";

type PageProps = { params: Promise<{ locale: string; id: string }> };

const loadTour = async (id: string) => {
  try {
    return await api<TourDetail>(`/tours/${encodeURIComponent(id)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "GuideDash",
  });
  return { title: t("editTour"), robots: { index: false } };
};

export default async function EditTourPage({ params }: PageProps) {
  const locale = await enterLocale(params);
  const { id } = await params;
  await requireRole("GUIDE", locale, `/guide/tours/${id}/edit`);
  const [tour, places] = await Promise.all([
    loadTour(id),
    loadAllPlaceSummaries(),
  ]);
  // Another guide's tour: the API would refuse the save anyway, so don't offer the form.
  if (!tour.viewer.isGuide) redirect(`/${locale}/forbidden?role=GUIDE`);
  const t = await getTranslations("GuideDash");
  const tCommon = await getTranslations("Common");
  const { date, time } = seoulDateParts(tour.startsAt);

  return (
    <Container className="max-w-3xl pb-20">
      <ButtonLink
        href="/guide"
        variant="ghost"
        size="sm"
        className="mt-8 -ml-3"
      >
        <ArrowLeft />
        {tCommon("back")}
      </ButtonLink>
      <PageHeader
        title={t("editTour")}
        subtitle={tour.title}
        className="pt-4"
      />
      <Card padding="lg">
        <TourForm
          tourId={tour.id}
          places={places}
          minDate={seoulToday()}
          defaults={{
            title: tour.title,
            description: tour.description,
            date,
            time,
            durationMin: tour.durationMin,
            capacity: tour.capacity,
            pricePerPerson: tour.pricePerPerson,
            meetingName: tour.meetingName,
            meeting: { lat: tour.meetingLat, lng: tour.meetingLng },
            placeIds: tour.stops.map((stop) => stop.place.id),
          }}
        />
      </Card>
    </Container>
  );
}
