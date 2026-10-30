export type DishSeed = {
  slug: string;
  nameEn: string;
  nameKo: string;
  descriptionEn: string;
  descriptionKo: string;
  spiceLevel: number;
  priceFrom: number;
  restaurantSlugs: string[];
};

export const dishes: DishSeed[] = [
  {
    slug: "bibimbap",
    nameEn: "Bibimbap",
    nameKo: "비빔밥",
    descriptionEn:
      "Rice topped with seasoned vegetables, egg and gochujang that you mix together before eating.",
    descriptionKo:
      "나물, 계란, 고추장을 얹은 밥을 쓱쓱 비벼 먹는 한국의 대표 한 그릇 요리입니다.",
    spiceLevel: 1,
    priceFrom: 9000,
    restaurantSlugs: [
      "gwangjang-market-food-stalls",
      "tongin-market-dosirak-cafe",
    ],
  },
  {
    slug: "bulgogi",
    nameEn: "Bulgogi",
    nameKo: "불고기",
    descriptionEn:
      "Thin slices of soy-and-pear marinated beef, grilled until sweet and smoky.",
    descriptionKo:
      "간장과 배즙으로 재운 얇은 소고기를 달콤하고 불향 가득하게 구운 요리입니다.",
    spiceLevel: 0,
    priceFrom: 15000,
    restaurantSlugs: ["yukjeon-hoekwan", "mapo-jeong-daepo"],
  },
  {
    slug: "samgyeopsal",
    nameEn: "Samgyeopsal",
    nameKo: "삼겹살",
    descriptionEn:
      "Grilled pork belly wrapped in lettuce with garlic, ssamjang and kimchi.",
    descriptionKo:
      "구운 삼겹살을 상추에 마늘, 쌈장, 김치와 함께 싸 먹는 한국식 바비큐입니다.",
    spiceLevel: 0,
    priceFrom: 16000,
    restaurantSlugs: ["hongdae-bbq-dakgalbi-street", "mapo-jeong-daepo"],
  },
  {
    slug: "kimchi-jjigae",
    nameEn: "Kimchi Jjigae",
    nameKo: "김치찌개",
    descriptionEn:
      "A bubbling stew of aged kimchi, pork and tofu, the ultimate Korean comfort food.",
    descriptionKo:
      "잘 익은 김치와 돼지고기, 두부를 넣고 끓인 얼큰한 찌개로 한국인의 소울푸드입니다.",
    spiceLevel: 2,
    priceFrom: 9000,
    restaurantSlugs: ["bukchang-dong-sundubu", "tongin-market-dosirak-cafe"],
  },
  {
    slug: "tteokbokki",
    nameEn: "Tteokbokki",
    nameKo: "떡볶이",
    descriptionEn:
      "Chewy rice cakes in a sweet, spicy gochujang sauce, often with fish cake and a boiled egg.",
    descriptionKo:
      "쫄깃한 가래떡을 달콤매콤한 고추장 양념에 어묵, 삶은 계란과 함께 조린 길거리 간식입니다.",
    spiceLevel: 2,
    priceFrom: 5000,
    restaurantSlugs: [
      "sindang-tteokbokki-town",
      "gwangjang-market-food-stalls",
      "tongin-market-dosirak-cafe",
    ],
  },
  {
    slug: "samgyetang",
    nameEn: "Samgyetang",
    nameKo: "삼계탕",
    descriptionEn:
      "A whole young chicken stuffed with sticky rice and ginseng, simmered in a milky broth.",
    descriptionKo:
      "찹쌀과 인삼을 채운 영계를 뽀얀 국물에 푹 끓여 낸 대표 보양식입니다.",
    spiceLevel: 0,
    priceFrom: 18000,
    restaurantSlugs: ["tosokchon-samgyetang"],
  },
  {
    slug: "naengmyeon",
    nameEn: "Naengmyeon",
    nameKo: "냉면",
    descriptionEn:
      "Chewy buckwheat noodles in an icy beef broth (mul-naengmyeon) or tossed in spicy sauce (bibim-naengmyeon).",
    descriptionKo:
      "얼음 동동 육수에 말아 먹는 물냉면과 매콤하게 비벼 먹는 비빔냉면, 쫄깃한 메밀 면이 매력입니다.",
    spiceLevel: 1,
    priceFrom: 13000,
    restaurantSlugs: ["eulji-myeonok", "pildong-myeonok"],
  },
  {
    slug: "japchae",
    nameEn: "Japchae",
    nameKo: "잡채",
    descriptionEn:
      "Glass noodles stir-fried with vegetables and beef in a glossy soy-sesame sauce.",
    descriptionKo:
      "당면에 채소와 소고기를 넣고 간장과 참기름으로 볶은 윤기 나는 잔치 음식입니다.",
    spiceLevel: 0,
    priceFrom: 8000,
    restaurantSlugs: [
      "gwangjang-market-food-stalls",
      "tongin-market-dosirak-cafe",
    ],
  },
  {
    slug: "kimbap",
    nameEn: "Kimbap",
    nameKo: "김밥",
    descriptionEn:
      "Seaweed rice rolls filled with vegetables, egg and ham. Gwangjang's mayak (addictive) kimbap is the famous version.",
    descriptionKo:
      "채소, 계란, 햄을 넣고 돌돌 만 김밥입니다. 광장시장의 마약김밥이 특히 유명해요.",
    spiceLevel: 0,
    priceFrom: 3500,
    restaurantSlugs: ["gwangjang-market-food-stalls"],
  },
  {
    slug: "sundubu-jjigae",
    nameEn: "Sundubu Jjigae",
    nameKo: "순두부찌개",
    descriptionEn:
      "Silky uncurdled tofu in a fiery seafood or pork broth, served bubbling with a raw egg.",
    descriptionKo:
      "부드러운 순두부를 해물이나 돼지고기 육수에 얼큰하게 끓여 날계란과 함께 내는 찌개입니다.",
    spiceLevel: 2,
    priceFrom: 9000,
    restaurantSlugs: ["bukchang-dong-sundubu"],
  },
  {
    slug: "dakgalbi",
    nameEn: "Dakgalbi",
    nameKo: "닭갈비",
    descriptionEn:
      "Spicy stir-fried chicken with cabbage, sweet potato and rice cakes, finished with fried rice.",
    descriptionKo:
      "양배추, 고구마, 떡과 함께 매콤하게 볶아 마지막에 볶음밥으로 마무리하는 닭요리입니다.",
    spiceLevel: 2,
    priceFrom: 14000,
    restaurantSlugs: ["hongdae-bbq-dakgalbi-street"],
  },
  {
    slug: "korean-fried-chicken",
    nameEn: "Korean Fried Chicken",
    nameKo: "양념치킨 / 후라이드",
    descriptionEn:
      "Double-fried for extra crunch, tossed in sweet-spicy yangnyeom or served plain. Best with cold beer: chimaek.",
    descriptionKo:
      "두 번 튀겨 더욱 바삭한 치킨을 달콤매콤한 양념이나 후라이드로 즐기세요. 시원한 맥주와 함께하는 치맥이 정석입니다.",
    spiceLevel: 1,
    priceFrom: 20000,
    restaurantSlugs: [
      "gangnam-chicken-alley",
      "jinokhwa-halmae-wonjo-dakhanmari",
    ],
  },
  {
    slug: "bindaetteok",
    nameEn: "Bindaetteok",
    nameKo: "빈대떡",
    descriptionEn:
      "A crispy mung-bean pancake fried in plenty of oil, best eaten hot at Gwangjang Market with makgeolli.",
    descriptionKo:
      "녹두를 갈아 기름에 바삭하게 부친 전으로 광장시장에서 막걸리와 함께 먹는 것이 제맛입니다.",
    spiceLevel: 0,
    priceFrom: 8000,
    restaurantSlugs: ["gwangjang-market-food-stalls", "yukjeon-hoekwan"],
  },
  {
    slug: "hotteok",
    nameEn: "Hotteok",
    nameKo: "호떡",
    descriptionEn:
      "A griddled sweet pancake stuffed with brown sugar, cinnamon and nuts. A winter street-food favourite.",
    descriptionKo:
      "흑설탕, 계피, 견과류를 넣고 구운 달콤한 호떡으로 겨울 길거리 간식의 대표 주자입니다.",
    spiceLevel: 0,
    priceFrom: 2000,
    restaurantSlugs: [
      "gwangjang-market-food-stalls",
      "ikseon-dong-hanok-cafe-street",
    ],
  },
  {
    slug: "jjajangmyeon",
    nameEn: "Jjajangmyeon",
    nameKo: "짜장면",
    descriptionEn:
      "Wheat noodles in a thick, savoury black bean sauce, the Korean-Chinese dish for moving days and rainy nights.",
    descriptionKo:
      "춘장 소스를 듬뿍 얹은 면 요리로 이삿날이나 비 오는 날 생각나는 한국식 중화요리입니다.",
    spiceLevel: 0,
    priceFrom: 7000,
    restaurantSlugs: ["hong-kong-banjeom-hongdae"],
  },
];
