import { env } from "./config/env";
import { createApp } from "./app";
import { logger } from "./lib/logger";
import { prisma } from "./lib/prisma";

const server = createApp().listen(env.PORT, () => {
  logger.info(
    `API listening on http://localhost:${env.PORT} (payments: ${env.PAYMENTS_MODE})`,
  );
});

const shutdown = () => {
  server.close(() => {
    void prisma.$disconnect().finally(() => process.exit(0));
  });
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
