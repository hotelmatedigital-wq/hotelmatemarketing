import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  Check,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  User,
  MessageCircle,
} from "lucide-react";
import {
  Card,
  OwnerChip,
  SourceBadge,
  StatusBadge,
  STATUS_LABELS,
} from "@/components/ui";
import { followUpLabels, followUps } from "@/lib/data";
import { getLead } from "@/lib/store";
import SendIntakeButton from "@/components/SendIntakeButton";
import { fmtDateYear, fmtMoney, fmtTime, isToday, relTime } from "@/lib/format";

const STEPS = ["new", "contacted", "qualified", "proposal", "won"] as const;

// Always render fresh so demo dates/relative times never go stale.
export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const leadFollowUps = followUps
    .filter((f) => f.leadId === lead.id)
    .sort((a, b) => +new Date(a.dueAt) - +new Date(b.dueAt));

  const stepIndex =
    lead.status === "lost"
      ? -1
      : STEPS.indexOf(lead.status as (typeof STEPS)[number]);

  const activity: Array<{ icon: React.ReactNode; text: string; when: string }> =
    [
      {
        icon: <Megaphone className="size-3.5" />,
        text: `Lead captured via ${lead.campaign}`,
        when: relTime(lead.createdAt),
      },
    ];
  for (const f of leadFollowUps) {
    activity.push({
      icon: <CalendarClock className="size-3.5" />,
      text: `${f.done ? "Completed" : "Scheduled"}: ${followUpLabels[f.type]} — ${f.note}`,
      when: fmtDateYear(f.dueAt),
    });
  }
  activity.push({
    icon: <Check className="size-3.5" />,
    text: `Status: ${STATUS_LABELS[lead.status]}`,
    when: "now",
  });

  const waLink = `https://wa.me/${lead.phone.replace(/[^\d]/g, "")}`;

  return (
    <div>
      <Link
        href="/leads"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900/55 hover:text-ink-900"
      >
        <ArrowLeft className="size-4" /> Back to Leads
      </Link>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* left: lead info */}
        <div className="space-y-6 xl:col-span-1">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-ink-900">
                  {lead.hotel}
                </h1>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-900/55">
                  <MapPin className="size-3.5" /> {lead.location}
                </p>
              </div>
              <StatusBadge status={lead.status} />
            </div>

            <dl className="mt-5 space-y-3.5 text-sm">
              <div className="flex items-center gap-3">
                <User className="size-4 shrink-0 text-ink-900/35" />
                <span className="text-ink-900">{lead.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-ink-900/35" />
                <a
                  href={`tel:${lead.phone.replace(/\s/g, "")}`}
                  className="font-medium text-brand-600 hover:text-brand-700"
                >
                  {lead.phone}
                </a>
              </div>
              {lead.email && (
                <div className="flex items-center gap-3">
                  <Mail className="size-4 shrink-0 text-ink-900/35" />
                  <a
                    href={`mailto:${lead.email}`}
                    className="truncate text-brand-600 hover:text-brand-700"
                  >
                    {lead.email}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Building2 className="size-4 shrink-0 text-ink-900/35" />
                <span className="text-ink-900/80">
                  Interested in:{" "}
                  <span className="font-semibold">{lead.interest}</span>
                </span>
              </div>
            </dl>

            <div className="mt-5 flex gap-2">
              <a
                href={`tel:${lead.phone.replace(/\s/g, "")}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-xs font-bold text-white hover:bg-brand-600"
              >
                <Phone className="size-3.5" /> Call
              </a>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-600"
              >
                <MessageCircle className="size-3.5" /> WhatsApp
              </a>
              <SendIntakeButton name={lead.name} phone={lead.phone} />
            </div>
          </Card>

          <Card className="divide-y divide-mist-100">
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-900/50">
                Source
              </span>
              <SourceBadge source={lead.source} />
            </div>
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-900/50">
                Campaign
              </span>
              <span className="max-w-44 truncate text-right text-xs font-medium text-ink-900">
                {lead.campaign}
              </span>
            </div>
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-900/50">
                Budget
              </span>
              <span className="text-sm font-bold text-ink-900">
                {lead.budgetLKR
                  ? `${fmtMoney(lead.budgetLKR)}/mo`
                  : "Not captured"}
              </span>
            </div>
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-900/50">
                Assigned to
              </span>
              <OwnerChip name={lead.assignedTo} />
            </div>
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-900/50">
                Received
              </span>
              <span className="text-xs font-medium text-ink-900">
                {fmtDateYear(lead.createdAt)} · {relTime(lead.createdAt)}
              </span>
            </div>
          </Card>

          {lead.note && (
            <Card className="p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-900/50">
                Sales Note
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-900/80">
                {lead.note}
              </p>
            </Card>
          )}
        </div>

        {/* right: pipeline position + follow-ups + activity */}
        <div className="space-y-6 xl:col-span-2">
          {/* status stepper */}
          <Card className="p-6">
            <h2 className="text-sm font-bold text-ink-900">
              Conversion Progress
            </h2>
            {lead.status === "lost" ? (
              <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                This lead was marked as Lost. Keep it for reporting — you can
                re-engage in a future campaign.
              </p>
            ) : (
              <div className="mt-5 flex items-center">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center">
                      <span
                        className={`grid size-8 place-items-center rounded-full text-xs font-bold ${
                          i <= stepIndex
                            ? "bg-brand-500 text-white"
                            : "bg-mist-100 text-ink-900/35"
                        }`}
                      >
                        {i < stepIndex ? <Check className="size-4" /> : i + 1}
                      </span>
                      <span className="mt-1.5 hidden text-[10px] font-semibold uppercase tracking-wide text-ink-900/50 sm:block">
                        {STATUS_LABELS[s]}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`mx-1 mb-4 h-0.5 flex-1 sm:mb-5 ${
                          i < stepIndex ? "bg-brand-500" : "bg-mist-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* follow-ups for this lead */}
          <Card>
            <div className="border-b border-mist-200 px-5 py-4">
              <h2 className="text-sm font-bold text-ink-900">Follow-ups</h2>
            </div>
            <div className="divide-y divide-mist-100">
              {leadFollowUps.map((f) => (
                <div key={f.id} className="flex items-center gap-4 px-5 py-3.5">
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                      isToday(f.dueAt)
                        ? "bg-brand-50 text-brand-600"
                        : "bg-mist-100 text-ink-900/50"
                    }`}
                  >
                    <CalendarClock className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink-900">
                      {followUpLabels[f.type]} — {f.note}
                    </p>
                    <p className="text-xs text-ink-900/50">
                      {fmtDateYear(f.dueAt)} at {fmtTime(f.dueAt)} ·{" "}
                      {f.owner}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      f.done
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {f.done ? "Done" : "Pending"}
                  </span>
                </div>
              ))}
              {leadFollowUps.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-ink-900/45">
                  No follow-ups scheduled for this lead yet.
                </p>
              )}
            </div>
          </Card>

          {/* activity timeline */}
          <Card className="p-5">
            <h2 className="text-sm font-bold text-ink-900">Activity</h2>
            <ol className="mt-4 space-y-4 border-l border-mist-200 pl-5">
              {activity.map((a, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[27px] grid size-5 place-items-center rounded-full bg-brand-50 text-brand-600 ring-4 ring-white">
                    {a.icon}
                  </span>
                  <p className="text-sm text-ink-900">{a.text}</p>
                  <p className="text-xs text-ink-900/45">{a.when}</p>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}
