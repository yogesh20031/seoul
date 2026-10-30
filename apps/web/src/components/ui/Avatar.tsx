import Image from "next/image";
import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";

type AvatarProps = {
  name: string;
  src: string | null;
  size?: number;
  className?: string;
};

// Fixed set so Tailwind sees every class at build time.
const AVATAR_SIZES: Record<number, string> = {
  24: "size-6",
  28: "size-7",
  32: "size-8",
  40: "size-10",
  48: "size-12",
  56: "size-14",
  64: "size-16",
  96: "size-24",
};

export const Avatar = ({ name, src, size = 40, className }: AvatarProps) => {
  const sizeClass = AVATAR_SIZES[size] ?? "size-10";
  if (!src) {
    return (
      <span
        aria-label={name}
        className={cn(
          sizeClass,
          "inline-flex shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary ring-2 ring-background dark:text-primary-900",
          className,
        )}
      >
        {initials(name)}
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      className={cn(
        sizeClass,
        "shrink-0 rounded-full object-cover ring-2 ring-background",
        className,
      )}
    />
  );
};
