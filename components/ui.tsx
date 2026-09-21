import type { LucideIcon } from "lucide-react";
import { Globe, MessageCircle, DoorOpen, UserPlus } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "./brand-icons";
import type { LeadSource, LeadStatus } from "@/lib/types";
import { sourceLabels } from "@/lib/data";

/* ---------- page header ---------- */

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-ink-900/55">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ---------- card ---------- */

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-mist-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- KPI stat card ---------- */

const TONES = {
  brand: "bg-brand-50 text-brand-600",
  green: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
} as const;

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = "brand",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  tone?: keyof typeof TONES;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-900/50">
            {label}
          </p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900">
            {value}
          </p>
          {sub && <p className="mt-1 text-xs text-ink-900/45">{sub}</p>}
        </div>
        <div className={`grid size-11 place-items-center rounded-xl ${TONES[tone]}`}>
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  );
}

/* ---------- status badge ---------- */

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-brand-50 text-brand-700 ring-brand-500/25",
  contacted: "bg-amber-50 text-amber-700 ring-amber-500/25",
  qualified: "bg-violet-50 text-violet-700 ring-violet-500/25",
  proposal: "bg-sky-50 text-sky-700 ring-sky-500/25",
  won: "bg-emerald-50 text-emerald-700 ring-emerald-500/25",
  lost: "bg-rose-50 text-rose-600 ring-rose-500/25",
};

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

/* ---------- source badge ---------- */

const SOURCE_ICONS: Record<
  LeadSource,
  React.ComponentType<{ className?: string }>
> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  whatsapp: MessageCircle,
  website: Globe,
  walkin: DoorOpen,
  manual: UserPlus,
};

const SOURCE_COLORS: Record<LeadSource, string> = {
  facebook: "bg-blue-50 text-blue-600",
  instagram: "bg-pink-50 text-pink-600",
  whatsapp: "bg-emerald-50 text-emerald-600",
  website: "bg-mist-100 text-ink-700",
  walkin: "bg-orange-50 text-orange-600",
  manual: "bg-mist-100 text-ink-700",
};

export function SourceBadge({ source }: { source: LeadSource }) {
  const Icon = SOURCE_ICONS[source];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-900/70">
      <span
        className={`grid size-6 place-items-center rounded-md ${SOURCE_COLORS[source]}`}
      >
        <Icon className="size-3.5" />
      </span>
      {sourceLabels[source]}
    </span>
  );
}

/* ---------- avatar chip ---------- */

export function OwnerChip({ name }: { name: string }) {
  const init = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-900/70">
      <span className="grid size-6 place-items-center rounded-full bg-ink-900 text-[10px] font-bold text-white">
        {init}
      </span>
      {name.split(" ")[0]}
    </span>
  );
}
