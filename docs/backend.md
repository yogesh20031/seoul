# Backend (apps/api) – the simple version

This is the API. It is an Express server that reads and writes Postgres through Prisma and
answers JSON. The website (see [frontend.md](frontend.md)) is its only client.

```
Next.js (apps/web)  ──►  Express (apps/api)  ──►  Prisma  ──►  Postgres
                          /api/v1/...                            (Neon in prod,
                                                                  embedded locally)
                              │
                              └──►  Stripe (test mode) for payments
```

## What it is built with

| Thing                            | Used for                                  |
| -------------------------------- | ----------------------------------------- |
| Express 5                        | HTTP routes                               |
| Prisma 6                         | Database access and migrations            |
| Zod                              | Validating every input (body, query, env) |
| jsonwebtoken                     | Login tokens (JWT, 7 days)                |
| bcryptjs                         | Password hashing                          |
| Stripe                           | Checkout and refunds (test keys only)     |
| helmet, cors, express-rate-limit | Security basics                           |
| pino                             | Logging                                   |
| Vitest + supertest               | Tests against a real throwaway Postgres   |
| @seoul/shared                    | Zod schemas and types shared with the web |

## Folder map

```
apps/api
├── prisma/
│   ├── schema.prisma    the database tables
│   ├── migrations/      SQL history, made by `prisma migrate dev`
│   └── seed*.ts         demo data (guides, places, tours...)
├── scripts/dev-db.ts    starts a local Postgres from node_modules (no Docker)
└── src/
    ├── server.ts        starts listening
    ├── app.ts           builds the Express app: middleware + mounts every router
    ├── config/env.ts    reads and validates env vars (crashes early if wrong)
    ├── middleware/      auth.ts (who are you), validate.ts (parse), error-handler.ts
    ├── lib/             prisma client, jwt, stripe, http errors, geo maths, mappers
    ├── modules/<name>/  one folder per feature
    │   ├── router.ts    the URLs. Thin: parse input, call service, send JSON
    │   └── service.ts   the real logic and database calls
    └── __tests__/       one test file per module
```

## How one request flows

1. `app.ts` applies helmet, CORS (only the origins in `WEB_URL`), logging, JSON body parsing (100 kB max).
2. The router matches, e.g. `POST /api/v1/tours/:id/bookings`.
3. Middleware runs: `requireAuth` reads the `Authorization: Bearer <jwt>` header and sets `req.auth = { userId, role }`.
   `requireRole("TRAVELLER")` rejects the wrong role.
4. The router calls `parse(schema, req.body)`. Bad input throws a 400 with the Zod issues.
5. The service does the work with Prisma and returns a plain object.
6. The router sends it as JSON.
7. If anything throws, `error-handler.ts` turns it into the standard error shape.

