import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  CalendarHeart,
  MapIcon,
  UserRoundPen,
  UserRoundSearch,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Booking, Itinerary, SoloRequest } from "@seoul/shared";
import { BookingRow } from "@/components/dashboard/BookingRow";
import { SoloRow } from "@/components/dashboard/SoloRow";
import { Link } from "@/i18n/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { api } from "@/lib/api";
import { requireRole } from "@/lib/auth-guard";
import { formatDate } from "@/lib/format";
import { enterLocale } from "@/lib/locale";

type PageProps = { params: Promise<{ locale: string }> };

// Cancelled holds are noise in a trip list; refunds stay so people can see the money came back.
const splitBookings = (bookings: Booking[]) => {
  const now = Date.now();
  const visible = bookings.filter((booking) => booking.status !== "CANCELLED");
  const isUpcoming = (booking: Booking) =>
    new Date(booking.tour.startsAt).getTime() > now;
  return {
    visible,
    upcoming: visible.filter(isUpcoming),
    past: visible.filter((booking) => !isUpcoming(booking)),
  };
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "Dashboard",
  });
  return { title: t("title"), robots: { index: false } };
};

export default async function TravellerDashboardPage({ params }: PageProps) {
  const locale = await enterLocale(params);
  await requireRole("TRAVELLER", locale, "/dashboard");
  const t = await getTranslations("Dashboard");

  const [bookings, solo, plans] = await Promise.all([
    api<Booking[]>("/me/bookings"),
    api<SoloRequest[]>("/me/solo-requests"),
    api<Itinerary[]>("/itineraries/mine"),
  ]);
  const { visible, upcoming, past } = splitBookings(bookings);

  return (
    <Container className="pb-20">
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        action={
          <ButtonLink href="/dashboard/profile" variant="secondary">
            <UserRoundPen />
            {t("editProfile")}
          </ButtonLink>
        }
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <Section title={t("bookings")}>
          {visible.length === 0 ? (
            <EmptyState
              icon={<CalendarHeart />}
              title={t("noBookings")}
              action={<ButtonLink href="/tours">{t("browseTours")}</ButtonLink>}
            />
          ) : (
            <>
              {upcoming.length > 0 ? (
                <SubHeading>{t("upcoming")}</SubHeading>
              ) : null}
              {upcoming.map((booking) => (
                <BookingRow key={booking.id} booking={booking} upcoming />
              ))}
              {past.length > 0 ? <SubHeading>{t("past")}</SubHeading> : null}
              {past.map((booking) => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  upcoming={false}
                />
              ))}
            </>
          )}
        </Section>

        <div className="flex flex-col gap-10">
          <Section title={t("solo")}>
            {solo.length === 0 ? (
              <EmptyState
                icon={<UserRoundSearch />}
                title={t("noSolo")}
                action={
                  <ButtonLink href="/guides">{t("findGuide")}</ButtonLink>
                }
              />
            ) : (
              solo.map((request) => (
                <SoloRow key={request.id} request={request} />
              ))
            )}
          </Section>

          <Section title={t("plans")}>
            {plans.length === 0 ? (
              <EmptyState
                icon={<MapIcon />}
                title={t("noPlans")}
                action={
                  <ButtonLink href="/planner">{t("openPlanner")}</ButtonLink>
                }
              />
            ) : (
              plans.map((plan) => (
                <Link
                  key={plan.id}
                  href={`/planner/${plan.shareToken}`}
                  className="group"
                >
                  <Card
                    interactive
                    padding="sm"
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold group-hover:text-primary">
                        {plan.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {[
                          plan.date ? formatDate(plan.date, locale) : null,
                          t("stops", { count: plan.stops.length }),
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </div>
                    <MapIcon className="size-5 text-primary" />
                  </Card>
                </Link>
              ))
            )}
          </Section>
        </div>
      </div>
    </Container>
  );
}

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="flex flex-col gap-3">
    <h2 className="text-xl font-semibold">{title}</h2>
    {children}
  </section>
);

const SubHeading = ({ children }: { children: ReactNode }) => (
  <h3 className="mt-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
    {children}
  </h3>
);
