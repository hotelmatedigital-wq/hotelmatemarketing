import { getAllLeads } from "@/lib/store";
import { isDatabaseConfigured } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import LeadsBrowser from "./LeadsBrowser";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ add?: string | string[] }>;
}) {
  if (!isDatabaseConfigured()) return null;
  const [leads, query] = await Promise.all([getAllLeads(), searchParams]);
  const openOnLoad = query.add === "1";

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle="Only real inquiries entered manually or submitted through the intake form appear here."
      />
      <LeadsBrowser
        key={openOnLoad ? "add-lead" : "lead-browser"}
        initialLeads={leads}
        openOnLoad={openOnLoad}
      />
    </div>
  );
}
