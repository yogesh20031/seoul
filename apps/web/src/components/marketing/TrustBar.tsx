import { BadgeCheck, Languages, ShieldCheck, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

// Only claims the product actually backs: badges and reviews exist, members are visible before
// booking, checkout is Stripe, and the language count comes from the guides in the database.
const ITEMS = [
  { key: "verified", icon: BadgeCheck },
  { key: "members", icon: UsersRound },
  { key: "secure", icon: ShieldCheck },
  { key: "languages", icon: Languages },
] as const;

export const TrustBar = ({ languages }: { languages: number }) => {
  const t = useTranslations("Landing.trust");
  return (
    <section aria-label={t("label")} className="pb-6">
      <Container>
        <ul className="grid grid-cols-2 gap-4 glassy-2xl p-4 sm:p-6 lg:grid-cols-4">
          {ITEMS.map(({ key, icon: Icon }) => (
            <li key={key} className="flex items-center gap-3 sm:items-start">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:size-10 dark:text-primary-900">
                <Icon className="size-5" />
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold">{t(`${key}.title`)}</p>
                {/* Phones get the titles only, so the row stays one glance tall. */}
                <p className="hidden text-xs leading-relaxed text-text-secondary sm:block">
                  {t(`${key}.body`, { count: languages })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};
