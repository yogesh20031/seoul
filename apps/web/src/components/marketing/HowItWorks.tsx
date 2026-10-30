import { Compass, MapPinned, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const STEPS = [
  { key: "pick", icon: Compass },
  { key: "match", icon: UsersRound },
  { key: "meet", icon: MapPinned },
] as const;

export const HowItWorks = () => {
  const t = useTranslations("Landing");
  return (
    <Reveal className="py-16 sm:py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeader
          align="center"
          title={t("howTitle")}
          subtitle={t("howSubtitle")}
        />
        <ol className="relative grid gap-6 md:grid-cols-3">
          <div
            aria-hidden
            className="absolute top-7 right-[16%] left-[16%] hidden h-px border-t border-dashed border-primary/40 md:block"
          />
          {STEPS.map(({ key, icon: Icon }, index) => (
            <li
              key={key}
              className="relative flex flex-col items-center gap-4 text-center"
            >
              <span className="relative flex size-14 items-center justify-center glassy-full text-primary shadow-glow dark:text-primary-900">
                <Icon className="size-6" />
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-3xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
              </span>
              <h3 className="text-lg font-semibold">{t(`how.${key}.title`)}</h3>
              <p className="max-w-xs text-sm text-text-secondary">
                {t(`how.${key}.body`)}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </Reveal>
  );
};
