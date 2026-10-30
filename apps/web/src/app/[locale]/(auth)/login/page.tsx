import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { DEMO_ACCOUNTS } from "@/components/auth/demo-accounts";
import { LoginForm } from "@/components/auth/LoginForm";
import { safeNextPath } from "@/lib/form";
import { enterLocale } from "@/lib/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "Auth",
  });
  return { title: t("submitLogin") };
};

export default async function LoginPage({ params, searchParams }: PageProps) {
  await enterLocale(params);
  const t = await getTranslations("Auth");
  const next = safeNextPath((await searchParams).next);
  const signupHref = next
    ? `/signup?next=${encodeURIComponent(next)}`
    : "/signup";

  return (
    <AuthCard
      title={t("loginTitle")}
      subtitle={t("loginSubtitle")}
      footer={
        <>
          {t("noAccount")}{" "}
          <Link
            href={signupHref}
            className="font-medium text-primary hover:underline"
          >
            {t("submitSignup")}
          </Link>
        </>
      }
    >
      <LoginForm next={next} />
      <div className="rounded-xl bg-primary/8 px-4 py-3 text-xs text-text-secondary">
        <p className="mb-1 font-semibold text-foreground">{t("demoTitle")}</p>
        {t("demoBody", DEMO_ACCOUNTS)}
      </div>
    </AuthCard>
  );
}
