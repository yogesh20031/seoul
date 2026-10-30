"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { HandUnderline } from "./HandUnderline";

type Token = { text: string; stat: boolean };

const LINES = ["line1", "line2", "line3"] as const;
// Lines finish lighting up a little before the pinned block scrolls away, so the last one gets a beat.
const SPAN = 0.9;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

// Copy marks highlighted phrases with [brackets]; those become one underlined token.
const tokenize = (line: string): Token[] =>
  line
    .split(/(\[[^\]]+\])/)
    .filter(Boolean)
    .flatMap((part): Token[] =>
      part.startsWith("[")
        ? [{ text: part.slice(1, -1), stat: true }]
        : part
            .split(" ")
            .filter(Boolean)
            .map((text) => ({ text, stat: false })),
    );

/** Pinned block where each line brightens word by word as you scroll, after Aether's Social Guard page. */
export const ScrollStory = () => {
  const t = useTranslations("Story");
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={ref}
      className={cn("relative", reduce ? "py-20" : "h-[300vh]")}
    >
      <div
        className={cn(
          !reduce &&
            "sticky top-16 flex min-h-[calc(100svh-4rem)] items-center",
        )}
      >
        <Container className="max-w-4xl">
          <span className="text-xs font-semibold tracking-widest text-primary uppercase">
            {t("eyebrow")}
          </span>
          {LINES.map((key, index) => (
            <Line
              key={key}
              tokens={tokenize(t(key))}
              start={(index / LINES.length) * SPAN}
              end={((index + 1) / LINES.length) * SPAN}
              progress={scrollYProgress}
              lead={index === 0}
            />
          ))}
        </Container>
      </div>
    </section>
  );
};

type LineProps = {
  tokens: Token[];
  start: number;
  end: number;
  progress: MotionValue<number>;
  lead: boolean;
};

const Line = ({ tokens, start, end, progress, lead }: LineProps) => {
  const step = (end - start) / tokens.length;
  return (
    <p
      aria-label={tokens.map((token) => token.text).join(" ")}
      className={cn(
        "tracking-tighter text-balance",
        lead
          ? "mt-4 text-3xl leading-tight font-semibold sm:text-4xl md:text-5xl"
          : "mt-4 text-2xl leading-snug font-medium sm:text-3xl md:text-4xl",
      )}
    >
      {tokens.map((token, index) => (
        <Word
          key={`${token.text}-${index}`}
          token={token}
          start={start + step * index}
          end={start + step * (index + 1)}
          progress={progress}
        />
      ))}
    </p>
  );
};

type WordProps = {
  token: Token;
  start: number;
  end: number;
  progress: MotionValue<number>;
};

const Word = ({ token, start, end, progress }: WordProps) => {
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, (value) =>
    reduce ? 1 : 0.14 + 0.86 * clamp01((value - start) / (end - start)),
  );
  const underline = useTransform(progress, (value) =>
    clamp01((value - end) / 0.04),
  );

  return (
    <>
      <motion.span
        aria-hidden
        style={{ opacity }}
        className={cn(
          "inline-block",
          token.stat && "relative font-semibold text-primary",
        )}
      >
        {token.text}
        {token.stat ? <HandUnderline progress={underline} /> : null}
      </motion.span>{" "}
    </>
  );
};
