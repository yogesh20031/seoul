import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignupForm } from "@/components/auth/SignupForm";
import { safeNextPath } from "@/lib/form";
import { enterLocale } from "@/lib/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string; role?: string }>;
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const t = await getTranslations({
    locale: await enterLocale(params),
    namespace: "Auth",
  });
  return { title: t("submitSignup") };
};

export default async function SignupPage({ params, searchParams }: PageProps) {
  await enterLocale(params);
  const t = await getTranslations("Auth");
  const query = await searchParams;
  const next = safeNextPath(query.next);

  return (
    <AuthCard
      title={t("signupTitle")}
      subtitle={t("signupSubtitle")}
      footer={
        <>
          {t("hasAccount")}{" "}
          <Link
            href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
            className="font-medium text-primary hover:underline"
          >
            {t("submitLogin")}
          </Link>
        </>
      }
    >
      <SignupForm
        initialRole={query.role === "GUIDE" ? "GUIDE" : "TRAVELLER"}
        next={next}
      />
    </AuthCard>
  );
}
