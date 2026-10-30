import { Compass } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  const t = useTranslations("Errors");
  return (
    <Container className="max-w-xl py-24">
      <EmptyState
        icon={<Compass />}
        title={t("notFoundTitle")}
        description={t("notFoundBody")}
        action={<ButtonLink href="/">{t("home")}</ButtonLink>}
      />
    </Container>
  );
}
