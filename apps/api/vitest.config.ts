import { defineConfig } from "vitest/config";

const TEST_DB_URL = "postgresql://postgres:postgres@localhost:5434/seoul_test";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    globalSetup: ["./src/__tests__/global-setup.ts"],
    // Every file shares one database, so files must not overlap.
    fileParallelism: false,
    hookTimeout: 60_000,
    testTimeout: 30_000,
    env: {
      NODE_ENV: "test",
      JWT_SECRET: "test-secret-that-is-at-least-32-characters-long",
      PAYMENTS_MODE: "mock",
      WEB_URL: "http://localhost:3000",
      DATABASE_URL: TEST_DB_URL,
      DIRECT_URL: TEST_DB_URL,
    },
  },
});
