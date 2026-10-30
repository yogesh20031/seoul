import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { CityWordmark } from "./CityWordmark";
import { Logo } from "./Logo";
import { EXPLORE_ITEMS, MAIN_ITEMS } from "./nav-items";

export const Footer = async () => {
  const [t, tNav, tBrand, tCredits] = await Promise.all([
    getTranslations("Footer"),
    getTranslations("Nav"),
    getTranslations("Brand"),
    getTranslations("Credits"),
  ]);

  const columns = [
    {
      title: t("explore"),
      links: EXPLORE_ITEMS.map(({ href, label }) => ({
        href,
        label: tNav(label),
      })),
    },
    {
      title: t("travel"),
      links: MAIN_ITEMS.map(({ href, label }) => ({
        href,
        label: tNav(label),
      })),
    },
    {
      title: t("forGuides"),
      links: [
        { href: "/signup?role=GUIDE", label: t("becomeGuide") },
        { href: "/login", label: t("guideLogin") },
      ],
    },
  ];

  return (
    <footer className="mt-24">
      <div className="dark rounded-t-[2.5rem] bg-banner text-foreground lg:rounded-t-[4rem]">
        <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-4">
            <Logo label={tBrand("name")} className="text-white" />
            <p className="max-w-xs text-sm text-white/70">{t("about")}</p>
          </div>
          {columns.map((column) => (
            <FooterColumn
              key={column.title}
              title={column.title}
              links={column.links}
            />
          ))}
        </Container>
        <Container className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/50 sm:flex-row sm:justify-between">
          <span>{t("rights")}</span>
          <span className="flex gap-4">
            <Link
              href="/credits"
              className="transition-colors hover:text-white"
            >
              {tCredits("title")}
            </Link>
            {t("testMode")}
          </span>
        </Container>
        <Container className="pt-4 pb-10 sm:pb-16">
          <CityWordmark />
        </Container>
      </div>
    </footer>
  );
};

type FooterColumnProps = {
  title: string;
  links: { href: string; label: string }[];
};

const FooterColumn = ({ title, links }: FooterColumnProps) => (
  <div className="flex flex-col gap-3">
    <h3 className="text-sm font-semibold text-white">{title}</h3>
    <ul className="flex flex-col gap-2">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="text-sm text-white/65 transition-colors hover:text-white"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
