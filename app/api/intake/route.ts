import { NextResponse } from "next/server";
import { getLead, submitAssessment } from "@/lib/store";
import type { HotelCategory, OTAPlatform, FindUsSource } from "@/lib/types";

export const dynamic = "force-dynamic";

/** GET /api/intake?leadId=L-1043 — fetch prefill details for client */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const leadId = url.searchParams.get("leadId") || url.searchParams.get("id");

  if (!leadId) {
    return NextResponse.json({ prefill: null });
  }

  const lead = await getLead(leadId);
  if (!lead) {
    return NextResponse.json({ prefill: null });
  }

  return NextResponse.json({
    prefill: {
      leadId: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email || "",
      hotel: lead.hotel === "Pending Assessment" || lead.hotel === "—" ? "" : lead.hotel,
      location: lead.location === "—" ? "" : lead.location,
    },
  });
}

/** POST /api/intake — client submits the onboarding assessment form */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const businessName = String(body.businessName ?? "").trim();
  const businessArea = String(body.businessArea ?? "").trim();

  if (!name) {
    return NextResponse.json({ error: "Your name is required" }, { status: 400 });
  }
  if (!phone || phone.replace(/[^\d]/g, "").length < 7) {
    return NextResponse.json(
      { error: "A valid mobile / WhatsApp number is required" },
      { status: 400 }
    );
  }
  if (!businessName) {
    return NextResponse.json(
      { error: "Business / Hotel name is required" },
      { status: 400 }
    );
  }
  if (!businessArea) {
    return NextResponse.json(
      { error: "Business area / location is required" },
      { status: 400 }
    );
  }

  const email = String(body.email ?? "").trim();
  const hotelCategory = (body.hotelCategory as HotelCategory) || "Boutique Hotel";
  const roomsCount = Math.max(1, parseInt(String(body.roomsCount ?? "1"), 10) || 1);

  const hasRestaurant = Boolean(body.hasRestaurant);
  const hasSpa = Boolean(body.hasSpa);
  const usedPmsBefore = Boolean(body.usedPmsBefore);
  const currentlyUsingPms = Boolean(body.currentlyUsingPms);
  const usedChannelManagerBefore = Boolean(body.usedChannelManagerBefore);
  const currentlyUsingChannelManager = Boolean(body.currentlyUsingChannelManager);

  const otasManaged = Array.isArray(body.otasManaged)
    ? (body.otasManaged as OTAPlatform[])
    : [];

  const foundUs = (body.foundUs as FindUsSource) || "Social Media";
  const demoDate = String(body.demoDate ?? "").trim() || new Date().toISOString().split("T")[0];
  const demoTime = String(body.demoTime ?? "").trim() || "10:00 AM";

  try {
    const lead = await submitAssessment({
      leadId: body.leadId ? String(body.leadId) : undefined,
      name,
      phone,
      email: email || undefined,
      businessName,
      businessArea,
      hotelCategory,
      roomsCount,
      hasRestaurant,
      hasSpa,
      usedPmsBefore,
      currentlyUsingPms,
      usedChannelManagerBefore,
      currentlyUsingChannelManager,
      otasManaged,
      otasOtherText: body.otasOtherText ? String(body.otasOtherText) : undefined,
      foundUs,
      foundUsOtherText: body.foundUsOtherText ? String(body.foundUsOtherText) : undefined,
      demoDate,
      demoTime,
    });

    return NextResponse.json(
      {
        success: true,
        leadId: lead.id,
        demoDate,
        demoTime,
        recommendation: lead.assessment?.recommendation,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save assessment" },
      { status: 500 }
    );
  }
}
