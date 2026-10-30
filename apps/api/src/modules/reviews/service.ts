import { Prisma } from "@prisma/client";
import type { CreateReviewInput } from "@seoul/shared";
import {
  badRequest,
  conflict,
  forbidden,
  notFound,
} from "../../lib/http-error";
import { toReview } from "../../lib/mappers";
import { prisma } from "../../lib/prisma";
import { endsAt, seoulInstant } from "../../lib/time";

const MAX_REVIEWS = 100;

export const listReviews = async (guideId: string) => {
  const rows = await prisma.review.findMany({
    where: { guideId },
    include: { author: true },
    orderBy: { createdAt: "desc" },
    take: MAX_REVIEWS,
  });
  return rows.map(toReview);
};

/** Resolves which guide the trip belonged to and verifies the author actually took it and it's over. */
const verifyTrip = async (authorId: string, input: CreateReviewInput) => {
  const now = new Date();
  if (input.bookingId) {
    const booking = await prisma.booking.findUnique({
      where: { id: input.bookingId },
      include: { tour: true, review: true },
    });
    if (!booking) throw notFound("Booking");
    if (booking.travellerId !== authorId)
      throw forbidden("This isn't your booking");
    if (booking.status !== "PAID")
      throw conflict("Only paid bookings can be reviewed");
    if (endsAt(booking.tour.startsAt, booking.tour.durationMin) > now)
      throw conflict("You can review once the tour is over");
    if (booking.review) throw conflict("You've already reviewed this tour");
    return booking.tour.guideId;
  }
  if (!input.soloRequestId)
    throw badRequest("Review exactly one booking or solo trip");
  const solo = await prisma.soloRequest.findUnique({
    where: { id: input.soloRequestId },
    include: { review: true },
  });
  if (!solo) throw notFound("Solo request");
  if (solo.travellerId !== authorId) throw forbidden("This isn't your trip");
  if (solo.status !== "PAID" && solo.status !== "COMPLETED")
    throw conflict("Only paid trips can be reviewed");
  if (endsAt(seoulInstant(solo.date, solo.startTime), solo.durationMin) > now)
    throw conflict("You can review once the trip is over");
  if (solo.review) throw conflict("You've already reviewed this trip");
  return solo.guideId;
};

export const createReview = async (
  authorId: string,
  guideId: string,
  input: CreateReviewInput,
) => {
  const tripGuideId = await verifyTrip(authorId, input);
  if (tripGuideId !== guideId)
    throw badRequest("This trip was not with this guide");

  try {
    const review = await prisma.$transaction(async (tx) => {
      const created = await tx.review.create({
        data: {
          guideId,
          authorId,
          rating: input.rating,
          comment: input.comment,
          bookingId: input.bookingId,
          soloRequestId: input.soloRequestId,
        },
        include: { author: true },
      });
      const stats = await tx.review.aggregate({
        where: { guideId },
        _avg: { rating: true },
        _count: { _all: true },
      });
      await tx.guideProfile.update({
        where: { userId: guideId },
        data: {
          ratingAvg: Math.round((stats._avg.rating ?? 0) * 100) / 100,
          ratingCount: stats._count._all,
        },
      });
      return created;
    });
    return toReview(review);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw conflict("You've already reviewed this trip");
    }
    throw err;
  }
};
