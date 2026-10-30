import { ArrowRight, Map } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { MagneticButton } from "./MagneticButton";

export const FinalCta = () => {
  const t = useTranslations("Landing");
  return (
    <Reveal className="py-10">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-banner px-6 py-16 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="absolute -top-20 -left-10 -z-10 size-80 rounded-full bg-primary/50 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -right-10 -bottom-24 -z-10 size-80 rounded-full bg-kr-red/40 blur-3xl"
          />
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl md:text-5xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/75 sm:text-base">
            {t("ctaBody")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton>
              <Link
                href="/guides"
                className={cn(buttonVariants({ size: "lg" }), "group px-8")}
              >
                {t("ctaPrimary")}
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </MagneticButton>
            <Link
              href="/map"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "px-8 text-white hover:bg-white/15",
              )}
            >
              <Map />
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>
      </Container>
    </Reveal>
  );
};
