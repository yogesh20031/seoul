import { BedDouble, Landmark, TrainFront, UtensilsCrossed } from "lucide-react";

export const EXPLORE_ITEMS = [
  {
    href: "/explore/places",
    label: "places",
    hint: "placesHint",
    icon: Landmark,
  },
  {
    href: "/explore/food",
    label: "food",
    hint: "foodHint",
    icon: UtensilsCrossed,
  },
  {
    href: "/explore/hotels",
    label: "hotels",
    hint: "hotelsHint",
    icon: BedDouble,
  },
  {
    href: "/explore/transport",
    label: "transport",
    hint: "transportHint",
    icon: TrainFront,
  },
] as const;

export const MAIN_ITEMS = [
  { href: "/guides", label: "guides" },
  { href: "/tours", label: "tours" },
  { href: "/planner", label: "planner" },
  { href: "/map", label: "map" },
] as const;
