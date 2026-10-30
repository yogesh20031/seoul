import { pino } from "pino";

const isDev = process.env.NODE_ENV !== "production";

export const logger = pino({
  level: process.env.NODE_ENV === "test" ? "silent" : "info",
  ...(isDev && process.env.NODE_ENV !== "test"
    ? { transport: { target: "pino-pretty" } }
    : {}),
});
