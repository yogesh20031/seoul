// Real photos from Wikimedia Commons, all under licences that allow reuse with credit (CC0, PD, CC BY, CC BY-SA).
// Chosen by hand from a contact sheet. Where Commons has no photo of the exact business, the photo is an honest
// stand-in (its signature dish or the street it is on), noted per entry.
//
// The files are copied into apps/web/public/photos (resized to fit 1200x900) instead of hotlinked: Wikimedia
// rate-limits bursts from one server, which is exactly what next/image on Vercel would do. `url` is therefore a
// path on the web app, and `source` keeps the Commons page for the attribution trail.

type Photo = { url: string; credit: string; source: string };

export const PHOTOS: Record<string, Photo> = {
  // attractions
  "gyeongbokgung-palace": {
    url: "/photos/gyeongbokgung-palace.jpg",
    credit: "Basile Morin / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Front_view_of_the_Imperial_Throne_Hall_Geunjeongjeon_at_Gyeongbokgung_Palace_with_blue_sky_in_Seoul.jpg",
  },
  "changdeokgung-palace-secret-garden": {
    url: "/photos/changdeokgung-palace-secret-garden.jpg",
    credit: "kallerna / CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Changdeokgung_Seoul_3.jpg",
  },
  "bukchon-hanok-village": {
    url: "/photos/bukchon-hanok-village.jpg",
    credit: "Bgag / CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:Bukchon_Hanok_Village_01.jpg",
  },
  insadong: {
    url: "/photos/insadong.jpg",
    credit: "S h y numis / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Insa-dong_%EC%9D%B8%EC%82%AC%EB%8F%99_October_1_2020_20.jpg",
  },
  "n-seoul-tower": {
    url: "/photos/n-seoul-tower.jpg",
    credit: "Rtflakfizer / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Namsan_Tower_sunset,_Seoul.jpg",
  },
  "myeongdong-shopping-street": {
    url: "/photos/myeongdong-shopping-street.jpg",
    credit: "thelearnr / CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Seoul-Myeongdong-02.jpg",
  },
  "namdaemun-market": {
    url: "/photos/namdaemun-market.jpg",
    credit: "Adbar / CC BY-SA 3.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Namdaemun_Market_Alley.jpg",
  },
  "gwangjang-market": {
    url: "/photos/gwangjang-market.jpg",
    credit: "Bgag / CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:Gwangjang_Market,_Seoul_02.jpg",
  },
  "dongdaemun-design-plaza": {
    url: "/photos/dongdaemun-design-plaza.jpg",
    credit: "Dwxn / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:20240601_144028_Dongdaemun_Design_Plaza,_Seoul_08.jpg",
  },
  "cheonggyecheon-stream": {
    url: "/photos/cheonggyecheon-stream.jpg",
    credit: "Basile Morin / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Cheonggyecheon_stream_with_flowers_and_bridge_at_sunrise_near_Cheonggye_Plaza_in_Seoul.jpg",
  },
  "lotte-world-tower-seoul-sky": {
    url: "/photos/lotte-world-tower-seoul-sky.jpg",
    credit: "kallerna / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Lotte_World_morning_view_8.jpg",
  },
  "starfield-coex-library": {
    url: "/photos/starfield-coex-library.jpg",
    credit: "Sean Young (@assanges) / CC BY 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Starfield_Library_COEX_20240218.jpg",
  },
  "bongeunsa-temple": {
    url: "/photos/bongeunsa-temple.jpg",
    credit: "kallerna / CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Bongeunsa_Seoul_9.jpg",
  },
  "hongdae-street": {
    url: "/photos/hongdae-street.jpg",
    credit: "Sgroey / CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Hongdae_1.jpg",
  },
  "gyeongui-line-forest-park": {
    url: "/photos/gyeongui-line-forest-park.jpg",
    credit: "Brit in Seoul / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Yeontral_Park,_Hongdae.png",
  },
  "ikseon-dong-hanok-street": {
    url: "/photos/ikseon-dong-hanok-street.jpg",
    credit: "S h y numis / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Ikseon-dong_%EC%9D%B5%EC%84%A0%EB%8F%99_October_1_2020_3.jpg",
  },
  "seoul-forest": {
    url: "/photos/seoul-forest.jpg",
    credit: "Rachel.zrq / CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:Flowers_in_Seoul_Forest_Park.jpg",
  },
  "seongsu-dong": {
    url: "/photos/seongsu-dong.jpg",
    credit: "CartoonChess / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Flowery_cafe_in_Seongsu-dong.jpg",
  },
  "ihwa-mural-village": {
    url: "/photos/ihwa-mural-village.jpg",
    credit: "Stephen Kelly / CC BY 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Ihwa_Mural_Village,_Ihwa-dong.jpg",
  },
  "naksan-park-seoul-city-wall": {
    url: "/photos/naksan-park-seoul-city-wall.jpg",
    credit: "Dwxn / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:20240601_144028_Fortress_Wall_of_Seoul_-_Seoul_02.jpg",
  },
  "deoksugung-palace": {
    url: "/photos/deoksugung-palace.jpg",
    credit: "Chamberikore / Public domain",
    source:
      "https://commons.wikimedia.org/wiki/File:Deoksugungpalacefromthebuilding.jpg",
  },
  "jogyesa-temple": {
    url: "/photos/jogyesa-temple.jpg",
    credit: "Francisco Anzola / CC BY 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Jogyesa_Temple_(1509839597).jpg",
  },
  "war-memorial-of-korea": {
    url: "/photos/war-memorial-of-korea.jpg",
    credit: "Adbar / CC BY-SA 3.0",
    source:
      "https://commons.wikimedia.org/wiki/File:War_Memorial_of_Korea_main_building.JPG",
  },
  "national-museum-of-korea": {
    url: "/photos/national-museum-of-korea.jpg",
    credit: "Jinah78 / CC BY-SA 3.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Front_view_of_national_museum_of_korea.jpg",
  },
  itaewon: {
    url: "/photos/itaewon.jpg",
    credit: "kallerna / CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Itaewon_2.jpg",
  },
  "banpo-moonlight-rainbow-fountain": {
    url: "/photos/banpo-moonlight-rainbow-fountain.jpg",
    credit: "Wvdp / CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:Banpo_Bridge_Moonlight_Rainbow_Fountain_at_night_-_2023-08-14.jpg",
  },
  "yeouido-hangang-park": {
    url: "/photos/yeouido-hangang-park.jpg",
    credit: "kallerna / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Yeouido_Hangang_Park_from_Mapo_Bridge_1.jpg",
  },
  "the-hyundai-seoul": {
    url: "/photos/the-hyundai-seoul.jpg",
    credit: "Poeyal / CC BY 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Yeouido_Hyundai_Department_Store_Christmas.jpg",
  },
  "seoullo-7017": {
    url: "/photos/seoullo-7017.jpg",
    credit: "Christian Bolz / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Seoullo_7017_Overview_(5).jpg",
  },
  "haneul-park": {
    url: "/photos/haneul-park.jpg",
    credit: "Ji-soo Seo / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Silver_grass_in_the_Sky_Park.jpg",
  },
  "seodaemun-prison-history-hall": {
    url: "/photos/seodaemun-prison-history-hall.jpg",
    credit: "Noh Mun Duek / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Overview_of_the_Old_Seodaemun_Prison_(%EA%B5%AC%EC%84%9C%EB%8C%80%EB%AC%B8%ED%98%95%EB%AC%B4%EC%86%8C).jpg",
  },
  // restaurants
  "gwangjang-market-food-stalls": {
    url: "/photos/gwangjang-market-food-stalls.jpg",
    credit: "Republic of Korea / CC BY-SA 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Korea_GwangjangMarket_Eats_02_(13885109655).jpg",
  },
  "tosokchon-samgyetang": {
    url: "/photos/tosokchon-samgyetang.jpg",
    credit:
      "Korea.net / Korean Culture and Information Service (Jeon Han) / CC BY-SA 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Malbok_Tosokchon_Samgyetang_03.jpg",
  },
  // Stand-in: kalguksu, the restaurant's signature dish.
  "myeongdong-kyoja": {
    url: "/photos/myeongdong-kyoja.jpg",
    credit: "Mobius6 / CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Kalguksu_20230430_002.jpg",
  },
  // Stand-in: dakhanmari, the signature dish.
  "jinokhwa-halmae-wonjo-dakhanmari": {
    url: "/photos/jinokhwa-halmae-wonjo-dakhanmari.jpg",
    credit: "bryan... / CC BY-SA 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Dak-han-mari_3.jpg",
  },
  // Stand-in: Pyongyang naengmyeon, the signature dish.
  "eulji-myeonok": {
    url: "/photos/eulji-myeonok.jpg",
    credit: "Mobius6 / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Pyongyang_Naengmyeon_20190608_002.jpg",
  },
  // Stand-in: naengmyeon, the signature dish.
  "pildong-myeonok": {
    url: "/photos/pildong-myeonok.jpg",
    credit: "CYAN / CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Naengmyeon_a0.jpg",
  },
  // Stand-in: galbi on a charcoal grill.
  "mapo-jeong-daepo": {
    url: "/photos/mapo-jeong-daepo.jpg",
    credit: "ayustety / CC BY-SA 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Korean.food-Galbi-03.jpg",
  },
  // Stand-in: bulgogi, the signature dish.
  "yukjeon-hoekwan": {
    url: "/photos/yukjeon-hoekwan.jpg",
    credit: "국립국어원 / CC BY-SA 2.0 kr",
    source: "https://commons.wikimedia.org/wiki/File:Bulgogi_2.jpg",
  },
  // Stand-in: Korean royal court cuisine (sinseollo).
  "jungsik-seoul": {
    url: "/photos/jungsik-seoul.jpg",
    credit: "World to Table / CC BY-SA 3.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Korean_royal_court_cuisine-Sinseollo-Casserole-01.jpg",
  },
  // Stand-in: a hanjeongsik course spread.
  "mingles-seoul": {
    url: "/photos/mingles-seoul.jpg",
    credit: "Richy! / CC BY-SA 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Korean_cuisine-Hanjeongsik-05.jpg",
  },
  "ikseon-dong-hanok-cafe-street": {
    url: "/photos/ikseon-dong-hanok-cafe-street.jpg",
    credit: "S h y numis / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Ikseon-dong_%EC%9D%B5%EC%84%A0%EB%8F%99_October_1_2020_5.jpg",
  },
  // Stand-in: dakgalbi being cooked in Seoul.
  "hongdae-bbq-dakgalbi-street": {
    url: "/photos/hongdae-bbq-dakgalbi-street.jpg",
    credit: "Sgroey / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Cooking_Dak-galbi_in_Seoul_Korea.jpg",
  },
  // Stand-in: yangnyeom fried chicken.
  "gangnam-chicken-alley": {
    url: "/photos/gangnam-chicken-alley.jpg",
    credit: "Startandstar / CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:Yangnyeom_Chicken_Korean_fried_chicken.jpg",
  },
  "noryangjin-fish-market": {
    url: "/photos/noryangjin-fish-market.jpg",
    credit: "Gaël Chardon / CC BY-SA 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Korea-Seoul-Noryangjin_Fish_Market-03.jpg",
  },
  "sinsa-garosu-gil-cafes": {
    url: "/photos/sinsa-garosu-gil-cafes.jpg",
    credit: "sellyourseoul / CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Garosu-gil.jpg",
  },
  "tongin-market-dosirak-cafe": {
    url: "/photos/tongin-market-dosirak-cafe.jpg",
    credit: "ChoiSojeong / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Tongin_Market_2018-06-17-18-28-59.jpg",
  },
  "imun-seolnongtang": {
    url: "/photos/imun-seolnongtang.jpg",
    credit: "Seefooddiet / CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Imun_Seolnongtang_01.jpg",
  },
  // Stand-in: gomtang, the signature dish.
  hadongkwan: {
    url: "/photos/hadongkwan.jpg",
    credit: "chomjong / CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Gomtang.jpg",
  },
  "sindang-tteokbokki-town": {
    url: "/photos/sindang-tteokbokki-town.jpg",
    credit: "서울연구원 / CC BY 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Sindang-dong_Tteokbokki_town_in_2020.jpg",
  },
  // Stand-in: jajangmyeon, the signature dish.
  "hong-kong-banjeom-hongdae": {
    url: "/photos/hong-kong-banjeom-hongdae.jpg",
    credit: "Andy Li / CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:Jajangmyeon_-_Kogi_Korean_cuisine,_Brighton_2024-03-12.jpg",
  },
  // Stand-in: sundubu-jjigae, the signature dish.
  "bukchang-dong-sundubu": {
    url: "/photos/bukchang-dong-sundubu.jpg",
    credit: "titanium22 / CC BY-SA 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Korean_stew-Sundubu_jjigae-05.jpg",
  },
  // hotels
  // Stand-in: Sejong-daero, the street the hotel is on.
  "four-seasons-hotel-seoul": {
    url: "/photos/four-seasons-hotel-seoul.jpg",
    credit: "DtSeoul / CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:Seoul_CBD_along_Sejongdaero.jpg",
  },
  // Stand-in: Lotte World Tower, which houses the hotel.
  "signiel-seoul": {
    url: "/photos/signiel-seoul.jpg",
    credit: "mauveine.kim / CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:Seoul_Skyline_Night_2018.jpg",
  },
  // Stand-in: Euljiro near the hotel.
  "lotte-hotel-seoul": {
    url: "/photos/lotte-hotel-seoul.jpg",
    credit: "DtSeoul / CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:Seoul_CBD_along_Euljiro_near_Lotte_Hotel_Seoul.jpg",
  },
  "the-shilla-seoul": {
    url: "/photos/the-shilla-seoul.jpg",
    credit: "Maris Teteris / CC BY 3.0",
    source:
      "https://commons.wikimedia.org/wiki/File:The_Shilla_Seoul_-_panoramio.jpg",
  },
  "jw-marriott-dongdaemun-square": {
    url: "/photos/jw-marriott-dongdaemun-square.jpg",
    credit: "오모군 / CC BY 3.0",
    source:
      "https://commons.wikimedia.org/wiki/File:JW_Marriott_Dongdaemun_Square_Seoul.JPG",
  },
  // Stand-in: Myeongdong night market outside.
  "l7-myeongdong": {
    url: "/photos/l7-myeongdong.jpg",
    credit: "Sgroey / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Myeongdong_night_market_seoul_1.jpg",
  },
  // Stand-in: Insadong street outside.
  "nine-tree-premier-insadong": {
    url: "/photos/nine-tree-premier-insadong.jpg",
    credit: "travelmate2021 東大策略顧問有限公司 / CC BY 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Seoul-Insadong-Street-01.jpg",
  },
  // Stand-in: Hongdae street outside.
  "ryse-autograph-collection-hongdae": {
    url: "/photos/ryse-autograph-collection-hongdae.jpg",
    credit: "Sgroey / CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Hongdae_2.jpg",
  },
  "rakkojae-seoul": {
    url: "/photos/rakkojae-seoul.jpg",
    credit: "travel oriented / CC BY-SA 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Rakkojae_-_travel_oriented.jpg",
  },
  // Stand-in: a Bukchon hanok gate.
  "bukchon-hanok-guesthouse": {
    url: "/photos/bukchon-hanok-guesthouse.jpg",
    credit: "Steve / CC BY 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Korea-Seoul-Bukchon-24.jpg",
  },
  // Stand-in: Myeongdong street at night.
  "myeongdong-hostel": {
    url: "/photos/myeongdong-hostel.jpg",
    credit: "Adbar / CC BY-SA 3.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Myeong-dong_street_by_night.JPG",
  },
  // Stand-in: nearby Garosu-gil in Sinsa-dong.
  "andaz-seoul-gangnam": {
    url: "/photos/andaz-seoul-gangnam.jpg",
    credit: "sellyourseoul / CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Garosu-gil_at_night.jpg",
  },
  // dishes
  bibimbap: {
    url: "/photos/bibimbap.jpg",
    credit: "Sous Chef / CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Dolsot-bibimbap.jpg",
  },
  bulgogi: {
    url: "/photos/bulgogi.jpg",
    credit: "ayustety / CC BY-SA 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Korean.cuisine-Bulgogi-01.jpg",
  },
  samgyeopsal: {
    url: "/photos/samgyeopsal.jpg",
    credit: "hellochris / CC BY 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Korean.cuisine-Samgyeopsal-01.jpg",
  },
  "kimchi-jjigae": {
    url: "/photos/kimchi-jjigae.jpg",
    credit: "avlxyz / CC BY-SA 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Korean.cuisine-Kimchi_jjigae-01.jpg",
  },
  tteokbokki: {
    url: "/photos/tteokbokki.jpg",
    credit: "Popo le Chien / CC0",
    source: "https://commons.wikimedia.org/wiki/File:Tteokbokki.JPG",
  },
  samgyetang: {
    url: "/photos/samgyetang.jpg",
    credit: "wizdata / CC0",
    source: "https://commons.wikimedia.org/wiki/File:Samgye-tang_2.jpg",
  },
  naengmyeon: {
    url: "/photos/naengmyeon.jpg",
    credit: "chomjong / CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Mul-naengmyeon_3.jpg",
  },
  japchae: {
    url: "/photos/japchae.jpg",
    credit: "Jordi Sanchez / CC BY-SA 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Japchae_2.jpg",
  },
  kimbap: {
    url: "/photos/kimbap.jpg",
    credit: "changupn / CC0",
    source: "https://commons.wikimedia.org/wiki/File:Gimbap_(pixabay).jpg",
  },
  "sundubu-jjigae": {
    url: "/photos/sundubu-jjigae.jpg",
    credit: "travel oriented / CC BY-SA 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Sundubu-jjigae_1.jpg",
  },
  dakgalbi: {
    url: "/photos/dakgalbi.jpg",
    credit: "shizu k (shezzz) / CC BY-SA 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Korean_cuisine-Dakgalbi-01.jpg",
  },
  "korean-fried-chicken": {
    url: "/photos/korean-fried-chicken.jpg",
    credit: "Francesc Fort / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Korean_Fried_Chicken_-_Chikin.jpg",
  },
  bindaetteok: {
    url: "/photos/bindaetteok.jpg",
    credit: "Junho Jung / CC BY-SA 3.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Korean_mung_bean_pancake-Bindaetteok-01.jpg",
  },
  hotteok: {
    url: "/photos/hotteok.jpg",
    credit: "Korea.net / Korean Culture and Information Service / CC BY-SA 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Hotteok.jpg",
  },
  jjajangmyeon: {
    url: "/photos/jjajangmyeon.jpg",
    credit: "국립국어원 / CC BY-SA 2.0 kr",
    source: "https://commons.wikimedia.org/wiki/File:Jajangmyeon.jpg",
  },
};

export const photoFor = (slug: string) => {
  const photo = PHOTOS[slug];
  if (!photo) throw new Error(`No photo for "${slug}" in seed-data/photos.ts`);
  return photo;
};
