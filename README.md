# HOTEL MATE — Marketing Panel

Next.js marketing panel for [Hotel Mate](https://www.hotelmate.co.uk/) — monitor social-media leads, manage the sales pipeline and track follow-ups.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma ORM 7 · PostgreSQL (Neon / Supabase / any Postgres) · lucide icons
**Brand:** hotelmate.co.uk palette — primary `#00AEEF`, dark `#0C1E21`, neutral `#E5E5E5`

## Features

- 📊 **Dashboard** — KPIs, recent leads, leads by source, today's follow-ups
- 🎯 **Leads Management** — search + status/source filters, detail view with Call/WhatsApp/Send Form actions
- 📝 **Intake Form (`/intake`) & WhatsApp Flow** — shareable public form; leads save instantly to the panel with prefilled WhatsApp deep-links
- 📈 **Sales Pipeline** — kanban: Inquiry → Contacted → Negotiation → Won/Lost
- ⏰ **Follow-ups** — overdue / today / upcoming with done toggles
- ⚙️ **Settings** — Facebook Lead Ads, Hotel Mate PMS API, WhatsApp & Instagram integration cards
- 🗄️ **Production database** — every generated lead & client assessment persists in PostgreSQL via Prisma (no demo data, no file storage)

## Production database (Vercel)

The panel starts **100% clean** — no sample leads, deals or follow-ups. Everything captured at runtime is saved to PostgreSQL, so it survives Vercel's ephemeral filesystem.

1. **Create a Postgres database** (any of these):
   - [Neon](https://neon.tech) — create a project, copy the connection string
   - [Supabase](https://supabase.com) — Project Settings → Database → **Session pooler** or direct connection string
   - [Railway](https://railway.app) / self-hosted Postgres — any standard `postgresql://` URL
2. **Add the environment variable** in Vercel → Project → Settings → Environment Variables:
   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require"
   ```
3. **Deploy.** The build runs `prisma generate && prisma migrate deploy` automatically — schema migrations apply on every deploy. Builds fail fast if `DATABASE_URL` is missing, so real leads are never silently dropped.

Schema lives in [`prisma/schema.prisma`](prisma/schema.prisma) · migrations in [`prisma/migrations/`](prisma/migrations/).

## Run

```bash
npm install
cp .env.example .env     # then set DATABASE_URL to your Postgres
npm run db:deploy        # apply schema migrations
npm run dev              # http://localhost:3000
```

Useful scripts:

| Script | Purpose |
| --- | --- |
| `npm run db:deploy` | Apply pending migrations (also runs in the Vercel build) |
| `npm run db:migrate` | Create a new migration from schema changes (local dev) |
| `npm run db:studio` | Browse the database in Prisma Studio |

## Docs

Full plan, architecture & roadmap → [`docs/PROJECT_PLAN.md`](docs/PROJECT_PLAN.md)

---
Owner contact: **+94 78 860 7143**
