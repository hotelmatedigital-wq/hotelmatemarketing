import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  Plus,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import {
  Card,
  PageHeader,
  SourceBadge,
  StatCard,
  StatusBadge,
  STATUS_LABELS,
} from "@/components/ui";
import { getAllLeads } from "@/lib/store";
import { isDatabaseConfigured } from "@/lib/db";
import { fmtMoney, isWithinLastDays, relTime } from "@/lib/format";
import type { LeadStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
];

export default async function DashboardPage() {
  if (!isDatabaseConfigured()) return null;
  const leads = await getAllLeads();
  const newThisWeek = leads.filter((lead) =>
    isWithinLastDays(lead.createdAt, 7)
  ).length;
  const activeLeads = leads.filter(
    (lead) => lead.status !== "won" && lead.status !== "lost"
  );
  const pipelineValue = activeLeads.reduce(
    (total, lead) => total + (lead.budgetLKR ?? 0),
    0
  );
  const wonValue = leads
    .filter((lead) => lead.status === "won")
    .reduce((total, lead) => total + (lead.budgetLKR ?? 0), 0);

  const sources = [...new Set(leads.map((lead) => lead.source))];
  const sourceCounts = sources
    .map((source) => ({
      source,
      count: leads.filter((lead) => lead.source === source).length,
    }))
    .sort((a, b) => b.count - a.count);
  const maxCount = Math.max(1, ...sourceCounts.map((source) => source.count));
  const recentLeads = leads.slice(0, 6);

  return (
    <div>
      <PageHeader
        title="Marketing Dashboard"
        subtitle="Only your manually entered and genuinely captured lead data is shown."
        actions={
          <>
            <Link
              href="/leads?add=1"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-brand-500/30 hover:bg-brand-600"
            >
              <Plus className="size-4" /> Add Manual Lead
            </Link>
            <Link
              href="/sales"
              className="rounded-lg border border-mist-200 bg-white px-4 py-2 text-sm font-semibold text-ink-900 hover:bg-mist-50"
            >
              Sales Pipeline
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={UserPlus}
          label="New Leads (7 days)"
          value={String(newThisWeek)}
          sub="Real records added this week"
          tone="brand"
        />
        <StatCard
          icon={Users}
          label="Total Leads"
          value={String(leads.length)}
          sub="All saved lead records"
          tone="amber"
        />
        <StatCard
          icon={TrendingUp}
          label="Active Opportunities"
          value={String(activeLeads.length)}
          sub={`Pipeline ${fmtMoney(pipelineValue)}`}
          tone="violet"
        />
        <StatCard
          icon={Wallet}
          label="Won Value"
          value={fmtMoney(wonValue)}
          sub="Captured monthly value"
          tone="green"
        />
      </div>

      {leads.length === 0 && (
        <Card className="mt-6 border-dashed border-brand-200 bg-brand-50/40 p-8 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand-500 text-white">
            <UserPlus className="size-6" />
          </span>
          <h2 className="mt-3 text-lg font-extrabold text-ink-900">
            Start with your first real lead
          </h2>
          <p className="mx-auto mt-1 max-w-lg text-sm text-ink-900/55">
            The bundled sample records have been removed. Add an inquiry received by phone, WhatsApp, Facebook, Instagram, website or walk-in.
          </p>
          <Link
            href="/leads?add=1"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-600"
          >
            <Plus className="size-4" /> Open Leads &amp; Add
          </Link>
        </Card>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between border-b border-mist-200 px-5 py-4">
            <h2 className="text-sm font-bold text-ink-900">Recent Leads</h2>
            <Link
              href="/leads"
              className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-mist-100">
            {recentLeads.map((lead) => (
              <Link
                key={lead.id}
                href={`/leads/${lead.id}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5 transition-colors hover:bg-mist-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">{lead.hotel}</p>
                  <p className="truncate text-xs text-ink-900/50">
                    {lead.name} · {lead.location}
                  </p>
                </div>
                <div className="hidden md:block"><SourceBadge source={lead.source} /></div>
                {lead.formStatus === "submitted" && (
                  <span className="hidden items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 lg:inline-flex">
                    <Check className="size-2.5" /> Assessment Done
                  </span>
                )}
                <span className="hidden w-20 text-right text-xs text-ink-900/45 sm:block">
                  {relTime(lead.createdAt)}
                </span>
                <StatusBadge status={lead.status} />
              </Link>
            ))}
            {recentLeads.length === 0 && (
              <p className="px-5 py-10 text-center text-sm text-ink-900/40">
                No real leads have been added yet.
              </p>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="text-sm font-bold text-ink-900">Lead Status</h2>
            <div className="mt-4 space-y-2.5">
              {STATUSES.map((status) => {
                const count = leads.filter((lead) => lead.status === status).length;
                return (
                  <div key={status} className="flex items-center justify-between rounded-lg bg-mist-50 px-3 py-2">
                    <span className="text-xs font-semibold text-ink-900/65">{STATUS_LABELS[status]}</span>
                    <strong className="text-sm text-ink-900">{count}</strong>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-bold text-ink-900">Leads by Source</h2>
            <div className="mt-4 space-y-3">
              {sourceCounts.map(({ source, count }) => (
                <div key={source}>
                  <div className="mb-1 flex items-center justify-between">
                    <SourceBadge source={source} />
                    <span className="text-xs font-bold text-ink-900/70">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-mist-100">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {sourceCounts.length === 0 && (
                <p className="py-4 text-center text-xs text-ink-900/40">No source data yet.</p>
              )}
            </div>
          </Card>

          <div className="rounded-2xl bg-ink-900 p-5 text-white">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-lg bg-brand-500">
                <CircleDollarSign className="size-5" />
              </span>
              <h3 className="text-sm font-bold">Real Data Workspace</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/60">
              No sample leads are injected. New records are saved only when you add a lead or a client submits the intake form.
            </p>
            <Link
              href="/leads"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-600"
            >
              Manage leads <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
