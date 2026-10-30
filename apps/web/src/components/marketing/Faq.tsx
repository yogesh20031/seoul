import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const QUESTIONS = ["1", "2", "3", "4", "5"] as const;

// Native <details> gives an accessible accordion with no client JS.
export const Faq = () => {
  const t = useTranslations("Landing");
  return (
    <Reveal className="py-16 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeader
          title={t("faqTitle")}
          className="self-start lg:sticky lg:top-24"
        />
        <div className="flex flex-col gap-3">
          {QUESTIONS.map((n) => (
            <details key={n} className="group glassy-2xl px-5 py-1 open:pb-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-medium [&::-webkit-details-marker]:hidden">
                {t(`faq.q${n}`)}
                <Plus className="size-5 shrink-0 text-primary transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <p className="text-sm leading-6 text-text-secondary">
                {t(`faq.a${n}`)}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </Reveal>
  );
};
