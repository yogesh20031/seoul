import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CircleSlash } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { safeNextPath } from "@/lib/form";
import { enterLocale } from "@/lib/locale";
import { firstParam } from "@/lib/url";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "Checkout",
  });
  return { title: t("cancelTitle"), robots: { index: false } };
};

export default async function CheckoutCancelPage({
  params,
  searchParams,
}: PageProps) {
  await enterLocale(params);
  // Leaving checkout should land the user back on the page they started from.
  const next = safeNextPath(firstParam((await searchParams).next));
  if (next) redirect(next);
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
