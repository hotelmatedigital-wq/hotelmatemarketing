import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { Card, PageHeader } from "@/components/ui";

export default function FollowUpsPage() {
  return (
    <div>
      <PageHeader
        title="Follow-ups"
        subtitle="No sample follow-ups are included. Future reminders will be created from your real lead records."
        actions={
          <span className="rounded-xl border border-mist-200 bg-white px-4 py-2.5 text-sm">
            <strong className="text-brand-600">0</strong> scheduled
          </span>
        }
      />

      <Card className="border-dashed p-10 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <CalendarClock className="size-6" />
        </span>
        <h2 className="mt-3 text-base font-bold text-ink-900">
          No real follow-ups scheduled
        </h2>
        <p className="mx-auto mt-1 max-w-lg text-sm leading-relaxed text-ink-900/50">
          Demo reminders were removed. For now, record the next action in each lead&apos;s Sales Note and update its sales status from the lead profile.
        </p>
        <Link
          href="/leads"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-600"
        >
          Open Real Leads <ArrowRight className="size-4" />
        </Link>
      </Card>
    </div>
  );
}
