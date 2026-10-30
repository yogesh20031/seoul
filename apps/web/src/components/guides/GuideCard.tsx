import { BadgeCheck, CalendarDays, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { GuideCard as GuideCardData } from "@seoul/shared";
import { Link } from "@/i18n/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Rating } from "@/components/ui/Rating";
import { formatDateTime, formatDuration, formatKrw } from "@/lib/format";

export const GuideCard = ({ guide }: { guide: GuideCardData }) => {
  const t = useTranslations("Guides");
  const tCommon = useTranslations("Common");
  const locale = useLocale();

  return (
    <Link href={`/guides/${guide.id}`} className="group block h-full">
      <Card interactive className="flex h-full flex-col gap-4">
        <div className="flex items-start gap-3">
          <Avatar name={guide.name} src={guide.avatarUrl} size={56} />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-base font-semibold group-hover:text-primary">
                {guide.name}
              </h3>
              {guide.isVerified ? (
                <BadgeCheck
                  className="size-4 shrink-0 text-primary"
                  aria-label={tCommon("verified")}
                />
              ) : null}
            </div>
            <Rating value={guide.ratingAvg} count={guide.ratingCount} />
          </div>
        </div>

        <p className="line-clamp-2 text-sm text-text-secondary">
          {guide.headline}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {guide.specialties.slice(0, 3).map((specialty) => (
            <Badge key={specialty} tone="primary">
              {specialty}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Languages className="size-3.5" />
            {guide.languages.join(" · ")}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {guide.nextTourAt
              ? `${t("nextTour")}: ${formatDateTime(guide.nextTourAt, locale)}`
              : t("noUpcoming")}
          </span>
          <div className="flex items-baseline justify-between pt-1">
            <span>{t("soloPrice")}</span>
            <span className="text-sm font-semibold text-foreground">
              {formatKrw(guide.soloPrice, locale)}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                / {formatDuration(guide.soloDurationMin, locale)}
              </span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
