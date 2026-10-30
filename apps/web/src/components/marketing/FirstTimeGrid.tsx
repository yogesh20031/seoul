import {
  CreditCard,
  LifeBuoy,
  Map,
  Plane,
  Smartphone,
  Wifi,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const TIPS = [
  { key: "tmoney", icon: CreditCard },
  { key: "keta", icon: Plane },
  { key: "money", icon: Smartphone },
  { key: "sim", icon: Wifi },
  { key: "apps", icon: Map },
  { key: "help", icon: LifeBuoy },
] as const;

export const FirstTimeGrid = () => {
  const t = useTranslations("Landing");
  return (
    <Reveal className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeader
          eyebrow="Seoul 101"
          title={t("firstTimeTitle")}
          subtitle={t("firstTimeSubtitle")}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TIPS.map(({ key, icon: Icon }) => (
            <Card key={key} className="flex gap-4" interactive>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-primary-900">
                <Icon className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold">
                  {t(`firstTime.${key}.title`)}
                </h3>
                <p className="text-sm text-text-secondary">
                  {t(`firstTime.${key}.body`)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Reveal>
  );
};
