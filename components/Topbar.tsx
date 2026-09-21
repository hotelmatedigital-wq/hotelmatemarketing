"use client";

import { Menu, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { HotelMateIcon } from "@/components/HotelMateLogo";

export default function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-mist-200 bg-white/85 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenu}
        className="rounded-lg border border-mist-200 p-2 text-ink-700 hover:bg-mist-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      {/* Mobile logo */}
      <Link href="/" className="flex items-center gap-2 lg:hidden">
        <HotelMateIcon className="size-7" />
        <span
          className="text-sm font-black tracking-wider text-ink-900"
          style={{ letterSpacing: "0.06em" }}
        >
          HOTEL MATE
        </span>
      </Link>

      <div className="hidden items-center gap-2 rounded-lg border border-mist-200 bg-mist-50 px-3 py-2 text-sm text-ink-600 sm:flex sm:w-72">
        <Search className="size-4 shrink-0" />
        <span className="text-ink-900/40">Search leads, hotels…</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 sm:flex">
          <Sparkles className="size-3.5" />
          Demo Mode
        </span>

        <Link
          href="/settings"
          className="hidden rounded-lg bg-brand-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-500/30 hover:bg-brand-600 md:block"
        >
          Connect Facebook Leads
        </Link>

        <div className="grid size-9 place-items-center rounded-full bg-ink-900 text-xs font-bold text-white">
          AS
        </div>
      </div>
    </header>
  );
}
