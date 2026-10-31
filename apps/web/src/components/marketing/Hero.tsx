import {
  ArrowRight,
  Camera,
  Landmark,
  Mic2,
  MoonStar,
  Mountain,
  Route,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { ENTER } from "./enter";
import { HeroParallax } from "./HeroParallax";
import { HeroVisual } from "./HeroVisual";
import { MagneticButton } from "./MagneticButton";

type HeroProps = {
  stats: { guides: number; places: number; languages: number };
};

// Quick ways in, like the category row on Airbnb or ToursByLocals. `specialty` must match the
// guides' specialty strings exactly, because it becomes the /guides filter.
const INTERESTS = [
  { key: "food", specialty: "Street food", icon: UtensilsCrossed },
  { key: "history", specialty: "Palaces & history", icon: Landmark },
  { key: "kpop", specialty: "K-pop & K-drama", icon: Mic2 },
  { key: "nightlife", specialty: "Nightlife", icon: MoonStar },
  { key: "hiking", specialty: "Hiking", icon: Mountain },
  { key: "photo", specialty: "Photography", icon: Camera },
] as const;

export const Hero = ({ stats }: HeroProps) => {
  const t = useTranslations("Landing");
  const words = t("headline").split(" ");

  return (
    <section className="relative isolate overflow-hidden pt-12 pb-16 sm:pt-20 lg:pt-24">
      <GlowBlobs />
      <Container className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="flex flex-col items-start gap-7">
          <span
            className={cn(
              "inline-flex items-center gap-2 glassy-full px-3.5 py-1.5 text-xs font-medium",
              ENTER,
            )}
          >
            <Sparkles className="size-3.5 text-primary" />
            {t("badge")}
          </span>

          <h1 className="stagger-words max-w-2xl text-4xl leading-[1.05] font-semibold tracking-tighter text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
            {words.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className={cn(
                  "mr-[0.25em] inline-block",
                  ENTER,
                  index === words.length - 1 && "text-primary",
                )}
              >
                {word}
              </span>
            ))}
          </h1>

          <p
            className={cn(
              "max-w-xl text-base leading-7 text-pretty text-text-secondary md:text-lg md:leading-8",
              ENTER,
              "delay-300",
            )}
          >
            {t("subhead")}
          </p>

          <div
            className={cn(
              "flex w-full flex-col gap-3 sm:w-auto sm:flex-row",
              ENTER,
              "delay-500",
            )}
          >
            <MagneticButton>
              <Link
                href="/guides"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group w-full px-8",
                )}
              >
                {t("ctaGuide")}
                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/planner"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "w-full px-8",
                )}
              >
                <Route />
                {t("ctaPlan")}
              </Link>
            </MagneticButton>
          </div>

          <div
            className={cn(
              "flex flex-wrap items-center gap-2",
              ENTER,
              "delay-700",
            )}
          >
            <span className="mr-1 text-xs text-text-secondary">
              {t("popular")}
            </span>
            {INTERESTS.map(({ key, specialty, icon: Icon }) => (
              <Link
                key={key}
                href={`/guides?specialty=${encodeURIComponent(specialty)}`}
                className="inline-flex items-center gap-1.5 glassy-full px-3 py-1.5 text-xs font-medium transition-colors hover:bg-card-hover [&_svg]:size-3.5"
              >
                <Icon />
                {t(`interests.${key}`)}
              </Link>
            ))}
          </div>

          <dl
            className={cn("grid grid-cols-3 gap-6 pt-2", ENTER, "delay-1000")}
          >
            <Stat value={stats.guides} label={t("statGuides")} />
            <Stat value={stats.places} label={t("statPlaces")} />
            <Stat value={stats.languages} label={t("statLanguages")} />
          </dl>
        </div>

        <div className={cn(ENTER, "delay-300")}>
          <HeroParallax>
            <HeroVisual />
          </HeroParallax>
        </div>
      </Container>
    </section>
  );
};

const Stat = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col">
    <dt className="order-2 text-xs text-muted-foreground">{label}</dt>
    <dd className="order-1 text-2xl font-semibold tracking-tight sm:text-3xl">
      {value > 0 ? `${value}+` : "—"}
    </dd>
  </div>
);

const GlowBlobs = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute -top-24 -left-24 size-[28rem] animate-blob rounded-full bg-primary/20 blur-3xl" />
    <div className="absolute top-10 right-0 size-[22rem] animate-blob rounded-full bg-kr-red/15 blur-3xl [animation-delay:-6s]" />
    <div className="absolute bottom-0 left-1/3 size-[26rem] animate-blob rounded-full bg-kr-blue/15 blur-3xl [animation-delay:-12s]" />
  </div>
);
