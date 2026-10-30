import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
  TourForm,
  type TourFormDefaults,
} from "@/components/guide-dash/TourForm";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireRole } from "@/lib/auth-guard";
import { seoulToday } from "@/lib/format";
import { enterLocale } from "@/lib/locale";
import { loadAllPlaceSummaries } from "@/lib/places";

type PageProps = { params: Promise<{ locale: string }> };

const EMPTY_TOUR: Omit<TourFormDefaults, "date"> = {
  title: "",
  description: "",
  time: "10:00",
  durationMin: 180,
  capacity: 8,
  pricePerPerson: 45_000,
  meetingName: "",
  meeting: null,
  placeIds: [],
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "GuideDash",
  });
  return { title: t("newTour"), robots: { index: false } };
};

export default async function NewTourPage({ params }: PageProps) {
  const locale = await enterLocale(params);
  await requireRole("GUIDE", locale, "/guide/tours/new");
  const t = await getTranslations("GuideDash");
  const tCommon = await getTranslations("Common");
  const places = await loadAllPlaceSummaries();

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
      <PageHeader title={t("newTour")} className="pt-4" />
      <Card padding="lg">
        <TourForm
          defaults={{ ...EMPTY_TOUR, date: "" }}
          places={places}
          minDate={seoulToday()}
        />
      </Card>
    </Container>
  );
}
