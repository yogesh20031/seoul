import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Avatar } from "@/components/ui/Avatar";

const KEYS = ["t1", "t2", "t3"] as const;

export const Testimonials = () => {
  const t = useTranslations("Landing");
  return (
    <Reveal className="py-16 sm:py-20">
      <Container>
        <SectionHeader align="center" title={t("testimonialsTitle")} />
      </Container>
      <Marquee
        pauseOnHover
        speed="slow"
        className="mt-10 mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        {KEYS.map((key) => (
          <Card key={key} className="flex w-[22rem] shrink-0 flex-col gap-4">
            <Quote className="size-6 text-primary/60" />
            <p className="text-sm leading-6 text-text-secondary">
              {t(`testimonials.${key}.quote`)}
            </p>
            <div className="mt-auto flex items-center gap-3">
              <Avatar
                name={t(`testimonials.${key}.name`)}
                src={`https://i.pravatar.cc/150?u=${key}`}
                size={40}
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  {t(`testimonials.${key}.name`)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t(`testimonials.${key}.from`)}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </Marquee>
    </Reveal>
  );
};
