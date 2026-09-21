import Link from "next/link";
import {
  Users,
  CalendarClock,
  TrendingUp,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { FacebookIcon } from "@/components/brand-icons";
import {
  Card,
  PageHeader,
  StatCard,
  StatusBadge,
  SourceBadge,
} from "@/components/ui";
import { deals, followUps, leads } from "@/lib/data";
import { fmtMoney, fmtTime, isToday, relTime } from "@/lib/format";

export default function DashboardPage() {
  const newThisWeek = leads.filter(
    (l) =>
      Date.now() - new Date(l.createdAt).getTime() < 7 * 24 * 3600 * 1000
  ).length;
  const dueToday = followUps.filter((f) => !f.done && isToday(f.dueAt));
  const activeDeals = deals.filter(
    (d) => d.stage !== "won" && d.stage !== "lost"
  );
  const wonValue = deals
    .filter((d) => d.stage === "won")
    .reduce((s, d) => s + d.valueLKR, 0);
  const pipelineValue = activeDeals.reduce((s, d) => s + d.valueLKR, 0);

  // leads by source
  const sources = [...new Set(leads.map((l) => l.source))];
  const sourceCounts = sources
    .map((s) => ({
      source: s,
      count: leads.filter((l) => l.source === s).length,
    }))
    .sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...sourceCounts.map((s) => s.count));

  const recentLeads = [...leads]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div>
      <PageHeader
        title="Marketing Dashboard"
        subtitle="Social media leads, sales pipeline & follow-ups — all in one place."
        actions={
          <>
            <Link
              href="/leads"
              className="rounded-lg border border-mist-200 bg-white px-4 py-2 text-sm font-semibold text-ink-900 hover:bg-mist-50"
            >
              View Leads
            </Link>
            <Link
              href="/sales"
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-500/30 hover:bg-brand-600"
            >
              Sales Pipeline
            </Link>
          </>
        }
      />

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="New Leads (7 days)"
          value={String(newThisWeek)}
          sub="Facebook · Instagram · WhatsApp · Web"
          tone="brand"
        />
        <StatCard
          icon={CalendarClock}
          label="Follow-ups Today"
          value={String(dueToday.length)}
          sub={`${followUps.filter((f) => !f.done).length} open in total`}
          tone="amber"
        />
        <StatCard
          icon={TrendingUp}
          label="Active Deals"
          value={String(activeDeals.length)}
          sub={`Pipeline ${fmtMoney(pipelineValue)}`}
          tone="violet"
        />
        <StatCard
          icon={Wallet}
          label="Won This Month"
          value={fmtMoney(wonValue)}
          sub="Monthly contract value"
          tone="green"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* recent leads */}
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
                  <p className="truncate text-sm font-semibold text-ink-900">
                    {lead.hotel}
                  </p>
                  <p className="truncate text-xs text-ink-900/50">
                    {lead.name} · {lead.location}
                  </p>
                </div>
                <div className="hidden md:block">
                  <SourceBadge source={lead.source} />
                </div>
                <span className="hidden w-20 text-right text-xs text-ink-900/45 sm:block">
                  {relTime(lead.createdAt)}
                </span>
                <StatusBadge status={lead.status} />
              </Link>
            ))}
          </div>
        </Card>

        {/* right column */}
        <div className="space-y-6">
          {/* today's follow-ups */}
          <Card>
            <div className="flex items-center justify-between border-b border-mist-200 px-5 py-4">
              <h2 className="text-sm font-bold text-ink-900">
                Today&apos;s Follow-ups
              </h2>
              <Link
                href="/followups"
                className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                All <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-mist-100">
              {dueToday.slice(0, 4).map((f) => (
                <div key={f.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="rounded-md bg-brand-50 px-2 py-1 text-[11px] font-bold text-brand-700">
                    {fmtTime(f.dueAt)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900">
                      {f.leadName.split(" — ")[0]}
                    </p>
                    <p className="truncate text-xs text-ink-900/50">
                      {f.note}
                    </p>
                  </div>
                </div>
              ))}
              {dueToday.length === 0 && (
                <p className="px-5 py-6 text-sm text-ink-900/45">
                  Nothing scheduled today. 🎉
                </p>
              )}
            </div>
          </Card>

          {/* leads by source */}
          <Card className="p-5">
            <h2 className="text-sm font-bold text-ink-900">Leads by Source</h2>
            <div className="mt-4 space-y-3">
              {sourceCounts.map(({ source, count }) => (
                <div key={source}>
                  <div className="mb-1 flex items-center justify-between">
                    <SourceBadge source={source} />
                    <span className="text-xs font-bold text-ink-900/70">
                      {count}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-mist-100">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* facebook teaser */}
          <div className="rounded-2xl bg-ink-900 p-5 text-white">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-lg bg-brand-500">
                <FacebookIcon className="size-5" />
              </span>
              <h3 className="text-sm font-bold">Facebook Lead Forms</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/60">
              Step 2: new Facebook Lead Form submissions will sync here
              automatically — no manual exporting.
            </p>
            <Link
              href="/settings"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-600"
            >
              Set up connection <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
