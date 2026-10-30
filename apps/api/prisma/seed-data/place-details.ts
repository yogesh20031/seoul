// Visitor detail for every seeded place, kept apart from the core place records so those stay scannable.
// Only well-known facts: prices are marked "about" where they change, and anything uncertain is left out.

export type PlaceDetailSeed = {
  highlightsEn: string[];
  highlightsKo: string[];
  tipsEn: string[];
  tipsKo: string[];
  admissionEn?: string;
  admissionKo?: string;
  bestTimeEn?: string;
  bestTimeKo?: string;
};

const FREE = { admissionEn: "Free", admissionKo: "무료" } as const;

const ATTRACTIONS: Record<string, PlaceDetailSeed> = {
  "gyeongbokgung-palace": {
    highlightsEn: [
      "Geunjeongjeon, the grand throne hall",
      "Gyeonghoeru, the banquet pavilion floating on its pond",
      "Hyangwonjeong pavilion in the quiet northern gardens",
      "The royal guard changing ceremony at Gwanghwamun Gate",
    ],
    highlightsKo: [
      "웅장한 정전, 근정전",
      "연못 위에 떠 있는 듯한 경회루",
      "북쪽 정원의 고즈넉한 향원정",
      "광화문 앞 수문장 교대식",
    ],
    tipsEn: [
      "Wear a hanbok and you get in free; rental shops line the streets around the palace.",
      "Closed on Tuesdays.",
      "The National Folk Museum inside the grounds is free and easy to add on.",
    ],
    tipsKo: [
      "한복을 입으면 무료로 입장할 수 있어요. 궁 주변에 한복 대여점이 많습니다.",
      "매주 화요일은 휴궁입니다.",
      "궁 안에 있는 국립민속박물관은 무료라 함께 둘러보기 좋아요.",
    ],
    admissionEn:
      "₩3,000 for adults; free in hanbok, for under-19s and over-65s",
    admissionKo: "성인 3,000원 · 한복 착용자, 만 19세 미만, 만 65세 이상 무료",
    bestTimeEn: "Opening time on a weekday, or late afternoon for softer light",
    bestTimeKo: "평일 개장 직후, 또는 빛이 부드러운 늦은 오후",
  },
  "changdeokgung-palace-secret-garden": {
    highlightsEn: [
      "Donhwamun, the oldest surviving palace gate in Seoul",
      "Injeongjeon throne hall",
      "Buyongji pond in the Secret Garden (Huwon)",
      "Ongnyucheon, where kings floated wine cups along a carved stream",
    ],
    highlightsKo: [
      "서울에 남은 가장 오래된 궁궐 정문, 돈화문",
      "정전인 인정전",
      "후원(비원)의 부용지",
      "임금이 술잔을 띄우며 시를 짓던 옥류천",
    ],
    tipsEn: [
      "The Secret Garden can only be seen on a timed guided tour, and slots sell out — book ahead online.",
      "Closed on Mondays.",
      "Allow time for the walk: the garden tour alone takes about 90 minutes.",
    ],
    tipsKo: [
      "후원은 시간제 해설 관람으로만 들어갈 수 있고 금방 마감되니 온라인으로 미리 예약하세요.",
      "매주 월요일은 휴궁입니다.",
      "후원 관람만 약 90분이 걸리니 여유 있게 일정을 잡으세요.",
    ],
    admissionEn:
      "₩3,000 for the palace; the Secret Garden tour costs about ₩5,000 extra",
    admissionKo: "궁궐 3,000원 · 후원 관람은 약 5,000원 추가",
    bestTimeEn: "Autumn, when the Secret Garden turns red and gold",
    bestTimeKo: "후원이 붉고 노랗게 물드는 가을",
  },
  "bukchon-hanok-village": {
    highlightsEn: [
      "Gahoe-dong's sloping lanes of tiled roofs",
      "Views over the hanok roofs towards N Seoul Tower",
      "Small craft workshops and galleries tucked between homes",
    ],
    highlightsKo: [
      "기와지붕이 이어지는 가회동 언덕길",
      "한옥 지붕 너머로 보이는 N서울타워",
      "집들 사이에 숨은 공방과 작은 갤러리",
    ],
    tipsEn: [
      "People live here: keep your voice down and don't open gates or sit on doorsteps.",
      "Tourists are restricted in the core area from 5pm to 10am, and fines apply.",
      "Wear comfortable shoes — the lanes are steep.",
    ],
    tipsKo: [
      "주민이 실제로 사는 마을이에요. 조용히 다니고 대문을 열거나 계단에 앉지 마세요.",
      "핵심 구역은 오후 5시부터 오전 10시까지 관광객 출입이 제한되며 과태료가 부과됩니다.",
      "골목이 가파르니 편한 신발을 신으세요.",
    ],
    ...FREE,
    bestTimeEn: "Weekday mornings just after 10am",
    bestTimeKo: "평일 오전 10시 직후",
  },
  insadong: {
    highlightsEn: [
      "Ssamziegil, a spiral of small craft shops around a courtyard",
      "Traditional tea houses in the side alleys",
      "Calligraphy brushes, hanji paper and pottery shops",
      "The Starbucks with its sign written in Hangul",
    ],
    highlightsKo: [
      "마당을 둘러싸고 나선형으로 이어지는 쌈지길",
      "골목 안쪽의 전통 찻집",
      "붓, 한지, 도자기를 파는 가게들",
      "한글 간판을 단 스타벅스",
    ],
    tipsEn: [
      "The side alleys are calmer and better value than the main street.",
      "Combine with Ikseon-dong and Jogyesa Temple, both a short walk away.",
    ],
    tipsKo: [
      "큰길보다 옆 골목이 한적하고 가격도 괜찮아요.",
      "걸어서 가까운 익선동, 조계사와 함께 둘러보세요.",
    ],
    ...FREE,
    bestTimeEn: "Late afternoon, ending with tea",
    bestTimeKo: "늦은 오후에 둘러보고 찻집에서 마무리",
  },
  "n-seoul-tower": {
    highlightsEn: [
      "The observatory's 360° view over the whole city",
      "The love-lock terraces",
      "Palgakjeong pavilion and the old beacon mound on the summit",
    ],
    highlightsKo: [
      "도시 전체가 내려다보이는 360도 전망대",
      "사랑의 자물쇠 테라스",
      "정상의 팔각정과 봉수대",
    ],
    tipsEn: [
      "Take the Namsan cable car, Namsan circular bus 01A or 01B, or walk up from Myeongdong in about 30–40 minutes.",
      "The summit terraces are free; you only pay for the observatory.",
      "Clear days after rain give the longest views.",
    ],
    tipsKo: [
      "남산 케이블카나 남산순환버스 01A·01B를 타거나, 명동에서 30~40분 정도 걸어 올라가세요.",
      "정상 테라스는 무료이고 전망대만 유료예요.",
      "비 온 다음 날처럼 맑은 날에 가장 멀리 보여요.",
    ],
    admissionEn:
      "Observatory about ₩21,000 for adults; the park and terraces are free",
    admissionKo: "전망대 성인 약 21,000원 · 공원과 테라스는 무료",
    bestTimeEn: "Sunset, staying on for the night view",
    bestTimeKo: "해 질 무렵에 올라가 야경까지",
  },
  "myeongdong-shopping-street": {
    highlightsEn: [
      "Street-food stalls that fill the main lanes in the evening",
      "Korean skincare and cosmetics flagships",
      "Myeongdong Cathedral, Korea's first Gothic church",
    ],
    highlightsKo: [
      "저녁이면 큰길을 가득 채우는 길거리 음식 노점",
      "K-뷰티 화장품 대형 매장",
      "한국 최초의 고딕 양식 성당, 명동성당",
    ],
    tipsEn: [
      "Food stalls set up from late afternoon; come hungry around 5pm.",
      "Myeongdong's money changers usually offer some of the best rates in the city.",
      "Many cosmetics shops hand out samples — no need to buy everything you try.",
    ],
    tipsKo: [
      "노점은 늦은 오후부터 열리니 5시쯤 출출할 때 가세요.",
      "명동 환전소는 서울에서 환율이 좋은 편이에요.",
      "화장품 매장에서 샘플을 많이 주니 써 보고 고르세요.",
    ],
    ...FREE,
    bestTimeEn: "Early evening, when the stalls are out",
    bestTimeKo: "노점이 문을 여는 이른 저녁",
  },
  "namdaemun-market": {
    highlightsEn: [
      "Kalguksu alley, with hand-cut noodles at long counters",
      "Galchi jorim alley for braised hairtail",
      "Vegetable hotteok from the street stands",
      "Sungnyemun, the city's great south gate, at the market's edge",
    ],
    highlightsKo: [
      "긴 카운터에 앉아 먹는 칼국수 골목",
      "갈치조림 골목",
      "노점에서 파는 야채호떡",
      "시장 입구의 숭례문",
    ],
    tipsEn: [
      "Many shops close on Sundays.",
      "Bring some cash for the food stalls.",
    ],
    tipsKo: ["일요일에는 쉬는 가게가 많아요.", "노점용 현금을 조금 챙기세요."],
    ...FREE,
    bestTimeEn: "Weekday mornings, when the wholesalers are busiest",
    bestTimeKo: "도매상이 가장 분주한 평일 오전",
  },
  "gwangjang-market": {
    highlightsEn: [
      "Bindaetteok, mung-bean pancakes fried on huge griddles",
      "Mayak gimbap, small rice rolls with a mustard dip",
      "Yukhoe, Korean beef tartare, on Yukhoe Alley",
      "Hand-cut kalguksu from the stalls made famous by Netflix",
    ],
    highlightsKo: [
      "큰 철판에서 부쳐 내는 빈대떡",
      "겨자 소스에 찍어 먹는 마약김밥",
      "육회 골목의 육회",
      "넷플릭스로 유명해진 손칼국수",
    ],
    tipsEn: [
      "Grab a stool at any stall counter and order from the dishes in front of you.",
      "The textile floors close on Sundays, but most food stalls stay open.",
      "Share plates so you can try more.",
    ],
    tipsKo: [
      "아무 노점 의자에 앉아 앞에 놓인 음식을 가리켜 주문하면 돼요.",
      "원단 상가는 일요일에 쉬지만 먹자골목은 대부분 열어요.",
      "여럿이 나눠 먹으면 더 많이 맛볼 수 있어요.",
    ],
    ...FREE,
    bestTimeEn: "Weekday lunch or an early dinner",
    bestTimeKo: "평일 점심이나 이른 저녁",
  },
  "dongdaemun-design-plaza": {
    highlightsEn: [
      "Zaha Hadid's flowing silver building",
      "Remains of the old city wall in Dongdaemun History & Culture Park",
      "Design exhibitions and pop-up markets",
    ],
    highlightsKo: [
      "자하 하디드가 설계한 곡선의 은빛 건물",
      "동대문역사문화공원에 남은 옛 성곽",
      "디자인 전시와 팝업 마켓",
    ],
    tipsEn: [
      "Walking around the outside is free at any hour; exhibitions are ticketed separately.",
      "The Dongdaemun fashion malls nearby stay open late into the night.",
    ],
    tipsKo: [
      "건물 외관은 언제든 무료로 둘러볼 수 있고 전시는 따로 표를 사야 해요.",
      "근처 동대문 패션몰은 밤늦게까지 문을 엽니다.",
    ],
    admissionEn: "Free to walk around; exhibition prices vary",
    admissionKo: "외부 관람 무료 · 전시는 전시마다 다름",
    bestTimeEn: "After dark, when the building is lit up",
    bestTimeKo: "조명이 켜지는 해 진 뒤",
  },
  "cheonggyecheon-stream": {
    highlightsEn: [
      "A walkable stream of about 11 km running below street level",
      '"Spring", the giant shell sculpture at Cheonggye Plaza',
      "Stepping stones across the water",
      "The Seoul Lantern Festival each November",
    ],
    highlightsKo: [
      "도심 아래로 약 11km 이어지는 산책로",
      "청계광장의 소라 모양 조형물 '스프링'",
      "물 위를 건너는 징검다리",
      "매년 11월의 서울빛초롱축제",
    ],
    tipsEn: [
      "Start at Cheonggye Plaza and walk east as far as you like; there are exits at every bridge.",
      "A cool place to rest your feet on a summer evening.",
    ],
    tipsKo: [
      "청계광장에서 시작해 동쪽으로 원하는 만큼 걸으세요. 다리마다 출구가 있어요.",
      "여름 저녁에 발 담그고 쉬기 좋은 곳이에요.",
    ],
    ...FREE,
    bestTimeEn: "Evenings, when the stream is lit",
    bestTimeKo: "조명이 켜지는 저녁",
  },
  "lotte-world-tower-seoul-sky": {
    highlightsEn: [
      "Seoul Sky, the observatory near the top of the 555 m tower",
      "The glass-floored Sky Deck",
      "Seokchon Lake at the foot of the tower",
    ],
    highlightsKo: [
      "555m 타워 꼭대기의 전망대 서울스카이",
      "바닥이 유리로 된 스카이데크",
      "타워 아래 석촌호수",
    ],
    tipsEn: [
      "Check the visibility forecast before buying a ticket — fine dust can hide the view.",
      "Seokchon Lake is one of the city's best cherry blossom walks in early April.",
    ],
    tipsKo: [
      "미세먼지가 심하면 전망이 안 보이니 표를 사기 전에 날씨를 확인하세요.",
      "4월 초 석촌호수는 서울에서 손꼽히는 벚꽃 산책길이에요.",
    ],
    admissionEn: "Seoul Sky about ₩30,000 for adults",
    admissionKo: "서울스카이 성인 약 30,000원",
    bestTimeEn: "Just before sunset",
    bestTimeKo: "해 지기 직전",
  },
  "starfield-coex-library": {
    highlightsEn: [
      "13-metre bookshelves rising through the mall",
      "Free seating and magazines to browse",
      "COEX Aquarium and the Gangnam Style statue nearby",
    ],
    highlightsKo: [
      "몰 한가운데 솟은 13m 높이의 서가",
      "누구나 앉아 볼 수 있는 자리와 잡지",
      "근처의 코엑스 아쿠아리움과 강남스타일 조형물",
    ],
    tipsEn: [
      "Free to enter; weekday mornings are best for photos without crowds.",
      "Bongeunsa Temple is just across the road.",
    ],
    tipsKo: [
      "무료이고, 사람 없는 사진을 원하면 평일 오전이 좋아요.",
      "길 건너편에 봉은사가 있어요.",
    ],
    ...FREE,
    bestTimeEn: "Weekday mornings",
    bestTimeKo: "평일 오전",
  },
  "bongeunsa-temple": {
    highlightsEn: [
      "The 23-metre standing Maitreya Buddha",
      "Temple halls set against Gangnam's glass towers",
      "Lotus lanterns filling the courtyard before Buddha's Birthday",
    ],
    highlightsKo: [
      "높이 23m의 미륵대불",
      "강남 빌딩숲을 배경으로 한 전각들",
      "부처님오신날 즈음 마당을 채우는 연등",
    ],
    tipsEn: [
      "Dress modestly and keep your voice down near the halls.",
      "Bongeunsa runs templestay programmes if you want to stay longer.",
    ],
    tipsKo: [
      "단정한 옷차림으로, 법당 근처에서는 조용히 해 주세요.",
      "더 머물고 싶다면 템플스테이 프로그램도 있어요.",
    ],
    ...FREE,
    bestTimeEn: "Early morning, or in spring for the lanterns",
    bestTimeKo: "이른 아침, 또는 연등이 걸리는 봄",
  },
  "hongdae-street": {
    highlightsEn: [
      "Buskers and dance crews along the main walking street",
      "Indie live-music clubs",
      "The weekend Free Market of handmade goods at Hongdae Playground",
    ],
    highlightsKo: [
      "걷고싶은거리의 버스킹과 댄스 공연",
      "인디 라이브 클럽",
      "홍대 놀이터의 주말 프리마켓",
    ],
    tipsEn: [
      "Exit 9 of Hongik Univ. station leads to the main streets; exit 3 to Yeonnam-dong.",
      "It's quiet before noon and busiest on Friday and Saturday nights.",
    ],
    tipsKo: [
      "홍대입구역 9번 출구는 홍대 중심가, 3번 출구는 연남동으로 이어져요.",
      "오전엔 한산하고 금·토요일 밤에 가장 붐벼요.",
    ],
    ...FREE,
    bestTimeEn: "Friday or Saturday evening",
    bestTimeKo: "금요일이나 토요일 저녁",
  },
  "gyeongui-line-forest-park": {
    highlightsEn: [
      "A long, leafy park built over an old railway line",
      "Picnics on the lawns of the Yeonnam-dong stretch",
      "Cafes and small restaurants along both sides",
    ],
    highlightsKo: [
      "옛 철길 위에 만든 길고 푸른 공원",
      "연남동 구간 잔디밭에서 즐기는 피크닉",
      "양옆으로 늘어선 카페와 작은 식당들",
    ],
    tipsEn: [
      "Take exit 3 of Hongik Univ. station to come out right on the park.",
      "Locals bring takeaway and a mat on warm evenings — join them.",
    ],
    tipsKo: [
      "홍대입구역 3번 출구로 나오면 바로 공원이에요.",
      "따뜻한 저녁엔 다들 돗자리와 포장 음식을 들고 와요.",
    ],
    ...FREE,
    bestTimeEn: "Spring and autumn evenings",
    bestTimeKo: "봄·가을 저녁",
  },
  "ikseon-dong-hanok-street": {
    highlightsEn: [
      "Narrow hanok alleys converted into cafes, bars and boutiques",
      "Courtyard cafes under traditional roofs",
      "Retro photo studios and small design shops",
    ],
    highlightsKo: [
      "카페와 술집, 소품숍으로 바뀐 좁은 한옥 골목",
      "한옥 지붕 아래 마당 카페",
      "레트로 사진관과 작은 디자인 숍",
    ],
    tipsEn: [
      "Weekends get very crowded; go on a weekday afternoon.",
      "It's a five-minute walk from Insadong, so pair the two.",
    ],
    tipsKo: [
      "주말에는 매우 붐비니 평일 오후에 가세요.",
      "인사동에서 걸어서 5분이라 함께 돌아보기 좋아요.",
    ],
    ...FREE,
    bestTimeEn: "Weekday afternoon into the evening",
    bestTimeKo: "평일 오후부터 저녁까지",
  },
  "seoul-forest": {
    highlightsEn: [
      "The deer enclosure in the eco-forest",
      "Ginkgo avenues that turn gold in autumn",
      "Wide lawns and the riverside path",
    ],
    highlightsKo: [
      "생태숲의 꽃사슴 우리",
      "가을이면 노랗게 물드는 은행나무길",
      "넓은 잔디밭과 한강 산책로",
    ],
    tipsEn: [
      "Rent a Ttareungyi city bike nearby to cover the park and the river.",
      "Seongsu-dong's cafes start right outside the park.",
    ],
    tipsKo: [
      "근처에서 따릉이를 빌리면 공원과 한강을 둘러보기 편해요.",
      "공원 바로 옆에서 성수동 카페 거리가 시작돼요.",
    ],
    ...FREE,
    bestTimeEn: "Autumn, or a spring picnic",
    bestTimeKo: "가을, 또는 봄 피크닉",
  },
  "seongsu-dong": {
    highlightsEn: [
      "Old factories and warehouses turned into cafes and galleries",
      "Pop-up stores from fashion and beauty brands",
      "The handmade shoe shops this area was known for",
    ],
    highlightsKo: [
      "카페와 갤러리로 바뀐 옛 공장과 창고",
      "패션·뷰티 브랜드의 팝업 스토어",
      "이 동네를 대표하던 수제화 거리",
    ],
    tipsEn: [
      "Pop-ups change every week or two — check social media for what's on.",
      "Popular pop-ups have queues at weekends; weekdays are much easier.",
    ],
    tipsKo: [
      "팝업은 1~2주마다 바뀌니 SNS로 지금 열린 곳을 확인하세요.",
      "인기 팝업은 주말에 줄이 길어서 평일이 훨씬 편해요.",
    ],
    ...FREE,
    bestTimeEn: "Weekday afternoon",
    bestTimeKo: "평일 오후",
  },
  "ihwa-mural-village": {
    highlightsEn: [
      "Murals and installations on the stairs and walls of a hillside neighbourhood",
      "Views back over Seoul from the top of the slope",
    ],
    highlightsKo: [
      "언덕 마을의 계단과 벽을 채운 벽화와 설치 작품",
      "언덕 위에서 내려다보는 서울 풍경",
    ],
    tipsEn: [
      "It's a residential area: keep noise down, and some murals have been removed at residents' request.",
      "Walk up from Hyehwa station and carry on to Naksan Park and the city wall.",
    ],
    tipsKo: [
      "주민이 사는 곳이라 조용히 다녀 주세요. 주민 요청으로 지워진 벽화도 있어요.",
      "혜화역에서 걸어 올라가 낙산공원과 성곽길로 이어 가세요.",
    ],
    ...FREE,
    bestTimeEn: "Daytime, ending at Naksan Park for sunset",
    bestTimeKo: "낮에 둘러보고 낙산공원에서 노을로 마무리",
  },
  "naksan-park-seoul-city-wall": {
    highlightsEn: [
      "A lit stretch of the 600-year-old Seoul City Wall",
      "Sunset and night views over the city",
      "The theatre district of Daehak-ro at the bottom of the hill",
    ],
    highlightsKo: [
      "조명이 켜진 600년 된 한양도성 성곽",
      "도시를 내려다보는 노을과 야경",
      "언덕 아래 대학로 공연 거리",
    ],
    tipsEn: [
      "Walk along the outside of the wall after dark for the classic photo.",
      "Hyehwa station exit 2 brings you out by Marronnier Park.",
    ],
    tipsKo: [
      "해가 진 뒤 성곽 바깥길을 따라 걸으면 대표적인 야경 사진을 찍을 수 있어요.",
      "혜화역 2번 출구로 나오면 마로니에공원이에요.",
    ],
    ...FREE,
    bestTimeEn: "Sunset into the evening",
    bestTimeKo: "해 질 녘부터 저녁까지",
  },
  "deoksugung-palace": {
    highlightsEn: [
      "Seokjojeon, a stone Western-style hall from the Korean Empire",
      "The royal guard changing ceremony at Daehanmun Gate",
      "Deoksugung's stone-wall road (Doldam-gil)",
    ],
    highlightsKo: [
      "대한제국 시기의 서양식 석조 건물, 석조전",
      "대한문 앞 왕궁 수문장 교대의식",
      "덕수궁 돌담길",
    ],
    tipsEn: [
      "Open until 9pm, so it works as an evening visit.",
      "Closed on Mondays.",
    ],
    tipsKo: [
      "밤 9시까지 열어 저녁에 들르기 좋아요.",
      "매주 월요일은 휴궁입니다.",
    ],
    admissionEn: "₩1,000 for adults; free in hanbok",
    admissionKo: "성인 1,000원 · 한복 착용 시 무료",
    bestTimeEn: "Evening, when the palace is lit",
    bestTimeKo: "궁에 조명이 켜지는 저녁",
  },
  "jogyesa-temple": {
    highlightsEn: [
      "The head temple of the Jogye Order of Korean Buddhism",
      "A lacebark pine around 500 years old",
      "Thousands of lanterns in the weeks before Buddha's Birthday",
    ],
    highlightsKo: [
      "대한불교조계종의 총본산",
      "수령 약 500년의 백송",
      "부처님오신날을 앞두고 걸리는 수천 개의 연등",
    ],
    tipsEn: [
      "Dress modestly and stay quiet when a service is on.",
      "The Lotus Lantern Festival parade passes nearby in spring.",
    ],
    tipsKo: [
      "단정한 차림으로, 예불 중에는 조용히 해 주세요.",
      "봄에는 연등회 행렬이 근처를 지나가요.",
    ],
    ...FREE,
    bestTimeEn: "Spring, during the lantern season",
    bestTimeKo: "연등이 걸리는 봄",
  },
  "war-memorial-of-korea": {
    highlightsEn: [
      "Galleries on the Korean War",
      "Outdoor tanks, aircraft and ships you can walk around",
      "The Statue of Brothers at the entrance",
    ],
    highlightsKo: [
      "6·25 전쟁 전시실",
      "가까이서 볼 수 있는 야외 전차, 항공기, 함정",
      "입구의 형제의 상",
    ],
    tipsEn: [
      "Closed on Mondays.",
      "The outdoor exhibits are a good stop with children.",
    ],
    tipsKo: [
      "매주 월요일은 휴관입니다.",
      "야외 전시는 아이와 함께 보기 좋아요.",
    ],
    ...FREE,
    bestTimeEn: "Allow a half day",
    bestTimeKo: "반나절 정도 여유를 두세요",
  },
  "national-museum-of-korea": {
    highlightsEn: [
      "The Room of Quiet Contemplation with two Pensive Bodhisattvas",
      "The ten-storey Gyeongcheonsa pagoda in the main hall",
      "Gold crowns from the Silla kingdom",
    ],
    highlightsKo: [
      "반가사유상 두 점이 놓인 '사유의 방'",
      "중앙 홀의 경천사지 십층석탑",
      "신라 금관",
    ],
    tipsEn: [
      "The permanent collection is free; special exhibitions are ticketed.",
      "Open late on Wednesdays and Saturdays.",
    ],
    tipsKo: [
      "상설전시는 무료, 특별전은 유료예요.",
      "수요일과 토요일은 늦게까지 열어요.",
    ],
    admissionEn: "Free (special exhibitions extra)",
    admissionKo: "무료 (특별전 별도)",
    bestTimeEn: "A rainy day, or a late Wednesday visit",
    bestTimeKo: "비 오는 날, 또는 수요일 저녁",
  },
  itaewon: {
    highlightsEn: [
      "Restaurants from just about every cuisine",
      "Gyeongnidan-gil's hillside bars and cafes",
      "Leeum Museum of Art in nearby Hannam-dong",
    ],
    highlightsKo: [
      "세계 각국의 음식점",
      "언덕길을 따라 이어지는 경리단길 술집과 카페",
      "근처 한남동의 리움미술관",
    ],
    tipsEn: [
      "Hannam-dong next door has quieter cafes and design shops.",
      "Streets are steep; take a taxi up the hill and walk down.",
    ],
    tipsKo: [
      "바로 옆 한남동에 조용한 카페와 디자인 숍이 많아요.",
      "길이 가파르니 위로는 택시로 가고 걸어서 내려오세요.",
    ],
    ...FREE,
    bestTimeEn: "Evening for dinner and drinks",
    bestTimeKo: "저녁 식사와 한잔하기 좋은 저녁",
  },
  "banpo-moonlight-rainbow-fountain": {
    highlightsEn: [
      "The world's longest bridge fountain, in Guinness World Records",
      "Music-and-light shows reflected in the Han River",
      "The floating Sebitseom islands next to the bridge",
      "Jamsu Bridge underneath, which you can walk across",
    ],
    highlightsKo: [
      "기네스북에 오른 세계에서 가장 긴 교량 분수",
      "한강에 비치는 음악과 조명 쇼",
      "다리 옆에 떠 있는 세빛섬",
      "걸어서 건널 수 있는 아래층 잠수교",
    ],
    tipsEn: [
      "Shows run from spring to autumn only, and are cancelled in rain or strong wind.",
      "It's about a 15–20 minute walk from Express Bus Terminal station.",
      "Bring a mat: the lawns of Banpo Hangang Park fill up before the evening shows.",
    ],
    tipsKo: [
      "분수 쇼는 봄부터 가을까지만 하고, 비나 강풍이 있으면 취소돼요.",
      "고속터미널역에서 걸어서 15~20분 정도예요.",
      "저녁 쇼 전에 반포한강공원 잔디밭이 차니 돗자리를 챙기세요.",
    ],
    ...FREE,
    bestTimeEn: "A warm evening between April and October",
    bestTimeKo: "4월에서 10월 사이의 따뜻한 저녁",
  },
  "yeouido-hangang-park": {
    highlightsEn: [
      "Chimaek — fried chicken and beer delivered to the riverbank",
      "Cherry blossoms along Yunjung-ro in early April",
      "The Seoul International Fireworks Festival in autumn",
      "Han River cruises leaving from the park",
    ],
    highlightsKo: [
      "강변으로 배달시켜 먹는 치맥",
      "4월 초 윤중로 벚꽃길",
      "가을의 서울세계불꽃축제",
      "공원에서 출발하는 한강 유람선",
    ],
    tipsEn: [
      "Delivery riders meet you at the numbered delivery zones by the park entrances.",
      "Rent a Ttareungyi bike and ride along the river.",
    ],
    tipsKo: [
      "배달 음식은 공원 입구의 배달존 번호로 받으면 돼요.",
      "따릉이를 빌려 강변을 달려 보세요.",
    ],
    ...FREE,
    bestTimeEn: "Early April for blossoms, or any warm evening",
    bestTimeKo: "벚꽃 피는 4월 초, 또는 따뜻한 저녁",
  },
  "the-hyundai-seoul": {
    highlightsEn: [
      "Sounds Forest, an indoor garden under a glass roof",
      "An indoor waterfall in the atrium",
      "The basement food hall",
      "Rotating pop-ups and exhibitions",
    ],
    highlightsKo: [
      "유리 천장 아래 실내 정원 '사운즈 포레스트'",
      "아트리움의 실내 폭포",
      "지하 푸드홀",
      "수시로 바뀌는 팝업과 전시",
    ],
    tipsEn: [
      "Weekends are packed; weekday mornings are calm.",
      "Combine with Yeouido Hangang Park, a short walk away.",
    ],
    tipsKo: [
      "주말은 매우 붐비고 평일 오전은 한산해요.",
      "가까운 여의도한강공원과 함께 들르세요.",
    ],
    ...FREE,
    bestTimeEn: "Weekday mornings",
    bestTimeKo: "평일 오전",
  },
  "seoullo-7017": {
    highlightsEn: [
      "A 1970 highway overpass turned into an elevated garden walk",
      "Views of the old Seoul Station building",
      "Thousands of plants in round planters along the way",
    ],
    highlightsKo: [
      "1970년에 지은 고가도로를 바꾼 공중 정원 산책로",
      "옛 서울역사가 내려다보이는 풍경",
      "길을 따라 놓인 원형 화분의 수많은 식물",
    ],
    tipsEn: [
      "Walk it at night, when the walkway is lit blue.",
      "It links Seoul Station with Namdaemun Market and Namsan.",
    ],
    tipsKo: [
      "산책로가 파랗게 빛나는 밤에 걸어 보세요.",
      "서울역에서 남대문시장, 남산으로 이어져요.",
    ],
    ...FREE,
    bestTimeEn: "After dark",
    bestTimeKo: "해 진 뒤",
  },
  "haneul-park": {
    highlightsEn: [
      "Silver grass fields that glow at sunset in autumn",
      "A park on top of a former landfill",
      "Views over the Han River and World Cup Stadium",
    ],
    highlightsKo: [
      "가을 노을에 빛나는 억새밭",
      "옛 쓰레기 매립지 위에 만든 공원",
      "한강과 월드컵경기장이 보이는 전망",
    ],
    tipsEn: [
      "Climb the 291 wooden steps, or take the small electric shuttle up.",
      "The park closes after sunset, so time your visit for late afternoon.",
    ],
    tipsKo: [
      "291개의 나무 계단을 오르거나 전기차(맹꽁이차)를 타고 올라가세요.",
      "해 진 뒤 문을 닫으니 늦은 오후에 맞춰 가세요.",
    ],
    ...FREE,
    bestTimeEn: "October, late afternoon",
    bestTimeKo: "10월의 늦은 오후",
  },
  "seodaemun-prison-history-hall": {
    highlightsEn: [
      "Cell blocks from the prison built in 1908",
      "Exhibits on Korea's independence movement",
      "Independence Gate in the surrounding park",
    ],
    highlightsKo: [
      "1908년에 지어진 감옥의 옥사",
      "독립운동 관련 전시",
      "주변 공원의 독립문",
    ],
    tipsEn: [
      "The exhibits are moving and graphic in places — worth knowing if you're with children.",
      "Closed on Mondays.",
    ],
    tipsKo: [
      "일부 전시는 꽤 사실적이어서 아이와 함께라면 미리 알아 두세요.",
      "매주 월요일은 휴관입니다.",
    ],
    admissionEn: "₩3,000 for adults",
    admissionKo: "성인 3,000원",
  },
};

