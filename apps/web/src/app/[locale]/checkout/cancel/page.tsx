import type { Metadata } from "next";
import { CircleSlash } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { enterLocale } from "@/lib/locale";

type PageProps = { params: Promise<{ locale: string }> };

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "Checkout",
  });
  return { title: t("cancelTitle"), robots: { index: false } };
};

export default async function CheckoutCancelPage({ params }: PageProps) {
  await enterLocale(params);
  const t = await getTranslations("Checkout");
  return (
    <Container className="max-w-xl py-24">
      <EmptyState
        icon={<CircleSlash />}
        title={t("cancelTitle")}
        description={t("cancelBody")}
        action={
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <ButtonLink href="/dashboard">{t("viewTrips")}</ButtonLink>
            <ButtonLink href="/tours" variant="secondary">
              {t("backToTours")}
            </ButtonLink>
          </div>
        }
      />
    </Container>
  );
}
