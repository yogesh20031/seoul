import { ShieldAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { enterLocale } from "@/lib/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ role?: string }>;
};

export default async function ForbiddenPage({
  params,
  searchParams,
}: PageProps) {
  await enterLocale(params);
  const t = await getTranslations("Auth");
  const tErrors = await getTranslations("Errors");
  const role =
    (await searchParams).role === "GUIDE" ? t("guide") : t("traveller");

  return (
    <Container className="max-w-xl py-24">
      <EmptyState
        icon={<ShieldAlert />}
        title={t("forbiddenTitle")}
        description={t("forbiddenBody", { role })}
        action={<ButtonLink href="/">{tErrors("home")}</ButtonLink>}
      />
    </Container>
  );
}
