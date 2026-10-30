import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export const Logo = ({
  className,
  label,
}: {
  className?: string;
  label: string;
}) => (
  <Link
    href="/"
    className={cn(
      "flex items-center gap-2 font-semibold tracking-tight",
      className,
    )}
  >
    <LogoMark />
    <span className="text-base">{label}</span>
  </Link>
);

// Two interlocking halves, a nod to the red and blue of the Taegeuk without copying it.
const LogoMark = () => (
  <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
    <circle
      cx="16"
      cy="16"
      r="15"
      className="fill-card stroke-border"
      strokeWidth="1"
    />
    <path
      d="M16 4a12 12 0 0 1 0 24a6 6 0 0 1 0-12a6 6 0 0 0 0-12z"
      className="fill-kr-blue"
    />
    <path
      d="M16 4a6 6 0 0 1 0 12a6 6 0 0 0 0 12A12 12 0 0 1 16 4z"
      className="fill-kr-red"
    />
    <circle cx="16" cy="10" r="1.6" className="fill-card" />
    <circle cx="16" cy="22" r="1.6" className="fill-card" />
  </svg>
);
