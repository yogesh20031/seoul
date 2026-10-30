"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";

type ErrorPageProps = { error: Error & { digest?: string }; reset: () => void };

export default function ErrorPage({ reset }: ErrorPageProps) {
  const t = useTranslations("Common");
  return (
    <Container className="max-w-xl py-24">
      <EmptyState
        icon={<TriangleAlert />}
        title={t("somethingWrong")}
        // Most failures here are the free-tier API waking up, so say that rather than show a stack.
        description={t("apiDown")}
        action={
          <Button onClick={reset}>
            <RefreshCw />
            {t("tryAgain")}
          </Button>
        }
      />
    </Container>
  );
}
