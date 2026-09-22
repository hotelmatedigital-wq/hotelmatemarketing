import AppShell from "@/components/AppShell";
import DatabaseSetupNotice from "@/components/DatabaseSetupNotice";
import { isDatabaseConfigured } from "@/lib/db";

// Database readiness is a runtime concern; never bake it into a Vercel build.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppShell>
      {isDatabaseConfigured() ? children : <DatabaseSetupNotice />}
    </AppShell>
  );
}
