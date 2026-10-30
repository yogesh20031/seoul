import type { Earning, GuideOverview } from "@seoul/shared";
import { notFound } from "../../lib/http-error";
import { tourInclude } from "../../lib/mappers";
import { prisma } from "../../lib/prisma";
import { seoulInstant, seoulToday } from "../../lib/time";
import { countToursLed } from "../../lib/trips";
import { soloInclude, toSoloRequest } from "../solo/service";
import { buildTourDetails } from "../tours/service";

const RECENT_EARNINGS = 20;

const seatLabel = (seats: number) =>
  `${seats} ${seats === 1 ? "seat" : "seats"}`;

export const getOverview = async (guideId: string): Promise<GuideOverview> => {
  const now = new Date();
  const profile = await prisma.guideProfile.findUnique({
    where: { userId: guideId },
  });
  if (!profile) throw notFound("Guide profile");

  const [
    tours,
    pending,
    accepted,
    totals,
    pendingTotals,
    recent,
    toursLed,
    bookingTravellers,
    soloTravellers,
  ] = await Promise.all([
    prisma.tour.findMany({
      where: {
        guideId,
        status: { in: ["OPEN", "FULL"] },
        startsAt: { gt: now },
      },
      include: tourInclude(now),
      orderBy: { startsAt: "asc" },
      take: 20,
    }),
    prisma.soloRequest.findMany({
      where: { guideId, status: "PENDING" },
      include: soloInclude,
      orderBy: { createdAt: "asc" },
    }),
    prisma.soloRequest.findMany({
      where: {
        guideId,
        status: { in: ["ACCEPTED", "PAID"] },
        date: { gte: seoulToday(now) },
      },
      include: soloInclude,
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    }),
    prisma.earning.aggregate({ where: { guideId }, _sum: { net: true } }),
    prisma.earning.aggregate({
      where: { guideId, status: "PENDING" },
      _sum: { net: true },
    }),
    prisma.earning.findMany({
      where: { guideId },
      orderBy: { createdAt: "desc" },
      take: RECENT_EARNINGS,
      include: {
        booking: { include: { tour: true } },
        soloRequest: { include: { traveller: true } },
      },
    }),
    countToursLed(guideId),
    prisma.booking.findMany({
      where: { status: "PAID", tour: { guideId } },
      distinct: ["travellerId"],
      select: { travellerId: true },
    }),
    prisma.soloRequest.findMany({
      where: { guideId, status: { in: ["PAID", "COMPLETED"] } },
      distinct: ["travellerId"],
      select: { travellerId: true },
    }),
  ]);

  const earnings: Earning[] = recent.map((e) => ({
    id: e.id,
    gross: e.gross,
    platformFee: e.platformFee,
    net: e.net,
    status: e.status,
    createdAt: e.createdAt.toISOString(),
    label: e.booking
      ? `Group tour · ${e.booking.tour.title} · ${seatLabel(e.booking.seats)}`
      : `Private tour · ${e.soloRequest?.traveller.name ?? "Traveller"}`,
  }));

  const travellers = new Set(
    [...bookingTravellers, ...soloTravellers].map((t) => t.travellerId),
  );

  return {
    upcomingTours: await buildTourDetails(tours, guideId),
    pendingRequests: pending.map(toSoloRequest),
    upcomingSolo: accepted
      .filter((s) => seoulInstant(s.date, s.startTime) > now)
      .map(toSoloRequest),
    earnings: {
      totalNet: totals._sum.net ?? 0,
      pendingNet: pendingTotals._sum.net ?? 0,
      recent: earnings,
    },
    stats: {
      ratingAvg: profile.ratingAvg,
      ratingCount: profile.ratingCount,
      toursLed,
      travellersHosted: travellers.size,
    },
  };
};
