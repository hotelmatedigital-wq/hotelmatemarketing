import Link from "next/link";
import { Plus } from "lucide-react";
import { Card, PageHeader } from "@/components/ui";
import { getAllLeads } from "@/lib/store";
import { isDatabaseConfigured } from "@/lib/db";
import { fmtMoney, initials } from "@/lib/format";
import type { DealStage, Lead, LeadStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const COLUMNS: Array<{
  stage: DealStage;
  label: string;
  accent: string;
  dot: string;
}> = [
  { stage: "inquiry", label: "New Inquiry", accent: "border-t-brand-500", dot: "bg-brand-500" },
  { stage: "contacted", label: "Contacted", accent: "border-t-amber-400", dot: "bg-amber-400" },
  { stage: "negotiation", label: "Negotiation", accent: "border-t-violet-500", dot: "bg-violet-500" },
  { stage: "won", label: "Won", accent: "border-t-emerald-500", dot: "bg-emerald-500" },
  { stage: "lost", label: "Lost", accent: "border-t-rose-400", dot: "bg-rose-400" },
];

const STATUS_TO_STAGE: Record<LeadStatus, DealStage> = {
  new: "inquiry",
  contacted: "contacted",
  qualified: "negotiation",
  proposal: "negotiation",
  won: "won",
  lost: "lost",
};

function leadStage(lead: Lead): DealStage {
  return STATUS_TO_STAGE[lead.status];
}

export default async function SalesPage() {
  if (!isDatabaseConfigured()) return null;
  const leads = await getAllLeads();
  const active = leads.filter(
    (lead) => lead.status !== "won" && lead.status !== "lost"
  );
  const pipelineValue = active.reduce(
    (total, lead) => total + (lead.budgetLKR ?? 0),
    0
  );
  const wonValue = leads
    .filter((lead) => lead.status === "won")
    .reduce((total, lead) => total + (lead.budgetLKR ?? 0), 0);

  return (
    <div>
      <PageHeader
        title="Sales Pipeline"
        subtitle="This pipeline is generated only from your saved real leads. Update a lead profile to move it between stages."
        actions={
          <>
            <div className="flex items-center gap-4 rounded-xl border border-mist-200 bg-white px-4 py-2.5 text-sm">
              <span>
                Pipeline: <strong className="text-brand-600">{fmtMoney(pipelineValue)}</strong>
              </span>
              <span className="h-4 w-px bg-mist-200" />
              <span>
                Won: <strong className="text-emerald-600">{fmtMoney(wonValue)}</strong>
              </span>
            </div>
            <Link
              href="/leads?add=1"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-600"
            >
              <Plus className="size-4" /> Add Lead
            </Link>
          </>
        }
      />

      {leads.length === 0 && (
        <Card className="mb-6 border-dashed p-8 text-center">
          <h2 className="text-base font-bold text-ink-900">No pipeline records yet</h2>
          <p className="mx-auto mt-1 max-w-lg text-sm text-ink-900/50">
            Add your first real lead from the Leads page. It will appear under New Inquiry automatically.
          </p>
          <Link
            href="/leads?add=1"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-bold text-white hover:bg-brand-600"
          >
            <Plus className="size-4" /> Go to Leads
          </Link>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {COLUMNS.map(({ stage, label, accent, dot }) => {
          const items = leads.filter((lead) => leadStage(lead) === stage);
          const total = items.reduce(
            (sum, lead) => sum + (lead.budgetLKR ?? 0),
            0
          );

          return (
            <div key={stage}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-bold text-ink-900">
                  <span className={`size-2 rounded-full ${dot}`} />
                  {label}
                  <span className="rounded-full bg-mist-200 px-2 py-0.5 text-[11px] font-semibold text-ink-900/60">
                    {items.length}
                  </span>
                </h2>
              </div>
              <p className="mb-3 text-xs text-ink-900/45">
                {total > 0 ? `${fmtMoney(total)}/mo` : "No budget captured"}
              </p>

              <div className="space-y-3">
                {items.map((lead) => (
                  <Card key={lead.id} className={`border-t-4 p-4 ${accent}`}>
                    <Link href={`/leads/${lead.id}`} className="block">
                      <p className="text-sm font-bold leading-snug text-ink-900 hover:text-brand-600">
                        {lead.hotel}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-900/55">{lead.name}</p>
                    </Link>
                    <p className="mt-2 line-clamp-2 text-xs font-medium text-ink-900/70">
                      {lead.interest}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-sm font-extrabold text-ink-900">
                        {lead.budgetLKR ? fmtMoney(lead.budgetLKR) : "Budget pending"}
                        {lead.budgetLKR && (
                          <span className="text-[10px] font-semibold text-ink-900/40">/mo</span>
                        )}
                      </span>
                      <span
                        className="grid size-6 shrink-0 place-items-center rounded-full bg-ink-900 text-[9px] font-bold text-white"
                        title={lead.assignedTo}
                      >
                        {initials(lead.assignedTo)}
                      </span>
                    </div>
                  </Card>
                ))}
                {items.length === 0 && (
                  <div className="rounded-xl border border-dashed border-mist-300 p-6 text-center text-xs text-ink-900/40">
                    No real leads in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
