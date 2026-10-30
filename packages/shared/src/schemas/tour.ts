import { z } from "zod";
import { idSchema, latSchema, lngSchema, pageQuerySchema } from "./common";
import type { PlaceSummary } from "./place";
import type { PublicUser } from "./user";

export const TOUR_STATUSES = [
  "DRAFT",
  "OPEN",
  "FULL",
  "COMPLETED",
  "CANCELLED",
] as const;
export type TourStatus = (typeof TOUR_STATUSES)[number];

const tourFields = {
  title: z.string().trim().min(5).max(100),
  description: z.string().trim().min(20).max(2000),
  startsAt: z.iso.datetime({ offset: true }),
  durationMin: z.number().int().min(30).max(720),
  meetingName: z.string().trim().min(3).max(120),
  meetingLat: latSchema,
  meetingLng: lngSchema,
  capacity: z.number().int().min(2).max(20),
  pricePerPerson: z.number().int().min(5_000).max(1_000_000),
  placeIds: z.array(idSchema).max(10),
};

export const createTourSchema = z.object({
  ...tourFields,
  placeIds: tourFields.placeIds.default([]),
});
export type CreateTourInput = z.infer<typeof createTourSchema>;

// No defaults here: Zod 4 applies them inside .partial(), so an omitted placeIds would wipe the stops.
export const updateTourSchema = z.object(tourFields).partial();
export type UpdateTourInput = z.infer<typeof updateTourSchema>;

export const tourQuerySchema = pageQuerySchema.extend({
  guideId: idSchema.optional(),
  /** Only tours that stop at this place. */
  placeId: idSchema.optional(),
  q: z.string().trim().max(80).optional(),
  from: z.iso.date().optional(),
  to: z.iso.date().optional(),
});
export type TourQuery = z.infer<typeof tourQuerySchema>;

export type TourGuideSummary = {
  id: string;
  name: string;
  avatarUrl: string | null;
  ratingAvg: number;
  ratingCount: number;
  isVerified: boolean;
};

export type MemberPreview = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

export type TourCard = {
  id: string;
  title: string;
  startsAt: string;
  durationMin: number;
  meetingName: string;
  capacity: number;
  seatsTaken: number;
  pricePerPerson: number;
  status: TourStatus;
  coverImageUrl: string | null;
  guide: TourGuideSummary;
  /** First few members for the avatar stack. */
  memberPreview: MemberPreview[];
};

export type TourStop = {
  order: number;
  note: string | null;
  place: PlaceSummary;
};

export type TourMember = PublicUser & { seats: number };

export type TourDetail = TourCard & {
  description: string;
  meetingLat: number;
  meetingLng: number;
  stops: TourStop[];
  /** Full member list; null when the viewer isn't allowed to see it (logged out). */
  members: TourMember[] | null;
  viewer: {
    isGuide: boolean;
    bookingId: string | null;
    bookingStatus: BookingStatus | null;
  };
};

export const BOOKING_STATUSES = [
  "PENDING_PAYMENT",
  "PAID",
  "CANCELLED",
  "REFUNDED",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const createBookingSchema = z.object({
  seats: z.number().int().min(1).max(6),
  locale: z.enum(["en", "ko"]).default("en"),
});
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export type Booking = {
  id: string;
  seats: number;
  amount: number;
  status: BookingStatus;
  createdAt: string;
  tour: TourCard;
  canReview: boolean;
};

export type CheckoutResponse = { checkoutUrl: string };
