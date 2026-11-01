import type { GuideCard, Paginated, Place, TourCard } from "@seoul/shared";
import { api } from "@/lib/api";
import { enterLocale } from "@/lib/locale";
import { Hero } from "@/components/marketing/Hero";
import { ScrollStory } from "@/components/marketing/ScrollStory";
import { Playground } from "@/components/marketing/Playground";
import { DayNightSlider } from "@/components/marketing/DayNightSlider";
import { FirstTimeGrid } from "@/components/marketing/FirstTimeGrid";
import { WeatherSection } from "@/components/weather/WeatherSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { ReadyMadeDays } from "@/components/marketing/ReadyMadeDays";
import { TrustBar } from "@/components/marketing/TrustBar";
import { TopGuides } from "@/components/marketing/TopGuides";
import { UpcomingTours } from "@/components/marketing/UpcomingTours";
import { ExploreGrid } from "@/components/marketing/ExploreGrid";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Faq } from "@/components/marketing/Faq";
import { FinalCta } from "@/components/marketing/FinalCta";

type PageProps = { params: Promise<{ locale: string }> };

// Five minutes is fresh enough for "who's on top" and keeps the home page fast.
const REVALIDATE = 300;
const EMPTY: Paginated<never> = { items: [], total: 0, page: 1, pageSize: 0 };

export default async function HomePage({ params }: PageProps) {
  await enterLocale(params);

  // The landing page should still render when the API is asleep, just without the live sections.
  const [topGuides, tours, guides, places] = await Promise.all([
    api<GuideCard[]>("/guides/top", {
      withAuth: false,
      revalidate: REVALIDATE,
    }).catch(() => []),
    api<Paginated<TourCard>>("/tours", {
      withAuth: false,
      revalidate: REVALIDATE,
      query: { pageSize: 8 },
    }).catch(() => EMPTY),
    api<Paginated<GuideCard>>("/guides", {
      withAuth: false,
      revalidate: REVALIDATE,
      query: { pageSize: 50 },
    }).catch(() => EMPTY),
    api<Paginated<Place>>("/places", {
      withAuth: false,
      revalidate: REVALIDATE,
      query: { pageSize: 1 },
    }).catch(() => EMPTY),
  ]);

  const languages = new Set(guides.items.flatMap((guide) => guide.languages));

  return (
    <>
      <Hero
        stats={{
          guides: guides.total,
          places: places.total,
          languages: languages.size,
        }}
      />
      <TrustBar languages={languages.size} />
      <UpcomingTours tours={tours.items} />
      <TopGuides guides={topGuides} />
      <ReadyMadeDays />
      <HowItWorks />
      <ExploreGrid />
      <ScrollStory />
      <FirstTimeGrid />
      <WeatherSection />
      <Playground />
      <DayNightSlider />
      <Testimonials />
      <Faq languages={languages.size} />
      <FinalCta />
    </>
  );
}
