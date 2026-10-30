import {
  BadgePercent,
  Landmark,
  Moon,
  Mountain,
  Palette,
  ScrollText,
  ShoppingBag,
  Sparkles,
  Store,
  Trees,
} from "lucide-react";

// Keys of Places.tags in the message files, in the order the chips appear.
export const PLACE_TAGS = [
  { id: "palace", icon: Landmark },
  { id: "history", icon: ScrollText },
  { id: "view", icon: Mountain },
  { id: "night", icon: Moon },
  { id: "nature", icon: Trees },
  { id: "k-culture", icon: Sparkles },
  { id: "shopping", icon: ShoppingBag },
  { id: "market", icon: Store },
  { id: "art", icon: Palette },
  { id: "free", icon: BadgePercent },
] as const;

export type PlaceTag = (typeof PLACE_TAGS)[number]["id"];

export const isPlaceTag = (value: string | undefined): value is PlaceTag =>
  PLACE_TAGS.some((tag) => tag.id === value);
