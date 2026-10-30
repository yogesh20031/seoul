"use client";

import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full px-3.5 py-2 text-2sm font-medium transition-colors hover:bg-card-hover",
        active ? "text-primary dark:text-primary-900" : "text-text-secondary",
      )}
    >
      {children}
    </Link>
  );
};
