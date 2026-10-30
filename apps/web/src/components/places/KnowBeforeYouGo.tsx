import type { ReactNode } from "react";
import { CalendarClock, Info, Lightbulb, Ticket } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";

type KnowBeforeYouGoProps = {
  admission: string | null;
  bestTime: string | null;
  tips: string[];
};

export const KnowBeforeYouGo = ({
  admission,
  bestTime,
  tips,
}: KnowBeforeYouGoProps) => {
  const t = useTranslations("PlaceDetail");
  if (!admission && !bestTime && tips.length === 0) return null;

  return (
    <Card className="flex flex-col gap-5">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Info className="size-5 text-primary" />
        {t("knowBefore")}
      </h2>
      {admission || bestTime ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {admission ? (
            <Fact icon={<Ticket />} label={t("admission")} value={admission} />
          ) : null}
          {bestTime ? (
            <Fact
              icon={<CalendarClock />}
              label={t("bestTime")}
              value={bestTime}
            />
          ) : null}
        </div>
      ) : null}
      {tips.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-muted-foreground">
            {t("tips")}
          </h3>
          <ul className="flex flex-col gap-2.5">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-2.5 text-sm leading-relaxed">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Card>
  );
};

type FactProps = { icon: ReactNode; label: string; value: string };

const Fact = ({ icon, label, value }: FactProps) => (
  <div className="flex gap-3 rounded-2xl bg-card/60 p-3 ring-1 ring-border/60">
    <span className="mt-0.5 text-primary [&_svg]:size-4">{icon}</span>
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  </div>
);
