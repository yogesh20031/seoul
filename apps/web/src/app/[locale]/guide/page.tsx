import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  CalendarClock,
  Inbox,
  MapPin,
  Plus,
  Star,
  UserRoundPen,
  Users,
  Wallet,
  Route,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { GuideOverview, Locale, SoloRequest } from "@seoul/shared";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { GuideTourCard } from "@/components/guide-dash/GuideTourCard";
import { PendingRequestCard } from "@/components/guide-dash/PendingRequestCard";
import { Avatar } from "@/components/ui/Avatar";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { api } from "@/lib/api";
import { requireRole } from "@/lib/auth-guard";
import { formatDate, formatKrw } from "@/lib/format";
import { enterLocale } from "@/lib/locale";

type PageProps = { params: Promise<{ locale: string }> };

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "GuideDash",
  });
  return { title: t("title"), robots: { index: false } };
};

export default async function GuideDashboardPage({ params }: PageProps) {
  const locale = await enterLocale(params);
  await requireRole("GUIDE", locale, "/guide");
  const t = await getTranslations("GuideDash");
  const overview = await api<GuideOverview>("/guide/overview");
  const { stats, earnings } = overview;

  return (
    <Container className="pb-20">
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        action={
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/guide/profile" variant="secondary">
              <UserRoundPen />
              {t("profile")}
            </ButtonLink>
            <ButtonLink href="/guide/tours/new">
              <Plus />
              {t("newTour")}
            </ButtonLink>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Star />}
          label={t("statRating")}
          value={
            stats.ratingAvg > 0
              ? `${stats.ratingAvg.toFixed(2)} (${stats.ratingCount})`
              : "—"
          }
        />
        <StatCard
          icon={<Route />}
          label={t("statTours")}
          value={String(stats.toursLed)}
        />
        <StatCard
          icon={<Users />}
          label={t("statTravellers")}
          value={String(stats.travellersHosted)}
        />
        <StatCard
          icon={<Wallet />}
          label={t("statEarned")}
          value={formatKrw(earnings.totalNet, locale)}
        />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-10">
          <Section
            title={t("pendingRequests")}
            count={overview.pendingRequests.length}
          >
            {overview.pendingRequests.length === 0 ? (
              <EmptyState icon={<Inbox />} title={t("noRequests")} />
            ) : (
              overview.pendingRequests.map((request) => (
                <PendingRequestCard key={request.id} request={request} />
              ))
            )}
          </Section>

          <Section
            title={t("upcomingTours")}
            count={overview.upcomingTours.length}
          >
            {overview.upcomingTours.length === 0 ? (
              <EmptyState
                icon={<CalendarClock />}
                title={t("noTours")}
                action={
                  <ButtonLink href="/guide/tours/new">
                    {t("newTour")}
                  </ButtonLink>
                }
              />
            ) : (
              overview.upcomingTours.map((tour) => (
                <GuideTourCard key={tour.id} tour={tour} />
              ))
            )}
          </Section>
        </div>

        <div className="flex flex-col gap-10">
          <Section
            title={t("upcomingSolo")}
            count={overview.upcomingSolo.length}
          >
            {overview.upcomingSolo.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("noSolo")}</p>
            ) : (
              overview.upcomingSolo.map((request) => (
                <SoloSummary
                  key={request.id}
                  request={request}
                  locale={locale}
                />
              ))
            )}
          </Section>

          <EarningsCard earnings={earnings} locale={locale} />
        </div>
      </div>
    </Container>
  );
}

const Section = ({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) => (
  <section className="flex flex-col gap-3">
    <h2 className="flex items-center gap-2 text-xl font-semibold">
      {title}
      {count > 0 ? (
        <span className="rounded-full bg-primary/12 px-2 py-0.5 text-xs font-semibold text-primary">
          {count}
        </span>
      ) : null}
    </h2>
    {children}
  </section>
);

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <Card padding="sm" className="flex flex-col gap-2">
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground [&_svg]:size-4 [&_svg]:text-primary">
      {icon}
      {label}
    </span>
    <span className="text-xl font-semibold tabular-nums">{value}</span>
  </Card>
);

const SoloSummary = ({
  request,
  locale,
}: {
  request: SoloRequest;
  locale: Locale;
}) => (
  <Card padding="sm" className="flex flex-col gap-2">
    <div className="flex items-center gap-3">
      <Avatar
        name={request.traveller.name}
        src={request.traveller.avatarUrl}
        size={40}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-semibold">{request.traveller.name}</span>
        <span className="text-xs text-muted-foreground">
          {formatDate(request.date, locale)} · {request.startTime} ·{" "}
          {formatKrw(request.amount, locale)}
        </span>
      </div>
      <StatusBadge status={request.status} />
    </div>
    {request.meetingName ? (
      <span className="flex items-center gap-1.5 text-xs text-text-secondary">
        <MapPin className="size-3.5 text-primary" />
        {request.meetingName}
      </span>
    ) : null}
  </Card>
);

const EarningsCard = async ({
  earnings,
  locale,
}: {
  earnings: GuideOverview["earnings"];
  locale: Locale;
}) => {
  const t = await getTranslations("GuideDash");
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">{t("earnings")}</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-primary/8 p-3">
          <span className="text-xs text-muted-foreground">
            {t("earningsTotal")}
          </span>
          <p className="text-lg font-semibold">
            {formatKrw(earnings.totalNet, locale)}
          </p>
        </div>
        <div className="rounded-xl bg-muted/60 p-3">
          <span className="text-xs text-muted-foreground">
            {t("earningsPending")}
          </span>
          <p className="text-lg font-semibold">
            {formatKrw(earnings.pendingNet, locale)}
          </p>
        </div>
      </div>
      {earnings.recent.length > 0 ? (
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-md text-left text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr>
                <th className="px-2 py-2 font-medium" />
                <th className="px-2 py-2 text-right font-medium">
                  {t("gross")}
                </th>
                <th className="px-2 py-2 text-right font-medium">{t("fee")}</th>
                <th className="px-2 py-2 text-right font-medium">{t("net")}</th>
              </tr>
            </thead>
            <tbody>
              {earnings.recent.map((earning) => (
                <tr key={earning.id} className="border-t border-border/60">
                  <td className="px-2 py-2.5">
                    <span className="line-clamp-1">{earning.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(earning.createdAt, locale)}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-right whitespace-nowrap tabular-nums">
                    {formatKrw(earning.gross, locale)}
                  </td>
                  <td className="px-2 py-2.5 text-right whitespace-nowrap text-muted-foreground tabular-nums">
                    −{formatKrw(earning.platformFee, locale)}
                  </td>
                  <td className="px-2 py-2.5 text-right font-semibold whitespace-nowrap tabular-nums">
                    {formatKrw(earning.net, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <p className="text-xs text-muted-foreground">{t("earningsNote")}</p>
    </Card>
  );
};
