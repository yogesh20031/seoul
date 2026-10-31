import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { TourCard as TourCardData } from "@seoul/shared";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TourCard } from "@/components/tours/TourCard";

export const UpcomingTours = ({ tours }: { tours: TourCardData[] }) => {
  const t = useTranslations("Landing");
  const tCommon = useTranslations("Common");
  if (tours.length === 0) return null;

  return (
    <Reveal className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeader
          eyebrow={t("toursEyebrow")}
          title={t("toursTitle")}
          subtitle={t("toursSubtitle")}
          action={
            <Link
              href="/tours"
              className={buttonVariants({ variant: "secondary" })}
            >
              {tCommon("seeAll")}
              <ArrowRight />
            </Link>
          }
        />
        {/* A swipeable rail: the next card peeks in at the edge, so it's clear there are more. */}
        <ul className="-mx-4 scrollbar-none flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0">
          {tours.map((tour) => (
            <li
              key={tour.id}
              className="flex shrink-0 basis-[85%] snap-start sm:basis-[46%] lg:basis-[31%] [&>*]:w-full"
            >
              <TourCard tour={tour} />
            </li>
          ))}
        </ul>
      </Container>
    </Reveal>
  );
};
