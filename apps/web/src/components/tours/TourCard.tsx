import Image from "next/image";
import { Clock, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { TourCard as TourCardData } from "@seoul/shared";
import { Link } from "@/i18n/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Rating } from "@/components/ui/Rating";
import { formatDateTime, formatDuration, formatKrw } from "@/lib/format";
import { cn } from "@/lib/cn";

export const TourCard = ({ tour }: { tour: TourCardData }) => {
  const t = useTranslations("Tours");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const seatsLeft = Math.max(0, tour.capacity - tour.seatsTaken);

  return (
    <Link href={`/tours/${tour.id}`} className="group block h-full">
      <Card
        interactive
        padding="none"
        className="flex h-full flex-col overflow-hidden"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-muted">
          {tour.coverImageUrl ? (
            <Image
              src={tour.coverImageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out-strong group-hover:scale-105"
            />
          ) : null}
          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            <Badge className="glassy-full bg-black/30! text-white backdrop-blur-md">
              {formatDateTime(tour.startsAt, locale)}
            </Badge>
            {seatsLeft === 0 ? (
              <Badge tone="danger" className="bg-white/90">
                {t("full")}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="line-clamp-2 text-base leading-snug font-semibold group-hover:text-primary">
            {tour.title}
          </h3>

          <div className="flex items-center gap-2">
            <Avatar
              name={tour.guide.name}
              src={tour.guide.avatarUrl}
              size={24}
            />
            <span className="truncate text-xs font-medium">
              {tour.guide.name}
            </span>
            <Rating value={tour.guide.ratingAvg} className="ml-auto" />
          </div>

          <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">{tour.meetingName}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 shrink-0" />
              {formatDuration(tour.durationMin, locale)}
            </span>
          </div>

          <div className="mt-auto flex flex-col gap-2 pt-2">
            <div className="flex items-center justify-between gap-2">
              <AvatarStack
                members={tour.memberPreview}
                total={tour.seatsTaken}
                size={24}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  seatsLeft <= 2 ? "text-kr-red" : "text-muted-foreground",
                )}
              >
                {tCommon("seatsLeft", { count: seatsLeft })}
              </span>
            </div>
            <Progress
              value={tour.seatsTaken}
              max={tour.capacity}
              label={tCommon("seatsLeft", { count: seatsLeft })}
            />
            <div className="flex items-baseline justify-between border-t border-border/60 pt-3">
              <span className="text-xs text-muted-foreground">
                {tCommon("perPerson")}
              </span>
              <span className="text-base font-semibold">
                {formatKrw(tour.pricePerPerson, locale)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
