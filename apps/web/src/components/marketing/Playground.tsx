import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GroupDemo } from "./playground/GroupDemo";
import { GuideMatcherDemo } from "./playground/GuideMatcherDemo";
import { PlannerDemo } from "./playground/PlannerDemo";
import { PlayCard } from "./playground/PlayCard";

export const Playground = () => {
  const t = useTranslations("Playground");
  return (
    <section className="py-16 sm:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          <PlayCard index={0} tone="violet" title={t("plannerTitle")}>
            <PlannerDemo />
          </PlayCard>
          <PlayCard index={1} tone="red" title={t("groupTitle")}>
            <GroupDemo />
          </PlayCard>
          <PlayCard
            index={2}
            tone="blue"
            title={t("matcherTitle")}
            hint={t("matcherHint")}
          >
            <GuideMatcherDemo />
          </PlayCard>
        </div>
      </Container>
    </section>
  );
};
