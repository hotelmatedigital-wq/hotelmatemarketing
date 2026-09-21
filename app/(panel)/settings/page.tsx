import {
  Plug,
  Server,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/brand-icons";
import { HotelMateIcon } from "@/components/HotelMateLogo";
import { Card, PageHeader } from "@/components/ui";
import { HOTLINE, team } from "@/lib/data";

function StatusPill({
  state,
}: {
  state: "connected" | "demo" | "off";
}) {
  const map = {
    connected: ["bg-emerald-50 text-emerald-600 ring-emerald-500/25", "Connected"],
    demo: ["bg-amber-50 text-amber-600 ring-amber-500/25", "Demo Mode"],
    off: ["bg-mist-100 text-ink-900/50 ring-mist-300", "Not Connected"],
  } as const;
  const [cls, label] = map[state];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${cls}`}
    >
      {label}
    </span>
  );
}

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings & Integrations"
        subtitle="Connect the panel to Facebook Lead Ads and the Hotel Mate PMS."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Facebook */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <FacebookIcon className="size-6" />
            </span>
            <StatusPill state="off" />
          </div>
          <h2 className="mt-4 text-base font-bold text-ink-900">
            Facebook Lead Ads
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-900/60">
            Pull leads directly from your Facebook Lead Forms — no CSV
            exports. New submissions appear in the Leads tab instantly.
          </p>
          <ul className="mt-3 space-y-1.5 text-xs text-ink-900/55">
            <li>· Page &amp; ad account authorization (OAuth)</li>
            <li>· Auto-match lead form fields → Hotel Mate fields</li>
            <li>· Instant webhook delivery (planned)</li>
          </ul>
          <button
            disabled
            className="mt-5 flex cursor-not-allowed items-center gap-2 rounded-lg bg-ink-900/10 px-4 py-2.5 text-sm font-bold text-ink-900/40"
          >
            <Plug className="size-4" /> Connect — arrives in Step 2
          </button>
        </Card>

        {/* Hotel Mate PMS */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-ink-900 p-2 shadow-sm">
              <HotelMateIcon className="size-full" />
            </span>
            <StatusPill state="demo" />
          </div>
          <h2 className="mt-4 text-base font-bold text-ink-900">
            Hotel Mate PMS API
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-900/60">
            Marketing panel talks to the existing Hotel Mate system (Next.js)
            through its API — one shared customer &amp; booking database.
          </p>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-ink-900/50">
            API Base URL
          </label>
          <input
            readOnly
            value="https://web.hotelmate.app/api"
            className="mt-1.5 w-full rounded-lg border border-mist-200 bg-mist-50 px-3 py-2.5 text-sm text-ink-900/70 outline-none"
          />
          <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-900/45">
            <ShieldCheck className="size-3.5 text-brand-500" />
            Running on demo data until API credentials are configured (Step 3)
          </p>
        </Card>

        {/* WhatsApp */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <WhatsAppIcon className="size-6" />
            </span>
            <StatusPill state="off" />
          </div>
          <h2 className="mt-4 text-base font-bold text-ink-900">
            WhatsApp Business
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-900/60">
            One-click follow-ups and template messages for leads captured from
            social campaigns.
          </p>
          <button
            disabled
            className="mt-5 cursor-not-allowed rounded-lg bg-ink-900/10 px-4 py-2.5 text-sm font-bold text-ink-900/40"
          >
            Connect — planned for Step 4
          </button>
        </Card>

        {/* Instagram */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-pink-50 text-pink-600">
              <InstagramIcon className="size-6" />
            </span>
            <StatusPill state="off" />
          </div>
          <h2 className="mt-4 text-base font-bold text-ink-900">
            Instagram DM &amp; Ads
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-900/60">
            Instagram lead forms and DM inquiries funnel into the same
            pipeline — same view, same follow-up flow.
          </p>
          <button
            disabled
            className="mt-5 cursor-not-allowed rounded-lg bg-ink-900/10 px-4 py-2.5 text-sm font-bold text-ink-900/40"
          >
            Connect — planned for Step 4
          </button>
        </Card>
      </div>

      {/* team */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-base font-bold text-ink-900">Sales Team</h2>
          <div className="mt-4 divide-y divide-mist-100">
            {team.map((m) => (
              <div key={m.name} className="flex items-center gap-3 py-3">
                <span className="grid size-9 place-items-center rounded-full bg-ink-900 text-xs font-bold text-white">
                  {m.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    {m.name}
                  </p>
                  <p className="text-xs text-ink-900/50">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-ink-900 p-6 text-white">
          <h2 className="text-base font-bold">Owner Contact</h2>
          <p className="mt-1 text-sm text-white/55">
            Primary contact for this panel
          </p>
          <a
            href="tel:+94788607143"
            className="mt-5 flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3.5 transition-colors hover:bg-white/15"
          >
            <span className="grid size-10 place-items-center rounded-lg bg-brand-500">
              <Phone className="size-5" />
            </span>
            <span>
              <span className="block text-lg font-extrabold tracking-wide">
                {HOTLINE}
              </span>
              <span className="text-xs text-white/50">
                Call / WhatsApp · Sales &amp; Management
              </span>
            </span>
          </a>
          <p className="mt-4 text-xs leading-relaxed text-white/40">
            Demo build — data resets on restart. Connect Facebook Lead Ads and
            the Hotel Mate PMS API to go live.
          </p>
        </Card>
      </div>
    </div>
  );
}
