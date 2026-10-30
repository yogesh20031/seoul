import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { GuideCard as GuideCardData } from "@seoul/shared";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GuideCard } from "@/components/guides/GuideCard";

export const TopGuides = ({ guides }: { guides: GuideCardData[] }) => {
  const t = useTranslations("Landing");
  const tCommon = useTranslations("Common");
  if (guides.length === 0) return null;

  return (
    <Reveal className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeader
          title={t("topGuidesTitle")}
          subtitle={t("topGuidesSubtitle")}
          action={
            <Link
              href="/guides"
              className={buttonVariants({ variant: "secondary" })}
            >
              {tCommon("seeAll")}
              <ArrowRight />
            </Link>
          }
        />
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {guides.slice(0, 4).map((guide) => (
            <div
              key={guide.id}
              className="w-[80%] shrink-0 snap-start sm:w-auto"
            >
              <GuideCard guide={guide} />
            </div>
          ))}
        </div>
      </Container>
    </Reveal>
  );
};
