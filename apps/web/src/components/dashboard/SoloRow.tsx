import { CalendarClock, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { SoloRequest } from "@seoul/shared";
import { cancelSoloAction, paySoloAction } from "@/actions/solo";
import { Link } from "@/i18n/navigation";
import { ActionButton } from "@/components/ui/ActionButton";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { formatDate, formatKrw } from "@/lib/format";
import { ReviewForm } from "./ReviewForm";
import { StatusBadge } from "./StatusBadge";

export const SoloRow = ({ request }: { request: SoloRequest }) => {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const cancellable =
    request.status === "PENDING" || request.status === "ACCEPTED";

  return (
    <Card padding="sm" className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Avatar
          name={request.guide.name}
          src={request.guide.avatarUrl}
          size={40}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Link
            href={`/guides/${request.guide.id}`}
            className="truncate font-semibold hover:text-primary"
          >
            {request.guide.name}
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarClock className="size-3.5" />
            {formatDate(request.date, locale)} · {request.startTime} ·{" "}
            {formatKrw(request.amount, locale)}
          </span>
        </div>
        <StatusBadge status={request.status} />
      </div>
      {request.meetingName ? (
        <span className="flex items-center gap-1.5 text-xs text-text-secondary">
          <MapPin className="size-3.5 text-primary" />
          {t("meetAt", { place: request.meetingName })}
        </span>
      ) : null}
      {request.status === "ACCEPTED" || cancellable ? (
        <div className="flex flex-wrap items-start gap-2">
          {request.status === "ACCEPTED" ? (
            <ActionButton
              action={paySoloAction}
              fields={{ requestId: request.id }}
            >
              {t("pay")}
            </ActionButton>
          ) : null}
          {cancellable ? (
            <ActionButton
              action={cancelSoloAction}
              fields={{ requestId: request.id }}
              variant="outline"
              confirmLabel={t("cancelConfirm")}
            >
              {t("cancel")}
            </ActionButton>
          ) : null}
        </div>
      ) : null}
      {request.canReview ? (
        <ReviewForm
          guideId={request.guide.id}
          guideName={request.guide.name}
          soloRequestId={request.id}
        />
      ) : null}
    </Card>
  );
};
