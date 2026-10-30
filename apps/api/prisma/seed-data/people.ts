export type GuideSeed = {
  email: string;
  name: string;
  country: string;
  bio: string;
  headline: string;
  languages: string[];
  specialties: string[];
  soloPrice: number;
  soloDurationMin: number;
  isVerified: boolean;
};

export type TravellerSeed = {
  email: string;
  name: string;
  country: string;
  bio: string;
};

export const guides: GuideSeed[] = [
  {
    email: "minji.kim@seoulguide.dev",
    name: "Kim Minji",
    country: "South Korea",
    bio: "Former museum docent who grew up in Bukchon. I love explaining how five centuries of Joseon history still shape daily life in Seoul.",
    headline: "Palace and hanok storyteller with 8 years of docent experience",
    languages: ["Korean", "English"],
    specialties: ["Palaces & history", "Hanok & tea"],
    soloPrice: 90_000,
    soloDurationMin: 240,
    isVerified: true,
  },
  {
    email: "jisoo.park@seoulguide.dev",
    name: "Park Jisoo",
    country: "South Korea",
    bio: "Street-food obsessive and ex-line cook. I will teach you how to order, what to dip and when the best bindaetteok comes off the pan.",
    headline: "Market crawls and late-night eats like a local",
    languages: ["English", "Korean"],
    specialties: ["Street food", "Nightlife"],
    soloPrice: 60_000,
    soloDurationMin: 180,
    isVerified: true,
  },
  {
    email: "yuki.tanaka@seoulguide.dev",
    name: "Yuki Tanaka",
    country: "Japan",
    bio: "Moved from Osaka to Seoul for K-drama and never left. I know every filming spot and the cafes where idols hang out.",
    headline: "K-pop and K-drama locations in Japanese, Korean and English",
    languages: ["Japanese", "Korean", "English"],
    specialties: ["K-pop & K-drama", "Photography"],
    soloPrice: 110_000,
    soloDurationMin: 240,
    isVerified: true,
  },
  {
    email: "li.wei@seoulguide.dev",
    name: "Li Wei",
    country: "China",
    bio: "Photographer and tea lover based in Seoul for six years. I take small groups to the quiet corners most visitors miss.",
    headline: "Photo walks and tea houses in quiet corners of Seoul",
    languages: ["Chinese", "English", "Korean"],
    specialties: ["Photography", "Hanok & tea"],
    soloPrice: 80_000,
    soloDurationMin: 240,
    isVerified: false,
  },
  {
    email: "carlos.ortega@seoulguide.dev",
    name: "Carlos Ortega",
    country: "Spain",
    bio: "Weekend hiker and craft-beer fan. Seoul is ringed by mountains, and the best views are free if you know the trail.",
    headline:
      "City wall hikes, sunsets and rooftop nights in Spanish or English",
    languages: ["Spanish", "English"],
    specialties: ["Hiking", "Nightlife"],
    soloPrice: 120_000,
    soloDurationMin: 300,
    isVerified: true,
  },
  {
    email: "camille.laurent@seoulguide.dev",
    name: "Camille Laurent",
    country: "France",
    bio: "Art historian who fell for Seoul's gallery scene and tea ceremonies. I tailor private days around your interests.",
    headline: "Private art, tea and architecture days in French or English",
    languages: ["French", "English"],
    specialties: ["Hanok & tea", "Photography", "Palaces & history"],
    soloPrice: 160_000,
    soloDurationMin: 360,
    isVerified: false,
  },
];

export const travellers: TravellerSeed[] = [
  {
    email: "emma.wilson@example.com",
    name: "Emma Wilson",
    country: "United Kingdom",
    bio: "History teacher on a two-week Korea trip.",
  },
  {
    email: "liam.carter@example.com",
    name: "Liam Carter",
    country: "United States",
    bio: "Software engineer who watches too many K-dramas.",
  },
  {
    email: "sofia.garcia@example.com",
    name: "Sofia Garcia",
    country: "Mexico",
    bio: "Foodie travelling solo across Asia.",
  },
  {
    email: "hiroshi.sato@example.com",
    name: "Hiroshi Sato",
    country: "Japan",
    bio: "Photographer visiting for the autumn colours.",
  },
  {
    email: "chen.yu@example.com",
    name: "Chen Yu",
    country: "Taiwan",
    bio: "Coffee lover who plans trips around cafes.",
  },
  {
    email: "anna.schmidt@example.com",
    name: "Anna Schmidt",
    country: "Germany",
    bio: "Architect fascinated by modern Seoul.",
  },
  {
    email: "priya.nair@example.com",
    name: "Priya Nair",
    country: "India",
    bio: "First time in Korea, travelling with friends.",
  },
  {
    email: "lucas.silva@example.com",
    name: "Lucas Silva",
    country: "Brazil",
    bio: "Hiker and street photographer.",
  },
];
