import { PrismaClient } from "@prisma/client";

declare global {
  // Reuse one client across tsx watch reloads so dev doesn't run out of connections.
  var prismaClient: PrismaClient | undefined;
}

export const prisma = globalThis.prismaClient ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prismaClient = prisma;
