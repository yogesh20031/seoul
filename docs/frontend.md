# Frontend (apps/web) – the simple version

This is the website people see. It is a Next.js app. It never talks to the database itself.
It talks to the API (see [backend.md](backend.md)) and shows the result as pages.

```
Browser  ──►  Next.js (apps/web)  ──►  Express API (apps/api)  ──►  Postgres
             pages, forms, cookie      JSON over HTTP
```

## What it is built with

| Thing         | Used for                                                       |
| ------------- | -------------------------------------------------------------- |
| Next.js 16    | Pages, routing, Server Components, Server Actions              |
| React 19      | UI                                                             |
| Tailwind 4    | Styling (tokens live in `src/styles/tokens.css`)               |
| next-intl     | English / Korean text (`messages/en.json`, `messages/ko.json`) |
| next-themes   | Light / dark mode                                              |
| MapLibre      | The maps (loaded lazily, client only)                          |
| Zod           | Checking form input before it goes to the API                  |
| @seoul/shared | Types and Zod schemas shared with the API                      |

## Folder map

```
apps/web/src
├── app/[locale]/        one folder = one page. "[locale]" is "en" or "ko".
│   ├── page.tsx         landing page
│   ├── explore/         places, food, hotels, transport
│   ├── tours/           group tours list + detail
│   ├── guides/          guide list + profile
│   ├── planner/         day planner (+ shared plan at /planner/[token])
│   ├── dashboard/       traveller area (login needed)
│   ├── guide/           guide area (login as GUIDE needed)
│   ├── (auth)/          login, signup
│   └── checkout/        success / cancel pages after paying
├── app/api/weather/     the only API route in the web app (Seoul weather proxy)
├── actions/             Server Actions: the only place forms send data from
├── components/          UI, grouped by feature (tours/, guides/, map/, ui/ ...)
├── hooks/               custom React hooks
├── i18n/                next-intl setup (locales, Link, redirect)
├── lib/                 helpers: api.ts, session.ts, auth-guard.ts, form.ts ...
├── styles/              globals.css, tokens.css, glass.css
└── proxy.ts             runs before every request (locale + "has cookie?" check)
```

## The 5 ideas you need

### 1. Every URL starts with the language

`/en/tours`, `/ko/tours`. The `[locale]` folder handles this. Every page calls `enterLocale(params)`
first (in `src/lib/locale.ts`). It 404s unknown languages and tells next-intl which one to use.

Text comes from `messages/en.json` and `messages/ko.json`:

```tsx
// server component
const t = await getTranslations("Tours");
t("title");

// client component
const t = useTranslations("Tours");
```

Use `Link` from `@/i18n/navigation`, not from `next/link`, so the language stays in the URL.

### 2. Pages are Server Components and fetch from the API with `api()`

`src/lib/api.ts` is the one function that calls the backend. It runs on the server only.

```ts
const tours = await api<Paginated<TourCard>>("/tours", {
  query: { page: 1 },
  withAuth: false, // public data
  revalidate: 60, // cache for 60 s
});
```

- It prefixes `API_URL` + `/api/v1`.
- If the user is logged in, it adds the token as a `Bearer` header. The browser never sees the token.
- A failed request throws `ApiError` with `status` and `code`. A 404 is usually turned into `notFound()`.
- If the API is asleep (Render free plan), you get code `API_UNREACHABLE`.

### 3. Login is a cookie that holds the API token

- The API returns a JWT on login. `setSession()` in `src/lib/session.ts` puts it in an
  `httpOnly` cookie called `sm_token` (7 days).
- `getCurrentUser()` reads the cookie and asks the API `/auth/me`. It is cached per request,
  so the navbar and the page can both call it for free.
- `proxy.ts` only checks "is there a cookie?" for `/dashboard` and `/guide` and redirects to login if not.
- `requireRole("GUIDE", locale, "/guide")` in `src/lib/auth-guard.ts` does the real check on the page.
- The API checks again on every request, so the frontend check is just for a nice redirect.

### 4. Forms use Server Actions

All writes live in `src/actions/*.ts` (marked `"use server"`). The pattern is always the same:

```ts
export const bookTourAction = async (_prev: FormState, formData: FormData) => {
  if (!(await userWithRole("TRAVELLER"))) return { status: "error", message: "..." };  // 1. who is it
  const parsed = schema.safeParse({ ... });                                             // 2. validate (Zod)
  if (!parsed.success) return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error) };
  try {
    await api("/tours/.../bookings", { method: "POST", body: parsed.data });           // 3. call API
  } catch (error) {
    return apiFailure(error);                                                           // 4. show API error
  }
  revalidatePath(...) or redirect(...);                                                 // 5. refresh / move
};
```

The client side uses `useActionState(action, idleState)` and shows `FormState`
(`status`, `message`, `fieldErrors`, `values`). Helpers for reading `FormData` are in `src/lib/form.ts`.

### 5. Client components are leaves

Pages stay on the server. Only small interactive bits say `"use client"`:
forms, the map, toggles, pickers. Maps go through `src/components/map/lazy.tsx`
(`LazyPointMap`, `LazyRouteMap`...) because MapLibre is big and needs `window`.

## Styling

- Tailwind classes, ordered spacing → layout → text → colour → state.
- Colours and radii are CSS variables in `tokens.css`, exposed as Tailwind colours
  (`bg-card`, `text-text-secondary`, `bg-primary`...). Dark mode is `dark:` classes via next-themes.
- The "glass" look is in `glass.css`.
- Reusable bits are in `components/ui` (`Button`, `Card`, `Field`, `Input`, `Select`, `Badge`...).
  Use `cn()` from `src/lib/cn.ts` to merge classes.

## Env vars

| Name                   | What                                          |
| ---------------------- | --------------------------------------------- |
| `API_URL`              | Where the Express API is. Server-side only.   |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the site, for metadata / links. |

Copy `apps/web/.env.example` to `apps/web/.env.local` for local dev.

## Common tasks

**Add a page**

1. Create `src/app/[locale]/my-page/page.tsx`.
2. Call `await enterLocale(params)` first.
3. Fetch with `api()`; render with components from `components/ui`.
4. Add text to both `messages/en.json` and `messages/ko.json`.
5. If it needs login, call `requireRole(...)` and add the path to `PROTECTED` in `proxy.ts`.

**Add a form that writes data**

1. Add an action in `src/actions/<feature>.ts` following the 5-step pattern above.
2. Make a small `"use client"` component with `useActionState`.
3. Add or reuse a Zod schema in `packages/shared` so the API and the form agree.

**Call a new API endpoint**
Just `api<Type>("/path")`. The response type comes from `@seoul/shared`.

## Run and check

```sh
pnpm dev                              # web on :3000 (API must be running on :4000)
pnpm --filter @seoul/web check-types
pnpm --filter @seoul/web lint
pnpm --filter @seoul/web build
```

Deploys to Vercel from `apps/web` (see `apps/web/vercel.json` and the root README).
