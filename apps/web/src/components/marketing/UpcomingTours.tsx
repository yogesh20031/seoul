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
          eyebrow="Group tours"
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tours.slice(0, 6).map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </Container>
    </Reveal>
  );
};
