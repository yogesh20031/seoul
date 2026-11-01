import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

type FaqEntry = { key: string; question: string; answer: string };

// Grouped the way travellers think about a trip: booking it, paying for it, trusting the guide.
// Every answer mirrors a rule the API enforces, so change both together.
const GROUPS = [
  {
    key: "booking",
    items: ["groupTours", "privateGuide", "whoJoins", "planner"],
  },
  { key: "payments", items: ["payment", "cancel", "guideCancels"] },
  { key: "trust", items: ["guides", "reviews", "languages"] },
] as const;

// Native <details> gives an accessible accordion with no client JS.
export const Faq = ({ languages }: { languages: number }) => {
  const t = useTranslations("Landing");
  const groups = GROUPS.map((group) => ({
    key: group.key,
    title: t(`faq.groups.${group.key}`),
    entries: group.items.map((item) => ({
      key: item,
      question: t(`faq.items.${item}.q`),
      answer: t(`faq.items.${item}.a`, { count: languages }),
    })),
  }));
  // FAQPage structured data lets search engines show these answers directly in results.
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((group) =>
      group.entries.map((entry) => ({
        "@type": "Question",
        name: entry.question,
        acceptedAnswer: { "@type": "Answer", text: entry.answer },
      })),
    ),
    // Escaped so a "<" in a translation can never close the script tag early.
  }).replace(/</g, "\\u003c");

  return (
    <Reveal className="py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeader
          title={t("faqTitle")}
          subtitle={t("faqSubtitle")}
          className="self-start lg:sticky lg:top-24"
        />
        <div className="flex flex-col gap-8">
          {groups.map((group) => (
            <section key={group.key} className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                {group.title}
              </h3>
              {group.entries.map((entry) => (
                <FaqItem key={entry.key} entry={entry} />
              ))}
            </section>
          ))}
        </div>
      </Container>
    </Reveal>
  );
};

const FaqItem = ({ entry }: { entry: FaqEntry }) => (
  <details className="group glassy-2xl px-5 py-1 open:pb-4">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-medium [&::-webkit-details-marker]:hidden">
      {entry.question}
      <Plus className="size-5 shrink-0 text-primary transition-transform duration-200 group-open:rotate-45" />
    </summary>
    <p className="text-sm leading-6 text-text-secondary">{entry.answer}</p>
  </details>
);