const RESTAURANTS: Record<string, PlaceDetailSeed> = {
  "gwangjang-market-food-stalls": {
    highlightsEn: [
      "Bindaetteok (mung-bean pancake)",
      "Mayak gimbap",
      "Yukhoe (beef tartare)",
      "A bottle of makgeolli to share",
    ],
    highlightsKo: ["빈대떡", "마약김밥", "육회", "나눠 마실 막걸리 한 병"],
    tipsEn: [
      "Sit at any counter and point at what looks good.",
      "Order small and move between stalls.",
    ],
    tipsKo: [
      "아무 카운터에나 앉아 맛있어 보이는 걸 가리키면 돼요.",
      "조금씩 시켜서 여러 노점을 돌아보세요.",
    ],
    bestTimeEn: "Weekday lunch",
    bestTimeKo: "평일 점심",
  },
  "tosokchon-samgyetang": {
    highlightsEn: [
      "Samgyetang: a whole young chicken stuffed with rice and ginseng",
      "Black-chicken samgyetang",
      "A small glass of ginseng liquor that comes with the meal",
    ],
    highlightsKo: [
      "찹쌀과 인삼을 넣은 영계 한 마리, 삼계탕",
      "오골계 삼계탕",
      "식사와 함께 나오는 인삼주 한 잔",
    ],
    tipsEn: [
      "Expect a queue at lunch, but it moves quickly.",
      "It's popular on the hottest days of summer, when Koreans eat it for strength.",
    ],
    tipsKo: [
      "점심엔 줄이 있지만 금방 빠져요.",
      "복날처럼 더운 날에 특히 붐벼요.",
    ],
    bestTimeEn: "Mid-afternoon, between lunch and dinner",
    bestTimeKo: "점심과 저녁 사이 오후",
  },
  "myeongdong-kyoja": {
    highlightsEn: [
      "Kalguksu in a rich chicken broth",
      "Steamed mandu dumplings",
      "Bibim-guksu, spicy cold noodles",
      "Its famously garlicky kimchi",
    ],
    highlightsKo: [
      "진한 닭 육수의 칼국수",
      "찐만두",
      "비빔국수",
      "마늘 향이 강한 김치",
    ],
    tipsEn: [
      "You pay when you order.",
      "Noodle and rice refills are free — just ask.",
    ],
    tipsKo: [
      "주문할 때 바로 계산해요.",
      "면과 밥은 무료로 더 달라고 할 수 있어요.",
    ],
    bestTimeEn: "Before noon or after 2pm",
    bestTimeKo: "정오 전이나 오후 2시 이후",
  },
  "jinokhwa-halmae-wonjo-dakhanmari": {
    highlightsEn: [
      "Dakhanmari: a whole chicken simmered at your table",
      "Rice cakes and potatoes added to the pot",
      "Kalguksu noodles cooked in the broth at the end",
    ],
    highlightsKo: [
      "식탁에서 끓여 먹는 닭 한 마리",
      "냄비에 넣는 떡과 감자",
      "마지막에 육수에 끓이는 칼국수",
    ],
    tipsEn: [
      "Mix your own dipping sauce from the chilli, mustard, soy and vinegar on the table.",
      "One pot feeds two to three people.",
    ],
    tipsKo: [
      "식탁 위 고춧가루, 겨자, 간장, 식초로 소스를 직접 만들어요.",
      "한 냄비면 2~3명이 먹을 수 있어요.",
    ],
    bestTimeEn: "Dinner",
    bestTimeKo: "저녁",
  },
  "eulji-myeonok": {
    highlightsEn: [
      "Pyongyang-style naengmyeon in a clear, cold beef broth",
      "Pyeonyuk, thin slices of pressed boiled beef",
    ],
    highlightsKo: ["맑고 차가운 육수의 평양냉면", "편육"],
    tipsEn: [
      "Taste the broth before adding vinegar or mustard — the subtlety is the point.",
      "Closed on Sundays.",
    ],
    tipsKo: [
      "식초나 겨자를 넣기 전에 육수 맛을 먼저 보세요. 슴슴한 맛이 매력이에요.",
      "일요일은 쉽니다.",
    ],
    bestTimeEn: "Summer lunch",
    bestTimeKo: "여름 점심",
  },
  "pildong-myeonok": {
    highlightsEn: [
      "Pyongyang naengmyeon topped with chilli flakes",
      "Jeyuk, sliced boiled pork",
    ],
    highlightsKo: ["고춧가루를 살짝 뿌린 평양냉면", "제육"],
    tipsEn: [
      "A Michelin Bib Gourmand favourite, so lunch queues are normal.",
      "Order the pork to share alongside the noodles.",
    ],
    tipsKo: [
      "미쉐린 빕 구르망에 오른 곳이라 점심엔 줄이 있어요.",
      "냉면과 함께 제육을 나눠 드세요.",
    ],
    bestTimeEn: "Early lunch, before 11:30",
    bestTimeKo: "11시 30분 전 이른 점심",
  },
  "mapo-jeong-daepo": {
    highlightsEn: [
      "Galmaegisal, tender pork skirt grilled over charcoal",
      "Samgyeopsal pork belly",
      "Egg cooked in the ring around the grill",
    ],
    highlightsKo: [
      "숯불에 굽는 갈매기살",
      "삼겹살",
      "불판 가장자리에 부어 익히는 계란",
    ],
    tipsEn: [
      "Staff usually grill the meat for you — let them.",
      "Order soju or beer with it, like everyone else.",
    ],
    tipsKo: [
      "보통 직원이 고기를 구워 주니 맡기세요.",
      "소주나 맥주를 곁들이는 게 정석이에요.",
    ],
    bestTimeEn: "After work, from 6pm",
    bestTimeKo: "퇴근 후 저녁 6시부터",
  },
  "yukjeon-hoekwan": {
    highlightsEn: [
      "Seoul-style bulgogi cooked in a shallow broth",
      "Naengmyeon to finish",
    ],
    highlightsKo: ["육수에 자작하게 끓이는 서울식 불고기", "마무리로 냉면"],
    tipsEn: [
      "Spoon the broth over rice once the beef is gone.",
      "Portions are per person; most tables order at least two.",
    ],
    tipsKo: [
      "고기를 다 먹으면 남은 육수를 밥에 비벼 드세요.",
      "1인분 단위라 보통 2인분 이상 주문해요.",
    ],
    bestTimeEn: "Dinner",
    bestTimeKo: "저녁",
  },
  "jungsik-seoul": {
    highlightsEn: [
      "A seasonal tasting menu of modern Korean cooking",
      "Korean ingredients in fine-dining form",
      "Two Michelin stars",
    ],
    highlightsKo: [
      "제철 재료로 만든 모던 한식 코스",
      "파인 다이닝으로 풀어낸 한국 식재료",
      "미쉐린 2스타",
    ],
    tipsEn: ["Reserve weeks ahead.", "Smart casual dress is expected."],
    tipsKo: ["몇 주 전에 예약하세요.", "단정한 복장이 좋아요."],
    bestTimeEn: "A special-occasion dinner",
    bestTimeKo: "특별한 날의 저녁",
  },
  "mingles-seoul": {
    highlightsEn: [
      "Chef Kang Min-goo's tasting menu",
      "Dishes built around jang — Korea's fermented sauces",
      "The jang-themed dessert",
    ],
    highlightsKo: [
      "강민구 셰프의 코스",
      "장(된장·간장·고추장)을 중심으로 한 요리",
      "장을 활용한 디저트",
    ],
    tipsEn: [
      "Reservations open in advance and fill fast.",
      "Tell them about allergies when booking.",
    ],
    tipsKo: [
      "예약이 미리 열리고 금방 마감돼요.",
      "알레르기는 예약할 때 알려 주세요.",
    ],
    bestTimeEn: "Dinner",
    bestTimeKo: "저녁",
  },
  "ikseon-dong-hanok-cafe-street": {
    highlightsEn: [
      "Coffee in a hanok courtyard",
      "Korean desserts like bingsu shaved ice",
      "Wine and cocktail bars in old houses after dark",
    ],
    highlightsKo: [
      "한옥 마당에서 마시는 커피",
      "빙수 같은 한국식 디저트",
      "해가 지면 문을 여는 한옥 와인바와 칵테일바",
    ],
    tipsEn: [
      "The best-known cafes have queues at weekends.",
      "Many places take no reservations; go early.",
    ],
    tipsKo: [
      "유명한 카페는 주말에 줄이 있어요.",
      "예약을 안 받는 곳이 많으니 일찍 가세요.",
    ],
    bestTimeEn: "Weekday afternoon",
    bestTimeKo: "평일 오후",
  },
  "hongdae-bbq-dakgalbi-street": {
    highlightsEn: [
      "Dakgalbi, spicy chicken stir-fried at your table",
      "Fried rice made in the pan at the end",
      "Samgyeopsal and soju",
    ],
    highlightsKo: [
      "식탁에서 볶아 먹는 닭갈비",
      "마지막에 철판에 볶는 볶음밥",
      "삼겹살과 소주",
    ],
    tipsEn: [
      "Add cheese to the dakgalbi if you want it milder.",
      "Always save room for the fried rice.",
    ],
    tipsKo: [
      "맵다면 닭갈비에 치즈를 추가하세요.",
      "볶음밥 먹을 배는 꼭 남겨 두세요.",
    ],
    bestTimeEn: "Late evening",
    bestTimeKo: "늦은 저녁",
  },
  "gangnam-chicken-alley": {
    highlightsEn: [
      "Crispy Korean fried chicken",
      "Yangnyeom chicken in sweet-spicy glaze",
      "Half-and-half to try both",
      "Chimaek: chicken with draught beer",
    ],
    highlightsKo: [
      "바삭한 후라이드 치킨",
      "달콤 매콤한 양념치킨",
      "둘 다 맛보는 반반",
      "생맥주와 함께하는 치맥",
    ],
    tipsEn: [
      "The pickled radish cubes are there to cut the grease.",
      "One chicken is plenty for two.",
    ],
    tipsKo: [
      "치킨무는 느끼함을 잡아 줘요.",
      "한 마리면 두 명이 충분히 먹어요.",
    ],
    bestTimeEn: "Late evening",
    bestTimeKo: "늦은 저녁",
  },
  "noryangjin-fish-market": {
    highlightsEn: [
      "Hoe, sliced raw fish",
      "Live king crab or snow crab, steamed upstairs",
      "Maeuntang, spicy stew made from the leftover bones",
    ],
    highlightsKo: [
      "회",
      "위층에서 쪄 주는 킹크랩이나 대게",
      "남은 뼈로 끓이는 매운탕",
    ],
    tipsEn: [
      "Buy seafood at the stalls, then a restaurant upstairs cooks it for a per-person table fee.",
      "Compare prices between stalls; most are per kilo.",
    ],
    tipsKo: [
      "1층 가게에서 해산물을 사고 위층 식당에서 1인당 상차림비를 내고 먹어요.",
      "가게마다 가격을 비교해 보세요. 대부분 kg 단위예요.",
    ],
    bestTimeEn: "Lunch or early dinner",
    bestTimeKo: "점심이나 이른 저녁",
  },
  "sinsa-garosu-gil-cafes": {
    highlightsEn: [
      "Specialty coffee and brunch",
      "Bakeries and dessert cafes",
      "Fashion flagships between the cafes",
    ],
    highlightsKo: [
      "스페셜티 커피와 브런치",
      "베이커리와 디저트 카페",
      "카페 사이사이의 패션 플래그십 매장",
    ],
    tipsEn: [
      "The side streets (Sero-su-gil) are quieter than the main road.",
      "Autumn ginkgo leaves make it especially pretty.",
    ],
    tipsKo: [
      "큰길보다 옆 골목(세로수길)이 한적해요.",
      "은행잎이 물드는 가을이 특히 예뻐요.",
    ],
    bestTimeEn: "Late morning brunch",
    bestTimeKo: "늦은 아침 브런치",
  },
  "tongin-market-dosirak-cafe": {
    highlightsEn: [
      "Building your own lunchbox with old-style brass coins",
      "Gireum tteokbokki, rice cakes stir-fried in oil",
      "Jeon pancakes and side dishes from the stalls",
    ],
    highlightsKo: [
      "엽전으로 채우는 나만의 도시락",
      "기름떡볶이",
      "노점의 전과 반찬",
    ],
    tipsEn: [
      "Buy coins and a tray at the cafe, then trade coins for food at participating stalls.",
      "Come at lunchtime; stalls wind down by late afternoon.",
    ],
    tipsKo: [
      "도시락 카페에서 엽전과 쟁반을 산 뒤 가맹 가게에서 엽전으로 음식을 담아요.",
      "오후 늦게는 문 닫는 가게가 많으니 점심에 가세요.",
    ],
    bestTimeEn: "Lunch",
    bestTimeKo: "점심",
  },
  "imun-seolnongtang": {
    highlightsEn: [
      "Seolnongtang, milky ox-bone soup",
      "Often called Seoul's oldest restaurant, open since 1904",
    ],
    highlightsKo: [
      "뽀얀 사골 국물의 설렁탕",
      "1904년에 문을 연 서울에서 가장 오래된 식당으로 꼽히는 곳",
    ],
    tipsEn: [
      "Season the soup yourself with salt and green onion.",
      "Add the kkakdugi radish kimchi juice for a kick.",
    ],
    tipsKo: [
      "소금과 파로 직접 간을 맞추세요.",
      "깍두기 국물을 넣으면 더 칼칼해요.",
    ],
    bestTimeEn: "Breakfast or lunch",
    bestTimeKo: "아침이나 점심",
  },
  hadongkwan: {
    highlightsEn: [
      "Gomtang, clear beef-bone soup with sliced brisket",
      "Kkakdugi radish kimchi",
    ],
    highlightsKo: ["양지를 얹은 맑은 곰탕", "깍두기"],
    tipsEn: [
      "It closes when the day's soup runs out, usually mid-afternoon.",
      "Closed on Sundays.",
    ],
    tipsKo: [
      "그날 준비한 국물이 떨어지면 문을 닫아요. 보통 오후 중반이에요.",
      "일요일은 쉽니다.",
    ],
    bestTimeEn: "Morning, before the lunch rush",
    bestTimeKo: "점심 붐비기 전 오전",
  },
  "sindang-tteokbokki-town": {
    highlightsEn: [
      "Jeukseok tteokbokki, cooked in a pot at your table",
      "Ramyeon noodles and boiled eggs added to the pot",
      "Fried rice in the leftover sauce",
    ],
    highlightsKo: [
      "식탁에서 끓여 먹는 즉석떡볶이",
      "라면 사리와 삶은 달걀",
      "남은 양념에 볶는 볶음밥",
    ],
    tipsEn: [
      "Mabongnim Halmeoni is the original shop the street grew around.",
      "Choose your add-ons when you order.",
    ],
    tipsKo: [
      "거리의 시작이 된 원조 가게는 마복림 할머니집이에요.",
      "주문할 때 사리를 골라요.",
    ],
    bestTimeEn: "Lunch or dinner",
    bestTimeKo: "점심이나 저녁",
  },
  "hong-kong-banjeom-hongdae": {
    highlightsEn: [
      "Jjajangmyeon in black bean sauce",
      "Jjamppong, spicy seafood noodle soup",
      "Tangsuyuk, sweet-and-sour pork",
    ],
    highlightsKo: ["짜장면", "얼큰한 해물 짬뽕", "탕수육"],
    tipsEn: [
      "Korean-Chinese food is a local comfort food — order to share.",
      "Quick and cheap, good before a night out in Hongdae.",
    ],
    tipsKo: [
      "한국식 중화요리는 나눠 먹는 게 제맛이에요.",
      "빠르고 저렴해서 홍대에서 놀기 전에 들르기 좋아요.",
    ],
    bestTimeEn: "Any time",
    bestTimeKo: "언제든",
  },
  "bukchang-dong-sundubu": {
    highlightsEn: [
      "Sundubu jjigae, soft tofu stew served bubbling",
      "Seafood or beef versions",
      "A raw egg to crack into the hot stew",
    ],
    highlightsKo: [
      "펄펄 끓여 나오는 순두부찌개",
      "해물이나 소고기 순두부",
      "뜨거운 찌개에 깨 넣는 날달걀",
    ],
    tipsEn: [
      "Pick your spice level when you order.",
      "Crack the egg in straight away, while it's boiling.",
    ],
    tipsKo: ["주문할 때 맵기를 골라요.", "끓고 있을 때 바로 달걀을 넣으세요."],
    bestTimeEn: "Lunch",
    bestTimeKo: "점심",
  },
};

