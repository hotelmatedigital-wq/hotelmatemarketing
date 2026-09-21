# HOTEL MATE — Marketing Panel (Project Plan & Step 1 Report)

> **Next.js marketing panel for Hotel Mate** — monitor social media leads, manage sales (client closing) and follow-ups.
> සමාජ මාධ්‍ය වලින් එන Leads බලාගැනීම, විකිණීම (Sales/Closing) සහ Follow-ups කළමනාකරණය සඳහා වූ පැනල් එක.

---

## 1. Project Scan (ව්‍යාපෘතික ස්කෑන් එක)

| අංගය | සොයාගත් දේ |
|---|---|
| Repository | `hotelmatedigital-wq/hotelmatemarketing` — empty (README only). Built from scratch. |
| Reference site | [hotelmate.co.uk](https://www.hotelmate.co.uk/) — scanned for UI direction |
| Brand colors (extracted) | **Primary `#00AEEF`** (Cerulean) · **Dark `#0C1E21`** (Firefly) · **Neutral `#E5E5E5`** (Mercury) |
| Framework | Next.js 16 (App Router, TypeScript, Tailwind CSS v4) — same stack family as the Hotel Mate system |
| Owner contact | **+94 78 860 7143** (wired into sidebar, footer & settings) |

**Panel එකේ අරමුණ:** Facebook Lead Forms / Instagram / WhatsApp හරහා එන leads ටික මේකෙන්ම manage කරන එක — Hotel Mate PMS එකට සම්බන්ධ වෙලා, demo → management දක්වා ගෙනියන එක.

---

## 2. What's Built in Step 1 & Lead Capture Flow (දැන් හදලා තියෙන දේවල්)

✅ **Dashboard** — KPI cards (new leads, follow-ups today, active deals, won revenue), recent leads, leads-by-source chart, today's follow-ups.
✅ **Leads Management** — full table with **search + status filter + source filter**; lead detail page with contact actions (Call / WhatsApp / Send Form), conversion progress stepper, follow-ups & activity timeline.
✅ **Direct Lead Capture & WhatsApp Flow (අලුතින් එක් කළ flow එක)**:
  - **Public Intake Form (`/intake`)**: Clean mobile-friendly form to send to leads over WhatsApp. Collects name, phone, email, hotel name, location, requirements & notes.
  - **Leads API (`/api/leads`)**: POST to capture leads, GET to fetch them. Persists safely into local storage until PMS database connection is made in Step 3.
  - **"Add Lead" Manual Entry**: Quick modal in the panel to enter any incoming lead (name, phone, email, source).
  - **"Send Form via WhatsApp" Action**: One-click deep link (`wa.me`) that sends the prefilled message + `/intake` form link to the lead's WhatsApp number.
  - **"Copy Intake Link"**: Easy button to copy the form URL for social media bios or quick chats.
✅ **Sales Pipeline** — kanban board: *New Inquiry → Contacted → Negotiation → Won / Lost*, with deal values (LKR/mo) and owners.
✅ **Follow-ups** — grouped *Overdue / Today / Upcoming*, one-click done toggle, typed actions (call, WhatsApp, email, meeting, SMS).
✅ **Settings & Integrations** — connection cards for **Facebook Lead Ads**, **Hotel Mate PMS API**, WhatsApp Business, Instagram + sales team + owner contact.
✅ **Demo data layer** — realistic Sri Lankan sample data generated in `lib/data.ts` + dynamic captures merged seamlessly.

### UI / Design
- Colors match hotelmate.co.uk: cyan-blue primary (`#00AEEF`), dark petrol sidebar (`#0C1E21`), light neutral backgrounds.
- Clean card layout, rounded corners, soft shadows — consistent with the Hotel Mate brand feel.
- Fully responsive (mobile sidebar drawer, scrollable tables, responsive grids).

---

## 3. Architecture (ගොඩනැගිල්ල)

```
hotelmatemarketing/
├── app/
│   ├── layout.tsx          # Root layout + panel shell
│   ├── page.tsx            # Dashboard
│   ├── leads/
│   │   ├── page.tsx        # Leads list (search + filters)
│   │   └── [id]/page.tsx   # Lead detail (contact, pipeline, activity)
│   ├── sales/page.tsx      # Sales pipeline board
│   ├── followups/page.tsx  # Follow-up manager
│   └── settings/page.tsx   # Integrations & team
├── components/
│   ├── AppShell.tsx / Sidebar.tsx / Topbar.tsx
│   ├── ui.tsx              # Card, StatCard, badges, page header
│   └── brand-icons.tsx     # Facebook / Instagram / WhatsApp SVGs
├── lib/
│   ├── types.ts            # Data model (Lead, Deal, FollowUp…)
│   ├── data.ts             # DEMO data source (swappable in Step 2+)
│   └── format.ts           # Date / money / relative-time helpers
└── docs/PROJECT_PLAN.md    # This document
```

**Key design decision:** every screen reads from `lib/data.ts` through typed interfaces (`lib/types.ts`). The field shapes mirror what the **Facebook Lead Ads API** returns and what the **Hotel Mate PMS** exposes — so in Step 2+ we only swap the data source, **no UI rewrites**.

### Data model (summary)
| Entity | Main fields |
|---|---|
| `Lead` | id, name, hotel, location, phone/email, **source** (facebook/instagram/whatsapp/website/walkin), **campaign**, interest, budget, **status** (new→contacted→qualified→proposal→won/lost), assignedTo, createdAt, note |
| `Deal` | leadId, client, hotel, plan, valueLKR, **stage**, expectedClose, owner |
| `FollowUp` | leadId, dueAt, **type** (call/whatsapp/email/meeting/sms), note, owner, done |

---

## 4. Roadmap (ඉදිරි පියවර)

| Step | වැඩ | Status |
|---|---|---|
| **1** | Panel skeleton — UI, pages, demo data, brand theme | ✅ **Done (this build)** |
| **2** | **Facebook Lead Ads integration** — OAuth connect, auto-pull Lead Form submissions into `/leads` (no CSV exports) | Next |
| **3** | **Hotel Mate PMS connection** — shared database/API with the existing Next.js system (leads ↔ bookings/customers), make statuses & deals persist | Planned |
| **4** | WhatsApp Business follow-ups + Instagram DM capture, reminders/notifications | Planned |
| **5** | Reports & analytics (campaign ROI, conversion by source, sales team performance) | Planned |

---

## 5. Run It (ධාවනය)

```bash
npm install
npm run dev        # http://localhost:3000  (bound to 0.0.0.0)
npm run build && npm start   # production build
```

## 6. Contact

**Hotel Mate Marketing Panel** · Owner/Sales hotline: **+94 78 860 7143**
Reference: [hotelmate.co.uk](https://www.hotelmate.co.uk/) · All-in-One · Integrated · AI Powered