Every error looks like this:

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Only 2 seats left",
    "details": null
  }
}
```

Codes: `BAD_REQUEST` 400, `UNAUTHORIZED` 401, `FORBIDDEN` 403, `NOT_FOUND` 404,
`CONFLICT` 409, `RATE_LIMITED` 429, `INTERNAL` 500. Throw them with the helpers in
`src/lib/http-error.ts` (`badRequest()`, `notFound()`, `conflict()`...).

## Auth in one paragraph

Register or login returns `{ token, user }`. The token is a JWT signed with `JWT_SECRET`,
valid 7 days, carrying the user id and role (`TRAVELLER` or `GUIDE`). The client sends it back
as `Authorization: Bearer <token>`. Auth routes are rate limited to 30 tries per 15 minutes per IP.

## All endpoints

Everything is under `/api/v1`. "Auth" says who may call it.

| Method | Path                             | Auth             | Does                                                               |
| ------ | -------------------------------- | ---------------- | ------------------------------------------------------------------ |
| GET    | `/health` (no prefix)            | -                | `{ ok: true }`                                                     |
| POST   | `/auth/register`                 | -                | create account, returns token                                      |
| POST   | `/auth/login`                    | -                | returns token                                                      |
| GET    | `/auth/me`                       | login            | current user                                                       |
| PATCH  | `/users/me`                      | login            | update name, bio, avatar...                                        |
| GET    | `/users/:id`                     | -                | public profile                                                     |
| GET    | `/places`                        | -                | list places (`category`, `district`, `tag`, `q`, paging)           |
| GET    | `/places/:slug`                  | -                | one place                                                          |
| GET    | `/districts`                     | -                | districts                                                          |
| GET    | `/dishes`, `/dishes/:slug`       | -                | food                                                               |
| GET    | `/transport`, `/transport/:slug` | -                | transport guides                                                   |
| GET    | `/guides`                        | -                | list guides (filters + paging)                                     |
| GET    | `/guides/top`                    | -                | top rated guides                                                   |
| GET    | `/guides/:id`                    | -                | guide profile                                                      |
| PUT    | `/guides/me`                     | GUIDE            | edit own guide profile                                             |
| GET    | `/guides/:id/reviews`            | -                | reviews of a guide                                                 |
| POST   | `/guides/:id/reviews`            | TRAVELLER        | leave a review (only after a paid, finished trip)                  |
| POST   | `/guides/:id/solo-requests`      | TRAVELLER        | ask a guide for a private day                                      |
| GET    | `/tours`                         | -                | list group tours (`q`, `from`, `to`, `guideId`, `placeId`, paging) |
| GET    | `/tours/:id`                     | optional         | tour detail; with a token you also see your booking                |
| POST   | `/tours`                         | GUIDE            | create a tour                                                      |
| PATCH  | `/tours/:id`                     | GUIDE (owner)    | edit a tour                                                        |
| POST   | `/tours/:id/cancel`              | GUIDE (owner)    | cancel a tour                                                      |
| POST   | `/tours/:id/bookings`            | TRAVELLER        | book seats, returns `{ checkoutUrl }`                              |
| GET    | `/me/bookings`                   | TRAVELLER        | my bookings                                                        |
| POST   | `/bookings/:id/cancel`           | login (owner)    | cancel or refund                                                   |
| GET    | `/me/solo-requests`              | login            | my private requests (as traveller or guide)                        |
| POST   | `/solo-requests/:id/accept`      | GUIDE            | accept, set meeting point                                          |
| POST   | `/solo-requests/:id/decline`     | GUIDE            | decline                                                            |
| POST   | `/solo-requests/:id/cancel`      | TRAVELLER        | cancel                                                             |
| POST   | `/solo-requests/:id/pay`         | TRAVELLER        | pay an accepted request, returns `{ checkoutUrl }`                 |
| POST   | `/itineraries/plan`              | -                | order stops and compute times (nothing saved)                      |
| POST   | `/itineraries`                   | login            | save a plan, returns a share token                                 |
| GET    | `/itineraries/mine`              | login            | my saved plans                                                     |
| GET    | `/itineraries/:shareToken`       | -                | a shared plan                                                      |
| POST   | `/payments/confirm`              | login            | after Stripe redirect: mark paid if Stripe says paid               |
| POST   | `/webhooks/stripe`               | Stripe signature | Stripe tells us a checkout finished or expired                     |
| GET    | `/guide/overview`                | GUIDE            | dashboard numbers for a guide                                      |

Input shapes for every POST/PATCH live in `packages/shared/src/schemas/*.ts`.

## The database (short)

Main tables in `prisma/schema.prisma`:

- **User** has a role, `TRAVELLER` or `GUIDE`. A guide also has a **GuideProfile** (price, languages, rating).
- **Place**, **Dish**, **TransportGuide** are the content. Text fields exist twice: `nameEn` and `nameKo`.
- **Tour** is a group tour run by a guide, with **TourStop**s and **Booking**s.
- **SoloRequest** is a private tour request from one traveller to one guide.
- **Review** points at a guide and at the booking or solo request it came from.
- **Itinerary** + **ItineraryStop** is a saved day plan, shared by `shareToken`.
- **Earning** is what the guide earns from a paid booking (platform keeps 15%, see `packages/shared/src/money.ts`).

Status flows:

```
Tour:        DRAFT → OPEN ⇄ FULL → COMPLETED        (or CANCELLED)
Booking:     PENDING_PAYMENT → PAID → REFUNDED       (or CANCELLED)
SoloRequest: PENDING → ACCEPTED → PAID → COMPLETED   (or DECLINED / CANCELLED)
```

## Payments, step by step

`PAYMENTS_MODE` is `mock` locally and `stripe` in production.

1. Traveller books. The service locks the tour row, checks the seats, creates a
   `PENDING_PAYMENT` booking with a 31-minute hold, and creates a Stripe Checkout session.
   It returns `checkoutUrl`. In mock mode the booking is marked paid at once and the URL is our own success page.
2. Traveller pays on Stripe and is sent back to `/checkout/success?session_id=...`.
3. Two things can mark it paid, whichever comes first:
   the Stripe **webhook** (`checkout.session.completed`) or the web's **`/payments/confirm`** call.
   `markBookingPaid` only flips `PENDING_PAYMENT → PAID`, so doing it twice is harmless.
4. On paid: an **Earning** row is created and the tour becomes `FULL` if no seats are left.
5. If the session expires, the webhook cancels the booking and the seats are free again.
   Unpaid bookings past `holdExpiresAt` do not count as taken either.
6. Cancel before paying: expire the Stripe session. Cancel after paying, more than 24 h before
   the tour: refund via Stripe and set `REFUNDED`.

The webhook route is mounted before `express.json()` because Stripe signs the raw body.

## Day planner

`POST /itineraries/plan` takes 2 to 10 place ids, a start time (default 09:00) and an optional start point.
`src/lib/geo.ts` orders the stops (nearest-neighbour from the start point, or the best of every starting stop when there is none), estimates each leg (walk or subway
by distance) and adds each place's `suggestedMinutes`. Nothing is stored unless the user saves.

## Env vars

| Name                    | What                                                                             |
| ----------------------- | -------------------------------------------------------------------------------- |
| `NODE_ENV`              | development, test or production                                                  |
| `PORT`                  | default 4000                                                                     |
| `DATABASE_URL`          | Postgres connection (Neon pooled URL in prod)                                    |
| `DIRECT_URL`            | Non-pooled URL, only for migrations                                              |
| `JWT_SECRET`            | 32+ random chars                                                                 |
| `WEB_URL`               | allowed browser origins, comma separated. First one is used for Stripe redirects |
| `PAYMENTS_MODE`         | `mock` or `stripe` (mock is refused in production)                               |
| `STRIPE_SECRET_KEY`     | must start with `sk_test_`                                                       |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` from the Stripe dashboard                                            |
| `SEED_FORCE`            | set to `1` only to seed a production database once                               |

`src/config/env.ts` checks all of this at startup and prints what is wrong.

## Common tasks

**Add an endpoint**

1. Add or extend a Zod schema in `packages/shared/src/schemas/`.
2. Write the logic in `src/modules/<feature>/service.ts`.
3. Add the route in `router.ts`: middleware → `parse()` → service → `res.json()`.
4. Add a test in `src/__tests__/<feature>.test.ts` using `api()` and `registerUser()` from `helpers.ts`.

**Change the database**

1. Edit `prisma/schema.prisma`.
2. `pnpm --filter @seoul/api db:migrate` (creates a migration and regenerates the client).
3. Update seed data if needed.

## Run and check

```sh
pnpm --filter @seoul/api db:dev      # local Postgres on :5433, keep it running
pnpm --filter @seoul/api db:deploy   # apply migrations
pnpm --filter @seoul/api db:seed     # demo data (password: password123)
pnpm --filter @seoul/api dev         # API on :4000

pnpm --filter @seoul/api test        # spins up its own Postgres on :5434
pnpm --filter @seoul/api check-types
pnpm --filter @seoul/api lint
```

Deploys to Render from `render.yaml`. The build runs migrations, so a push to `main` that
touches `apps/api` or `packages/shared` migrates and redeploys.
