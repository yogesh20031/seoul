import { z } from "zod";
import { localeSchema } from "./common";
import type { Role } from "./auth";

export const updateMeSchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  bio: z.string().trim().max(500).optional(),
  country: z.string().trim().max(56).optional(),
  avatarUrl: z.url().max(500).nullable().optional(),
  locale: localeSchema.optional(),
});
export type UpdateMeInput = z.infer<typeof updateMeSchema>;

/** What other travellers and guides are allowed to see about someone. Never includes email. */
export type PublicUser = {
  id: string;
  name: string;
  avatarUrl: string | null;
  country: string | null;
  bio: string | null;
  role: Role;
  tripsCount: number;
  memberSince: string;
};
