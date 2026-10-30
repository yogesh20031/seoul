import type {
  Prisma,
  Place as PlaceRow,
  Review as ReviewRow,
  User as UserRow,
} from "@prisma/client";
import type {
  AuthUser,
  GuideCard,
  Locale,
  MemberPreview,
  Place,
  PlaceSummary,
  PublicUser,
  Review,
  TourCard,
  TourDetail,
  TourGuideSummary,
  TourMember,
  TourStatus,
} from "@seoul/shared";
import { activeBookingWhere } from "./capacity";
import { endsAt } from "./time";

export const asLocale = (value: string): Locale =>
  value === "ko" ? "ko" : "en";

export const toAuthUser = (user: UserRow): AuthUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  avatarUrl: user.avatarUrl,
  locale: asLocale(user.locale),
});

export const toPublicUser = (
  user: UserRow,
  tripsCount: number,
): PublicUser => ({
  id: user.id,
  name: user.name,
  avatarUrl: user.avatarUrl,
  country: user.country,
  bio: user.bio,
  role: user.role,
  tripsCount,
  memberSince: user.createdAt.toISOString(),
});

export const toMemberPreview = (user: UserRow): MemberPreview => ({
  id: user.id,
  name: user.name,
  avatarUrl: user.avatarUrl,
});

export const toPlaceSummary = (place: PlaceRow): PlaceSummary => ({
  id: place.id,
  slug: place.slug,
  category: place.category,
  nameEn: place.nameEn,
  nameKo: place.nameKo,
  district: place.district,
  lat: place.lat,
  lng: place.lng,
  imageUrl: place.imageUrl,
  suggestedMinutes: place.suggestedMinutes,
});

export const toPlace = (place: PlaceRow): Place => ({
  ...toPlaceSummary(place),
  descriptionEn: place.descriptionEn,
  descriptionKo: place.descriptionKo,
  imageCredit: place.imageCredit,
  address: place.address,
  tags: place.tags,
  priceLevel: place.priceLevel,
  openHours: place.openHours,
  nearestStation: place.nearestStation,
  bookingUrl: place.bookingUrl,
  highlightsEn: place.highlightsEn,
  highlightsKo: place.highlightsKo,
  tipsEn: place.tipsEn,
  tipsKo: place.tipsKo,
  admissionEn: place.admissionEn,
  admissionKo: place.admissionKo,
  bestTimeEn: place.bestTimeEn,
  bestTimeKo: place.bestTimeKo,
});

export const toReview = (review: ReviewRow & { author: UserRow }): Review => ({
  id: review.id,
  rating: review.rating,
  comment: review.comment,
  createdAt: review.createdAt.toISOString(),
  author: {
    id: review.author.id,
    name: review.author.name,
    avatarUrl: review.author.avatarUrl,
    country: review.author.country,
  },
});

export const guideCardInclude = (now: Date) =>
  ({
    user: true,
    tours: {
      where: { status: "OPEN", startsAt: { gt: now } },
      orderBy: { startsAt: "asc" },
      take: 1,
      select: { startsAt: true },
    },
  }) satisfies Prisma.GuideProfileInclude;

export type GuideRow = Prisma.GuideProfileGetPayload<{
  include: ReturnType<typeof guideCardInclude>;
}>;

export const toGuideCard = (row: GuideRow): GuideCard => ({
  id: row.userId,
  name: row.user.name,
  avatarUrl: row.user.avatarUrl,
  headline: row.headline,
  languages: row.languages,
  specialties: row.specialties,
  soloPrice: row.soloPrice,
  soloDurationMin: row.soloDurationMin,
  ratingAvg: row.ratingAvg,
  ratingCount: row.ratingCount,
  isVerified: row.isVerified,
  nextTourAt: row.tours[0]?.startsAt.toISOString() ?? null,
});

export const tourInclude = (now: Date) =>
  ({
    guide: { include: { user: true } },
    bookings: {
      where: activeBookingWhere(now),
      orderBy: { createdAt: "asc" },
      include: { traveller: true },
    },
    stops: { orderBy: { order: "asc" }, include: { place: true } },
  }) satisfies Prisma.TourInclude;

export type TourRow = Prisma.TourGetPayload<{
  include: ReturnType<typeof tourInclude>;
}>;

export const toGuideSummary = (guide: TourRow["guide"]): TourGuideSummary => ({
  id: guide.userId,
  name: guide.user.name,
  avatarUrl: guide.user.avatarUrl,
  ratingAvg: guide.ratingAvg,
  ratingCount: guide.ratingCount,
  isVerified: guide.isVerified,
});

const MEMBER_PREVIEW_SIZE = 5;

const seatsTakenOf = (row: TourRow) =>
  row.bookings.reduce((sum, b) => sum + b.seats, 0);

// Persisted status only changes on booking events, so seat holds that expired and tours that ended are derived on read.
const displayStatus = (row: TourRow, seatsTaken: number): TourStatus => {
  if (row.status !== "OPEN" && row.status !== "FULL") return row.status;
  if (endsAt(row.startsAt, row.durationMin) < new Date()) return "COMPLETED";
  return seatsTaken >= row.capacity ? "FULL" : "OPEN";
};

export const toTourCard = (row: TourRow): TourCard => {
  const seatsTaken = seatsTakenOf(row);
  return {
    id: row.id,
    title: row.title,
    startsAt: row.startsAt.toISOString(),
    durationMin: row.durationMin,
    meetingName: row.meetingName,
    capacity: row.capacity,
    seatsTaken,
    pricePerPerson: row.pricePerPerson,
    status: displayStatus(row, seatsTaken),
    coverImageUrl: row.coverImageUrl,
    guide: toGuideSummary(row.guide),
    memberPreview: row.bookings
      .filter((b) => b.status === "PAID")
      .slice(0, MEMBER_PREVIEW_SIZE)
      .map((b) => toMemberPreview(b.traveller)),
  };
};

export const toTourDetail = (
  row: TourRow,
  members: TourMember[] | null,
  viewer: TourDetail["viewer"],
): TourDetail => ({
  ...toTourCard(row),
  description: row.description,
  meetingLat: row.meetingLat,
  meetingLng: row.meetingLng,
  stops: row.stops.map((stop) => ({
    order: stop.order,
    note: stop.note,
    place: toPlaceSummary(stop.place),
  })),
  members,
  viewer,
});
