export type TourSeed = {
  guide: number;
  title: string;
  description: string;
  dayOffset: number;
  time: string;
  durationMin: number;
  capacity: number;
  pricePerPerson: number;
  meetingName: string;
  meetingLat: number;
  meetingLng: number;
  stops: string[];
  bookings: {
    traveller: number;
    seats: number;
    rating?: number;
    comment?: string;
  }[];
};

export const upcomingTours: TourSeed[] = [
  {
    guide: 0,
    title: "Royal Palaces & Bukchon Hanok Walk",
    description:
      "Walk through Gyeongbokgung with a former docent, wander the hanok lanes of Bukchon and finish with traditional sweets in Insadong.",
    dayOffset: 3,
    time: "10:00",
    durationMin: 240,
    capacity: 8,
    pricePerPerson: 45_000,
    meetingName: "Gyeongbokgung Station Exit 5",
    meetingLat: 37.5759,
    meetingLng: 126.9735,
    stops: ["gyeongbokgung-palace", "bukchon-hanok-village", "insadong"],
    bookings: [
      { traveller: 0, seats: 2 },
      { traveller: 1, seats: 1 },
      { traveller: 5, seats: 1 },
    ],
  },
  {
    guide: 1,
    title: "Gwangjang Market Street Food Crawl",
    description:
      "Eat your way through Gwangjang Market: bindaetteok, mayak gimbap, tteokbokki and yukhoe with a local who knows the best stalls.",
    dayOffset: 5,
    time: "18:00",
    durationMin: 180,
    capacity: 6,
    pricePerPerson: 55_000,
    meetingName: "Gwangjang Market Gate 1",
    meetingLat: 37.5704,
    meetingLng: 126.9996,
    stops: ["gwangjang-market", "cheonggyecheon-stream"],
    bookings: [
      { traveller: 6, seats: 2 },
      { traveller: 7, seats: 2 },
      { traveller: 3, seats: 2 },
    ],
  },
  {
    guide: 4,
    title: "Namsan Night Views & Myeongdong Snacks",
    description:
      "Ride up Namsan at dusk for the city lights, then walk down into Myeongdong for late-night street snacks.",
    dayOffset: 7,
    time: "19:00",
    durationMin: 150,
    capacity: 10,
    pricePerPerson: 38_000,
    meetingName: "Myeongdong Station Exit 3",
    meetingLat: 37.5609,
    meetingLng: 126.9863,
    stops: ["n-seoul-tower", "myeongdong-shopping-street"],
    bookings: [{ traveller: 2, seats: 2 }],
  },
  {
    guide: 2,
    title: "K-Drama Locations in Bukchon & Ikseon-dong",
    description:
      "Visit the lanes and cafes featured in famous K-dramas, with behind-the-scenes stories and plenty of photo stops.",
    dayOffset: 9,
    time: "13:00",
    durationMin: 210,
    capacity: 8,
    pricePerPerson: 60_000,
    meetingName: "Anguk Station Exit 2",
    meetingLat: 37.5766,
    meetingLng: 126.9854,
    stops: ["ikseon-dong-hanok-street", "bukchon-hanok-village", "insadong"],
    bookings: [{ traveller: 3, seats: 1 }],
  },
  {
    guide: 3,
    title: "Seongsu Cafes & Seoul Forest Photo Walk",
    description:
      "Explore Seongsu's converted factories and roasteries, then take portraits in the meadows of Seoul Forest.",
    dayOffset: 12,
    time: "14:00",
    durationMin: 180,
    capacity: 8,
    pricePerPerson: 42_000,
    meetingName: "Seongsu Station Exit 3",
    meetingLat: 37.5446,
    meetingLng: 127.0559,
    stops: ["seongsu-dong", "seoul-forest"],
    bookings: [],
  },
  {
    guide: 1,
    title: "Hongdae & Yeonnam-dong Indie Culture Walk",
    description:
      "Street performers, vintage shops and brunch spots along the Gyeongui Line Forest Park, ending with dinner in Hongdae.",
    dayOffset: 14,
    time: "15:00",
    durationMin: 180,
    capacity: 10,
    pricePerPerson: 40_000,
    meetingName: "Hongik Univ. Station Exit 9",
    meetingLat: 37.5575,
    meetingLng: 126.9245,
    stops: ["gyeongui-line-forest-park", "hongdae-street"],
    bookings: [{ traveller: 4, seats: 2 }],
  },
  {
    guide: 4,
    title: "Naksan Sunset Hike & Ihwa Murals",
    description:
      "A relaxed hike along the Seoul City Wall at golden hour, with a detour through the Ihwa mural lanes.",
    dayOffset: 17,
    time: "16:30",
    durationMin: 180,
    capacity: 8,
    pricePerPerson: 35_000,
    meetingName: "Hyehwa Station Exit 2",
    meetingLat: 37.5822,
    meetingLng: 127.0018,
    stops: ["ihwa-mural-village", "naksan-park-seoul-city-wall"],
    bookings: [
      { traveller: 7, seats: 1 },
      { traveller: 2, seats: 1 },
    ],
  },
  {
    guide: 5,
    title: "Han River Picnic & Yeouido Evening",
    description:
      "Pick up picnic food, relax by the Han River and explore The Hyundai Seoul as the sun goes down.",
    dayOffset: 21,
    time: "17:00",
    durationMin: 180,
    capacity: 12,
    pricePerPerson: 48_000,
    meetingName: "Yeouinaru Station Exit 2",
    meetingLat: 37.5271,
    meetingLng: 126.9327,
    stops: ["yeouido-hangang-park", "the-hyundai-seoul"],
    bookings: [{ traveller: 5, seats: 2 }],
  },
  {
    guide: 0,
    title: "Hanok Tea Ceremony in Bukchon",
    description:
      "A quiet morning learning to brew and serve Korean tea in a hanok, followed by a stroll through Bukchon's back lanes.",
    dayOffset: 25,
    time: "11:00",
    durationMin: 150,
    capacity: 6,
    pricePerPerson: 65_000,
    meetingName: "Anguk Station Exit 1",
    meetingLat: 37.5764,
    meetingLng: 126.9855,
    stops: ["bukchon-hanok-village", "changdeokgung-palace-secret-garden"],
    bookings: [],
  },
  {
    guide: 5,
    title: "Itaewon & War Memorial History Day",
    description:
      "A morning at the War Memorial and National Museum of Korea, then lunch and a wander around Itaewon.",
    dayOffset: 29,
    time: "10:00",
    durationMin: 240,
    capacity: 10,
    pricePerPerson: 50_000,
    meetingName: "Samgakji Station Exit 12",
    meetingLat: 37.5348,
    meetingLng: 126.9733,
    stops: ["war-memorial-of-korea", "national-museum-of-korea", "itaewon"],
    bookings: [{ traveller: 6, seats: 1 }],
  },
];

