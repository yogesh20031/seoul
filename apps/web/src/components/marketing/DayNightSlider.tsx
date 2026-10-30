"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import Image from "next/image";
import { ChevronsLeftRight, Moon, Sun } from "lucide-react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CITY_PHOTOS } from "@/lib/city-photos";
import { EASE_OUT_EXPO } from "./motion";

const DAY = CITY_PHOTOS.banpoDusk;
const NIGHT = CITY_PHOTOS.banpoNight;
const START = 50;

/** Drag across Banpo Bridge from dusk to night, after the compare slider on Aether's Sis page. */
export const DayNightSlider = () => {
  const t = useTranslations("Playground");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const dragging = useRef(false);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const x = useMotionValue(START);
  const clip = useTransform(x, (v) => `inset(0 0 0 ${v}%)`);
  const left = useTransform(x, (v) => `${v}%`);

  // Keeps the keyboard slider in step when the handle is dragged with a pointer.
  useMotionValueEvent(x, "change", (v) => {
    if (rangeRef.current) rangeRef.current.value = String(Math.round(v));
  });

  // A small nudge on first view tells people the image is draggable.
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(x, [START, 30, 70, START], {
      duration: 2.2,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [inView, reduce, x]);

  const setFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(
      Math.min(
        100,
        Math.max(0, ((event.clientX - rect.left) / rect.width) * 100),
      ),
    );
  };

  return (
    <section className="py-16 sm:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeader
          title={t("dayNightTitle")}
          subtitle={t("dayNightSubtitle")}
          align="center"
        />
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="relative aspect-[16/9] cursor-ew-resize touch-pan-y overflow-hidden rounded-[2rem] shadow-2xl select-none sm:aspect-[21/9]"
          onPointerDown={(event) => {
            dragging.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            setFromPointer(event);
          }}
          onPointerMove={(event) => {
            if (dragging.current) setFromPointer(event);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
        >
          <Image
            src={DAY.src}
            alt={DAY.alt[locale]}
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="pointer-events-none object-cover"
          />
          <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
            <Image
              src={NIGHT.src}
              alt={NIGHT.alt[locale]}
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="pointer-events-none object-cover"
            />
          </motion.div>

          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 glassy-full px-3 py-1 text-xs font-medium text-white">
            <Sun className="size-3.5" />
            {t("day")}
          </span>
          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 glassy-full px-3 py-1 text-xs font-medium text-white">
            <Moon className="size-3.5" />
            {t("night")}
          </span>

          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white/90"
            style={{ left }}
          >
            <span className="absolute top-1/2 left-1/2 flex size-11 -translate-1/2 items-center justify-center rounded-full bg-white text-primary shadow-xl">
              <ChevronsLeftRight className="size-5" />
            </span>
          </motion.div>

          <input
            ref={rangeRef}
            type="range"
            min={0}
            max={100}
            defaultValue={START}
            aria-label={t("dragLabel")}
            onChange={(event) => x.set(Number(event.target.value))}
            className="absolute bottom-0 left-0 h-1 w-full opacity-0 focus-visible:opacity-100"
          />
          <span className="absolute right-4 bottom-3 text-2xs text-white/70">
            {DAY.credit} · {NIGHT.credit}
          </span>
        </motion.div>
        <p className="-mt-6 text-center text-xs text-muted-foreground">
          {t("dragHint")}
        </p>
      </Container>
    </section>
  );
};
