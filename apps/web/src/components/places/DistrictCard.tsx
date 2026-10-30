import { ArrowRight, MapPinned } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { districtInfo } from "@/lib/districts";
import { withQuery } from "@/lib/url";

export const DistrictCard = ({ district }: { district: string }) => {
  const t = useTranslations("PlaceDetail");
  const locale = useLocale();
  const info = districtInfo(district);
  if (!info) return null;
  const name = info.name[locale];

  return (
    <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
        <MapPinned className="size-6" />
      </span>
      <div className="flex flex-1 flex-col gap-1.5">
        <h2 className="text-lg font-semibold">
          {t("aboutDistrict", { district: name })}
        </h2>
        <p className="text-sm leading-relaxed text-text-secondary">
          {info.blurb[locale]}
        </p>
      </div>
      {/* Links by the stored English district name, which is what the places filter matches on. */}
      <Link
        href={withQuery("/explore/places", { district })}
        className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        {t("moreInDistrict", { district: name })}
        <ArrowRight className="size-4" />
      </Link>
    </Card>
  );
};
