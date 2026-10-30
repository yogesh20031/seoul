import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Globe2,
  Languages,
  Route,
  Sparkles,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { GuideDetail, Locale } from "@seoul/shared";
import { ReviewList } from "@/components/guides/ReviewList";
import { SoloRequestForm } from "@/components/guides/SoloRequestForm";
import { TourCard } from "@/components/tours/TourCard";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Rating } from "@/components/ui/Rating";
import { api, ApiError } from "@/lib/api";
import {
  formatDate,
  formatDuration,
  formatKrw,
  seoulToday,
} from "@/lib/format";
import { enterLocale } from "@/lib/locale";
import { getCurrentUser } from "@/lib/session";

type PageProps = { params: Promise<{ locale: string; id: string }> };

const loadGuide = async (id: string) => {
  try {
    return await api<GuideDetail>(`/guides/${encodeURIComponent(id)}`, {
      withAuth: false,
      revalidate: 60,
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
  const guide = await loadGuide((await params).id);
  return { title: guide.name, description: guide.headline };
};

export default async function GuideProfilePage({ params }: PageProps) {
  const locale = await enterLocale(params);
  const { id } = await params;
  const [guide, viewer] = await Promise.all([
    loadGuide(id),
    getCurrentUser().catch(() => null),
  ]);
  const t = await getTranslations("Guides");
  const tCommon = await getTranslations("Common");

  return (
    <Container className="pt-8 pb-20">
      <ButtonLink href="/guides" variant="ghost" size="sm" className="-ml-3">
        <ArrowLeft />
        {tCommon("back")}
      </ButtonLink>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="flex flex-col gap-10">
          <ProfileHeader guide={guide} locale={locale} />

          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{t("upcomingTours")}</h2>
            {guide.upcomingTours.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("noUpcoming")}</p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {guide.upcomingTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="flex items-baseline gap-2 text-xl font-semibold">
              {t("reviewsTitle")}
              <span className="text-sm font-normal text-muted-foreground">
                {tCommon("reviews", { count: guide.ratingCount })}
              </span>
            </h2>
            {guide.reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("noReviews")}</p>
            ) : (
              <ReviewList reviews={guide.reviews} />
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card variant="strong" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">{t("requestTitle")}</h2>
              <p className="text-sm text-text-secondary">
                {t("requestBody", { name: guide.name })}
              </p>
            </div>
            <div className="flex items-baseline justify-between rounded-xl bg-primary/8 px-4 py-3">
              <span className="text-sm text-muted-foreground">
                {formatDuration(guide.soloDurationMin, locale)}
              </span>
              <span className="text-xl font-semibold">
                {formatKrw(guide.soloPrice, locale)}
              </span>
            </div>
            <BookingSlot
              guide={guide}
              viewerRole={viewer?.role ?? null}
              loginLabel={t("requestLoginPrompt")}
              guideLabel={t("guideCantBook")}
            />
          </Card>
        </aside>
      </div>
    </Container>
  );
}

const ProfileHeader = async ({
  guide,
  locale,
}: {
  guide: GuideDetail;
  locale: Locale;
}) => {
  const t = await getTranslations("Guides");
  const tCommon = await getTranslations("Common");
  const tDashboard = await getTranslations("Dashboard");
  return (
    <Card padding="lg" className="flex flex-col gap-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Avatar name={guide.name} src={guide.avatarUrl} size={96} />
        <div className="flex flex-col gap-2">
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {guide.name}
            {guide.isVerified ? (
              <BadgeCheck
                className="size-6 text-primary"
                aria-label={tCommon("verified")}
              />
            ) : null}
          </h1>
          <p className="text-text-secondary">{guide.headline}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Rating
              value={guide.ratingAvg}
              count={guide.ratingCount}
              className="text-sm"
            />
            <span className="text-muted-foreground">
              {t("toursLed", { count: guide.toursLed })}
            </span>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Fact
          icon={<Languages />}
          label={t("languages")}
          value={guide.languages.join(" · ")}
        />
        {guide.country ? (
          <Fact
            icon={<Globe2 />}
            label={tDashboard("country")}
            value={guide.country}
          />
        ) : null}
        <Fact
          icon={<CalendarDays />}
          label={t("about")}
          value={t("memberSince", {
            date: formatDate(guide.memberSince, locale),
          })}
        />
        <Fact
          icon={<Route />}
          label={t("nextTour")}
          value={
            guide.nextTourAt
              ? formatDate(guide.nextTourAt, locale)
              : t("noUpcoming")
          }
        />
      </div>
      {guide.specialties.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {guide.specialties.map((specialty) => (
            <Badge key={specialty} tone="primary">
              <Sparkles />
              {specialty}
            </Badge>
          ))}
        </div>
      ) : null}
      {guide.bio ? (
        <div className="flex flex-col gap-1.5">
          <h2 className="text-sm font-semibold">{t("about")}</h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            {guide.bio}
          </p>
        </div>
      ) : null}
    </Card>
  );
};

type BookingSlotProps = {
  guide: GuideDetail;
  viewerRole: "TRAVELLER" | "GUIDE" | null;
  loginLabel: string;
  guideLabel: string;
};

const BookingSlot = ({
  guide,
  viewerRole,
  loginLabel,
  guideLabel,
}: BookingSlotProps) => {
  if (viewerRole === "TRAVELLER")
    return (
      <SoloRequestForm
        guideId={guide.id}
        guideName={guide.name}
        minDate={seoulToday()}
      />
    );
  if (viewerRole === "GUIDE")
    return <p className="text-sm text-muted-foreground">{guideLabel}</p>;
  return (
    <ButtonLink
      href={`/login?next=${encodeURIComponent(`/guides/${guide.id}`)}`}
      className="w-full"
    >
      {loginLabel}
    </ButtonLink>
  );
};

const Fact = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex gap-3">
    <span className="mt-0.5 text-primary [&_svg]:size-4">{icon}</span>
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  </div>
);
