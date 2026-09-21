"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Mail,
  MessageCircle,
  Phone,
  Smartphone,
  Users,
} from "lucide-react";
import { Card, OwnerChip, PageHeader } from "@/components/ui";
import { followUps as seed } from "@/lib/data";
import { fmtTime, isOverdue, isToday } from "@/lib/format";
import type { FollowUp, FollowUpType } from "@/lib/types";

const TYPE_ICONS: Record<FollowUpType, React.ReactNode> = {
  call: <Phone className="size-4" />,
  whatsapp: <MessageCircle className="size-4" />,
  email: <Mail className="size-4" />,
  meeting: <Users className="size-4" />,
  sms: <Smartphone className="size-4" />,
};

const TYPE_TONES: Record<FollowUpType, string> = {
  call: "bg-brand-50 text-brand-600",
  whatsapp: "bg-emerald-50 text-emerald-600",
  email: "bg-sky-50 text-sky-600",
  meeting: "bg-violet-50 text-violet-600",
  sms: "bg-amber-50 text-amber-600",
};

function FollowUpRow({
  item,
  onToggle,
}: {
  item: FollowUp;
  onToggle: (id: string) => void;
}) {
  const overdue = !item.done && isOverdue(item.dueAt);
  return (
    <div
      className={`flex items-center gap-3 px-5 py-3.5 transition-opacity ${
        item.done ? "opacity-50" : ""
      }`}
    >
      <button
        onClick={() => onToggle(item.id)}
        className="shrink-0 text-ink-900/30 hover:text-brand-600"
        aria-label="Toggle done"
      >
        {item.done ? (
          <CheckCircle2 className="size-5 text-emerald-500" />
        ) : (
          <Circle className="size-5" />
        )}
      </button>
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-lg ${TYPE_TONES[item.type]}`}
      >
        {TYPE_ICONS[item.type]}
      </span>
      <div className="min-w-0 flex-1">
        <Link
          href={`/leads/${item.leadId}`}
          className={`block truncate text-sm font-semibold hover:text-brand-600 ${
            item.done ? "text-ink-900/50 line-through" : "text-ink-900"
          }`}
        >
          {item.leadName}
        </Link>
        <p className="truncate text-xs text-ink-900/50">{item.note}</p>
      </div>
      <div className="hidden text-right sm:block">
        <p
          className={`text-xs font-bold ${
            overdue ? "text-rose-500" : "text-ink-900/70"
          }`}
        >
          {fmtTime(item.dueAt)}
        </p>
        <OwnerChip name={item.owner} />
      </div>
    </div>
  );
}

export default function FollowUpsPage() {
  const [items, setItems] = useState(seed);

  const toggle = (id: string) =>
    setItems((prev) =>
      prev.map((f) => (f.id === id ? { ...f, done: !f.done } : f))
    );

  const overdue = items.filter((f) => !f.done && isOverdue(f.dueAt));
  const today = items.filter(
    (f) => !f.done && isToday(f.dueAt) && !isOverdue(f.dueAt)
  );
  const upcoming = items.filter(
    (f) => !f.done && !isToday(f.dueAt) && !isOverdue(f.dueAt)
  );
  const done = items.filter((f) => f.done);

  const sections = [
    { title: "Overdue", tone: "text-rose-500", items: overdue },
    { title: "Today", tone: "text-brand-600", items: today },
    { title: "Upcoming", tone: "text-ink-900", items: upcoming },
  ];

  return (
    <div>
      <PageHeader
        title="Follow-ups"
        subtitle="Never let a lead go cold — every inquiry gets a next step."
        actions={
          <span className="rounded-xl border border-mist-200 bg-white px-4 py-2.5 text-sm">
            <strong className="text-brand-600">
              {items.filter((f) => !f.done).length}
            </strong>{" "}
            open · <strong className="text-emerald-600">{done.length}</strong>{" "}
            done
          </span>
        }
      />

      <div className="space-y-6">
        {sections.map(({ title, tone, items: rows }) => (
          <div key={title}>
            <h2 className={`mb-3 text-sm font-bold uppercase tracking-wide ${tone}`}>
              {title}{" "}
              <span className="ml-1 rounded-full bg-mist-200 px-2 py-0.5 text-[11px] text-ink-900/60">
                {rows.length}
              </span>
            </h2>
            <Card className="divide-y divide-mist-100">
              {rows.map((f) => (
                <FollowUpRow key={f.id} item={f} onToggle={toggle} />
              ))}
              {rows.length === 0 && (
                <p className="px-5 py-6 text-sm text-ink-900/40">
                  Nothing here.
                </p>
              )}
            </Card>
          </div>
        ))}

        {done.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-emerald-600">
              Completed{" "}
              <span className="ml-1 rounded-full bg-mist-200 px-2 py-0.5 text-[11px] text-ink-900/60">
                {done.length}
              </span>
            </h2>
            <Card className="divide-y divide-mist-100">
              {done.map((f) => (
                <FollowUpRow key={f.id} item={f} onToggle={toggle} />
              ))}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
