# HOTEL MATE — Marketing Panel Architecture

Hotel Mate's Next.js marketing workspace captures genuine social, phone, website and walk-in inquiries; sends a client assessment link; recommends an appropriate package; and tracks the resulting sales opportunity.

## 1. Current product flow

### Manual lead capture

Operators can create a real lead from the Leads page or Lead Generator with:

- contact name, mobile/WhatsApp number and optional email
- property name and location
- acquisition source and campaign
- product interest, estimated budget and initial note
- pipeline status and owner

Creating a lead persists it in Supabase PostgreSQL and assigns a sequence-backed public ID such as `L-1001`. No records are generated or seeded automatically.

### Client assessment

The public `/intake` page supports a generic form or a personalized `?leadId=L-1001` link. It collects:

1. Client name and contact details
2. Property name and area
3. Hotel category and room count
4. Restaurant and spa availability
5. Previous/current PMS usage
6. Previous/current channel-manager usage
7. Managed OTAs, including an optional custom answer
8. Discovery source
9. Preferred product-demo date and time

Submitting the form stores the full assessment as PostgreSQL `JSONB`, marks the lead as submitted/qualified and calculates a Starter, Professional or Enterprise recommendation. Legitimate demo scheduling fields are retained as client appointment data.

### Sales management

Dashboard metrics, lead lists, lead profiles and the kanban pipeline all query the same PostgreSQL records. Status, estimated budget, owner and note changes are durable. A lead can also be permanently deleted from the management card.

## 2. Data architecture

Supabase PostgreSQL is the only durable data source. There is no JSON-file fallback and there are no sample entities.

```text
Browser
  ├─ Next.js server-rendered panel pages
  └─ /api/leads and /api/intake
             │
             ▼
      lib/validation.ts
             │
             ▼
        lib/store.ts       SQL repository
             │
             ▼
          lib/db.ts        lazy server-only postgres.js client
             │
             ▼
      Supabase PostgreSQL  leads table + ID sequence
```

`lib/db.ts` does not create a client or open a socket until a runtime store operation occurs. Consequently, Vercel's `next build` step can finish without database access. The driver uses one connection per serverless instance and disables prepared statements for Supabase transaction-pooler compatibility.

### Database objects

The versioned schema is in [`../supabase/migrations/202609220001_create_leads.sql`](../supabase/migrations/202609220001_create_leads.sql).

- `hotelmate_lead_number_seq` — concurrency-safe numeric source for `L-1001` IDs
- `leads` — contact, property, source, sales, form and assessment data
- indexes on creation time, status and source
- check constraints for sources, statuses, form statuses and positive budgets
- Row Level Security enabled to prevent accidental browser API exposure

The migration contains no `INSERT` statements. An untouched deployment returns an empty lead list.

## 3. Important routes

| Route | Purpose |
|---|---|
| `/` | Dashboard based on persisted real leads |
| `/leads` | Add, search and filter leads |
| `/leads/[id]` | Lead details, assessment and sales controls |
| `/generator` | Capture a lead and prepare a WhatsApp intake message |
| `/intake` | Public client assessment form |
| `/sales` | Status-derived sales pipeline |
| `/followups` | Honest empty state until reminder persistence is implemented |
| `/settings` | Storage and external-integration status |
| `/api/leads` | List and create leads |
| `/api/leads/[id]` | Update or delete one lead |
| `/api/intake` | Prefill and submit an assessment |

## 4. Repository map

```text
app/
├── (panel)/                 server-rendered marketing workspace
├── api/leads/               lead CRUD handlers
├── api/intake/              assessment handlers
└── intake/                  public assessment UI
components/
├── AddLeadModal.tsx         complete manual-entry form
├── LeadManagementCard.tsx  update/delete controls
├── ClientAssessmentCard.tsx
└── DatabaseSetupNotice.tsx  runtime configuration guidance
lib/
├── db.ts                    Supabase/PostgreSQL connection and schema bootstrap
├── store.ts                 SQL lead repository
├── validation.ts            API payload validation
├── types.ts                 shared domain types
├── data.ts                  legitimate options and recommendation rules
└── wa.ts                    WhatsApp message/deep-link helpers
supabase/migrations/         versioned PostgreSQL schema
```

## 5. Supabase and Vercel

Use the Supabase transaction-pooler URI as the server-only `DATABASE_URL`. Add it in Vercel Project Settings for the environments that should access the database, then redeploy. A local developer should place it in `.env.local`, which is ignored by Git.

The application can initialize its idempotent schema on the first runtime request. Teams that require migration-first deployment can instead execute the migration through the Supabase SQL Editor before releasing the app.

See the root [`README.md`](../README.md) for the exact setup commands and secret-handling guidance.

## 6. Security and remaining production work

- SQL values are parameterized through `postgres.js`.
- `DATABASE_URL` is imported only by server modules and must never be exposed as `NEXT_PUBLIC_*`.
- API responses use no-store headers and payloads pass centralized validation.
- Supabase RLS is enabled; the server's direct PostgreSQL role owns database access.
- Operator authentication and authorization are not implemented yet. They are required before the panel and mutation APIs are placed on an unrestricted public production domain.
- Automated Facebook/Instagram OAuth, webhooks, WhatsApp Business API and PMS synchronization remain disconnected; operators can continue entering genuine leads manually.

## 7. Verification

Run the complete local quality gate with:

```bash
npm ci
npm run check
npm audit --audit-level=low
```

Lint, TypeScript, unit tests and the optimized Next.js build do not require a database connection. End-to-end SQL lifecycle verification requires a securely supplied test or Supabase `DATABASE_URL`.

---

Hotel Mate owner contact: **+94 78 860 7143**
