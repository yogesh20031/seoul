"use client";

import { useRef, useState, useTransition, type ReactNode } from "react";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";
import { withQuery } from "@/lib/url";
import { PLACE_TAGS, type PlaceTag } from "./place-tags";

type Filters = { q?: string; district?: string; tag?: PlaceTag };

type PlaceFiltersProps = {
  filters: Filters;
  districts: string[];
  total: number;
};

// Long enough that typing a word doesn't fire a request per letter.
const SEARCH_DEBOUNCE_MS = 350;

/** Search, district and category filters for the places list. All state lives in the URL. */
export const PlaceFilters = ({
  filters,
  districts,
  total,
}: PlaceFiltersProps) => {
  const t = useTranslations("Places");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(filters.q ?? "");
  const debounce = useRef<number | undefined>(undefined);

  // Any filter change goes back to page 1, since the old page may not exist in the new results.
  const apply = (changes: Filters) =>
    startTransition(() =>
      router.replace(withQuery(pathname, { ...filters, ...changes }), {
        scroll: false,
      }),
    );

  const onSearch = (value: string) => {
    setQuery(value);
    window.clearTimeout(debounce.current);
    debounce.current = window.setTimeout(
      () => apply({ q: value.trim() || undefined }),
      SEARCH_DEBOUNCE_MS,
    );
  };

  const clearAll = () => {
    setQuery("");
    startTransition(() => router.replace(pathname, { scroll: false }));
  };

  const clearFilter = (key: keyof Filters) =>
    key === "q" ? onSearch("") : apply({ [key]: undefined });

  const active = [
    filters.q ? { key: "q" as const, label: `“${filters.q}”` } : null,
    filters.district
      ? { key: "district" as const, label: filters.district }
      : null,
    filters.tag
      ? { key: "tag" as const, label: t(`tags.${filters.tag}`) }
      : null,
  ].filter((item) => item !== null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 glassy-2xl p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <input
              type="search"
              value={query}
              onChange={(event) => onSearch(event.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
              className="h-11 w-full rounded-xl glassy-input px-10 text-sm placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
            />
            {/* After the input in the DOM so the input's glass background doesn't paint over it. */}
            <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground">
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
            </span>
            {query ? (
              <button
                type="button"
                onClick={() => onSearch("")}
                aria-label={t("clearSearch")}
                className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-card-hover hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
          <div className="relative sm:w-56">
            <MapPin className="pointer-events-none absolute top-1/2 left-3.5 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
            <Select
              aria-label={tCommon("district")}
              value={filters.district ?? ""}
              onChange={(event) =>
                apply({ district: event.target.value || undefined })
              }
              className="pl-10"
            >
              <option value="">{t("allDistricts")}</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div
          className="-mx-1 scrollbar-none flex gap-2 overflow-x-auto px-1 py-0.5"
          role="radiogroup"
          aria-label={t("allTags")}
        >
          <TagChip
            active={!filters.tag}
            onClick={() => apply({ tag: undefined })}
          >
            {t("allTags")}
          </TagChip>
          {PLACE_TAGS.map(({ id, icon: Icon }) => (
            <TagChip
              key={id}
              active={filters.tag === id}
              onClick={() =>
                apply({ tag: filters.tag === id ? undefined : id })
              }
            >
              <Icon />
              {t(`tags.${id}`)}
            </TagChip>
          ))}
        </div>
      </div>

      <div className="flex min-h-8 flex-wrap items-center gap-2">
        <p
          className={cn(
            "mr-1 text-sm font-medium transition-opacity",
            pending && "opacity-50",
          )}
          aria-live="polite"
        >
          {t("results", { count: total })}
        </p>
        {active.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => clearFilter(item.key)}
            aria-label={t("removeFilter", { filter: item.label })}
            className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-full bg-primary/12 pr-2 pl-3 text-xs font-medium text-primary transition-colors hover:bg-primary/20 dark:text-primary-900"
          >
            {item.label}
            <X className="size-3.5" />
          </button>
        ))}
        {active.length > 1 ? (
          <button
            type="button"
            onClick={clearAll}
            className="cursor-pointer text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {tCommon("clear")}
          </button>
        ) : null}
      </div>
    </div>
  );
};

type TagChipProps = {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
};

const TagChip = ({ active, onClick, children }: TagChipProps) => (
  <button
    type="button"
    role="radio"
    aria-checked={active}
    onClick={onClick}
    className={cn(
      "inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-2sm font-medium whitespace-nowrap transition-colors [&_svg]:size-4",
      active
        ? "glass-btn text-primary-foreground"
        : "text-text-secondary hover:bg-card-hover hover:text-foreground",
    )}
  >
    {children}
  </button>
);
