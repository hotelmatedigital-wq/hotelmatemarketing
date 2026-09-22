import { NextResponse } from "next/server";
import { deleteLead, updateLead } from "@/lib/store";
import { DatabaseConfigurationError } from "@/lib/db";
import {
  RequestValidationError,
  validateLeadUpdate,
} from "@/lib/validation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

function validLeadId(id: string): boolean {
  return id.length <= 24 && /^L-\d+$/.test(id);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!validLeadId(id)) {
    return NextResponse.json(
      { error: "Lead ID is invalid" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  let input: ReturnType<typeof validateLeadUpdate>;
  try {
    input = validateLeadUpdate(payload);
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
    const lead = await updateLead(id, input);
    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404, headers: NO_STORE_HEADERS }
      );
    }
    return NextResponse.json(lead, { headers: NO_STORE_HEADERS });
  } catch (error) {
    if (error instanceof DatabaseConfigurationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 503, headers: NO_STORE_HEADERS }
      );
    }
    console.error("Unable to update lead", error);
    return NextResponse.json(
      { error: "Unable to update the PostgreSQL lead" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!validLeadId(id)) {
    return NextResponse.json(
      { error: "Lead ID is invalid" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  try {
    if (!(await deleteLead(id))) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404, headers: NO_STORE_HEADERS }
      );
    }
    return new NextResponse(null, { status: 204, headers: NO_STORE_HEADERS });
  } catch (error) {
    if (error instanceof DatabaseConfigurationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 503, headers: NO_STORE_HEADERS }
      );
    }
    console.error("Unable to delete lead", error);
    return NextResponse.json(
      { error: "Unable to delete the PostgreSQL lead" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
