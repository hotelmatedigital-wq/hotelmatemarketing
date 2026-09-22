import { NextResponse } from "next/server";
import { createLead, getAllLeads } from "@/lib/store";
import { DatabaseConfigurationError } from "@/lib/db";
import {
  RequestValidationError,
  validateLeadInput,
} from "@/lib/validation";

// Always fresh — never cache the lead list.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

/** GET /api/leads — persisted real leads, newest first. */
export async function GET() {
  try {
    const leads = await getAllLeads();
    return NextResponse.json(leads, { headers: NO_STORE_HEADERS });
  } catch (error) {
    if (error instanceof DatabaseConfigurationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 503, headers: NO_STORE_HEADERS }
      );
    }
    console.error("Unable to read leads", error);
    return NextResponse.json(
      { error: "Unable to load leads from PostgreSQL" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

/** POST /api/leads — capture a new lead (intake form or admin). */
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

  let input: ReturnType<typeof validateLeadInput>;
  try {
    input = validateLeadInput(payload);
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
    const lead = await createLead(input);
    return NextResponse.json(lead, {
      status: 201,
      headers: NO_STORE_HEADERS,
    });
  } catch (error) {
    if (error instanceof DatabaseConfigurationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 503, headers: NO_STORE_HEADERS }
      );
    }
    console.error("Unable to create lead", error);
    return NextResponse.json(
      { error: "Unable to save the lead to PostgreSQL" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
