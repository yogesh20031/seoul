"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AuthUser } from "@seoul/shared";
import { Link } from "@/i18n/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { useDismiss } from "@/hooks/useDismiss";
import { logoutAction } from "@/actions/auth";

export const UserMenu = ({ user }: { user: AuthUser }) => {
  const t = useTranslations("Nav");
  const tAuth = useTranslations("Auth");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  const isGuide = user.role === "GUIDE";
  const home = isGuide ? "/guide" : "/dashboard";
  const profile = isGuide ? "/guide/profile" : "/dashboard/profile";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full p-1 pr-3 transition-colors hover:bg-card-hover"
      >
        <Avatar name={user.name} src={user.avatarUrl} size={32} />
        <span className="hidden max-w-28 truncate text-2sm font-medium sm:block">
          {user.name}
        </span>
      </button>
      {open ? (
        <div
          role="menu"
          data-slot="popover-content"
          className="absolute top-full right-0 mt-2 w-56 animate-in glassy-strong p-1.5 shadow-xl duration-200 fade-in slide-in-from-top-1"
        >
          <p className="px-3 pt-2 pb-1 text-2xs font-medium tracking-wide text-muted-foreground uppercase">
            {isGuide ? tAuth("guide") : tAuth("traveller")}
          </p>
          <MenuLink href={home} onClick={close} icon={<LayoutDashboard />}>
            {isGuide ? t("guideDashboard") : t("dashboard")}
          </MenuLink>
          <MenuLink href={profile} onClick={close} icon={<UserRound />}>
            {t("profile")}
          </MenuLink>
          <form action={logoutAction}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-destructive transition-colors hover:bg-card-hover [&_svg]:size-4"
            >
              <LogOut />
              {t("logout")}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

type MenuLinkProps = {
  href: string;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
};

const MenuLink = ({ href, onClick, icon, children }: MenuLinkProps) => (
  <Link
    href={href}
    role="menuitem"
    onClick={onClick}
    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-card-hover [&_svg]:size-4 [&_svg]:text-muted-foreground"
  >
    {icon}
    {children}
  </Link>
);
