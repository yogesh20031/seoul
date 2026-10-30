import type { Metadata } from "next";
import {
  Bus,
  CarTaxiFront,
  CreditCard,
  Lightbulb,
  Plane,
  Smartphone,
  TrainFront,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { TransportGuide, TransportKind } from "@seoul/shared";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { api } from "@/lib/api";
import { pick } from "@/lib/format";
import { enterLocale } from "@/lib/locale";

type PageProps = { params: Promise<{ locale: string }> };

const KIND_ICON: Record<TransportKind, typeof Bus> = {
  SUBWAY: TrainFront,
  BUS: Bus,
  TAXI: CarTaxiFront,
  AIRPORT: Plane,
  TMONEY: CreditCard,
  APP: Smartphone,
};
const TIPS = ["tip1", "tip2", "tip3"] as const;
const REVALIDATE = 3600;

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "Transport",
  });
  return { title: t("title"), description: t("subtitle") };
};

export default async function TransportPage({ params }: PageProps) {
  const locale = await enterLocale(params);
  const t = await getTranslations("Transport");
  const guides = await api<TransportGuide[]>("/transport", {
    withAuth: false,
    revalidate: REVALIDATE,
  });

  return (
    <Container className="pb-20">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="grid gap-4 sm:grid-cols-2">
          {guides.map((guide) => {
            const Icon = KIND_ICON[guide.kind];
            return (
              <Link
                key={guide.id}
                href={`/explore/transport/${guide.slug}`}
                className="group"
              >
                <Card interactive className="flex h-full flex-col gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <h2 className="text-lg font-semibold group-hover:text-primary">
                    {pick(guide, "title", locale)}
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {pick(guide, "summary", locale)}
                  </p>
                  <span className="mt-auto text-sm font-medium text-primary">
                    {t("readGuide")} →
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
        <Card
          variant="strong"
          className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start"
        >
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Lightbulb className="size-5 text-warning" />
            {t("quickTips")}
          </h2>
          <ul className="flex flex-col gap-3 text-sm text-text-secondary">
            {TIPS.map((tip) => (
              <li key={tip} className="border-l-2 border-primary/40 pl-3">
                {t(tip)}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Container>
  );
}
