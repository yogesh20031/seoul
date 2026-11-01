// Adds the finished-but-unrated demo tours to a live database without wiping anything, so the
// review flow can be tried with the demo traveller. Tours already present (same guide and title)
// are skipped, so it's safe to run twice.
import { logger } from "../src/lib/logger";
import { prisma } from "../src/lib/prisma";
import { guides, travellers } from "./seed-data/people";
import { unratedTours } from "./seed-data/tours";
import {
  placeLookup,
  recomputeRatings,
  seedTours,
  type People,
} from "./seed-lib";

const main = async () => {
  const users = await prisma.user.findMany({
    where: {
      email: { in: [...guides, ...travellers].map((person) => person.email) },
    },
    select: { id: true, email: true },
  });
  const idByEmail = new Map(users.map((u) => [u.email, u.id]));
  const idsFor = (people: { email: string }[]) =>
    people.map((person) => {
      const id = idByEmail.get(person.email);
      if (!id)
        throw new Error(`${person.email} is missing; run db:seed:guides first`);
      return { id };
    });
  const people: People = {
    guideUsers: idsFor(guides),
    travellerUsers: idsFor(travellers),
  };

  const existing = await prisma.tour.findMany({
    where: { title: { in: unratedTours.map((tour) => tour.title) } },
    select: { title: true, guideId: true },
  });
  const missing = unratedTours.filter(
    (tour) =>
      !existing.some(
        (row) =>
          row.title === tour.title &&
          row.guideId === people.guideUsers[tour.guide]?.id,
      ),
  );
  if (missing.length === 0) {
    logger.info("The unrated demo tours are already in the database.");
    return;
  }

  const requirePlace = await placeLookup();
  for (const tour of missing) tour.stops.forEach(requirePlace);
  await seedTours(missing, people, requirePlace, true);
  // Some seeded co-travellers did rate these tours, so the guides' scores need refreshing.
  await recomputeRatings(
    missing.flatMap((tour) => people.guideUsers[tour.guide]?.id ?? []),
  );
  logger.info(`Added ${missing.length} finished tours waiting for a rating.`);
};

main()
  .catch((err) => {
    logger.error({ err }, "unrated tour seed failed");
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
