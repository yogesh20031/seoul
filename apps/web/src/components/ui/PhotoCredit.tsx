import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

type PhotoCreditProps = { credit: string | null; className?: string };

/** Creative Commons photos must credit the author and licence wherever they're shown. */
export const PhotoCredit = ({ credit, className }: PhotoCreditProps) => {
  const t = useTranslations("Common");
  if (!credit) return null;
  return (
    <p className={cn("text-2xs text-muted-foreground", className)}>
      {t("photoCredit", { credit })}
    </p>
  );
};
