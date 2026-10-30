import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { GUIDE_SORTS } from "@seoul/shared";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export type GuideFilterValues = {
  q?: string;
  language?: string;
  specialty?: string;
  minRating?: string;
  maxPrice?: string;
  sort?: string;
};

type GuideFiltersProps = {
  values: GuideFilterValues;
  languages: string[];
  specialties: string[];
};

const RATINGS = ["4.5", "4", "3"] as const;
const PRICES = [50_000, 80_000, 120_000, 200_000] as const;
const SORT_KEYS = {
  rating: "sortRating",
  price_asc: "sortPriceAsc",
  price_desc: "sortPriceDesc",
  newest: "sortNewest",
} as const;

/** A plain GET form: filters live in the URL, so results are shareable and work without JS. */
export const GuideFilters = ({
  values,
  languages,
  specialties,
}: GuideFiltersProps) => {
  const t = useTranslations("Guides");

  return (
    <Card padding="sm" className="p-3!">
      <form className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto]">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            type="search"
            defaultValue={values.q}
            placeholder={t("searchPlaceholder")}
            className="pl-10"
            aria-label={t("searchPlaceholder")}
          />
        </div>
        <Select
          name="language"
          defaultValue={values.language ?? ""}
          aria-label={t("language")}
        >
          <option value="">{t("anyLanguage")}</option>
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </Select>
        <Select
          name="specialty"
          defaultValue={values.specialty ?? ""}
          aria-label={t("specialty")}
        >
          <option value="">{t("anySpecialty")}</option>
          {specialties.map((specialty) => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </Select>
        <Select
          name="minRating"
          defaultValue={values.minRating ?? ""}
          aria-label={t("minRating")}
        >
          <option value="">{t("anyRating")}</option>
          {RATINGS.map((rating) => (
            <option key={rating} value={rating}>
              {t("ratingAtLeast", { rating })}
            </option>
          ))}
        </Select>
        <Select
          name="maxPrice"
          defaultValue={values.maxPrice ?? ""}
          aria-label={t("maxPrice")}
        >
          <option value="">{t("anyPrice")}</option>
          {PRICES.map((price) => (
            <option key={price} value={price}>
              ≤ ₩{price.toLocaleString("en-US")}
            </option>
          ))}
        </Select>
        <Select
          name="sort"
          defaultValue={values.sort ?? "rating"}
          aria-label={t("sort")}
        >
          {GUIDE_SORTS.map((sort) => (
            <option key={sort} value={sort}>
              {t(SORT_KEYS[sort])}
            </option>
          ))}
        </Select>
        <Button type="submit" className="h-11">
          <SlidersHorizontal />
          {t("apply")}
        </Button>
      </form>
    </Card>
  );
};
