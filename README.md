# HOTEL MATE — Marketing Panel

Next.js marketing panel for [Hotel Mate](https://www.hotelmate.co.uk/): capture genuine inquiries, complete property assessments and manage the sales pipeline.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase PostgreSQL · `postgres.js`

## Features

- **Dashboard** — metrics, recent records and source/status breakdowns derived from real leads
- **Lead management** — manually add, search, filter, update and delete genuine inquiries
- **Client intake (`/intake`)** — shareable assessment form with package recommendations and demo scheduling
- **Sales pipeline** — persisted statuses shown from inquiry through won/lost
- **WhatsApp flow** — personalized assessment links and pre-filled outreach messages
- **No bundled demo records** — a new database starts empty

## Prerequisites

- Node.js 22
- A [Supabase](https://supabase.com/) project
- A [Vercel](https://vercel.com/) project for deployment

## Supabase setup

1. Create a Supabase project.
2. In the Supabase dashboard, open **Connect** and copy the **Transaction pooler** PostgreSQL URI. Transaction pooling is appropriate for Vercel serverless functions.
3. Keep that URI secret. Never use a `NEXT_PUBLIC_` variable for it and never commit it.
4. Either:
   - let Hotel Mate create the idempotent schema on its first runtime query; or
   - run [`supabase/migrations/202609220001_create_leads.sql`](supabase/migrations/202609220001_create_leads.sql) in the Supabase SQL Editor before deployment.

The migration creates an empty `leads` table, indexes and a PostgreSQL sequence. It does **not** insert samples. The sequence assigns concurrency-safe public IDs beginning with `L-1001`.

### Local environment

Copy the template and insert the pooler URI locally:

```bash
cp .env.example .env.local
```

```dotenv
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@YOUR_POOLER_HOST:6543/postgres?sslmode=require"
```

If a password is inserted into a URI manually, percent-encode URI-reserved characters. The URI supplied by Supabase is preferred.

Then run:

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. If `DATABASE_URL` is missing, the panel shows setup guidance rather than silently writing temporary files.

## Vercel deployment

1. Import this GitHub repository into Vercel and keep the detected **Next.js** framework preset.
2. In **Project Settings → Environment Variables**, add `DATABASE_URL` with the Supabase transaction-pooler URI.
3. Enable it for **Production**, **Preview** and **Development** as needed.
4. Deploy or redeploy after adding the variable.

The PostgreSQL client is initialized lazily. `next build` does not connect to Supabase, so Vercel can compile the application before runtime secrets or database connectivity are available. Prepared statements are disabled for transaction-pooler compatibility.

> GitHub Pages is not a supported target. This application needs Next.js server rendering and API route handlers; deploy it to Vercel.

## Persistence architecture

- `lib/db.ts` — server-only lazy PostgreSQL client and idempotent schema initialization
- `lib/store.ts` — SQL repository for create, list, lookup, update, delete and assessment submission
- `supabase/migrations/` — versioned SQL schema
- `DATABASE_URL` — server-only connection secret

Lead and assessment data is durable across restarts, deployments and Vercel serverless instances because Supabase—not the application filesystem—is the source of truth.

## Quality checks

```bash
npm run lint       # ESLint + Next.js/React rules
npm run typecheck  # TypeScript without emitting files
npm test           # Node test suite
npm run build      # Optimized production build
npm run check      # Lint, type-check, tests and build
npm audit          # Dependency vulnerability report
```

GitHub Actions runs `npm run check` on pushes and pull requests. A live SQL lifecycle test additionally requires a securely configured Supabase `DATABASE_URL`.

## Security note

The database secret is server-only and Supabase Row Level Security is enabled on the table. The application does not yet include operator authentication; add an authentication and authorization layer before exposing the marketing panel or mutation APIs on a public production domain.

## Documentation

Architecture and product flow: [`docs/PROJECT_PLAN.md`](docs/PROJECT_PLAN.md)

---

Owner contact: **+94 78 860 7143**
