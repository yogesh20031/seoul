import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { PublicUser } from "@seoul/shared";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { api } from "@/lib/api";
import { requireRole } from "@/lib/auth-guard";
import { enterLocale } from "@/lib/locale";

type PageProps = { params: Promise<{ locale: string }> };

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "Dashboard",
  });
  return { title: t("profileTitle"), robots: { index: false } };
};

export default async function TravellerProfilePage({ params }: PageProps) {
  const locale = await enterLocale(params);
  const user = await requireRole("TRAVELLER", locale, "/dashboard/profile");
  const t = await getTranslations("Dashboard");
  const tCommon = await getTranslations("Common");
  // AuthUser has no bio/country; the public profile does, and it's exactly what other members see.
  const profile = await api<PublicUser>(`/users/${user.id}`);

  return (
    <Container className="max-w-2xl pb-20">
      <ButtonLink
        href="/dashboard"
        variant="ghost"
        size="sm"
        className="mt-8 -ml-3"
      >
        <ArrowLeft />
        {tCommon("back")}
      </ButtonLink>
      <PageHeader
        title={t("profileTitle")}
        subtitle={t("profileSubtitle")}
        className="pt-4"
      />
      <Card padding="lg">
        <ProfileForm user={user} bio={profile.bio} country={profile.country} />
      </Card>
    </Container>
  );
}
