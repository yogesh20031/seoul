import { CalendarClock, MessageSquareText } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { SoloRequest } from "@seoul/shared";
import { declineSoloAction } from "@/actions/solo";
import { ActionButton } from "@/components/ui/ActionButton";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { formatDate, formatDuration, formatKrw } from "@/lib/format";
import { AcceptRequestForm } from "./AcceptRequestForm";

export const PendingRequestCard = ({ request }: { request: SoloRequest }) => {
  const t = useTranslations("GuideDash");
  const locale = useLocale();

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar
          name={request.traveller.name}
          src={request.traveller.avatarUrl}
          size={48}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="font-semibold">{request.traveller.name}</span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarClock className="size-3.5" />
            {formatDate(request.date, locale)} · {request.startTime} ·{" "}
            {formatDuration(request.durationMin, locale)}
          </span>
        </div>
        <span className="text-sm font-semibold">
          {formatKrw(request.amount, locale)}
        </span>
      </div>
      {request.note ? (
        <p className="flex gap-2 rounded-xl bg-muted/60 p-3 text-sm text-text-secondary">
          <MessageSquareText className="mt-0.5 size-4 shrink-0 text-primary" />
          {request.note}
        </p>
      ) : null}
      <AcceptRequestForm requestId={request.id} startTime={request.startTime} />
      <div className="border-t border-border/60 pt-3">
        <ActionButton
          action={declineSoloAction}
          fields={{ requestId: request.id }}
          variant="ghost"
          confirmLabel={t("declineConfirm")}
        >
          {t("decline")}
        </ActionButton>
      </div>
    </Card>
  );
};
