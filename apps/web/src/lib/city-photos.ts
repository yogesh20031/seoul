import type { Locale } from "@seoul/shared";

export type CityPhoto = {
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
  /** "Author / Licence", shown next to the photo or on /credits, as the licences require. */
  credit: string;
  /** The Commons file page, which holds the full licence terms. */
  source: string;
};

// Real photos of Seoul from Wikimedia Commons (CC0, public domain, CC BY, CC BY-SA), checked by eye.
// Self-hosted in public/photos/city: hotlinking upload.wikimedia.org through next/image gets rate-limited (429).
// Used by the landing page, auth pages and footer wordmark; every one is listed on /credits.
export const CITY_PHOTOS = {
  gyeongbokgung: {
    src: "/photos/city/gyeongbokgung.jpg",
    width: 1280,
    height: 720,
    alt: {
      en: "Geunjeongjeon throne hall, Gyeongbokgung",
      ko: "경복궁 근정전",
    },
    credit: "Basile Morin / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Front_view_of_the_Imperial_Throne_Hall_Geunjeongjeon_at_Gyeongbokgung_Palace_with_blue_sky_in_Seoul.jpg",
  },
  changdeokgung: {
    src: "/photos/city/changdeokgung.jpg",
    width: 1280,
    height: 883,
    alt: { en: "Injeongjeon hall, Changdeokgung", ko: "창덕궁 인정전" },
    credit: "kallerna / CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Changdeokgung_Seoul_3.jpg",
  },
  namsanSunset: {
    src: "/photos/city/namsanSunset.jpg",
    width: 1280,
    height: 956,
    alt: { en: "N Seoul Tower at sunset", ko: "노을 속 N서울타워" },
    credit: "Rtflakfizer / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Namsan_Tower_sunset,_Seoul.jpg",
  },
  skylineNight: {
    src: "/photos/city/skylineNight.jpg",
    width: 1280,
    height: 696,
    alt: {
      en: "Seoul skyline at night from Namsan",
      ko: "남산에서 본 서울 야경",
    },
    credit: "kallerna / CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:N_Seoul_Tower_view_2.jpg",
  },
  bukchon: {
    src: "/photos/city/bukchon.jpg",
    width: 1280,
    height: 853,
    alt: { en: "Hanok alley in Bukchon", ko: "북촌 한옥 골목" },
    credit: "Bgag / CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:Bukchon_Hanok_Village_01.jpg",
  },
  insadong: {
    src: "/photos/city/insadong.jpg",
    width: 1280,
    height: 853,
    alt: { en: "Insadong main street", ko: "인사동 거리" },
    credit: "S h y numis / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Insa-dong_%EC%9D%B8%EC%82%AC%EB%8F%99_October_1_2020_20.jpg",
  },
  gwangjang: {
    src: "/photos/city/gwangjang.jpg",
    width: 1280,
    height: 853,
    alt: { en: "Gwangjang Market entrance", ko: "광장시장 입구" },
    credit: "Bgag / CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:Gwangjang_Market,_Seoul_01.jpg",
  },
  myeongdongNight: {
    src: "/photos/city/myeongdongNight.jpg",
    width: 1280,
    height: 851,
    alt: { en: "Myeongdong at night", ko: "명동의 밤" },
    credit: "Tristan Surtel / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Namdaemun-ro_and_Aloft_Seoul_Myeongdong_by_night.jpg",
  },
  cheonggyecheon: {
    src: "/photos/city/cheonggyecheon.jpg",
    width: 1280,
    height: 853,
    alt: { en: "Cheonggyecheon stream at sunrise", ko: "해 뜰 무렵의 청계천" },
    credit: "Basile Morin / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Cheonggyecheon_stream_at_sunrise_with_trees_in_Seoul.jpg",
  },
  ddp: {
    src: "/photos/city/ddp.jpg",
    width: 1280,
    height: 960,
    alt: { en: "Dongdaemun Design Plaza", ko: "동대문디자인플라자" },
    credit: "Dwxn / CC BY-SA 4.0",
    source:
      "https://commons.wikimedia.org/wiki/File:20240601_144028_Dongdaemun_Design_Plaza,_Seoul_08.jpg",
  },
  banpoDusk: {
    src: "/photos/city/banpoDusk.jpg",
    width: 1280,
    height: 853,
    alt: { en: "Banpo Bridge fountain at dusk", ko: "해 질 녘 반포대교 분수" },
    credit: "Bryan Dorrough / Public domain",
    source:
      "https://commons.wikimedia.org/wiki/File:Han_River,_Banpo_Bridge_(36).jpg",
  },
  banpoNight: {
    src: "/photos/city/banpoNight.jpg",
    width: 1280,
    height: 720,
    alt: {
      en: "Banpo Moonlight Rainbow Fountain at night",
      ko: "밤의 반포대교 달빛무지개분수",
    },
    credit: "Wvdp / CC0",
    source:
      "https://commons.wikimedia.org/wiki/File:Banpo_Bridge_Moonlight_Rainbow_Fountain_at_night_-_2023-08-14.jpg",
  },
  ddpNight: {
    src: "/photos/city/ddpNight.jpg",
    width: 1280,
    height: 427,
    alt: {
      en: "Dongdaemun Design Plaza at night",
      ko: "밤의 동대문디자인플라자",
    },
    credit: "Eugene Lim / CC BY 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Dongdaemun_Design_Plaza_at_night,_Seoul,_Korea.jpg",
  },
  hanRiverNight: {
    src: "/photos/city/hanRiverNight.jpg",
    width: 1280,
    height: 869,
    alt: {
      en: "Han River and N Seoul Tower at night",
      ko: "한강과 N서울타워 야경",
    },
    credit:
      "서울특별시 소방재난본부(Seoul Metropolitan Fire & Disaster Headquarters) / Public domain",
    source:
      "https://commons.wikimedia.org/wiki/File:2011%EB%85%84_11%EC%9B%94_%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD_%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C_%EB%AA%85%EC%86%8C_(Seoul_best_attractions)_%EB%8B%AC%EB%B9%9B%EB%AC%B4%EC%A7%80%EA%B0%9C%EB%B6%84%EC%88%981.jpg",
  },
} satisfies Record<string, CityPhoto>;

export type CityPhotoKey = keyof typeof CITY_PHOTOS;
