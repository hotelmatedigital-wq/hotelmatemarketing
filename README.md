# HOTEL MATE — Marketing Panel

Next.js marketing panel for [Hotel Mate](https://www.hotelmate.co.uk/) — monitor social-media leads, manage the sales pipeline and track follow-ups.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · lucide icons
**Brand:** hotelmate.co.uk palette — primary `#00AEEF`, dark `#0C1E21`, neutral `#E5E5E5`

## Features

- 📊 **Dashboard** — KPIs, recent leads, leads by source, today's follow-ups
- 🎯 **Leads Management** — search + status/source filters, detail view with Call/WhatsApp/Send Form actions
- 📝 **Intake Form (`/intake`) & WhatsApp Flow** — shareable public form; leads save instantly to the panel with prefilled WhatsApp deep-links
- 📈 **Sales Pipeline** — kanban: Inquiry → Contacted → Negotiation → Won/Lost
- ⏰ **Follow-ups** — overdue / today / upcoming with done toggles
- ⚙️ **Settings** — Facebook Lead Ads, Hotel Mate PMS API, WhatsApp & Instagram integration cards
- Demo data baked in + file persistence for newly captured leads (`/api/leads`)

## Run

```bash
npm install
npm run dev    # http://localhost:3000
```

## Docs

Full plan, architecture & roadmap → [`docs/PROJECT_PLAN.md`](docs/PROJECT_PLAN.md)

---
Owner contact: **+94 78 860 7143**
