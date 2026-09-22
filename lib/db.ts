import "server-only";
import postgres from "postgres";

export class DatabaseConfigurationError extends Error {
  constructor() {
    super(
      "Supabase PostgreSQL is not configured. Add DATABASE_URL to the server environment."
    );
    this.name = "DatabaseConfigurationError";
  }
}

type DatabaseClient = postgres.Sql;
type DatabaseGlobals = typeof globalThis & {
  hotelMateSql?: DatabaseClient;
  hotelMateSchemaPromise?: Promise<void>;
};

const databaseGlobals = globalThis as DatabaseGlobals;

export function isDatabaseConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL ||
      process.env.SUPABASE_DATABASE_URL ||
      process.env.POSTGRES_URL
  );
}

function databaseUrl(): string {
  const url =
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DATABASE_URL ||
    process.env.POSTGRES_URL;
  if (!url) throw new DatabaseConfigurationError();
  return url;
}

function createClient(): DatabaseClient {
  const url = databaseUrl();
  const isLocal = /(?:localhost|127\.0\.0\.1)/.test(url);

  return postgres(url, {
    ssl: isLocal ? false : "require",
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });
}

async function createSchema(sql: DatabaseClient): Promise<void> {
  const existing = await sql<{ exists: boolean }[]>`
    SELECT to_regclass('public.leads') IS NOT NULL AS exists
  `;
  if (existing[0]?.exists) return;

  await sql.begin(async (transaction) => {
    // Prevent simultaneous cold serverless instances from racing on DDL.
    await transaction`
      SELECT pg_advisory_xact_lock(hashtext('hotelmate-schema-v1'))
    `;

    // Another instance may have completed setup while this one waited.
    const afterLock = await transaction<{ exists: boolean }[]>`
      SELECT to_regclass('public.leads') IS NOT NULL AS exists
    `;
    if (afterLock[0]?.exists) return;

    await transaction`
      CREATE SEQUENCE IF NOT EXISTS public.hotelmate_lead_number_seq
        AS BIGINT
        START WITH 1001
    `;

    await transaction`
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
      )
    `;

    await transaction`
      CREATE INDEX IF NOT EXISTS leads_created_at_idx
        ON public.leads (created_at DESC)
    `;
    await transaction`
      CREATE INDEX IF NOT EXISTS leads_status_idx
        ON public.leads (status)
    `;
    await transaction`
      CREATE INDEX IF NOT EXISTS leads_source_idx
        ON public.leads (source)
    `;
    await transaction`ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY`;
  });
}

/**
 * Return a lazily-created PostgreSQL client and initialize the schema on the
 * first runtime query. Nothing connects during `next build`.
 */
export async function database(): Promise<DatabaseClient> {
  const sql = databaseGlobals.hotelMateSql ?? createClient();
  databaseGlobals.hotelMateSql = sql;

  if (!databaseGlobals.hotelMateSchemaPromise) {
    databaseGlobals.hotelMateSchemaPromise = createSchema(sql).catch((error) => {
      databaseGlobals.hotelMateSchemaPromise = undefined;
      throw error;
    });
  }

  await databaseGlobals.hotelMateSchemaPromise;
  return sql;
}
