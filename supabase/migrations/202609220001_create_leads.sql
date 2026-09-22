-- Hotel Mate real-lead storage for Supabase PostgreSQL.
-- The application also runs these idempotent statements on its first query.

BEGIN;
SELECT pg_advisory_xact_lock(hashtext('hotelmate-schema-v1'));

CREATE SEQUENCE IF NOT EXISTS public.hotelmate_lead_number_seq
  AS BIGINT
  START WITH 1001;

CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY DEFAULT ('L-' || nextval('public.hotelmate_lead_number_seq'::REGCLASS)::TEXT),
  name TEXT NOT NULL,
  hotel TEXT NOT NULL DEFAULT 'Property not provided',
  location TEXT NOT NULL DEFAULT 'Not provided',
  phone TEXT NOT NULL,
  email TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  campaign TEXT NOT NULL DEFAULT 'Manual entry',
  interest TEXT NOT NULL DEFAULT 'Not specified',
  budget_lkr BIGINT,
  status TEXT NOT NULL DEFAULT 'new',
  assigned_to TEXT NOT NULL DEFAULT 'Unassigned',
  note TEXT,
  form_status TEXT NOT NULL DEFAULT 'pending',
  assessment JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  CONSTRAINT leads_source_check CHECK (
    source IN ('facebook', 'instagram', 'whatsapp', 'website', 'walkin', 'manual')
  ),
  CONSTRAINT leads_status_check CHECK (
    status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')
  ),
  CONSTRAINT leads_form_status_check CHECK (
    form_status IN ('pending', 'submitted')
  ),
  CONSTRAINT leads_budget_check CHECK (
    budget_lkr IS NULL OR budget_lkr > 0
  )
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx
  ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx
  ON public.leads (status);
CREATE INDEX IF NOT EXISTS leads_source_idx
  ON public.leads (source);

-- Direct DATABASE_URL connections use the database role and do not expose this
-- table through the browser. Keep Row Level Security enabled for Supabase APIs.
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

COMMIT;
