import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { AuthUser, Locale, TourDetail } from "@seoul/shared";
import { cancelBookingAction } from "@/actions/bookings";
import { LazyPointMap } from "@/components/map/lazy";
import { BookingForm } from "@/components/tours/BookingForm";
import { MemberList } from "@/components/tours/MemberList";
import { ActionButton } from "@/components/ui/ActionButton";
import { Avatar } from "@/components/ui/Avatar";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FormMessage } from "@/components/ui/FormMessage";
import { Progress } from "@/components/ui/Progress";
import { Rating } from "@/components/ui/Rating";
import { Link } from "@/i18n/navigation";
import { api, ApiError } from "@/lib/api";
import { formatDateTime, formatDuration, formatKrw, pick } from "@/lib/format";
import { enterLocale } from "@/lib/locale";
import { getCurrentUser } from "@/lib/session";

type PageProps = { params: Promise<{ locale: string; id: string }> };

// Always fetched with the viewer's token: the member list and booking state are personal.
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
  await enterLocale(params);
  const tour = await loadTour((await params).id);
  return { title: tour.title, description: tour.description.slice(0, 160) };
};

export default async function TourPage({ params }: PageProps) {
  const locale = await enterLocale(params);
  const { id } = await params;
  const [tour, viewer] = await Promise.all([
    loadTour(id),
    getCurrentUser().catch(() => null),
  ]);
  const t = await getTranslations("Tours");
  const tCommon = await getTranslations("Common");
  const seatsLeft = Math.max(0, tour.capacity - tour.seatsTaken);

  return (
    <div className="pb-20">
      <TourHero tour={tour} locale={locale} />

      <Container className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="flex flex-col gap-10">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              icon={<CalendarClock />}
              label={t("startsAt")}
              value={formatDateTime(tour.startsAt, locale)}
              hint={tCommon("seoulTime")}
            />
            <Stat
              icon={<Clock />}
              label={t("duration")}
              value={formatDuration(tour.durationMin, locale)}
            />
            <Stat
              icon={<Users />}
              label={t("groupSize")}
              value={t("membersCount", {
                taken: tour.seatsTaken,
                capacity: tour.capacity,
              })}
            />
          </div>

          <p className="text-base leading-relaxed whitespace-pre-line text-text-secondary">
            {tour.description}
          </p>

          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{t("meetingPoint")}</h2>
            <p className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="size-4 text-primary" />
              {tour.meetingName}
            </p>
            <LazyPointMap
              lat={tour.meetingLat}
              lng={tour.meetingLng}
              label={tour.meetingName}
              className="h-72"
            />
          </section>

          {tour.stops.length > 0 ? (
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">{t("stops")}</h2>
              <ol className="flex flex-col gap-2">
                {tour.stops.map((stop, index) => (
                  <li key={stop.place.id}>
                    <Link
                      href={`/explore/places/${stop.place.slug}`}
                      className="flex items-center gap-4 glassy-md p-3 transition-colors hover:text-primary"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {index + 1}
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-medium">
                          {pick(stop.place, "name", locale)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {stop.place.district}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">{t("members")}</h2>
              <AvatarStack
                members={tour.memberPreview}
                total={tour.members?.length ?? tour.memberPreview.length}
              />
            </div>
            <MembersBody tour={tour} />
          </section>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <Card variant="strong" className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold">
                {formatKrw(tour.pricePerPerson, locale)}
              </span>
              <span className="text-sm text-muted-foreground">
                {tCommon("perPerson")}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Progress
                value={tour.seatsTaken}
                max={tour.capacity}
                label={tCommon("seatsLeft", { count: seatsLeft })}
              />
              <span className="text-xs text-muted-foreground">
                {tCommon("seatsLeft", { count: seatsLeft })}
              </span>
            </div>
            <BookingPanel tour={tour} viewer={viewer} seatsLeft={seatsLeft} />
          </Card>
          <GuideSummaryCard tour={tour} />
        </aside>
      </Container>
    </div>
  );
}

const TourHero = async ({
  tour,
  locale,
}: {
  tour: TourDetail;
  locale: Locale;
}) => {
  const tCommon = await getTranslations("Common");
  return (
    <div className="relative isolate overflow-hidden">
      {tour.coverImageUrl ? (
        <Image
          src={tour.coverImageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
      ) : null}
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/70 to-background/10" />
      <Container className="flex min-h-72 flex-col justify-end gap-3 pt-8 pb-8 sm:min-h-80">
        <ButtonLink
          href="/tours"
          variant="secondary"
          size="sm"
          className="mb-auto self-start"
        >
          <ArrowLeft />
          {tCommon("back")}
        </ButtonLink>
        <span className="text-sm font-medium text-primary">
          {formatDateTime(tour.startsAt, locale)}
        </span>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          {tour.title}
        </h1>
      </Container>
    </div>
  );
};

const MembersBody = async ({ tour }: { tour: TourDetail }) => {
  const t = await getTranslations("Tours");
  if (tour.members === null) {
    return (
      <Card padding="sm" className="flex items-center justify-between gap-3">
        <span className="text-sm text-text-secondary">
          {t("membersLoggedOut")}
        </span>
        <ButtonLink
          href={`/login?next=${encodeURIComponent(`/tours/${tour.id}`)}`}
          size="sm"
          variant="secondary"
        >
          {t("loginToBook")}
        </ButtonLink>
      </Card>
    );
  }
  if (tour.members.length === 0)
    return <p className="text-sm text-muted-foreground">{t("membersEmpty")}</p>;
  return <MemberList members={tour.members} />;
};

type BookingPanelProps = {
  tour: TourDetail;
  viewer: AuthUser | null;
  seatsLeft: number;
};

/** One state per situation, checked in priority order: the tour itself, then who is looking. */
const BookingPanel = async ({ tour, viewer, seatsLeft }: BookingPanelProps) => {
  const t = await getTranslations("Tours");

  if (tour.status === "CANCELLED")
    return <FormMessage tone="error">{t("cancelled")}</FormMessage>;
  if (tour.status === "COMPLETED")
    return <p className="text-sm text-muted-foreground">{t("ended")}</p>;
  if (tour.viewer.isGuide) {
    return (
      <div className="flex flex-col gap-3">
        <FormMessage tone="success">{t("yourTour")}</FormMessage>
        <ButtonLink href={`/guide/tours/${tour.id}/edit`} variant="secondary">
          {t("manageTour")}
        </ButtonLink>
      </div>
    );
  }
  if (tour.viewer.bookingStatus === "PAID" && tour.viewer.bookingId) {
    return (
      <div className="flex flex-col gap-3">
        <FormMessage tone="success">{t("booked")}</FormMessage>
        <ActionButton
          action={cancelBookingAction}
          fields={{ bookingId: tour.viewer.bookingId }}
          variant="outline"
          confirmLabel={t("cancelBookingConfirm")}
        >
          {t("cancelBooking")}
        </ActionButton>
      </div>
    );
  }
  if (!viewer) {
    return (
      <ButtonLink
        href={`/login?next=${encodeURIComponent(`/tours/${tour.id}`)}`}
        size="lg"
        className="w-full"
      >
        {t("loginToBook")}
      </ButtonLink>
    );
  }
  if (viewer.role === "GUIDE")
    return (
      <p className="text-sm text-muted-foreground">{t("guidesCantBook")}</p>
    );
  if (seatsLeft === 0)
    return <p className="text-sm font-medium text-kr-red">{t("full")}</p>;

  // A pending booking is resumed by booking again: the API reuses the held seats.
  const pending = tour.viewer.bookingStatus === "PENDING_PAYMENT";
  return (
    <div className="flex flex-col gap-3">
      {pending ? <FormMessage tone="error">{t("pending")}</FormMessage> : null}
      <BookingForm
        tourId={tour.id}
        pricePerPerson={tour.pricePerPerson}
        seatsLeft={seatsLeft}
        submitLabel={pending ? t("completePayment") : t("payNow")}
      />
    </div>
  );
};

const GuideSummaryCard = async ({ tour }: { tour: TourDetail }) => {
  const t = await getTranslations("Tours");
  const tCommon = await getTranslations("Common");
  return (
    <Link href={`/guides/${tour.guide.id}`} className="group">
      <Card interactive padding="sm" className="flex items-center gap-3">
        <Avatar name={tour.guide.name} src={tour.guide.avatarUrl} size={48} />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs text-muted-foreground">{t("guide")}</span>
          <span className="flex items-center gap-1 truncate font-semibold group-hover:text-primary">
            {tour.guide.name}
            {tour.guide.isVerified ? (
              <BadgeCheck
                className="size-4 text-primary"
                aria-label={tCommon("verified")}
              />
            ) : null}
          </span>
          <Rating value={tour.guide.ratingAvg} count={tour.guide.ratingCount} />
        </div>
      </Card>
    </Link>
  );
};

const Stat = ({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}) => (
  <Card padding="sm" className="flex flex-col gap-1.5">
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground [&_svg]:size-4 [&_svg]:text-primary">
      {icon}
      {label}
    </span>
    <span className="text-sm font-semibold">{value}</span>
    {hint ? (
      <span className="text-2xs text-muted-foreground">{hint}</span>
    ) : null}
  </Card>
);
