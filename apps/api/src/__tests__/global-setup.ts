import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";
import EmbeddedPostgres from "embedded-postgres";

const PORT = 5434;
const DB_NAME = "seoul_test";
const dataDir = path.resolve(import.meta.dirname, "../../.pgdata-test");

let pg: EmbeddedPostgres | null = null;

export const setup = async () => {
  rmSync(dataDir, { recursive: true, force: true });
  pg = new EmbeddedPostgres({
    databaseDir: dataDir,
    user: "postgres",
    password: "postgres",
    port: PORT,
    persistent: false,
  });
  await pg.initialise();
  await pg.start();
  await pg.createDatabase(DB_NAME);

  const url = `postgresql://postgres:postgres@localhost:${PORT}/${DB_NAME}`;
  execSync("npx prisma migrate deploy", {
    cwd: path.resolve(import.meta.dirname, "../.."),
    env: { ...process.env, DATABASE_URL: url, DIRECT_URL: url },
    stdio: "pipe",
  });
};

export const teardown = async () => {
  await pg?.stop();
  rmSync(dataDir, { recursive: true, force: true });
};
