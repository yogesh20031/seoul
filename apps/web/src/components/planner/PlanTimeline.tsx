import { Footprints, TrainFront } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ItineraryPlan, PlannedStop } from "@seoul/shared";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/format";

/** The ordered day: each stop with when to arrive and leave, and how to get there from the previous one. */
export const PlanTimeline = ({ plan }: { plan: ItineraryPlan }) => {
  const t = useTranslations("Planner");
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-text-secondary">
        {t("summary", {
          stops: plan.stops.length,
          km: plan.totalDistanceKm.toFixed(1),
          minutes: plan.totalTravelMin,
          end: plan.endsAt,
        })}
      </p>
      <ol className="relative flex flex-col gap-1 border-l-2 border-dashed border-primary/30 pl-6">
        {plan.stops.map((stop) => (
          <StopRow key={stop.place.id} stop={stop} />
        ))}
      </ol>
    </div>
  );
};

const StopRow = ({ stop }: { stop: PlannedStop }) => {
  const t = useTranslations("Planner");
  const locale = useLocale();
  return (
    <li className="flex flex-col gap-2 pb-3">
      {stop.mode ? (
        <span className="-ml-px flex items-center gap-1.5 text-xs text-muted-foreground">
          {stop.mode === "WALK" ? (
            <Footprints className="size-3.5" />
          ) : (
            <TrainFront className="size-3.5" />
          )}
          {stop.mode === "WALK"
            ? t("walk", { minutes: stop.travelMin })
            : t("subway", { minutes: stop.travelMin })}
          {" · "}
          {t("distance", { km: stop.distanceKm.toFixed(1) })}
        </span>
      ) : null}
      <div className="relative flex items-center gap-3 glassy-md p-3">
        <span className="absolute top-1/2 -left-[2.35rem] flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground ring-4 ring-background">
          {stop.order + 1}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <Link
            href={`/explore/places/${stop.place.slug}`}
            className="truncate text-sm font-semibold hover:text-primary"
          >
            {pick(stop.place, "name", locale)}
          </Link>
          <span className="text-xs text-muted-foreground">
            {stop.place.district}
          </span>
        </div>
        <div className="flex flex-col items-end text-xs">
          <span className="font-medium">
            {t("arrive", { time: stop.arriveAt })}
          </span>
          <span className="text-muted-foreground">
            {t("stay", { time: stop.leaveAt })}
          </span>
        </div>
      </div>
    </li>
  );
};
