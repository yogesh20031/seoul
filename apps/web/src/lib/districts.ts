import type { Locale } from "@seoul/shared";

type DistrictInfo = {
  name: Record<Locale, string>;
  blurb: Record<Locale, string>;
};

// Keyed by the district string stored on places, so a lookup is a straight index.
export const DISTRICTS = {
  "Jongno-gu": {
    name: { en: "Jongno-gu", ko: "종로구" },
    blurb: {
      en: "The historic heart of Seoul. Jongno holds the main royal palaces, the hanok lanes of Bukchon and Ikseon-dong, and the tea houses of Insadong, all within walking distance of each other.",
      ko: "서울의 역사가 시작된 중심지예요. 주요 궁궐과 북촌·익선동의 한옥 골목, 인사동 찻집이 모두 걸어서 닿는 거리에 모여 있어요.",
    },
  },
  "Jung-gu": {
    name: { en: "Jung-gu", ko: "중구" },
    blurb: {
      en: "Downtown Seoul, where shopping and history overlap. Myeongdong's street food, Namdaemun Market, Deoksugung Palace and the slopes of Namsan are all here.",
      ko: "쇼핑과 역사가 겹치는 서울 도심이에요. 명동 길거리 음식, 남대문시장, 덕수궁, 남산 자락이 모두 이곳에 있어요.",
    },
  },
  "Yongsan-gu": {
    name: { en: "Yongsan-gu", ko: "용산구" },
    blurb: {
      en: "Between the old city and the Han River. Yongsan is home to N Seoul Tower, the National Museum of Korea and the international food streets of Itaewon and Hannam-dong.",
      ko: "구도심과 한강 사이에 자리한 동네예요. N서울타워, 국립중앙박물관, 다국적 음식점이 모인 이태원과 한남동이 있어요.",
    },
  },
  "Mapo-gu": {
    name: { en: "Mapo-gu", ko: "마포구" },
    blurb: {
      en: "Seoul's young, creative west. Mapo means Hongdae's buskers and live music, the cafes of Yeonnam-dong, and riverside parks built on reclaimed land.",
      ko: "젊고 창의적인 서울의 서쪽이에요. 홍대의 버스킹과 라이브 공연, 연남동 카페, 매립지 위에 만든 강변 공원이 있어요.",
    },
  },
  "Seongdong-gu": {
    name: { en: "Seongdong-gu", ko: "성동구" },
    blurb: {
      en: "Once a district of shoe workshops and factories, now one of the city's trendiest areas. Seongsu-dong's warehouse cafes and pop-ups sit right next to Seoul Forest.",
      ko: "수제화 공방과 공장이 모여 있던 곳이 지금은 서울에서 가장 트렌디한 동네가 됐어요. 창고형 카페와 팝업이 가득한 성수동 바로 옆에 서울숲이 있어요.",
    },
  },
  "Gangnam-gu": {
    name: { en: "Gangnam-gu", ko: "강남구" },
    blurb: {
      en: "Modern Seoul south of the river: wide avenues, glass towers, fine dining and flagship stores, with the thousand-year-old Bongeunsa Temple in the middle of it all.",
      ko: "한강 남쪽의 현대적인 서울이에요. 넓은 대로와 고층 빌딩, 파인 다이닝과 플래그십 매장 사이에 천 년 넘은 봉은사가 자리하고 있어요.",
    },
  },
  "Seocho-gu": {
    name: { en: "Seocho-gu", ko: "서초구" },
    blurb: {
      en: "A calm, leafy district beside Gangnam. Visitors come for the Han River parks at Banpo, the rainbow fountain on Banpo Bridge and the floating Sebitseom islands.",
      ko: "강남 옆의 차분하고 푸른 동네예요. 반포한강공원과 반포대교 무지개분수, 물 위에 뜬 세빛섬을 보러 많이 찾아요.",
    },
  },
  "Songpa-gu": {
    name: { en: "Songpa-gu", ko: "송파구" },
    blurb: {
      en: "South-east Seoul, dominated by the 555-metre Lotte World Tower. Seokchon Lake, Lotte World and the 1988 Olympic Park are all close by.",
      ko: "555m 롯데월드타워가 우뚝 선 서울 동남쪽이에요. 석촌호수, 롯데월드, 1988년 올림픽공원이 가까이 있어요.",
    },
  },
  "Yeongdeungpo-gu": {
    name: { en: "Yeongdeungpo-gu", ko: "영등포구" },
    blurb: {
      en: "Home to Yeouido, the island that is Seoul's financial centre. Its riverside park is the city's favourite picnic spot, famous for cherry blossoms and autumn fireworks.",
      ko: "서울의 금융 중심지인 여의도가 있는 곳이에요. 여의도한강공원은 벚꽃과 가을 불꽃축제로 유명한, 서울 사람들이 가장 사랑하는 피크닉 장소예요.",
    },
  },
  "Seodaemun-gu": {
    name: { en: "Seodaemun-gu", ko: "서대문구" },
    blurb: {
      en: "A district of universities and history. Seodaemun Prison and Independence Gate tell the story of Korea's independence movement, and the student areas of Sinchon are nearby.",
      ko: "대학가와 역사가 함께 있는 동네예요. 서대문형무소와 독립문에서 독립운동의 역사를 볼 수 있고, 신촌 대학가도 가까워요.",
    },
  },
  "Dongjak-gu": {
    name: { en: "Dongjak-gu", ko: "동작구" },
    blurb: {
      en: "A residential district on the south bank, best known to visitors for Noryangjin Fisheries Market and the Seoul National Cemetery.",
      ko: "한강 남쪽의 주거 지역으로, 여행자에게는 노량진수산시장과 국립서울현충원으로 잘 알려져 있어요.",
    },
  },
} satisfies Record<string, DistrictInfo>;

const BY_NAME = new Map<string, DistrictInfo>(Object.entries(DISTRICTS));

/** Info for a district, or null for one we haven't written up yet. */
export const districtInfo = (district: string) => BY_NAME.get(district) ?? null;
