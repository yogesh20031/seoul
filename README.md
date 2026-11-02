# SeoulMate

SeoulMate is a travel guide to Seoul with a built-in guide marketplace.

- **Explore Seoul.** Places, food, hotels, transport guides and a city map, in English and Korean.
- **Join a group tour.** Guides publish tours with a date, meeting point and seats. Travellers book seats and pay.
- **Book a private guide.** A traveller sends a request, the guide accepts it with a meeting point, then the traveller pays.
- **Plan a day.** Pick places and the day planner orders the stops, estimates walk or subway time and gives a shareable link.
- **Rate the trip.** After a paid trip ends, the traveller can review the guide.

It has light and dark mode, a glassy UI, and weather for your travel date.

## Tech stack

| Part              | Stack                                                 | Hosted on (free) |
| ----------------- | ----------------------------------------------------- | ---------------- |
| `apps/web`        | Next.js 16, React 19, Tailwind 4, next-intl, MapLibre | Vercel           |
| `apps/api`        | Express 5, Prisma 6, Zod, JWT, Stripe (test mode)     | Render           |
| `packages/shared` | Zod schemas and types used by both apps               | (bundled)        |
| Database          | Postgres                                              | Neon             |

Outside services that need no key: map tiles from [OpenFreeMap](https://openfreemap.org) and
weather from [Open-Meteo](https://open-meteo.com).

## How it fits together

```
Browser ──► Next.js web (:3000) ──► Express API (:4000) ──► Postgres (:5433 locally)
                                            │
                                            └──► Stripe (test mode, optional locally)
```

The browser only talks to the web app. The web app calls the API from the server and keeps the
login token in an httpOnly cookie. The API owns the database, auth and payments.

Plain-language deep dives: [frontend docs](docs/frontend.md) and [backend docs](docs/backend.md).

## Project structure

```
.
├── apps/
│   ├── web/              Next.js website (pages, forms, maps, translations)
│   │   ├── src/app/      routes, one folder per page under [locale]/
│   │   ├── src/actions/  Server Actions (all form submissions)
│   │   ├── src/components/
│   │   ├── messages/     en.json and ko.json text
│   │   └── public/photos self-hosted, credited photos
│   └── api/              Express API
│       ├── src/modules/  one folder per feature (router.ts + service.ts)
│       ├── prisma/       schema, migrations and seed data
│       └── scripts/      dev-db.ts starts a local Postgres
├── packages/shared/      Zod schemas and types shared by web and api
├── docs/                 frontend.md and backend.md
├── render.yaml           Render blueprint for the API
└── turbo.json            Turborepo task setup
```

## Run it locally

### What you need

- **Node.js 24 or newer.** Check with `node -v`.
- **pnpm 12.** Install with `npm install -g pnpm@12.3.4`, or run `corepack enable`.
- Nothing else. No Docker and no Postgres install. The API ships an embedded Postgres for local dev.

### Step by step

1. **Install dependencies** from the repo root.

   ```sh
   pnpm install
   ```

2. **Create your env files.** The defaults work as-is for local dev.

   ```sh
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env.local
   ```

3. **Start the database** in its own terminal and leave it running.
   It runs Postgres on port 5433 and keeps the data in `apps/api/.pgdata`.

   ```sh
   pnpm --filter @seoul/api db:dev
   ```

4. **Create the tables and demo data** in a second terminal.

   ```sh
   pnpm --filter @seoul/api db:deploy   # apply migrations
   pnpm --filter @seoul/api db:seed     # wipe and load demo data
   ```

5. **Start the apps.**

   ```sh
   pnpm dev
   ```

6. **Open** http://localhost:3000. The API answers at http://localhost:4000/health.

### Demo accounts

Every seeded account uses the password `password123`.

| Role      | Email                      |
| --------- | -------------------------- |
| Traveller | `emma.wilson@example.com`  |
| Guide     | `minji.kim@seoulguide.dev` |

The login page shows these too.

### Payments locally

`PAYMENTS_MODE="mock"` is the default. Bookings are marked paid at once and you land on the success
page, so you need no Stripe account. To try real Stripe test checkout locally, set
`PAYMENTS_MODE="stripe"`, add your `sk_test_` key, and forward webhooks with the Stripe CLI:

```sh
stripe listen --forward-to localhost:4000/api/v1/webhooks/stripe
```

Copy the `whsec_` secret it prints into `STRIPE_WEBHOOK_SECRET`. Pay with test card
`4242 4242 4242 4242`, any future date, any CVC.

## Environment variables

Every variable is listed with where it is read in [`apps/api/.env.example`](apps/api/.env.example)
and [`apps/web/.env.example`](apps/web/.env.example). In short:

| App | Variable                                                      | Needed for                   |
| --- | ------------------------------------------------------------- | ---------------------------- |
| api | `DATABASE_URL`, `DIRECT_URL`                                  | Postgres                     |
| api | `JWT_SECRET`                                                  | login tokens (32+ chars)     |
| api | `WEB_URL`                                                     | CORS and Stripe return links |
| api | `PAYMENTS_MODE`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | payments                     |
| api | `NODE_ENV`, `PORT`, `SEED_FORCE`                              | runtime and seeding          |
| web | `API_URL`                                                     | where the API is             |
| web | `NEXT_PUBLIC_SITE_URL`                                        | metadata and share links     |

## Scripts

Run from the repo root. Turborepo runs each one in every app that has it.

| Command            | Does                                       |
| ------------------ | ------------------------------------------ |
| `pnpm dev`         | API on :4000 and web on :3000, with reload |
| `pnpm build`       | production build of everything             |
| `pnpm check-types` | TypeScript check                           |
| `pnpm lint`        | ESLint                                     |
| `pnpm test`        | API tests                                  |
| `pnpm format`      | Prettier on the whole repo                 |

API-only database scripts, run with `pnpm --filter @seoul/api <script>`:

| Script            | Does                                                         |
| ----------------- | ------------------------------------------------------------ |
| `db:dev`          | start the local embedded Postgres on :5433                   |
| `db:deploy`       | apply migrations                                             |
| `db:migrate`      | create a new migration after editing `schema.prisma`         |
| `db:seed`         | wipe everything and load demo data                           |
| `db:seed:guides`  | add new demo guides without wiping (safe on a live database) |
| `db:seed:unrated` | add finished, unrated demo tours without wiping              |
| `db:reset`        | drop and recreate the database, then seed                    |

## Tests

```sh
pnpm test
```

The API tests start their own throwaway Postgres on port 5434 and run against the real Express app,
so the dev database is never touched. Before pushing, run the full check:

```sh
pnpm check-types && pnpm lint && pnpm test && pnpm build
```

## Deploy

Do the steps in this order, because each one needs a URL from the one before.

### 1. Database: Neon

1. Sign up at [neon.tech](https://neon.tech) and create a project in **AWS US East 2 (Ohio)**, the same
   region as the Render service in `render.yaml`. If you pick another region, change `region:` there to match.
2. **Connect** → copy the **pooled** connection string (`DATABASE_URL`) and, with "Connection pooling"
   off, the **direct** one (`DIRECT_URL`).

### 2. Payments: Stripe (test mode)

1. Sign up at [stripe.com](https://stripe.com) and keep **Test mode** on.
2. **Developers → API keys** → copy the secret key (`sk_test_…`, this is `STRIPE_SECRET_KEY`).
   The webhook secret comes in step 5.

### 3. API: Render

1. Sign up at [render.com](https://render.com) with GitHub.
2. **New → Blueprint** → pick this repo. Render reads [`render.yaml`](render.yaml).
3. Fill in the values it asks for:
   - `DATABASE_URL`, `DIRECT_URL` from Neon
   - `STRIPE_SECRET_KEY` from Stripe
   - `WEB_URL`: put `http://localhost:3000` for now (fixed in step 5)
   - `STRIPE_WEBHOOK_SECRET`: put `pending` for now
4. Deploy. When it's live, open `https://<service>.onrender.com/health`: it should say `{"ok":true}`.
5. Seed the demo data once (Render → service → **Shell**):
   `SEED_FORCE=1 pnpm --filter @seoul/api db:seed`

The free plan sleeps after 15 idle minutes; the first request afterwards takes 30 to 60 seconds.

### 4. Web: Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → import this repo.
2. **Root Directory**: `apps/web` (Vercel picks up [`apps/web/vercel.json`](apps/web/vercel.json)).
3. Environment variables: `API_URL` = the Render URL, `NEXT_PUBLIC_SITE_URL` = the Vercel URL
   (deploy once to learn it, set it, then redeploy).

### 5. Connect them

1. Render → `WEB_URL` = the Vercel URL.
2. Stripe → **Developers → Webhooks → Add endpoint**:
   `https://<service>.onrender.com/api/v1/webhooks/stripe`, event `checkout.session.completed`.
   Copy its signing secret (`whsec_…`) into Render's `STRIPE_WEBHOOK_SECRET`.
3. Pay with test card `4242 4242 4242 4242`, any future date, any CVC.

## Troubleshooting

- **"Invalid environment" when the API starts.** A variable in `apps/api/.env` is missing or wrong.
  The message names it. `JWT_SECRET` must be at least 32 characters.
- **API can't reach the database.** The `db:dev` terminal must be running. Port 5433 must be free.
- **Want a clean local database.** Stop `db:dev`, delete `apps/api/.pgdata`, start it again,
  then run `db:deploy` and `db:seed`.
- **"Our server is waking up" on the live site.** The free Render API was asleep. Wait a few seconds and retry.
- **Seed refuses to run in production.** That is on purpose, because it wipes data. Use `SEED_FORCE=1` once.

## Photos

Real photos from Wikimedia Commons (CC0, public domain, CC BY, CC BY-SA), self-hosted in
`apps/web/public/photos`. Every one is credited next to it or on `/credits`.
