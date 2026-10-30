"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { CITY_PHOTOS, type CityPhotoKey } from "@/lib/city-photos";
import { cn } from "@/lib/cn";

type Letter = {
  photos: [CityPhotoKey, CityPhotoKey];
  /** Letter outline from public/letters (Poppins Bold), used as a CSS mask. Full class strings so Tailwind sees them. */
  mask: string;
  /**
   * Advance width / height of that SVG, plus that advance as a share of the whole word (3124 units),
   * so the word scales with its container and the font's own side bearings do the spacing.
   */
  aspect: string;
  swapDelay: string;
  driftDelay: string;
};

// A day scene and an evening scene per letter, so the word drifts from day into night.
// Delays are negative so each letter starts mid-cycle and they never all swap together.
const LETTERS: Letter[] = [
  {
    photos: ["gyeongbokgung", "changdeokgung"],
    mask: "mask-[url(/letters/letter-s.svg)]",
    aspect: "aspect-[615/719] w-[19.68%]",
    swapDelay: "[animation-delay:0s]",
    driftDelay: "[animation-delay:0s]",
  },
  {
    photos: ["namsanSunset", "skylineNight"],
    mask: "mask-[url(/letters/letter-e.svg)]",
    aspect: "aspect-[541/719] w-[17.32%]",
    swapDelay: "[animation-delay:-2.4s]",
    driftDelay: "[animation-delay:-5s]",
  },
  {
    photos: ["bukchon", "insadong"],
    mask: "mask-[url(/letters/letter-o.svg)]",
    aspect: "aspect-[786/719] w-[25.16%]",
    swapDelay: "[animation-delay:-4.8s]",
    driftDelay: "[animation-delay:-10s]",
  },
  {
    photos: ["gwangjang", "myeongdongNight"],
    mask: "mask-[url(/letters/letter-u.svg)]",
    aspect: "aspect-[705/719] w-[22.57%]",
    swapDelay: "[animation-delay:-7.2s]",
    driftDelay: "[animation-delay:-3s]",
  },
  {
    photos: ["cheonggyecheon", "ddpNight"],
    mask: "mask-[url(/letters/letter-l.svg)]",
    aspect: "aspect-[477/719] w-[15.27%]",
    swapDelay: "[animation-delay:-9.6s]",
    driftDelay: "[animation-delay:-8s]",
  },
];

const PHOTO_SIZES = "(min-width: 1152px) 290px, 25vw";

/**
 * "SEOUL" with city photos inside the letters, ported from Aether's footer VideoTextAnimated:
 * each letter is a masked box, the letters rise in with a stagger every time the footer scrolls
 * into view, and photos (instead of videos) drift and crossfade, paused while off screen.
 */
export const CityWordmark = ({ className }: { className?: string }) => {
  const [inView, setInView] = useState(false);
  // Photos load the first time the footer comes near and then stay, like Aether mounting <source> on view.
  const [seen, setSeen] = useState(false);

  return (
    <div
      role="img"
      aria-label="Seoul"
      className={cn("flex w-full justify-center overflow-hidden", className)}
    >
      <motion.div
        className={cn(
          "group flex w-full max-w-6xl items-end",
          !inView && "is-paused",
        )}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        onViewportEnter={() => {
          setSeen(true);
          setInView(true);
        }}
        onViewportLeave={() => setInView(false)}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
      >
        {LETTERS.map((letter, i) => (
          <motion.span
            key={i}
            className={cn(
              "relative block overflow-hidden bg-white/10 mask-contain mask-center mask-no-repeat",
              letter.aspect,
              letter.mask,
            )}
            variants={{
              hidden: { opacity: 0, y: 80 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 1.4, ease: [0.25, 0.8, 0.25, 1] },
              },
            }}
          >
            {seen ? (
              <>
                <LetterPhoto
                  photo={letter.photos[0]}
                  driftDelay={letter.driftDelay}
                />
                <LetterPhoto
                  photo={letter.photos[1]}

                  driftDelay={letter.driftDelay}
                  className={cn(
                    "opacity-0 motion-safe:animate-photo-swap",
                    letter.swapDelay,
                  )}
                />
              </>
            ) : null}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

type LetterPhotoProps = {
  photo: CityPhotoKey;
  driftDelay: string;
  className?: string;
};

// Decorative: the wordmark is labelled "Seoul" as a whole, and every photo is credited on /credits.
const LetterPhoto = ({ photo, driftDelay, className }: LetterPhotoProps) => {
  const { src } = CITY_PHOTOS[photo];
  return (
    <span
      className={cn(
        "absolute inset-0 group-[.is-paused]:[animation-play-state:paused] group-[.is-paused]:*:[animation-play-state:paused]",
        className,
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes={PHOTO_SIZES}
        className={cn("object-cover motion-safe:animate-kenburns", driftDelay)}
      />
    </span>
  );
};
