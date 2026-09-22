import { NextResponse } from "next/server";
import { getLead, submitAssessment } from "@/lib/store";
import { DatabaseConfigurationError } from "@/lib/db";
import {
  RequestValidationError,
  validateAssessmentInput,
} from "@/lib/validation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

/** GET /api/intake?leadId=<lead-id> — fetch prefill details for a client. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const leadId = url.searchParams.get("leadId") || url.searchParams.get("id");

  if (!leadId) {
    return NextResponse.json(
      { prefill: null },
      { headers: NO_STORE_HEADERS }
    );
  }
  if (leadId.length > 24 || !/^L-\d+$/.test(leadId)) {
    return NextResponse.json(
      { error: "Lead ID is invalid" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  try {
    const lead = await getLead(leadId);
    if (!lead) {
      return NextResponse.json(
        { prefill: null },
        { headers: NO_STORE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        prefill: {
          leadId: lead.id,
          name: lead.name,
          phone: lead.phone,
          email: lead.email || "",
          hotel:
            lead.hotel === "Pending Assessment" || lead.hotel === "—"
              ? ""
              : lead.hotel,
          location: lead.location === "—" ? "" : lead.location,
        },
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    if (error instanceof DatabaseConfigurationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 503, headers: NO_STORE_HEADERS }
      );
    }
    console.error("Unable to load intake prefill", error);
    return NextResponse.json(
      { error: "Unable to load the personalized form" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

/** POST /api/intake — client submits the onboarding assessment form. */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  let input: ReturnType<typeof validateAssessmentInput>;
  try {
    input = validateAssessmentInput(payload);
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }
    throw error;
  }

  try {
    if (input.leadId && !(await getLead(input.leadId))) {
      return NextResponse.json(
        { error: "The personalized lead link is no longer valid" },
        { status: 404, headers: NO_STORE_HEADERS }
      );
    }

    const lead = await submitAssessment(input);
    return NextResponse.json(
      {
        success: true,
        leadId: lead.id,
        demoDate: input.demoDate,
        demoTime: input.demoTime,
        recommendation: lead.assessment?.recommendation,
      },
      {
        status: input.leadId ? 200 : 201,
        headers: NO_STORE_HEADERS,
      }
    );
  } catch (error) {
    if (error instanceof DatabaseConfigurationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 503, headers: NO_STORE_HEADERS }
      );
    }
    console.error("Unable to save intake assessment", error);
    return NextResponse.json(
      { error: "Failed to save assessment to PostgreSQL" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
