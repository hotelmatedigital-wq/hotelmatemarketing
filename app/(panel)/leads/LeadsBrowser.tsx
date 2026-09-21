"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronRight,
  Copy,
  Plus,
  Search,
  MessageCircle,
  Sparkles,
  X,
  FileCheck2,
} from "lucide-react";
import {
  Card,
  OwnerChip,
  SourceBadge,
  StatusBadge,
  STATUS_LABELS,
} from "@/components/ui";
import AddLeadModal from "@/components/AddLeadModal";
import { sourceLabels } from "@/lib/data";
import { fmtMoney, relTime } from "@/lib/format";
import { generateLeadWhatsAppMessage, waLink } from "@/lib/wa";
import type { Lead, LeadSource } from "@/lib/types";

const STATUS_FILTERS: Array<LeadStatusFilter> = [
  "all",
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
];
type LeadStatusFilter = "all" | Lead["status"];

export default function LeadsBrowser({
  initialLeads,
}: {
  initialLeads: Lead[];
}) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<LeadStatusFilter>("all");
  const [source, setSource] = useState<LeadSource | "all">("all");
  const [formFilter, setFormFilter] = useState<"all" | "submitted" | "pending">(
    "all"
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [captured, setCaptured] = useState<Lead | null>(null);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (status !== "all" && l.status !== status) return false;
      if (source !== "all" && l.source !== source) return false;
      if (formFilter === "submitted" && l.formStatus !== "submitted")
        return false;
      if (formFilter === "pending" && l.formStatus !== "pending") return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.hotel.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.campaign.toLowerCase().includes(q)
      );
    });
  }, [leads, query, status, source, formFilter]);

  const intakeUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/intake`
      : "/intake";

  async function copyIntakeLink() {
    try {
      await navigator.clipboard.writeText(intakeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", intakeUrl);
    }
  }

  return (
    <div>
      {/* actions row */}
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

        <select
          value={formFilter}
          onChange={(e) =>
            setFormFilter(e.target.value as "all" | "submitted" | "pending")
          }
          className="rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm font-medium text-ink-900 outline-none"
        >
          <option value="all">All form states</option>
          <option value="submitted">Assessment Submitted</option>
          <option value="pending">Form Pending</option>
        </select>

        <Link
          href="/generator"
          className="flex items-center gap-1.5 rounded-lg border border-brand-300 bg-brand-50 px-3.5 py-2 text-sm font-bold text-brand-700 hover:bg-brand-100"
        >
          <Sparkles className="size-4" /> FB & IG Generator
        </Link>

        <button
          onClick={copyIntakeLink}
          className="flex items-center gap-1.5 rounded-lg border border-mist-200 bg-white px-3.5 py-2 text-sm font-semibold text-ink-900 hover:bg-mist-50"
        >
          {copied ? (
            <Check className="size-4 text-emerald-500" />
          ) : (
            <Copy className="size-4" />
          )}
          {copied ? "Copied!" : "Copy Form Link"}
        </button>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-brand-500/30 hover:bg-brand-600"
        >
          <Plus className="size-4" /> Add Lead
        </button>
      </div>

      {/* captured-lead banner */}
      {captured && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <Check className="size-5 shrink-0 text-emerald-600" />
          <p className="min-w-0 flex-1 text-sm text-emerald-800">
            <strong>{captured.name}</strong> saved as a new lead (
            {captured.id}). Send the intake form to confirm their details:
          </p>
          <a
            href={waLink(
              captured.phone,
              generateLeadWhatsAppMessage({
                clientName: captured.name,
                formUrl:
                  typeof window !== "undefined"
                    ? `${window.location.origin}/intake?leadId=${captured.id}`
                    : `https://marketing.hotelmate.app/intake?leadId=${captured.id}`,
              })
            )}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700"
          >
            <MessageCircle className="size-4" /> Send Form via WhatsApp
          </a>
          <button
            onClick={() => setCaptured(null)}
            className="rounded-md p-1 text-emerald-700/60 hover:text-emerald-800"
            aria-label="Dismiss"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* status chips */}
      <div className="mb-4 flex flex-wrap gap-1.5">
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
            <span className="ml-1 opacity-60">
              {s === "all"
                ? leads.length
                : leads.filter((l) => l.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-mist-200 bg-mist-50 text-[11px] font-semibold uppercase tracking-wider text-ink-900/50">
                <th className="px-5 py-3">Lead & Property</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Assessment</th>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3 text-right">Est. Budget</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-2 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-mist-100">
              {filtered.map((lead) => {
                const isSubmitted = lead.formStatus === "submitted";
                return (
                  <tr
                    key={lead.id}
                    onClick={() => router.push(`/leads/${lead.id}`)}
                    className="cursor-pointer transition-colors hover:bg-brand-50/40"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-ink-900">{lead.hotel}</p>
                      <p className="text-xs text-ink-900/50">
                        {lead.name} {lead.location !== "—" && `· ${lead.location}`}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <SourceBadge source={lead.source} />
                    </td>

                    <td className="px-4 py-3.5">
                      {isSubmitted ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                          <Check className="size-3 text-emerald-600" /> Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="max-w-40 truncate px-4 py-3.5 text-xs text-ink-900/60">
                      {lead.campaign}
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
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-ink-900/45">
            No leads match your filters.
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-mist-200 bg-mist-50 px-5 py-3 text-xs text-ink-900/50">
          <span>
            Showing {filtered.length} of {leads.length} leads
          </span>
          <Link
            href="/generator"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Launch FB & IG Lead Generator ↗
          </Link>
        </div>
      </Card>

      <AddLeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdded={(lead) => {
          setLeads((prev) => [lead, ...prev]);
          setModalOpen(false);
          setCaptured(lead);
        }}
      />
    </div>
  );
}
