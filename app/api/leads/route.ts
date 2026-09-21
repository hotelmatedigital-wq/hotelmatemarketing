import { NextResponse } from "next/server";
import { createLead, getAllLeads } from "@/lib/store";

// Always fresh — never cache the lead list.
export const dynamic = "force-dynamic";

/** GET /api/leads — all leads (demo seed + captured), newest first. */
export async function GET() {
  const leads = await getAllLeads();
  return NextResponse.json(leads);
}

/** POST /api/leads — capture a new lead (intake form or admin). */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!phone || phone.replace(/[^\d]/g, "").length < 7) {
    return NextResponse.json(
      { error: "A valid phone / WhatsApp number is required" },
      { status: 400 }
    );
  }

  const email = String(body.email ?? "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Email address looks invalid" },
      { status: 400 }
    );
  }

  const budget = Number(body.budgetLKR);

  const lead = await createLead({
    name,
    phone,
    email: email || undefined,
    hotel: body.hotel ? String(body.hotel) : undefined,
    location: body.location ? String(body.location) : undefined,
    interest: body.interest ? String(body.interest) : undefined,
    budgetLKR: Number.isFinite(budget) && budget > 0 ? budget : undefined,
    note: body.note ? String(body.note) : undefined,
    source:
      body.source === "manual" ||
      body.source === "walkin" ||
      body.source === "whatsapp" ||
      body.source === "instagram" ||
      body.source === "facebook" ||
      body.source === "website"
        ? body.source
        : "website",
    campaign: body.campaign ? String(body.campaign) : undefined,
  });

  return NextResponse.json(lead, { status: 201 });
}
