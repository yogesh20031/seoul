export type TransportSeed = {
  slug: string;
  kind: "SUBWAY" | "BUS" | "TAXI" | "AIRPORT" | "TMONEY" | "APP";
  order: number;
  titleEn: string;
  titleKo: string;
  summaryEn: string;
  summaryKo: string;
  bodyEn: string;
  bodyKo: string;
};

export const transport: TransportSeed[] = [
  {
    slug: "t-money-card",
    kind: "TMONEY",
    order: 1,
    titleEn: "T-money card",
    titleKo: "티머니 카드",
    summaryEn: "One rechargeable card for subway, buses and many taxis.",
    summaryKo: "지하철, 버스, 일부 택시까지 쓸 수 있는 충전식 교통카드입니다.",
    bodyEn: `## Get one on day one

A **T-money** card is the easiest way to pay for transport. Tap in and out on the subway and tap when you board and leave a bus.

### Where to buy
- Convenience stores (GS25, CU, 7-Eleven) and subway station kiosks
- The card itself costs around 2,500-4,000 KRW, and you load credit separately

### Top up
- Cash top-ups at convenience stores and station machines
- Unused balance can usually be refunded at convenience stores, with a small fee, so only load what you need

### Good to know
- Transfers between subway and bus within a time window are discounted
- Some foreign credit cards also work on the gates, but a T-money card is the safest bet
- Fares change from time to time, so check the current prices before you travel`,
    bodyKo: `## 첫날에 하나 장만하세요

**티머니** 카드는 교통비를 내는 가장 간편한 방법입니다. 지하철은 타고 내릴 때, 버스는 탈 때와 내릴 때 카드를 대면 됩니다.

### 구매처
- 편의점(GS25, CU, 세븐일레븐), 지하철역 판매기
- 카드값은 대략 2,500~4,000원 정도이며 충전금은 별도입니다

### 충전
- 편의점과 역 충전기에서 현금으로 충전할 수 있어요
- 남은 잔액은 편의점에서 소정의 수수료를 내고 환불받을 수 있으니 필요한 만큼만 충전하세요

### 알아두세요
- 일정 시간 안에 지하철과 버스를 환승하면 요금이 할인됩니다
- 일부 해외 신용카드도 개찰구에서 되지만 티머니가 가장 확실합니다
- 요금은 변동될 수 있으니 여행 전에 확인하세요`,
  },
  {
    slug: "subway",
    kind: "SUBWAY",
    order: 2,
    titleEn: "Subway",
    titleKo: "지하철",
    summaryEn:
      "Fast, clean, English-signed and runs almost everywhere you will want to go.",
    summaryKo:
      "빠르고 깨끗하며 영어 안내가 잘 되어 있어 대부분의 여행지를 갈 수 있습니다.",
    bodyEn: `## Seoul's backbone

The subway covers nearly every sight in this guide. Stations announce in Korean, English, Japanese and Chinese.

### Tips
- Lines are colour-coded and numbered; know your **line number and direction** (the last station of the line)
- Trains usually run from about 05:30 until around midnight; check the last train if you are out late
- Stand to the side of the door, let people off first and keep priority seats for those who need them
- In big interchange stations, such as Seoul Station and Dongdaemun History & Culture Park, allow extra minutes for transfers

### Avoid
- Rush hour, roughly 07:30-09:00 and 18:00-19:30, on Line 2 and Line 9`,
    bodyKo: `## 서울 교통의 중심

이 가이드에 나오는 대부분의 명소를 지하철로 갈 수 있습니다. 역 안내 방송은 한국어, 영어, 일본어, 중국어로 나옵니다.

### 팁
- 노선은 색상과 번호로 구분됩니다. **호선과 방면**(종착역 이름)을 확인하세요
- 보통 오전 5시 30분경부터 자정 무렵까지 운행하니 늦은 시간에는 막차를 확인하세요
- 문 옆에 서서 내리는 사람이 먼저 내리도록 하고 교통약자석은 양보해 주세요
- 서울역, 동대문역사문화공원 같은 환승역은 환승 시간을 넉넉히 잡으세요

### 피할 것
- 2호선과 9호선의 출퇴근 혼잡 시간(대략 07:30~09:00, 18:00~19:30)`,
  },
  {
    slug: "bus",
    kind: "BUS",
    order: 3,
    titleEn: "Bus",
    titleKo: "버스",
    summaryEn:
      "Great for reaching places the subway misses, with a colour-coded system.",
    summaryKo:
      "지하철이 닿지 않는 곳까지 갈 수 있는 색깔로 구분된 버스 시스템입니다.",
    bodyEn: `## Colour-coded routes

- **Blue** buses run long trunk routes across the city
- **Green** buses feed from neighbourhoods to subway stations
- **Red** buses connect Seoul with the suburbs
- **Yellow** buses circle small central areas

### How to ride
1. Tap your T-money card when you **board**
2. Press the stop button before your stop
3. Tap again when you **exit** so transfers are calculated correctly

### Tips
- Naver Map and KakaoMap show real-time arrivals and are far more reliable than guesswork
- Buses can be crowded and sudden brakers; hold on`,
    bodyKo: `## 색깔로 구분되는 노선

- **파랑** 버스는 도시를 가로지르는 간선 노선입니다
- **초록** 버스는 동네와 지하철역을 이어 주는 지선 노선입니다
- **빨강** 버스는 서울과 수도권 외곽을 연결합니다
- **노랑** 버스는 도심의 좁은 구간을 순환합니다

### 타는 방법
1. **탈 때** 티머니 카드를 대세요
2. 내릴 정류장 전에 하차 벨을 누르세요
3. **내릴 때**도 한 번 더 카드를 대야 환승 요금이 제대로 계산됩니다

### 팁
- 네이버 지도와 카카오맵에서 실시간 도착 정보를 볼 수 있어 훨씬 정확합니다
- 버스는 붐비고 급정거가 있을 수 있으니 손잡이를 꼭 잡으세요`,
  },
  {
    slug: "taxi-kakao-t",
    kind: "TAXI",
    order: 4,
    titleEn: "Taxi & Kakao T",
    titleKo: "택시와 카카오 T",
    summaryEn:
      "Cheap compared with many cities. Use Kakao T to avoid language trouble.",
    summaryKo:
      "다른 도시에 비해 저렴하며 카카오 T를 쓰면 언어 문제 없이 이용할 수 있습니다.",
    bodyEn: `## Taxis in Seoul

Regular taxis are metered and generally safe. Late at night a surcharge applies, so fares can be noticeably higher.

### Kakao T
- Hail and pay in the app, with your destination typed in so there is no need to explain
- Add a foreign card in the app, or pay the driver with a card or T-money
- At busy times, drivers may take a while to accept; try again or walk to a main road

### Tips
- Show the destination in **Korean** on your phone if you do not use an app
- Orange and silver taxis are normal; "deluxe" black taxis cost more
- Fares and surcharges change, so treat any number you hear as "around" and check`,
    bodyKo: `## 서울의 택시

일반 택시는 미터기 요금이며 대체로 안전합니다. 심야에는 할증이 붙어 요금이 꽤 오를 수 있어요.

### 카카오 T
- 앱에서 목적지를 입력해 호출하고 결제까지 할 수 있어 설명할 필요가 없습니다
- 앱에 해외 카드를 등록하거나 기사님께 카드나 티머니로 결제하세요
- 혼잡한 시간에는 배차가 늦을 수 있으니 다시 호출하거나 큰길로 나가 보세요

### 팁
- 앱을 쓰지 않는다면 목적지를 **한글**로 휴대폰에 띄워 보여 주세요
- 일반 택시 외에 검은색 모범택시는 요금이 더 비쌉니다
- 요금과 할증은 바뀔 수 있으니 대략적인 금액으로만 생각하고 확인하세요`,
  },
  {
    slug: "airport-transfers",
    kind: "AIRPORT",
    order: 5,
    titleEn: "From the airport: Incheon & Gimpo",
    titleKo: "공항에서 시내로: 인천·김포",
    summaryEn:
      "AREX trains, limousine buses and taxis connect both airports to the city.",
    summaryKo:
      "공항철도, 리무진 버스, 택시로 두 공항에서 시내까지 갈 수 있습니다.",
    bodyEn: `## Incheon International Airport (ICN)

### AREX (Airport Railroad)
- **Express** trains run non-stop to Seoul Station in about 45-50 minutes
- **All-stop** trains stop at Gimpo Airport, Hongik Univ. (Hongdae) and more; slower but cheaper
- Hongik Univ. station is the easiest option if you are staying in Hongdae or Mapo

### Limousine buses
- Run to major hotels and districts such as Myeongdong, Jongno and Gangnam
- Good if you have lots of luggage and your hotel is on a route
- Journey time depends heavily on traffic, often 60-90 minutes

### Taxi
- Convenient for groups or late arrivals, but the most expensive option; ask for the fixed or metered fare estimate

## Gimpo Airport (GMP)
- Line 5, Line 9 and AREX all connect directly, so the subway is the fastest way into the city

Always confirm current fares and timetables before you travel.`,
    bodyKo: `## 인천국제공항(ICN)

### 공항철도(AREX)
- **직통열차**는 서울역까지 쉬지 않고 약 45~50분이 걸립니다
- **일반열차**는 김포공항, 홍대입구 등에 정차하며 더 느리지만 저렴합니다
- 홍대나 마포에 묵는다면 홍대입구역이 가장 편합니다

### 리무진 버스
- 명동, 종로, 강남 등 주요 호텔과 지역까지 운행합니다
- 짐이 많고 숙소가 노선 위에 있다면 편리합니다
- 소요 시간은 교통 상황에 따라 크게 달라지며 보통 60~90분입니다

### 택시
- 여럿이 함께하거나 늦게 도착할 때 편하지만 가장 비쌉니다. 예상 요금을 미리 확인하세요

## 김포국제공항(GMP)
- 5호선, 9호선, 공항철도가 바로 연결되어 지하철이 시내까지 가장 빠릅니다

요금과 시간표는 여행 전에 꼭 확인하세요.`,
  },
  {
    slug: "navigation-apps",
    kind: "APP",
    order: 6,
    titleEn: "Navigation & translation apps",
    titleKo: "길찾기·번역 앱",
    summaryEn:
      "Install Naver Map or KakaoMap. Google Maps walking directions are limited in Korea.",
    summaryKo:
      "네이버 지도나 카카오맵을 설치하세요. 한국에서는 구글 지도의 도보 길찾기가 제한적입니다.",
    bodyEn: `## Why not just Google Maps?

Korean law restricts exporting detailed map data, so **Google Maps cannot give turn-by-turn walking or driving directions** in Korea and its transit info is often out of date.

### What to use instead
- **Naver Map**: best overall, with English mode, subway exits, real-time buses and walking routes
- **KakaoMap**: excellent for buses and taxi hailing through Kakao T
- **Papago**: Naver's translator, great for menus (camera mode) and conversation

### Tips
- Download the English language pack in each app before you arrive
- Save your hotel and sights as favourites
- Use the **exit number** shown in the app: large stations have 10+ exits and the wrong one can mean a long walk
- Get an eSIM or pocket Wi-Fi at the airport for reliable data`,
    bodyKo: `## 구글 지도는 왜 안 되나요?

한국은 상세 지도 데이터의 해외 반출이 제한되어 있어 **구글 지도로는 도보나 자동차 길안내를 받을 수 없고** 대중교통 정보도 오래된 경우가 많습니다.

### 대신 쓸 앱
- **네이버 지도**: 영어 모드, 지하철 출구, 실시간 버스, 도보 경로까지 가장 완성도가 높습니다
- **카카오맵**: 버스 정보가 좋고 카카오 T로 택시도 부를 수 있습니다
- **파파고**: 네이버 번역기로 메뉴판(카메라 모드)과 대화 번역에 유용합니다

### 팁
- 도착하기 전에 각 앱의 영어 언어팩을 내려받아 두세요
- 숙소와 가고 싶은 곳을 즐겨찾기에 저장하세요
- 앱에 표시된 **출구 번호**를 확인하세요. 큰 역은 출구가 10개 이상이라 잘못 나가면 많이 걸어야 합니다
- 공항에서 eSIM이나 포켓 와이파이를 준비하면 데이터가 안정적입니다`,
  },
];
