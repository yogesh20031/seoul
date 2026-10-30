// Runs a real Postgres from node_modules so local dev needs no Docker or Homebrew install.
// Data lives in apps/api/.pgdata; delete that folder to start fresh.
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";
import path from "node:path";
import { logger } from "../src/lib/logger";

const dataDir = path.resolve(import.meta.dirname, "../.pgdata");
const firstRun = !existsSync(dataDir);

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: "postgres",
  password: "postgres",
  port: 5433,
  persistent: true,
});

if (firstRun) await pg.initialise();
await pg.start();
if (firstRun) await pg.createDatabase("seoul");

logger.info(
  "Postgres running on postgresql://postgres:postgres@localhost:5433/seoul (Ctrl+C to stop)",
);

const stop = async () => {
  await pg.stop();
  process.exit(0);
};
process.on("SIGINT", () => void stop());
process.on("SIGTERM", () => void stop());
