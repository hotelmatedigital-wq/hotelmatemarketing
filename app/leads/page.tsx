"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Search } from "lucide-react";
import {
  Card,
  OwnerChip,
  PageHeader,
  SourceBadge,
  StatusBadge,
  STATUS_LABELS,
} from "@/components/ui";
import { leads, sourceLabels } from "@/lib/data";
import { fmtMoney, relTime } from "@/lib/format";
import type { LeadSource, LeadStatus } from "@/lib/types";

const STATUS_FILTERS: Array<LeadStatus | "all"> = [
  "all",
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
];

export default function LeadsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [source, setSource] = useState<LeadSource | "all">("all");

  const filtered = useMemo(() => {
    return [...leads]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .filter((l) => {
        if (status !== "all" && l.status !== status) return false;
        if (source !== "all" && l.source !== source) return false;
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          l.name.toLowerCase().includes(q) ||
          l.hotel.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          l.campaign.toLowerCase().includes(q)
        );
      });
  }, [query, status, source]);

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle="Inquiries captured from social media, website & referrals."
      />

      {/* filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex min-w-56 flex-1 items-center gap-2 rounded-lg border border-mist-200 bg-white px-3 py-2 sm:max-w-xs">
          <Search className="size-4 text-ink-900/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hotel, person, campaign…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-900/35"
          />
        </div>

        <select
          value={source}
          onChange={(e) => setSource(e.target.value as LeadSource | "all")}
          className="rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm font-medium text-ink-900 outline-none"
        >
          <option value="all">All sources</option>
          {(Object.keys(sourceLabels) as LeadSource[]).map((s) => (
            <option key={s} value={s}>
              {sourceLabels[s]}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                status === s
                  ? "bg-ink-900 text-white"
                  : "border border-mist-200 bg-white text-ink-900/60 hover:bg-mist-50"
              }`}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-mist-200 bg-mist-50 text-[11px] font-semibold uppercase tracking-wider text-ink-900/50">
                <th className="px-5 py-3">Lead</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Interest</th>
                <th className="px-4 py-3 text-right">Budget</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-2 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-mist-100">
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => router.push(`/leads/${lead.id}`)}
                  className="cursor-pointer transition-colors hover:bg-brand-50/40"
                >
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-ink-900">{lead.hotel}</p>
                    <p className="text-xs text-ink-900/50">
                      {lead.name} · {lead.location}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <SourceBadge source={lead.source} />
                  </td>
                  <td className="max-w-40 truncate px-4 py-3.5 text-xs text-ink-900/60">
                    {lead.campaign}
                  </td>
                  <td className="max-w-48 truncate px-4 py-3.5 text-xs text-ink-900/60">
                    {lead.interest}
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs font-semibold text-ink-900">
                    {lead.budgetLKR ? fmtMoney(lead.budgetLKR) : "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <OwnerChip name={lead.assignedTo} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-xs text-ink-900/50">
                    {relTime(lead.createdAt)}
                  </td>
                  <td className="px-2 py-3.5 text-ink-900/30">
                    <ChevronRight className="size-4" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-ink-900/45">
            No leads match your filters.
          </div>
        )}

        <div className="border-t border-mist-200 bg-mist-50 px-5 py-3 text-xs text-ink-900/50">
          Showing {filtered.length} of {leads.length} leads · Demo data (Step
          1) — Facebook Lead Forms sync arrives in Step 2
        </div>
      </Card>
    </div>
  );
}
