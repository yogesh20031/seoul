import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { TransportGuide } from "@seoul/shared";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Markdown } from "@/components/ui/Markdown";
import { api, ApiError } from "@/lib/api";
import { pick } from "@/lib/format";
import { enterLocale } from "@/lib/locale";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

const REVALIDATE = 3600;

const loadGuide = async (slug: string) => {
  try {
    return await api<TransportGuide>(`/transport/${encodeURIComponent(slug)}`, {
      withAuth: false,
      revalidate: REVALIDATE,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const locale = await enterLocale(params);
  const guide = await loadGuide((await params).slug);
  return {
    title: pick(guide, "title", locale),
    description: pick(guide, "summary", locale),
  };
};

export default async function TransportGuidePage({ params }: PageProps) {
  const locale = await enterLocale(params);
  const guide = await loadGuide((await params).slug);
  const t = await getTranslations("Common");

  return (
    <Container className="max-w-3xl pt-8 pb-20">
      <ButtonLink
        href="/explore/transport"
        variant="ghost"
        size="sm"
        className="-ml-3"
      >
        <ArrowLeft />
        {t("back")}
      </ButtonLink>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
        {pick(guide, "title", locale)}
      </h1>
      <p className="mt-2 text-lg text-text-secondary">
        {pick(guide, "summary", locale)}
      </p>
      <Card padding="lg" className="mt-8">
        <Markdown source={pick(guide, "body", locale)} />
      </Card>
    </Container>
  );
}
