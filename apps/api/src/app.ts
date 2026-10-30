import express, { type Router } from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { rateLimit } from "express-rate-limit";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { errorHandler } from "./middleware/error-handler";
import { notFound } from "./lib/http-error";
import { authRouter } from "./modules/auth/router";
import { usersRouter } from "./modules/users/router";
import { placesRouter } from "./modules/places/router";
import { guidesRouter } from "./modules/guides/router";
import { toursRouter } from "./modules/tours/router";
import { bookingsRouter } from "./modules/bookings/router";
import { soloRouter } from "./modules/solo/router";
import { reviewsRouter } from "./modules/reviews/router";
import { itinerariesRouter } from "./modules/itineraries/router";
import {
  paymentsRouter,
  stripeWebhookHandler,
} from "./modules/payments/router";
import { dashboardRouter } from "./modules/dashboard/router";

export const createApp = () => {
  const app = express();
  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(helmet());
  app.use(cors({ origin: env.webOrigins, credentials: false }));
  if (env.NODE_ENV === "test") {
    // Skip request logging in tests but keep req.log, which the error handler uses.
    app.use((req, _res, next) => {
      req.log = logger;
      next();
    });
  } else {
    app.use(pinoHttp({ logger }));
  }

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  // Stripe signs the raw bytes, so the webhook must see the body before express.json() parses it.
  app.post(
    "/api/v1/webhooks/stripe",
    express.raw({ type: "application/json" }),
    stripeWebhookHandler,
  );

  app.use(express.json({ limit: "100kb" }));

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: env.NODE_ENV === "test" ? 1000 : 30,
    // Same JSON shape as every other API error; the default plain-text reply can't be read by the web client.
    handler: (_req, res) => {
      res.status(429).json({
        error: {
          code: "RATE_LIMITED",
          message:
            "Too many attempts. Please wait a few minutes and try again.",
        },
      });
    },
  });

  const routers: [string, Router][] = [
    ["/auth", authRouter],
    ["/users", usersRouter],
    ["/", placesRouter],
    ["/guides", guidesRouter],
    ["/tours", toursRouter],
    ["/", bookingsRouter],
    ["/", soloRouter],
    ["/", reviewsRouter],
    ["/itineraries", itinerariesRouter],
    ["/payments", paymentsRouter],
    ["/guide", dashboardRouter],
  ];
  app.use("/api/v1/auth", authLimiter);
  for (const [path, router] of routers)
    app.use(`/api/v1${path === "/" ? "" : path}`, router);

  app.use(() => {
    throw notFound("Route");
  });
  app.use(errorHandler);

  return app;
};
