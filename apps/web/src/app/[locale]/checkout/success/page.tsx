import type { Metadata } from "next";
import { CheckCircle2, Hourglass } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { api, ApiError } from "@/lib/api";
import { enterLocale } from "@/lib/locale";
import { firstParam } from "@/lib/url";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type ConfirmResponse = { kind: "booking" | "solo"; id: string; status: string };

const PAID_STATUSES = new Set(["PAID", "COMPLETED"]);

/**
 * Stripe redirects here before its webhook may have arrived, so we ask the API to check the
 * session directly. That also means the flow works locally without the Stripe CLI forwarding webhooks.
 */
const confirmStripeSession = async (sessionId: string) => {
  try {
    const result = await api<ConfirmResponse>("/payments/confirm", {
      method: "POST",
      body: { sessionId },
    });
    return PAID_STATUSES.has(result.status);
  } catch (error) {
    if (error instanceof ApiError) return false;
    throw error;
  }
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "Checkout",
  });
  return { title: t("successTitle"), robots: { index: false } };
};

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: PageProps) {
  await enterLocale(params);
  const t = await getTranslations("Checkout");
  const query = await searchParams;
  const sessionId = firstParam(query.session_id);
  // Mock mode marks the booking paid before redirecting, so there's nothing to confirm.
  const paid =
    firstParam(query.mock) === "1" ||
    (sessionId ? await confirmStripeSession(sessionId) : false);

  return (
    <Container className="max-w-xl py-24">
      <EmptyState
        icon={paid ? <CheckCircle2 /> : <Hourglass />}
        title={paid ? t("successTitle") : t("pendingTitle")}
        description={paid ? t("successBody") : t("pendingBody")}
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
