import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR, Poppins } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { enterLocale } from "@/lib/locale";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "@/styles/globals.css";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Poppins has no Hangul, so Korean text falls through to Noto Sans KR.
const notoKr = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  variable: "--font-noto-kr",
  display: "swap",
  preload: false,
});

export const generateStaticParams = () =>
  routing.locales.map((locale) => ({ locale }));

export const generateMetadata = async ({
  params,
}: LayoutProps): Promise<Metadata> => {
  const locale = await enterLocale(params);
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: {
      default: t("title"),
      template: `%s · ${t("title").split(" · ")[0]}`,
    },
    description: t("description"),
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ),
  };
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f8ff" },
    { media: "(prefers-color-scheme: dark)", color: "#020116" },
  ],
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const locale = await enterLocale(params);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${poppins.variable} ${notoKr.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <NextIntlClientProvider>
            <div className="app-backdrop" aria-hidden />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
