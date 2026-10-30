import { z } from "zod";

export const LOCALES = ["en", "ko"] as const;
export const localeSchema = z.enum(LOCALES);
export type Locale = z.infer<typeof localeSchema>;

export const idSchema = z.string().min(1).max(64);

export const pageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
});

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

// Rough bounding box of Seoul plus a margin; anything outside is almost certainly a typo.
export const SEOUL_BOUNDS = {
  minLat: 37.4,
  maxLat: 37.72,
  minLng: 126.76,
  maxLng: 127.2,
} as const;

export const SEOUL_CENTER = { lat: 37.5665, lng: 126.978 } as const;

export const latSchema = z
  .number()
  .min(SEOUL_BOUNDS.minLat)
  .max(SEOUL_BOUNDS.maxLat);
export const lngSchema = z
  .number()
  .min(SEOUL_BOUNDS.minLng)
  .max(SEOUL_BOUNDS.maxLng);

export const coordsSchema = z.object({ lat: latSchema, lng: lngSchema });
export type Coords = z.infer<typeof coordsSchema>;

/** "HH:mm", 24-hour clock. */
export const timeOfDaySchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:mm");

export type ApiErrorBody = {
  error: { code: string; message: string; details?: unknown };
};
