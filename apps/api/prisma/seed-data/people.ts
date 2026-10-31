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
  // Added after launch; seed-guides.ts inserts these into an existing database without a wipe.
  // Keep appending here: tour seeds point at guides by array position.
  {
    email: "haneul.choi@seoulguide.dev",
    name: "Choi Haneul",
    country: "South Korea",
    bio: "Born by the Han River and still on it every weekend. I plan easy bike rides, chimaek picnics and the best spots for the rainbow fountain.",
    headline: "Han River bike rides and picnics, easy pace, families welcome",
    languages: ["Korean", "English"],
    specialties: ["Han River & cycling", "Family-friendly"],
    soloPrice: 70_000,
    soloDurationMin: 180,
    isVerified: true,
  },
  {
    email: "seojun.lee@seoulguide.dev",
    name: "Lee Seojun",
    country: "South Korea",
    bio: "Spent a year as a temple-stay volunteer. I explain Buddhist rituals, temple architecture and where to find a quiet hour in the middle of the city.",
    headline:
      "Temples, rituals and quiet corners in Korean, English or Japanese",
    languages: ["Korean", "English", "Japanese"],
    specialties: ["Temples", "Palaces & history"],
    soloPrice: 85_000,
    soloDurationMin: 240,
    isVerified: true,
  },
  {
    email: "mai.nguyen@seoulguide.dev",
    name: "Nguyen Thi Mai",
    country: "Vietnam",
    bio: "Came to Seoul as a student on a tight budget. I know the markets, the cheap eats and how to stretch a day without missing the highlights.",
    headline: "Seoul on a budget: markets, cheap eats and free sights",
    languages: ["Vietnamese", "English", "Korean"],
    specialties: ["Street food", "Shopping & markets"],
    soloPrice: 55_000,
    soloDurationMin: 180,
    isVerified: true,
  },
  {
    email: "daniel.becker@seoulguide.dev",
    name: "Daniel Becker",
    country: "Germany",
    bio: "Architect working in Seoul since 2019. I show how the city went from hanok to Zaha Hadid in one lifetime, building by building.",
    headline: "Architecture and design walks from hanok to skyscrapers",
    languages: ["German", "English"],
    specialties: ["Architecture & design", "Photography"],
    soloPrice: 100_000,
    soloDurationMin: 240,
    isVerified: false,
  },
  {
    email: "yerin.han@seoulguide.dev",
    name: "Han Yerin",
    country: "South Korea",
    bio: "Fashion stylist by day. I take you to the K-beauty shops locals actually use, the Hongdae vintage stores and the cafes worth the queue.",
    headline: "K-beauty, fashion and Hongdae shopping with a stylist",
    languages: ["Korean", "English", "Chinese"],
    specialties: ["Shopping & markets", "K-pop & K-drama"],
    soloPrice: 75_000,
    soloDurationMin: 180,
    isVerified: true,
  },
  {
    email: "omar.haddad@seoulguide.dev",
    name: "Omar Haddad",
    country: "Jordan",
    bio: "Living in Itaewon for seven years. I help Muslim travellers find halal Korean food, prayer spaces and a relaxed way to see the city.",
    headline: "Halal Korean food and Itaewon in Arabic or English",
    languages: ["Arabic", "English", "Korean"],
    specialties: ["Halal food", "Street food"],
    soloPrice: 65_000,
    soloDurationMin: 180,
    isVerified: true,
  },
  {
    email: "sarah.mitchell@seoulguide.dev",
    name: "Sarah Mitchell",
    country: "United States",
    bio: "Modern Korean history graduate. I connect the palaces, the colonial era and the war years so the city's museums finally make sense.",
    headline: "Museums and modern history, from Joseon to the Korean War",
    languages: ["English"],
    specialties: ["Museums", "Palaces & history"],
    soloPrice: 95_000,
    soloDurationMin: 240,
    isVerified: true,
  },
  {
    email: "minho.jung@seoulguide.dev",
    name: "Jung Minho",
    country: "South Korea",
    bio: "Night photographer who knows every viewpoint in the city. Bring a phone or a tripod and leave with the shot you came for.",
    headline: "Night views and photo spots along the city wall and the river",
    languages: ["Korean", "English"],
    specialties: ["Photography", "Hiking"],
    soloPrice: 90_000,
    soloDurationMin: 240,
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
