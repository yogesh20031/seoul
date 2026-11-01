import { CalendarClock, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Booking } from "@seoul/shared";
import { cancelBookingAction } from "@/actions/bookings";
import { Link } from "@/i18n/navigation";
import { ActionButton } from "@/components/ui/ActionButton";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { formatDateTime, formatKrw } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

export const BookingRow = ({
  booking,
  upcoming,
}: {
  booking: Booking;
  upcoming: boolean;
}) => {
  const t = useTranslations("Dashboard");
  const tTours = useTranslations("Tours");
  const tCommon = useTranslations("Common");
  const locale = useLocale();

  return (
    <Card padding="sm" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Link
          href={`/tours/${booking.tour.id}`}
          className="text-base font-semibold hover:text-primary"
        >
          {booking.tour.title}
        </Link>
        <StatusBadge status={booking.status} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CalendarClock className="size-3.5" />
          {formatDateTime(booking.tour.startsAt, locale)}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="size-3.5" />
          {tCommon("seats", { count: booking.seats })} ·{" "}
          {formatKrw(booking.amount, locale)}
        </span>
        <span>{t("meetAt", { place: booking.tour.meetingName })}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {booking.status === "PENDING_PAYMENT" && upcoming ? (
          <ButtonLink href={`/tours/${booking.tour.id}`} size="sm">
            {tTours("completePayment")}
          </ButtonLink>
        ) : null}
        {booking.status === "PAID" && upcoming ? (
          <ActionButton
            action={cancelBookingAction}
            fields={{ bookingId: booking.id }}
            variant="outline"
            confirmLabel={tTours("cancelBookingConfirm")}
          >
            {t("cancel")}
          </ActionButton>
        ) : null}
      </div>
    </Card>
  );
};
