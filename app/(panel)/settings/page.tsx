import { Database, Phone, Plug, ShieldCheck, UserPlus } from "lucide-react";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/brand-icons";
import { HotelMateIcon } from "@/components/HotelMateLogo";
import { Card, PageHeader } from "@/components/ui";
import { HOTLINE } from "@/lib/data";
import { isDatabaseConfigured } from "@/lib/db";

function StatusPill({ state }: { state: "active" | "off" }) {
  const map = {
    active: ["bg-emerald-50 text-emerald-700 ring-emerald-500/25", "Active"],
    off: ["bg-mist-100 text-ink-900/50 ring-mist-300", "Not Connected"],
  } as const;
  const [className, label] = map[state];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${className}`}>
      {label}
    </span>
  );
}

export default function SettingsPage() {
  const databaseConnected = isDatabaseConfigured();

  return (
    <div>
      <PageHeader
        title="Settings & Integrations"
        subtitle="Real leads are stored in Supabase PostgreSQL. External marketing integrations remain disconnected until credentials are configured."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <UserPlus className="size-6" />
            </span>
            <StatusPill state="active" />
          </div>
          <h2 className="mt-4 text-base font-bold text-ink-900">Manual Lead Entry</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-900/60">
            Add genuine inquiries from phone calls, WhatsApp, Facebook, Instagram, your website or walk-ins. No sample records are injected.
          </p>
          <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="size-3.5" /> Ready to save real leads
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-violet-50 text-violet-600">
              <Database className="size-6" />
            </span>
            <StatusPill state={databaseConnected ? "active" : "off"} />
          </div>
          <h2 className="mt-4 text-base font-bold text-ink-900">Supabase PostgreSQL</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-900/60">
            Leads, assessments and sales updates are stored in the shared PostgreSQL table, so they persist across Vercel deployments and serverless instances.
          </p>
          <p className="mt-3 text-xs text-ink-900/45">
            Server secret: <code className="rounded bg-mist-100 px-1.5 py-0.5">DATABASE_URL</code>
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <FacebookIcon className="size-6" />
            </span>
            <StatusPill state="off" />
          </div>
          <h2 className="mt-4 text-base font-bold text-ink-900">Facebook Lead Ads</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-900/60">
            Until OAuth and webhooks are configured, enter Facebook leads manually and select Facebook Lead Form as their source.
          </p>
          <button disabled className="mt-5 flex cursor-not-allowed items-center gap-2 rounded-lg bg-ink-900/10 px-4 py-2.5 text-sm font-bold text-ink-900/40">
            <Plug className="size-4" /> Credentials required
          </button>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-ink-900 p-2 shadow-sm">
              <HotelMateIcon className="size-full" />
            </span>
            <StatusPill state="off" />
          </div>
          <h2 className="mt-4 text-base font-bold text-ink-900">Hotel Mate PMS API</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-900/60">
            A shared PMS database is not connected yet. The Supabase leads table is the current source of truth for this panel.
          </p>
          <input
            readOnly
            aria-label="Planned API base URL"
            value="https://web.hotelmate.app/api"
            className="mt-4 w-full rounded-lg border border-mist-200 bg-mist-50 px-3 py-2.5 text-sm text-ink-900/70 outline-none"
          />
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <WhatsAppIcon className="size-6" />
            </span>
            <StatusPill state="active" />
          </div>
          <h2 className="mt-4 text-base font-bold text-ink-900">WhatsApp Links</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-900/60">
            Phone and intake-form buttons open WhatsApp with pre-filled messages. The WhatsApp Business API itself is not connected.
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-pink-50 text-pink-600">
              <InstagramIcon className="size-6" />
            </span>
            <StatusPill state="off" />
          </div>
          <h2 className="mt-4 text-base font-bold text-ink-900">Instagram DM &amp; Ads</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-900/60">
            Enter Instagram inquiries manually and select Instagram as the source until Meta integration credentials are available.
          </p>
        </Card>
      </div>

      <Card className="mt-6 bg-ink-900 p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold">Owner Contact</h2>
            <p className="mt-1 text-sm text-white/55">Sales &amp; management contact for this panel</p>
          </div>
          <a
            href="tel:+94788607143"
            className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 transition-colors hover:bg-white/15"
          >
            <span className="grid size-10 place-items-center rounded-lg bg-brand-500"><Phone className="size-5" /></span>
            <span className="text-lg font-extrabold tracking-wide">{HOTLINE}</span>
          </a>
        </div>
      </Card>
    </div>
  );
}
