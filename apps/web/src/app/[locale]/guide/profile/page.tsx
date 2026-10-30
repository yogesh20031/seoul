import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { GuideDetail, PublicUser } from "@seoul/shared";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { GuideProfileForm } from "@/components/guide-dash/GuideProfileForm";
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
    namespace: "GuideDash",
  });
  return { title: t("profile"), robots: { index: false } };
};

export default async function GuideProfilePage({ params }: PageProps) {
  const locale = await enterLocale(params);
  const user = await requireRole("GUIDE", locale, "/guide/profile");
  const t = await getTranslations("GuideDash");
  const tDash = await getTranslations("Dashboard");
  const tCommon = await getTranslations("Common");
  const [guide, publicProfile] = await Promise.all([
    api<GuideDetail>(`/guides/${user.id}`),
    api<PublicUser>(`/users/${user.id}`),
  ]);

  return (
    <Container className="max-w-2xl pb-20">
      <ButtonLink
        href="/guide"
        variant="ghost"
        size="sm"
        className="mt-8 -ml-3"
      >
        <ArrowLeft />
        {tCommon("back")}
      </ButtonLink>
      <PageHeader
        title={t("profile")}
        subtitle={t("profileSubtitle")}
        className="pt-4"
      />
      <div className="flex flex-col gap-6">
        <Card padding="lg">
          <GuideProfileForm guide={guide} />
        </Card>
        <Card padding="lg" className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">{tDash("profileTitle")}</h2>
          <ProfileForm
            user={user}
            bio={publicProfile.bio}
            country={publicProfile.country}
          />
        </Card>
      </div>
    </Container>
  );
}
