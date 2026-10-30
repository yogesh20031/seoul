import { z } from "zod";
import { latSchema, lngSchema, timeOfDaySchema } from "./common";
import type { MemberPreview } from "./tour";

export const SOLO_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "DECLINED",
  "PAID",
  "COMPLETED",
  "CANCELLED",
] as const;
export type SoloStatus = (typeof SOLO_STATUSES)[number];

export const createSoloRequestSchema = z.object({
  date: z.iso.date(),
  startTime: timeOfDaySchema,
  note: z.string().trim().max(1000).default(""),
});
export type CreateSoloRequestInput = z.infer<typeof createSoloRequestSchema>;

export const acceptSoloRequestSchema = z.object({
  meetingName: z.string().trim().min(3).max(120),
  meetingLat: latSchema,
  meetingLng: lngSchema,
  startTime: timeOfDaySchema.optional(),
});
export type AcceptSoloRequestInput = z.infer<typeof acceptSoloRequestSchema>;

export const soloPaySchema = z.object({
  locale: z.enum(["en", "ko"]).default("en"),
});

export type SoloRequest = {
  id: string;
  date: string;
  startTime: string;
  durationMin: number;
  note: string;
  amount: number;
  status: SoloStatus;
  meetingName: string | null;
  meetingLat: number | null;
  meetingLng: number | null;
  createdAt: string;
  traveller: MemberPreview;
  guide: MemberPreview;
  canReview: boolean;
};
