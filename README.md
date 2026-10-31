# SeoulMate

A travel guide to Seoul (places, food, hotels, transport, a city map) plus a guide marketplace:
travellers join paid **group tours** with strangers or book a **private guide**, and solo travellers
can let the **day planner** order their stops. English/Korean, light/dark, glassy UI.

| Part              | Stack                                                 | Hosted on (free) |
| ----------------- | ----------------------------------------------------- | ---------------- |
| `apps/web`        | Next.js 16, React 19, Tailwind 4, next-intl, MapLibre | Vercel           |
| `apps/api`        | Express 5, Prisma 6, Zod, JWT, Stripe (test mode)     | Render           |
| `packages/shared` | Zod schemas and types used by both                    | (bundled)        |
| Database          | Postgres                                              | Neon             |

## Run locally

Needs Node 24+ and pnpm 12.

```sh
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
pnpm --filter @seoul/api db:dev      # embedded Postgres on :5433 (leave running)
pnpm --filter @seoul/api db:deploy   # apply migrations
pnpm --filter @seoul/api db:seed     # demo data
pnpm dev                             # api on :4000, web on :3000
```

Demo logins (password `password123`): guide `minji.kim@seoulguide.dev`, traveller `emma.wilson@example.com`.

Checks: `pnpm check-types && pnpm lint && pnpm test && pnpm build`.

## Deploy

Every variable is explained in [`apps/api/.env.example`](apps/api/.env.example) and
[`apps/web/.env.example`](apps/web/.env.example). Do the steps in this order, because each one
needs a URL from the one before.

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

## Photos

Real photos from Wikimedia Commons (CC0, public domain, CC BY, CC BY-SA), self-hosted in
`apps/web/public/photos`. Every one is credited next to it or on `/credits`.
