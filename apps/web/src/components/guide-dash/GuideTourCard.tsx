import { CalendarClock, Pencil } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { TourDetail } from "@seoul/shared";
import { cancelTourAction } from "@/actions/tours";
import { Link } from "@/i18n/navigation";
import { ActionButton } from "@/components/ui/ActionButton";
import { Avatar } from "@/components/ui/Avatar";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { formatDateTime } from "@/lib/format";

/** A guide's view of one upcoming tour: who's coming, how full it is, and the edit/cancel controls. */
export const GuideTourCard = ({ tour }: { tour: TourDetail }) => {
  const t = useTranslations("GuideDash");
  const tTours = useTranslations("Tours");
  const locale = useLocale();
  const members = tour.members ?? [];

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <Link
            href={`/tours/${tour.id}`}
            className="text-base font-semibold hover:text-primary"
          >
            {tour.title}
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarClock className="size-3.5" />
            {formatDateTime(tour.startsAt, locale)} · {tour.meetingName}
          </span>
        </div>
        <span className="text-sm font-medium">
          {tTours("membersCount", {
            taken: tour.seatsTaken,
            capacity: tour.capacity,
          })}
        </span>
      </div>
      <Progress
        value={tour.seatsTaken}
        max={tour.capacity}
        label={t("members", { count: members.length })}
      />
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {t("members", { count: members.length })}
        </span>
        {members.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex items-center gap-2 glassy-full py-1 pr-3 pl-1"
              >
                <Avatar name={member.name} src={member.avatarUrl} size={24} />
                <span className="text-xs font-medium">{member.name}</span>
                {member.country ? (
                  <span className="text-2xs text-muted-foreground">
                    {member.country}
                  </span>
                ) : null}
                {member.seats > 1 ? (
                  <span className="text-2xs font-semibold text-primary">
                    ×{member.seats}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="flex flex-wrap items-start gap-2 border-t border-border/60 pt-3">
        <ButtonLink
          href={`/guide/tours/${tour.id}/edit`}
          size="sm"
          variant="secondary"
        >
          <Pencil />
          {t("editTour")}
        </ButtonLink>
        <ActionButton
          action={cancelTourAction}
          fields={{ tourId: tour.id }}
          variant="ghost"
          confirmLabel={t("cancelTourConfirm")}
        >
          {t("cancelTour")}
        </ActionButton>
      </div>
    </Card>
  );
};
