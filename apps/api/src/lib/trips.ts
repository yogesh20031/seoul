import type { Role } from "@prisma/client";
import { prisma } from "./prisma";

type Subject = { id: string; role: Role };

/** Trips a user has taken (travellers) or led (guides), batched so lists don't fan out into N queries. */
export const tripsCounts = async (users: Subject[]) => {
  const counts = new Map<string, number>();
  const travellerIds = [
    ...new Set(users.filter((u) => u.role === "TRAVELLER").map((u) => u.id)),
  ];
  const guideIds = [
    ...new Set(users.filter((u) => u.role === "GUIDE").map((u) => u.id)),
  ];

  if (travellerIds.length > 0) {
    const [bookings, solos] = await Promise.all([
      prisma.booking.groupBy({
        by: ["travellerId"],
        where: { travellerId: { in: travellerIds }, status: "PAID" },
        _count: { _all: true },
      }),
      prisma.soloRequest.groupBy({
        by: ["travellerId"],
        where: {
          travellerId: { in: travellerIds },
          status: { in: ["PAID", "COMPLETED"] },
        },
        _count: { _all: true },
      }),
    ]);
    for (const row of bookings)
      counts.set(
        row.travellerId,
        (counts.get(row.travellerId) ?? 0) + row._count._all,
      );
    for (const row of solos)
      counts.set(
        row.travellerId,
        (counts.get(row.travellerId) ?? 0) + row._count._all,
      );
  }

  if (guideIds.length > 0) {
    const tours = await prisma.tour.groupBy({
      by: ["guideId"],
      where: {
        guideId: { in: guideIds },
        status: { notIn: ["CANCELLED", "DRAFT"] },
        startsAt: { lt: new Date() },
      },
      _count: { _all: true },
    });
    for (const row of tours) counts.set(row.guideId, row._count._all);
  }

  return counts;
};

export const countToursLed = (guideId: string) =>
  prisma.tour.count({
    where: {
      guideId,
      status: { notIn: ["CANCELLED", "DRAFT"] },
      startsAt: { lt: new Date() },
    },
  });
