"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

const REVEAL_CLASSNAME =
  "transition-[opacity,transform] duration-[450ms] ease-out data-[reveal=hidden]:translate-y-3 data-[reveal=hidden]:opacity-0";

type RevealProps = ComponentPropsWithoutRef<"section">;

/**
 * Scroll-reveal wrapper. Children are a slot, so wrapped sections stay Server Components.
 *
 * The server renders content visible; on mount we hide only what's still below the fold and
 * fade it in on intersect. Nothing in the first viewport is ever hidden, so this can't hold
 * back the largest paint while waiting for hydration.
 */
export const Reveal = ({ className, children, ...rest }: RevealProps) => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    element.dataset.reveal = "hidden";
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          element.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={cn(REVEAL_CLASSNAME, className)} {...rest}>
      {children}
    </section>
  );
};
