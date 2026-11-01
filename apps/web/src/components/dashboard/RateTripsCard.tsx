"use client";

import { useState } from "react";
import { CalendarClock, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { MemberPreview } from "@seoul/shared";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import { ReviewForm } from "./ReviewForm";

export type TripToRate = {
  key: string;
  title: string;
  date: string;
  guide: MemberPreview;
  bookingId?: string;
  soloRequestId?: string;
};

export const RateTripsCard = ({ trips }: { trips: TripToRate[] }) => {
  const t = useTranslations("Dashboard");
  // Deliberately frozen at first render: posting a review revalidates the guide pages, which
  // also re-renders this page without the rated trip. Keeping the original list keeps that row
  // (and its "thanks, new score" message) on screen; it drops off on the next visit.
  const [shown] = useState(trips);
  if (shown.length === 0) return null;

  return (
    <Card variant="strong" className="mb-10 flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-500">
          <Star className="size-5 fill-current" />
        </span>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-lg font-semibold">
            {t("rateTitle", { count: shown.length })}
          </h2>
          <p className="text-sm text-text-secondary">{t("rateSubtitle")}</p>
        </div>
      </div>
      <ul className="grid gap-4 lg:grid-cols-2">
        {shown.map((trip) => (
          <TripRow key={trip.key} trip={trip} />
        ))}
      </ul>
    </Card>
  );
};

const TripRow = ({ trip }: { trip: TripToRate }) => {
  const locale = useLocale();
  return (
    <li className="flex flex-col gap-4 rounded-xl border border-border p-4">
      <div className="flex items-center gap-3">
        <Avatar name={trip.guide.name} src={trip.guide.avatarUrl} size={40} />
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-semibold">{trip.title}</span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarClock className="size-3.5" />
            {trip.guide.name} · {formatDate(trip.date, locale)}
          </span>
        </div>
      </div>
      <ReviewForm
        guideId={trip.guide.id}
        guideName={trip.guide.name}
        bookingId={trip.bookingId}
        soloRequestId={trip.soloRequestId}
      />
    </li>
  );
};
