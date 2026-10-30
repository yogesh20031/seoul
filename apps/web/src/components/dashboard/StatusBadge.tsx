import { useTranslations } from "next-intl";
import type { BookingStatus, SoloStatus } from "@seoul/shared";
import { Badge } from "@/components/ui/Badge";

type Status = BookingStatus | SoloStatus;

const TONE: Record<
  Status,
  "success" | "warning" | "danger" | "neutral" | "primary"
> = {
  PAID: "success",
  COMPLETED: "neutral",
  PENDING_PAYMENT: "warning",
  PENDING: "warning",
  ACCEPTED: "primary",
  CANCELLED: "danger",
  REFUNDED: "neutral",
  DECLINED: "danger",
};

export const StatusBadge = ({ status }: { status: Status }) => {
  const t = useTranslations("Dashboard.statuses");
  return <Badge tone={TONE[status]}>{t(status)}</Badge>;
};
