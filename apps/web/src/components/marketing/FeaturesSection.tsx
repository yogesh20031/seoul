import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeatureDeck } from "./FeatureDeck";

export const FeaturesSection = () => {
  const t = useTranslations("Landing");
  return (
    <Reveal className="py-16 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <SectionHeader
          eyebrow="SeoulMate"
          title={t("featuresTitle")}
          subtitle={t("subhead")}
        />
        <FeatureDeck />
      </Container>
    </Reveal>
  );
};
