"use client";

import { DatabaseZap, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui";

export default function PanelError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl py-10">
      <Card className="p-8 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-red-600">
          <DatabaseZap className="size-7" />
        </span>
        <h1 className="mt-5 text-xl font-extrabold text-ink-900">
          PostgreSQL is temporarily unavailable
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink-900/55">
          Hotel Mate could not reach the configured Supabase database. Check the
          Vercel <code className="rounded bg-mist-100 px-1.5 py-0.5">DATABASE_URL</code>,
          Supabase project status and network connectivity, then try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-600"
        >
          <RefreshCw className="size-4" /> Retry connection
        </button>
      </Card>
    </div>
  );
}
