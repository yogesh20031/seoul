import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type ChipProps = {
  href: string;
  active?: boolean;
  children: ReactNode;
};

/** A filter chip that is a link, so filters live in the URL and work without JS. */
export const Chip = ({ href, active = false, children }: ChipProps) => (
  <Link
    href={href}
    scroll={false}
    aria-current={active ? "true" : undefined}
    className={cn(
      "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-2sm font-medium whitespace-nowrap transition-colors [&_svg]:size-4",
      active
        ? "glass-btn text-primary-foreground"
        : "glassy-full text-foreground hover:bg-card-hover",
    )}
  >
    {children}
  </Link>
);
