// Adds seed guides (and their tours and reviews) that aren't in the database yet, without wiping
// anything. Safe on a live database with real users, unlike seed.ts. Run it again after appending
// guides to seed-data/people.ts; guides that already exist are left untouched.
import { hashPassword } from "../src/lib/password";
import { logger } from "../src/lib/logger";
import { prisma } from "../src/lib/prisma";
import { guides, travellers } from "./seed-data/people";
import { pastTours, upcomingTours } from "./seed-data/tours";
import {
  PASSWORD,
  createGuideUser,
  createTravellerUser,
  placeLookup,
  recomputeRatings,
  seedTours,
  type People,
} from "./seed-lib";

const main = async () => {
  const existing = await prisma.user.findMany({
    where: {
      email: { in: [...guides, ...travellers].map((person) => person.email) },
    },
    select: { id: true, email: true },
  });
  const idByEmail = new Map(existing.map((u) => [u.email, u.id]));
  const passwordHash = await hashPassword(PASSWORD);

  const newGuides = guides.flatMap((g, index) =>
    idByEmail.has(g.email) ? [] : [index],
  );
  if (newGuides.length === 0) {
    logger.info("Every seed guide is already in the database; nothing to add.");
    return;
  }
  const newGuideIndexes = new Set(newGuides);
  const forNewGuides = (tour: { guide: number }) =>
    newGuideIndexes.has(tour.guide);
  const newPast = pastTours.filter(forNewGuides);
  const newUpcoming = upcomingTours.filter(forNewGuides);
  // Check every stop before writing, so a typo in a slug can't leave guides without their tours.
  const requirePlace = await placeLookup();
  for (const tour of [...newPast, ...newUpcoming])
    tour.stops.forEach(requirePlace);

  const guideUsers: People["guideUsers"] = [];
  for (const g of guides) {
    const id = idByEmail.get(g.email);
    if (id) {
      guideUsers.push({ id });
      continue;
    }
    guideUsers.push(await createGuideUser(g, passwordHash));
  }

  // New guides' tours are booked by the seed travellers, so make sure they exist too.
  const travellerUsers: People["travellerUsers"] = [];
  for (const t of travellers) {
    const id = idByEmail.get(t.email);
    travellerUsers.push(
      id ? { id } : await createTravellerUser(t, passwordHash),
    );
  }

  const people = { guideUsers, travellerUsers };
  await seedTours(newPast, people, requirePlace, true);
  await seedTours(newUpcoming, people, requirePlace, false);
  await recomputeRatings(
    [...newGuideIndexes].flatMap((index) => guideUsers[index]?.id ?? []),
  );

  logger.info(
    `Added ${newGuideIndexes.size} guides: ${[...newGuideIndexes]
      .map((index) => guides[index]?.name)
      .join(", ")}.`,
  );
};

main()
  .catch((err) => {
    logger.error({ err }, "guide seed failed");
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
