import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";
import { deals } from "@/lib/data";
import { fmtDate, fmtMoney, initials } from "@/lib/format";
import type { DealStage } from "@/lib/types";

// Always render fresh so demo dates/relative times never go stale.
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

export default function SalesPage() {
  const pipeline = deals.filter(
    (d) => d.stage !== "won" && d.stage !== "lost"
  );
  const pipelineValue = pipeline.reduce((s, d) => s + d.valueLKR, 0);
  const wonValue = deals
    .filter((d) => d.stage === "won")
    .reduce((s, d) => s + d.valueLKR, 0);

  return (
    <div>
      <PageHeader
        title="Sales Pipeline"
        subtitle="Move hotels from first inquiry to signed contract."
        actions={
          <div className="flex items-center gap-4 rounded-xl border border-mist-200 bg-white px-4 py-2.5 text-sm">
            <span>
              Pipeline:{" "}
              <strong className="text-brand-600">
                {fmtMoney(pipelineValue)}
              </strong>
            </span>
            <span className="h-4 w-px bg-mist-200" />
            <span>
              Won:{" "}
              <strong className="text-emerald-600">{fmtMoney(wonValue)}</strong>
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {COLUMNS.map(({ stage, label, accent, dot }) => {
          const items = deals.filter((d) => d.stage === stage);
          const total = items.reduce((s, d) => s + d.valueLKR, 0);
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
                {items.length > 0 ? `${fmtMoney(total)}/mo` : "—"}
              </p>

              <div className="space-y-3">
                {items.map((deal) => (
                  <Card
                    key={deal.id}
                    className={`border-t-4 p-4 ${accent}`}
                  >
                    <Link
                      href={`/leads/${deal.leadId}`}
                      className="block"
                    >
                      <p className="text-sm font-bold leading-snug text-ink-900 hover:text-brand-600">
                        {deal.hotel}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-900/55">
                        {deal.client}
                      </p>
                    </Link>
                    <p className="mt-2 line-clamp-1 text-xs font-medium text-ink-900/70">
                      {deal.plan}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-ink-900">
                        {fmtMoney(deal.valueLKR)}
                        <span className="text-[10px] font-semibold text-ink-900/40">
                          /mo
                        </span>
                      </span>
                      <span
                        className="grid size-6 place-items-center rounded-full bg-ink-900 text-[9px] font-bold text-white"
                        title={deal.owner}
                      >
                        {initials(deal.owner)}
                      </span>
                    </div>
                    {deal.expectedClose && deal.stage !== "won" && deal.stage !== "lost" && (
                      <p className="mt-2 border-t border-mist-100 pt-2 text-[11px] text-ink-900/45">
                        Expected close: {fmtDate(deal.expectedClose)}
                      </p>
                    )}
                  </Card>
                ))}
                {items.length === 0 && (
                  <div className="rounded-xl border border-dashed border-mist-300 p-6 text-center text-xs text-ink-900/40">
                    No deals
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-ink-900/45">
        Drag &amp; drop stage moves, notes and deal values become editable when
        the database connection lands in Step 3.
      </p>
    </div>
  );
}
