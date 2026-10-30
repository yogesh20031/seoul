import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { CITY_PHOTOS } from "@/lib/city-photos";
import { enterLocale } from "@/lib/locale";

type PageProps = { params: Promise<{ locale: string }> };

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "Credits",
  });
  return { title: t("title") };
};

// CC BY and CC BY-SA require attribution; this page credits every site-wide photo in one place.
export default async function CreditsPage({ params }: PageProps) {
  const locale = await enterLocale(params);
  const t = await getTranslations("Credits");

  return (
    <Container className="pb-20">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(CITY_PHOTOS).map(([key, photo]) => (
          <li key={key}>
            <Card padding="none" className="overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt[locale]}
                width={640}
                height={Math.round((640 * photo.height) / photo.width)}
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="flex flex-col gap-1 p-4 text-sm">
                <span className="font-medium">{photo.alt[locale]}</span>
                <span className="text-xs text-muted-foreground">
                  {photo.credit}
                </span>
                <a
                  href={photo.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  {t("source")} ↗
                </a>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </Container>
  );
}
