import type { ReactNode } from "react";
import { Footprints, MapPin, TrainFront, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";

const PINS = [
  {
    className: "top-[22%] left-[30%]",
    tone: "bg-kr-red",
    en: "Gyeongbokgung",
    ko: "경복궁",
  },
  {
    className: "top-[30%] left-[52%]",
    tone: "bg-primary",
    en: "Bukchon",
    ko: "북촌",
  },
  {
    className: "top-[52%] left-[42%]",
    tone: "bg-kr-blue",
    en: "Myeongdong",
    ko: "명동",
  },
  {
    className: "top-[62%] left-[68%]",
    tone: "bg-primary",
    en: "N Seoul Tower",
    ko: "N서울타워",
  },
] as const;

const GRID_LINES = [40, 100, 160, 220, 280, 340, 400] as const;

const MEMBERS = [
  {
    id: "a",
    name: "Emma Clarke",
    avatarUrl: "https://i.pravatar.cc/150?u=emma",
  },
  {
    id: "b",
    name: "Diego Ruiz",
    avatarUrl: "https://i.pravatar.cc/150?u=diego",
  },
  {
    id: "c",
    name: "Aiko Tanaka",
    avatarUrl: "https://i.pravatar.cc/150?u=aiko",
  },
] as const;

/**
 * Illustrated map with floating cards. Deliberately not a live MapLibre map: the real map is
 * ~800 kB of JS that the landing page doesn't need to show the idea.
 */
export const HeroVisual = () => {
  const t = useTranslations("Planner");
  const tTours = useTranslations("Tours");
  const locale = useLocale();
  const [first, second, third] = PINS;

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="relative aspect-[4/3.4] overflow-hidden glassy-3xl shadow-2xl">
        <MapArt />
        {PINS.map((pin) => (
          <span
            key={pin.en}
            className={cn(
              "absolute flex -translate-x-1/2 -translate-y-full flex-col items-center",
              pin.className,
            )}
          >
            <span className="mb-1 rounded-full bg-card/90 px-2 py-0.5 text-3xs font-semibold shadow-sm backdrop-blur">
              {pin[locale]}
            </span>
            <span
              className={cn(
                "flex size-7 animate-float-gentle items-center justify-center rounded-full text-white shadow-lg ring-4 ring-white/40",
                pin.tone,
              )}
            >
              <MapPin className="size-3.5" />
            </span>
          </span>
        ))}
      </div>

      <div className="absolute -bottom-6 -left-4 w-60 glassy-strong p-4 shadow-xl sm:-left-10">
        <p className="text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
          {t("resultTitle")}
        </p>
        <ol className="mt-2 flex flex-col gap-2 text-xs">
          <RouteStep
            name={first[locale]}
            icon={<Footprints />}
            leg={t("walk", { minutes: 11 })}
          />
          <RouteStep
            name={second[locale]}
            icon={<TrainFront />}
            leg={t("subway", { minutes: 18 })}
          />
          <RouteStep name={third[locale]} />
        </ol>
      </div>

      <div className="absolute -top-6 -right-3 w-56 glassy-strong p-4 shadow-xl sm:-right-8">
        <p className="text-sm font-semibold">Bukchon & tea house walk</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {tTours("members")}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-2">
            {MEMBERS.map((member) => (
              <Avatar
                key={member.id}
                name={member.name}
                src={member.avatarUrl}
                size={28}
              />
            ))}
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-primary">
            <Users className="size-3.5" />5 / 8
          </span>
        </div>
      </div>
    </div>
  );
};

const RouteStep = ({
  name,
  icon,
  leg,
}: {
  name: string;
  icon?: ReactNode;
  leg?: string;
}) => (
  <li className="flex flex-col gap-1">
    <span className="flex items-center gap-2 font-medium">
      <span className="size-2 rounded-full bg-primary" />
      {name}
    </span>
    {leg ? (
      <span className="ml-1 flex items-center gap-1.5 border-l border-dashed border-primary/40 pl-3 text-muted-foreground [&_svg]:size-3">
        {icon}
        {leg}
      </span>
    ) : null}
  </li>
);

// A stylised Seoul: the Han river, a few avenues, and Namsan as a soft green blob.
const MapArt = () => (
  <svg
    viewBox="0 0 400 340"
    className="absolute inset-0 size-full"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden
  >
    <defs>
      <linearGradient id="hero-river" x1="0" x2="1">
        <stop offset="0" stopColor="var(--kr-blue)" stopOpacity="0.35" />
        <stop offset="1" stopColor="var(--primary)" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    <rect width="400" height="340" className="fill-card/40" />
    <g className="stroke-foreground/10" strokeWidth="1">
      {GRID_LINES.map((offset) => (
        <g key={offset}>
          <line x1={offset} y1="0" x2={offset - 40} y2="340" />
          <line x1="0" y1={offset * 0.85} x2="400" y2={offset * 0.85 + 30} />
        </g>
      ))}
    </g>
    <path
      d="M-10 250 C 60 230, 110 270, 180 250 S 300 205, 410 230 L 410 265 C 310 245, 250 290, 180 285 S 60 268, -10 288 Z"
      fill="url(#hero-river)"
    />
    <ellipse cx="270" cy="200" rx="48" ry="30" className="fill-success/15" />
    <path
      d="M120 75 L 205 100 L 160 175 L 268 210"
      fill="none"
      className="stroke-primary"
      strokeWidth="3"
      strokeDasharray="6 7"
      strokeLinecap="round"
    />
  </svg>
);
