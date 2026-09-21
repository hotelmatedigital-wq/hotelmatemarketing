import { getAllLeads } from "@/lib/store";
import { PageHeader } from "@/components/ui";
import LeadsBrowser from "./LeadsBrowser";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await getAllLeads();

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle="Inquiries captured from social media, the intake form & manual entry."
      />
      <LeadsBrowser initialLeads={leads} />
    </div>
  );
}
