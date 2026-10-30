import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "./ButtonLink";

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  /** Builds the link for a page, keeping the current filters. */
  hrefFor: (page: number) => string;
};

export const Pagination = ({
  page,
  pageSize,
  total,
  hrefFor,
}: PaginationProps) => {
  const t = useTranslations("Common");
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages === 1) return null;

  return (
    <nav
      aria-label={t("page", { page, total: pages })}
      className="mt-10 flex items-center justify-center gap-3"
    >
      {page > 1 ? (
        <ButtonLink href={hrefFor(page - 1)} variant="secondary" size="sm">
          <ChevronLeft />
          {t("previous")}
        </ButtonLink>
      ) : null}
      <span className="text-sm text-muted-foreground">
        {t("page", { page, total: pages })}
      </span>
      {page < pages ? (
        <ButtonLink href={hrefFor(page + 1)} variant="secondary" size="sm">
          {t("next")}
          <ChevronRight />
        </ButtonLink>
      ) : null}
    </nav>
  );
};
