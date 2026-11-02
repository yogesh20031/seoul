# Run the frontend locally against the live backend

This guide runs **only the website** (`apps/web`) on your computer. It uses the deployed API and
database, so you don't need Postgres, Stripe keys or any secrets.

```
Your computer                          Already deployed
┌────────────────────────┐            ┌──────────────────┐     ┌──────────────┐
│ Next.js website :3000  │ ─────────► │ API on Render    │ ──► │ Postgres DB  │
│ (apps/web)             │  API_URL   │ (apps/api)       │     │ (Neon)       │
└────────────────────────┘            └──────────────────┘     └──────────────┘
```

> **Live API URL:** `https://YOUR-API.onrender.com`
>
> Replace this one value with the real Render URL before sharing the guide. Every step below
> refers to it as **the live API URL**.

## 1. Install the tools

You need these three things. Check each one in a terminal.

| Tool    | Version     | Check           | Install                                |
| ------- | ----------- | --------------- | -------------------------------------- |
| Git     | any         | `git --version` | https://git-scm.com                    |
| Node.js | 24 or newer | `node -v`       | https://nodejs.org (pick the 24.x LTS) |
| pnpm    | 12.3.4      | `pnpm -v`       | `npm install -g pnpm@12.3.4`           |

## 2. Get the code

```sh
git clone https://github.com/sabhyatachhetri45-dev/seoul.git
cd seoul
```

## 3. Install dependencies

Run this from the project root, the `seoul` folder. It takes a few minutes the first time.

```sh
pnpm install
```

## 4. Point the website at the live API

Create the file `apps/web/.env.local` with this content. Put the live API URL in `API_URL`,
with no `/api/v1` and no trailing slash.

```sh
API_URL="https://YOUR-API.onrender.com"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

On macOS or Linux you can create it in one go:

```sh
cat > apps/web/.env.local <<'EOF'
API_URL="https://YOUR-API.onrender.com"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
EOF
```

Those are the only two settings the website reads. You don't need `apps/api/.env`.

## 5. Wake the API up

The API runs on Render's free plan and goes to sleep after 15 idle minutes. Open this in a
browser first and wait until it shows `{"ok":true}`. That can take up to a minute.

```
https://YOUR-API.onrender.com/health
```

## 6. Start the website

```sh
pnpm turbo run dev --filter=@seoul/web
```

This builds the shared package first and then starts only the website.

> Don't use `pnpm dev` here. It also starts the local API, which crashes without a local
> database and stops the website with it.

Wait for `Ready` in the terminal, then open http://localhost:3000.

## 7. Log in with a demo account

The password for both accounts is `password123`.

| Role      | Email                      |
| --------- | -------------------------- |
| Traveller | `emma.wilson@example.com`  |
| Guide     | `minji.kim@seoulguide.dev` |

## Things to know

- **It's real data.** Everything you do, like signing up, booking a tour or leaving a review,
  is saved in the live database and shows up on the deployed site too.
- **Payments use Stripe test mode.** Pay with card `4242 4242 4242 4242`, any future date and any CVC.
  No real money moves.
- **After paying, you land on the deployed site.** Stripe sends you back to the website address set
  on the server, not to localhost. The booking is still saved. Go back to http://localhost:3000 and
  open the dashboard to see it.
- **Maps and weather work without keys.** They come from OpenFreeMap and Open-Meteo.
- **Your browser never calls the API directly.** The Next.js server calls it, so there are no
  CORS settings to change.

## Troubleshooting

| What you see                                            | What to do                                                                                                                                |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| "Our server is waking up"                               | The API was asleep. Wait 30 to 60 seconds and refresh.                                                                                    |
| Pages show errors or no data                            | Open the `/health` URL from step 5. If it doesn't say `{"ok":true}`, the API is down. Check `API_URL` in `apps/web/.env.local` for typos. |
| `Cannot find module '@seoul/shared'`                    | Run `pnpm --filter @seoul/shared build`, then start again.                                                                                |
| `Port 3000 is in use`                                   | Stop the other app on port 3000, or run `pnpm --filter @seoul/web exec next dev --port 3001` and open http://localhost:3001.              |
| `pnpm install` complains about the Node or pnpm version | Install Node 24+ and pnpm 12.3.4, then delete `node_modules` and install again.                                                           |
| Changed `.env.local` but nothing happened               | Stop the dev server with Ctrl+C and start it again.                                                                                       |

## Prompt for an AI coding assistant

To let an assistant such as Claude Code do the setup, paste this prompt into it from inside an
empty folder. Replace the API URL first.

```text
Set up and run the frontend of this project on my machine. Use the already-deployed backend.
Do not set up a local database or the local API.

Repo: https://github.com/sabhyatachhetri45-dev/seoul.git
Live API URL: https://YOUR-API.onrender.com

Steps:
1. Check that Node.js is 24 or newer and pnpm is 12.3.4. If pnpm is missing or a different
   version, install it with `npm install -g pnpm@12.3.4`. If Node is too old, stop and tell me.
2. Clone the repo and cd into it.
3. Run `pnpm install` from the repo root.
4. Create apps/web/.env.local containing exactly:
     API_URL="<the live API URL, no trailing slash, no /api/v1>"
     NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   Do not create apps/api/.env.
5. Call <live API URL>/health. It may take up to 60 seconds because the free server sleeps.
   Continue only once it returns {"ok":true}. If it never does, stop and tell me.
6. Start only the website with `pnpm turbo run dev --filter=@seoul/web`.
   Do not use `pnpm dev`, because that also starts the local API, which needs a local database.
7. When the terminal shows "Ready", tell me to open http://localhost:3000. Tell me the demo logins:
   traveller emma.wilson@example.com and guide minji.kim@seoulguide.dev, password password123.

Rules: don't change any source code, don't commit anything, and don't run database commands
(db:dev, db:deploy, db:seed, db:reset). The database is live and shared.
```
