"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <footer className="border-t border-mist-200 px-6 py-4 text-center text-xs text-ink-900/40">
          HOTEL MATE Marketing Panel · Real Lead Workspace · hotelmate.co.uk ·
          Hotline +94 78 860 7143
        </footer>
      </div>
    </div>
  );
}
