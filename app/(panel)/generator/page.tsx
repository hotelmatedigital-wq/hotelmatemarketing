import { getAllLeads } from "@/lib/store";
import { PageHeader } from "@/components/ui";
import GeneratorClient from "./GeneratorClient";

export const dynamic = "force-dynamic";

export default async function GeneratorPage() {
  const allLeads = await getAllLeads();
  // Filter leads originating from FB / IG or manual generator
  const fbIgLeads = allLeads.filter(
    (l) =>
      l.source === "facebook" ||
      l.source === "instagram" ||
      l.campaign.includes("FB") ||
      l.campaign.includes("IG") ||
      l.campaign.includes("Generator")
  );

  return (
    <div>
      <PageHeader
        title="FB & IG Lead Generator"
        subtitle="Capture Facebook & Instagram leads, generate personalized onboarding links, and launch pre-filled WhatsApp messages with one click."
      />
      <GeneratorClient initialLeads={fbIgLeads} />
    </div>
  );
}
