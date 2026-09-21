"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  CalendarClock,
  Settings,
  Phone,
  Sparkles,
  X,
} from "lucide-react";
import { HOTLINE } from "@/lib/data";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/generator", label: "FB & IG Leads", icon: Sparkles },
  { href: "/leads", label: "Leads & Assessment", icon: Users },
  { href: "/sales", label: "Sales Pipeline", icon: TrendingUp },
  { href: "/followups", label: "Follow-ups", icon: CalendarClock },
  { href: "/settings", label: "Settings", icon: Settings },
];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-500 text-lg font-extrabold text-white shadow-lg shadow-brand-500/30">
        H
      </div>
      <div className="leading-tight">
        <p className="text-sm font-extrabold tracking-widest text-white">
          HOTEL MATE
        </p>
        <p className="text-[11px] font-medium tracking-wide text-brand-300">
          Marketing Panel
        </p>
      </div>
    </div>
  );
}

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink-950/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink-900 transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Logo />
          <button
            onClick={onClose}
            className="rounded-md p-1 text-white/60 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="mt-2 flex-1 space-y-1 px-3">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => onClose()}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-500/15 text-brand-300"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="size-[18px] shrink-0" />
                {label}
                {active && (
                  <span className="ml-auto size-1.5 rounded-full bg-brand-400" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-xl bg-ink-800/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-300">
            Sales Hotline
          </p>
          <a
            href={`tel:${HOTLINE.replace(/\s/g, "")}`}
            className="mt-1 flex items-center gap-2 text-sm font-semibold text-white hover:text-brand-300"
          >
            <Phone className="size-4 text-brand-400" />
            {HOTLINE}
          </a>
          <p className="mt-2 text-[11px] leading-relaxed text-white/40">
            All-in-One · Integrated · AI Powered Hotel Management
          </p>
        </div>
      </aside>
    </>
  );
}
