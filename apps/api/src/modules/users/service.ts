import type { UpdateMeInput } from "@seoul/shared";
import { notFound } from "../../lib/http-error";
import { toAuthUser, toPublicUser } from "../../lib/mappers";
import { prisma } from "../../lib/prisma";
import { tripsCounts } from "../../lib/trips";

export const getPublicUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw notFound("User");
  const counts = await tripsCounts([user]);
  return toPublicUser(user, counts.get(user.id) ?? 0);
};

export const updateMe = async (userId: string, input: UpdateMeInput) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: input.name,
      locale: input.locale,
      avatarUrl: input.avatarUrl,
      // Clearing a field in the UI sends "", which we store as null.
      bio: input.bio === undefined ? undefined : input.bio || null,
      country: input.country === undefined ? undefined : input.country || null,
    },
  });
  return toAuthUser(user);
};