export const pastTours: TourSeed[] = [
  {
    guide: 0,
    title: "Gyeongbokgung Morning & Tosokchon Lunch",
    description:
      "An early palace visit before the crowds, followed by a hearty samgyetang lunch nearby.",
    dayOffset: -40,
    time: "09:30",
    durationMin: 210,
    capacity: 8,
    pricePerPerson: 42_000,
    meetingName: "Gyeongbokgung Station Exit 5",
    meetingLat: 37.5759,
    meetingLng: 126.9735,
    stops: ["gyeongbokgung-palace", "bukchon-hanok-village"],
    bookings: [
      {
        traveller: 0,
        seats: 2,
        rating: 5,
        comment: "Minji brought the palace to life. Best part of our trip.",
      },
      {
        traveller: 1,
        seats: 1,
        rating: 5,
        comment: "Great stories and perfect pacing.",
      },
      {
        traveller: 5,
        seats: 1,
        rating: 4,
        comment: "Very informative, a little rushed at the end.",
      },
    ],
  },
  {
    guide: 1,
    title: "Midnight Market Food Tour",
    description:
      "A late-evening crawl through Gwangjang Market and the alleys around Jongno.",
    dayOffset: -33,
    time: "18:30",
    durationMin: 180,
    capacity: 6,
    pricePerPerson: 52_000,
    meetingName: "Gwangjang Market Gate 1",
    meetingLat: 37.5704,
    meetingLng: 126.9996,
    stops: ["gwangjang-market", "cheonggyecheon-stream"],
    bookings: [
      {
        traveller: 6,
        seats: 1,
        rating: 5,
        comment: "Jisoo knows every stall. I ate more than I ever have.",
      },
      {
        traveller: 7,
        seats: 2,
        rating: 4,
        comment: "Delicious, though the market was very crowded.",
      },
      { traveller: 3, seats: 1, rating: 5, comment: "Authentic and fun." },
    ],
  },
  {
    guide: 2,
    title: "K-Drama Seoul Photo Day",
    description:
      "Photograph the most iconic drama spots across Bukchon and Ikseon-dong.",
    dayOffset: -26,
    time: "13:00",
    durationMin: 210,
    capacity: 8,
    pricePerPerson: 58_000,
    meetingName: "Anguk Station Exit 2",
    meetingLat: 37.5766,
    meetingLng: 126.9854,
    stops: ["ikseon-dong-hanok-street", "bukchon-hanok-village", "insadong"],
    bookings: [
      {
        traveller: 4,
        seats: 1,
        rating: 5,
        comment: "Yuki knew exactly where to stand for every shot.",
      },
      {
        traveller: 2,
        seats: 1,
        rating: 3,
        comment: "Fun, but I expected more drama trivia and less walking.",
      },
    ],
  },
  {
    guide: 4,
    title: "Namsan Sunset & City Lights",
    description: "Golden hour on Namsan followed by Seoul glittering below.",
    dayOffset: -19,
    time: "18:00",
    durationMin: 150,
    capacity: 10,
    pricePerPerson: 36_000,
    meetingName: "Myeongdong Station Exit 3",
    meetingLat: 37.5609,
    meetingLng: 126.9863,
    stops: ["n-seoul-tower", "myeongdong-shopping-street"],
    bookings: [
      {
        traveller: 1,
        seats: 2,
        rating: 5,
        comment: "Carlos picked the perfect time. Incredible views.",
      },
      {
        traveller: 0,
        seats: 1,
        rating: 4,
        comment: "Lovely evening, I would bring a jacket.",
      },
      {
        traveller: 7,
        seats: 1,
        rating: 5,
        comment: "Fun group and great photos.",
      },
    ],
  },
  {
    guide: 3,
    title: "Seongsu Roasteries Walk",
    description:
      "Tasting flights and quiet courtyards in Seongsu's best roasteries.",
    dayOffset: -12,
    time: "14:00",
    durationMin: 180,
    capacity: 8,
    pricePerPerson: 40_000,
    meetingName: "Seongsu Station Exit 3",
    meetingLat: 37.5446,
    meetingLng: 127.0559,
    stops: ["seongsu-dong", "seoul-forest"],
    bookings: [
      {
        traveller: 5,
        seats: 1,
        rating: 4,
        comment: "Great cafe picks and helpful tips.",
      },
      {
        traveller: 3,
        seats: 1,
        rating: 5,
        comment: "Li Wei has a great eye for hidden spots.",
      },
    ],
  },
  {
    guide: 0,
    title: "Deoksugung at Dusk & Jogyesa",
    description:
      "An evening tour of Deoksugung's lit-up halls and a quiet visit to Jogyesa temple.",
    dayOffset: -6,
    time: "17:00",
    durationMin: 150,
    capacity: 8,
    pricePerPerson: 40_000,
    meetingName: "City Hall Station Exit 2",
    meetingLat: 37.5658,
    meetingLng: 126.9772,
    stops: ["deoksugung-palace", "jogyesa-temple"],
    bookings: [
      {
        traveller: 2,
        seats: 1,
        rating: 5,
        comment: "Magical in the evening light.",
      },
      {
        traveller: 6,
        seats: 2,
        rating: 4,
        comment: "Lovely and calm. More seating would help.",
      },
    ],
  },
];