const HOTELS: Record<string, PlaceDetailSeed> = {
  "four-seasons-hotel-seoul": {
    highlightsEn: [
      "Walking distance to Gyeongbokgung and Gwanghwamun",
      "Charles H., a speakeasy bar on the lower floor",
      "A large indoor pool and spa",
    ],
    highlightsKo: [
      "경복궁과 광화문까지 걸어서 이동",
      "지하의 스피크이지 바 '찰스 H.'",
      "넓은 실내 수영장과 스파",
    ],
    tipsEn: [
      "Ideal for palaces and old Seoul.",
      "Book Charles H. ahead at weekends.",
    ],
    tipsKo: [
      "궁궐과 구도심을 둘러보기 좋은 위치예요.",
      "주말에는 찰스 H.를 미리 예약하세요.",
    ],
  },
  "signiel-seoul": {
    highlightsEn: [
      "Rooms on the upper floors of Lotte World Tower",
      "Some of the highest hotel views in Korea",
      "Fine dining high in the tower",
    ],
    highlightsKo: [
      "롯데월드타워 고층의 객실",
      "국내 최고 높이의 호텔 전망",
      "타워 고층의 파인 다이닝",
    ],
    tipsEn: [
      "Ask for a river-facing room.",
      "Seokchon Lake and Lotte World are on the doorstep.",
    ],
    tipsKo: [
      "한강 쪽 객실을 요청하세요.",
      "석촌호수와 롯데월드가 바로 앞이에요.",
    ],
  },
  "lotte-hotel-seoul": {
    highlightsEn: [
      "Connected to Lotte Department Store and its duty-free floors",
      "Myeongdong right outside",
      "A short walk to Deoksugung and City Hall",
    ],
    highlightsKo: [
      "롯데백화점과 면세점이 연결된 호텔",
      "바로 앞이 명동",
      "덕수궁과 시청까지 걸어서 가까움",
    ],
    tipsEn: [
      "Airport limousine buses stop by the hotel.",
      "Good base for shopping-heavy trips.",
    ],
    tipsKo: [
      "공항 리무진 버스가 호텔 근처에 서요.",
      "쇼핑 위주의 여행에 좋은 위치예요.",
    ],
  },
  "the-shilla-seoul": {
    highlightsEn: [
      "Gardens on the slopes of Namsan",
      "La Yeon, its celebrated Korean restaurant",
      "An outdoor pool with city views",
    ],
    highlightsKo: [
      "남산 자락의 정원",
      "이름난 한식당 라연",
      "도심이 보이는 야외 수영장",
    ],
    tipsEn: [
      "The Seoul City Wall trail starts behind the hotel.",
      "Dongguk Univ. station is at the bottom of the hill.",
    ],
    tipsKo: [
      "호텔 뒤편에서 한양도성 성곽길이 시작돼요.",
      "언덕 아래에 동대입구역이 있어요.",
    ],
  },
  "jw-marriott-dongdaemun-square": {
    highlightsEn: [
      "Views straight onto Heunginjimun, the great East Gate",
      "Steps from Gwangjang Market and DDP",
      "A good base for late-night shopping",
    ],
    highlightsKo: [
      "흥인지문(동대문)이 바로 보이는 전망",
      "광장시장과 DDP가 가까움",
      "심야 쇼핑하기 좋은 위치",
    ],
    tipsEn: [
      "Ask for a gate-view room — it's lit at night.",
      "Cheonggyecheon Stream is a minute away.",
    ],
    tipsKo: [
      "밤에 조명이 켜지는 동대문 뷰 객실을 요청하세요.",
      "청계천이 바로 옆이에요.",
    ],
  },
  "l7-myeongdong": {
    highlightsEn: [
      "A lifestyle hotel in the middle of Myeongdong",
      "Walkable to Namsan and Namdaemun Market",
    ],
    highlightsKo: [
      "명동 한가운데의 라이프스타일 호텔",
      "남산과 남대문시장까지 걸어서 이동",
    ],
    tipsEn: [
      "Rooms are compact — pack light.",
      "Street food is right outside in the evening.",
    ],
    tipsKo: [
      "객실이 아담하니 짐을 가볍게 챙기세요.",
      "저녁이면 바로 앞에서 길거리 음식을 즐길 수 있어요.",
    ],
  },
  "nine-tree-premier-insadong": {
    highlightsEn: [
      "Between Insadong and Jongno",
      "Walkable to palaces, Ikseon-dong and Cheonggyecheon",
    ],
    highlightsKo: [
      "인사동과 종로 사이",
      "궁궐, 익선동, 청계천까지 걸어서 이동",
    ],
    tipsEn: [
      "A practical, mid-range base for old Seoul.",
      "Jonggak station is a few minutes away.",
    ],
    tipsKo: [
      "구도심을 둘러보기 좋은 실속형 숙소예요.",
      "종각역이 몇 분 거리예요.",
    ],
  },
  "ryse-autograph-collection-hongdae": {
    highlightsEn: [
      "Design-led rooms and art throughout",
      "Side Note Club, the rooftop bar",
      "Hongdae's nightlife on the doorstep",
    ],
    highlightsKo: [
      "디자인과 예술 작품으로 꾸민 객실",
      "루프톱 바 '사이드 노트 클럽'",
      "바로 앞의 홍대 나이트라이프",
    ],
    tipsEn: [
      "The AREX airport train stops at Hongik Univ. station nearby.",
      "Weekend nights outside can be loud — ask for a high floor.",
    ],
    tipsKo: [
      "근처 홍대입구역에 공항철도가 서요.",
      "주말 밤엔 바깥이 시끄러울 수 있으니 고층을 요청하세요.",
    ],
  },
  "rakkojae-seoul": {
    highlightsEn: [
      "Sleeping on a heated ondol floor in a traditional hanok",
      "A quiet courtyard garden",
      "Korean breakfast",
    ],
    highlightsKo: [
      "전통 한옥의 따뜻한 온돌방에서의 하룻밤",
      "조용한 마당 정원",
      "한식 아침 식사",
    ],
    tipsEn: [
      "Beds are futon-style mattresses on the floor.",
      "Bukchon's quiet hours apply in the evening.",
    ],
    tipsKo: ["바닥에 요를 깔고 자요.", "저녁에는 북촌 정숙 시간이 적용돼요."],
  },
  "bukchon-hanok-guesthouse": {
    highlightsEn: [
      "Budget hanok stay inside Bukchon",
      "Shared courtyard with other travellers",
    ],
    highlightsKo: [
      "북촌 안의 저렴한 한옥 숙소",
      "다른 여행자와 함께 쓰는 마당",
    ],
    tipsEn: [
      "Bathrooms may be shared — check when booking.",
      "Keep noise down: neighbours live next door.",
    ],
    tipsKo: [
      "욕실을 같이 쓸 수 있으니 예약할 때 확인하세요.",
      "이웃이 사는 곳이라 조용히 해 주세요.",
    ],
  },
  "myeongdong-hostel": {
    highlightsEn: [
      "Dorms and private rooms at backpacker prices",
      "Central location for subway lines 2 and 4",
    ],
    highlightsKo: [
      "배낭여행자 가격의 도미토리와 개인실",
      "지하철 2·4호선 이용이 편한 위치",
    ],
    tipsEn: [
      "Bring a padlock for the lockers.",
      "Myeongdong's money changers are close by.",
    ],
    tipsKo: ["사물함용 자물쇠를 챙기세요.", "명동 환전소가 가까워요."],
  },
  "andaz-seoul-gangnam": {
    highlightsEn: [
      "Near Apgujeong Rodeo Street and Garosu-gil",
      "A design-led Hyatt hotel",
      "Easy access to Gangnam's restaurants",
    ],
    highlightsKo: [
      "압구정 로데오거리와 가로수길이 가까움",
      "디자인이 돋보이는 하얏트 계열 호텔",
      "강남 맛집으로 이동이 편리",
    ],
    tipsEn: [
      "A good base for shopping and dining south of the river.",
      "Allow 30–40 minutes by subway to the palaces.",
    ],
    tipsKo: [
      "강남에서 쇼핑과 식사를 즐기기 좋은 위치예요.",
      "궁궐까지는 지하철로 30~40분 정도 걸려요.",
    ],
  },
};

const ALL: Record<string, PlaceDetailSeed> = {
  ...ATTRACTIONS,
  ...RESTAURANTS,
  ...HOTELS,
};

/** Detail for a seeded place. Throws so a new place can't be added without its visitor info. */
export const detailsFor = (slug: string) => {
  const details = ALL[slug];
  if (!details) throw new Error(`Missing place details for "${slug}"`);
  // EN and KO are shown as parallel lists, so a missing translation would silently drop an item.
  if (
    details.highlightsEn.length !== details.highlightsKo.length ||
    details.tipsEn.length !== details.tipsKo.length
  ) {
    throw new Error(`Place details for "${slug}" have mismatched EN/KO lists`);
  }
  return {
    highlightsEn: details.highlightsEn,
    highlightsKo: details.highlightsKo,
    tipsEn: details.tipsEn,
    tipsKo: details.tipsKo,
    admissionEn: details.admissionEn ?? null,
    admissionKo: details.admissionKo ?? null,
    bestTimeEn: details.bestTimeEn ?? null,
    bestTimeKo: details.bestTimeKo ?? null,
  };
};
