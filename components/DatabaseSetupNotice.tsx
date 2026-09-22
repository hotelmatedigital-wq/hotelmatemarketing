import { CircleAlert, Database, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui";

export default function DatabaseSetupNotice() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <Card className="overflow-hidden">
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-amber-500 text-white">
              <CircleAlert className="size-5" />
            </span>
            <div>
              <h1 className="text-lg font-extrabold text-ink-900">
                Supabase PostgreSQL setup required
              </h1>
              <p className="text-sm text-ink-900/60">
                The build is ready; the runtime database connection is not configured yet.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">1</span>
            <div>
              <h2 className="text-sm font-bold text-ink-900">Copy the Supabase connection string</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-900/55">
                In Supabase open <strong>Connect</strong>, select the PostgreSQL transaction pooler and copy its URI. Replace the password placeholder inside Supabase or Vercel—not in source code.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">2</span>
            <div>
              <h2 className="text-sm font-bold text-ink-900">Add it to Vercel</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-900/55">
                Go to Project Settings → Environment Variables and create a secret named <code className="rounded bg-mist-100 px-1.5 py-0.5">DATABASE_URL</code> for Production, Preview and Development.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">3</span>
            <div>
              <h2 className="text-sm font-bold text-ink-900">Redeploy</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-900/55">
                Redeploy the latest commit. On the first runtime request Hotel Mate creates the SQL sequence, leads table and indexes automatically.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-mist-200 bg-mist-50 p-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-900/60">
              <Database className="size-4 text-brand-500" /> Expected variable
            </p>
            <code className="mt-2 block overflow-x-auto text-xs text-ink-900/70">
              DATABASE_URL=postgresql://postgres.PROJECT_REF:••••@YOUR_POOLER_HOST:6543/postgres?sslmode=require
            </code>
          </div>

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-600"
          >
            Open Supabase Dashboard <ExternalLink className="size-4" />
          </a>
        </div>
      </Card>
    </div>
  );
}
