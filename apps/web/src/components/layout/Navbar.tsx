import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/session";
import { Container } from "@/components/ui/Container";
import { buttonVariants } from "@/components/ui/button-variants";
import { Logo } from "./Logo";
import { NavLink } from "./NavLink";
import { ExploreMenu } from "./ExploreMenu";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleToggle } from "./LocaleToggle";
import { UserMenu } from "./UserMenu";
import { MobileNav } from "./MobileNav";
import { MAIN_ITEMS } from "./nav-items";

export const Navbar = async () => {
  const [t, tBrand, user] = await Promise.all([
    getTranslations("Nav"),
    getTranslations("Brand"),
    // A sleeping API shouldn't take the whole site down; show the logged-out nav instead.
    getCurrentUser().catch(() => null),
  ]);

  return (
    <header className="sticky top-0 z-50">
      {/* Glass lives on its own layer: a backdrop-filter on <header> would stop the dropdowns inside it from blurring the page. */}
      <div aria-hidden className="absolute inset-0 -z-10 glassy-sharp" />
      <Container className="flex h-16 items-center gap-4">
        <Logo label={tBrand("name")} />
        <nav className="ml-4 hidden items-center gap-0.5 lg:flex">
          <ExploreMenu />
          {MAIN_ITEMS.map(({ href, label }) => (
            <NavLink key={href} href={href}>
              {t(label)}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <LocaleToggle />
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden items-center gap-1 sm:flex">
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                {t("login")}
              </Link>
              <Link href="/signup" className={buttonVariants({ size: "sm" })}>
                {t("signup")}
              </Link>
            </div>
          )}
          <MobileNav loggedIn={user !== null} />
        </div>
      </Container>
    </header>
  );
};
