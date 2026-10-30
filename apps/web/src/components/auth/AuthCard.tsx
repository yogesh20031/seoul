import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/layout/Logo";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export const AuthCard = ({
  title,
  subtitle,
  children,
  footer,
}: AuthCardProps) => {
  const tBrand = useTranslations("Brand");
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-12 sm:py-20">
      <Card variant="strong" padding="lg" className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo label={tBrand("name")} />
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-text-secondary">{subtitle}</p>
        </div>
        {children}
      </Card>
      <p className="text-center text-sm text-muted-foreground">{footer}</p>
    </div>
  );
};
