import "server-only";
import { calculateRecommendation } from "./data";
import { database } from "./db";
import type { ClientAssessment, Lead } from "./types";

/**
 * Supabase PostgreSQL lead repository.
 *
 * The connection is lazy, so `next build` never needs database access. At
 * runtime DATABASE_URL must point to the Supabase transaction pooler or direct
 * PostgreSQL connection.
 */

interface LeadRow {
  id: string;
  name: string;
  hotel: string;
  location: string;
  phone: string;
  email: string | null;
  source: Lead["source"];
  campaign: string;
  interest: string;
  budget_lkr: string | number | null;
  status: Lead["status"];
  assigned_to: string;
  note: string | null;
  form_status: Lead["formStatus"];
  assessment: ClientAssessment | string | null;
  created_at: Date | string;
  updated_at: Date | string | null;
}

function isoDate(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function parseAssessment(
  value: ClientAssessment | string | null
): ClientAssessment | undefined {
  if (value === null) return undefined;
  return typeof value === "string"
    ? (JSON.parse(value) as ClientAssessment)
    : value;
}

function toLead(row: LeadRow): Lead {
  return {
    id: row.id,
    name: row.name,
    hotel: row.hotel,
    location: row.location,
    phone: row.phone,
    email: row.email ?? undefined,
    source: row.source,
    campaign: row.campaign,
    interest: row.interest,
    budgetLKR:
      row.budget_lkr === null ? undefined : Number(row.budget_lkr),
    status: row.status,
    assignedTo: row.assigned_to,
    note: row.note ?? undefined,
    formStatus: row.form_status,
    assessment: parseAssessment(row.assessment),
    createdAt: isoDate(row.created_at),
    updatedAt: row.updated_at ? isoDate(row.updated_at) : undefined,
  };
}

function assessmentJson(
  assessment: ClientAssessment | undefined
): string | null {
  return assessment ? JSON.stringify(assessment) : null;
}

/** Return only persisted real leads, newest first. */
export async function getAllLeads(): Promise<Lead[]> {
  const sql = await database();
  const rows = await sql<LeadRow[]>`
    SELECT *
    FROM public.leads
    ORDER BY created_at DESC
  `;
  return rows.map(toLead);
}

export async function getLead(id: string): Promise<Lead | undefined> {
  if (!/^L-\d+$/.test(id)) return undefined;
  const sql = await database();
  const rows = await sql<LeadRow[]>`
    SELECT *
    FROM public.leads
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0] ? toLead(rows[0]) : undefined;
}

export interface NewLeadInput {
  name: string;
  phone: string;
  email?: string;
  hotel?: string;
  location?: string;
  interest?: string;
  budgetLKR?: number;
  note?: string;
  source?: Lead["source"];
  campaign?: string;
  status?: Lead["status"];
  assignedTo?: string;
  formStatus?: "pending" | "submitted";
  assessment?: ClientAssessment;
}

/** Create and persist a real lead in PostgreSQL. */
export async function createLead(input: NewLeadInput): Promise<Lead> {
  const sql = await database();
  const rows = await sql<LeadRow[]>`
    INSERT INTO public.leads (
      name,
      phone,
      email,
      hotel,
      location,
      interest,
      budget_lkr,
      status,
      assigned_to,
      source,
      campaign,
      note,
      form_status,
      assessment
    ) VALUES (
      ${input.name.trim()},
      ${input.phone.trim()},
      ${input.email?.trim() || null},
      ${input.hotel?.trim() || "Property not provided"},
      ${input.location?.trim() || "Not provided"},
      ${input.interest?.trim() || "Not specified"},
      ${input.budgetLKR ?? null},
      ${input.assessment ? "qualified" : (input.status ?? "new")},
      ${input.assignedTo?.trim() || "Unassigned"},
      ${input.source ?? "manual"},
      ${input.campaign?.trim() || "Manual entry"},
      ${input.note?.trim() || null},
      ${input.formStatus ?? (input.assessment ? "submitted" : "pending")},
      ${assessmentJson(input.assessment)}::JSONB
    )
    RETURNING *
  `;
  return toLead(rows[0]);
}

export interface UpdateLeadInput {
  status?: Lead["status"];
  budgetLKR?: number | null;
  assignedTo?: string;
  note?: string | null;
}

/** Atomically update only the supplied sales fields for a persisted lead. */
export async function updateLead(
  id: string,
  input: UpdateLeadInput
): Promise<Lead | undefined> {
  const hasStatus = input.status !== undefined;
  const hasBudget = input.budgetLKR !== undefined;
  const hasAssignee = input.assignedTo !== undefined;
  const hasNote = input.note !== undefined;
  const sql = await database();
  const rows = await sql<LeadRow[]>`
    UPDATE public.leads
    SET
      status = CASE
        WHEN ${hasStatus} THEN ${input.status ?? null}
        ELSE status
      END,
      budget_lkr = CASE
        WHEN ${hasBudget} THEN ${input.budgetLKR ?? null}
        ELSE budget_lkr
      END,
      assigned_to = CASE
        WHEN ${hasAssignee} THEN ${input.assignedTo?.trim() || "Unassigned"}
        ELSE assigned_to
      END,
      note = CASE
        WHEN ${hasNote} THEN ${input.note?.trim() || null}
        ELSE note
      END,
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] ? toLead(rows[0]) : undefined;
}

/** Permanently remove a persisted lead. */
export async function deleteLead(id: string): Promise<boolean> {
  const sql = await database();
  const rows = await sql<{ id: string }[]>`
    DELETE FROM public.leads
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}

export interface SubmitAssessmentInput {
  leadId?: string;
  name: string;
  phone: string;
  email?: string;
  businessName: string;
  businessArea: string;
  hotelCategory: ClientAssessment["hotelCategory"];
  roomsCount: number;
  hasRestaurant: boolean;
  hasSpa: boolean;
  usedPmsBefore: boolean;
  currentlyUsingPms: boolean;
  usedChannelManagerBefore: boolean;
  currentlyUsingChannelManager: boolean;
  otasManaged: ClientAssessment["otasManaged"];
  otasOtherText?: string;
  foundUs: ClientAssessment["foundUs"];
  foundUsOtherText?: string;
  demoDate: string;
  demoTime: string;
}

/** Compute the recommendation and update or create a PostgreSQL lead row. */
export async function submitAssessment(
  input: SubmitAssessmentInput
): Promise<Lead> {
  const recommendation = calculateRecommendation({
    businessName: input.businessName,
    businessArea: input.businessArea,
    hotelCategory: input.hotelCategory,
    roomsCount: input.roomsCount,
    hasRestaurant: input.hasRestaurant,
    hasSpa: input.hasSpa,
    usedPmsBefore: input.usedPmsBefore,
    currentlyUsingPms: input.currentlyUsingPms,
    usedChannelManagerBefore: input.usedChannelManagerBefore,
    currentlyUsingChannelManager: input.currentlyUsingChannelManager,
    otasManaged: input.otasManaged,
    otasOtherText: input.otasOtherText,
    foundUs: input.foundUs,
    foundUsOtherText: input.foundUsOtherText,
    demoDate: input.demoDate,
    demoTime: input.demoTime,
  });

  const assessment: ClientAssessment = {
    submittedAt: new Date().toISOString(),
    businessName: input.businessName.trim(),
    businessArea: input.businessArea.trim(),
    hotelCategory: input.hotelCategory,
    roomsCount: input.roomsCount,
    hasRestaurant: input.hasRestaurant,
    hasSpa: input.hasSpa,
    usedPmsBefore: input.usedPmsBefore,
    currentlyUsingPms: input.currentlyUsingPms,
    usedChannelManagerBefore: input.usedChannelManagerBefore,
    currentlyUsingChannelManager: input.currentlyUsingChannelManager,
    otasManaged: input.otasManaged,
    otasOtherText: input.otasOtherText?.trim(),
    foundUs: input.foundUs,
    foundUsOtherText: input.foundUsOtherText?.trim(),
    demoDate: input.demoDate,
    demoTime: input.demoTime,
    recommendation,
  };

  if (!input.leadId) {
    return createLead({
      name: input.name,
      phone: input.phone,
      email: input.email,
      hotel: input.businessName,
      location: input.businessArea,
      interest: `${input.hotelCategory} (${input.roomsCount} rms) · ${recommendation.packageName}`,
      budgetLKR: recommendation.monthlyLKR,
      source: "whatsapp",
      campaign: "WhatsApp Assessment Form",
      formStatus: "submitted",
      assessment,
    });
  }

  const sql = await database();
  const rows = await sql<LeadRow[]>`
    UPDATE public.leads
    SET
      name = ${input.name.trim()},
      phone = ${input.phone.trim()},
      email = COALESCE(${input.email?.trim() || null}, email),
      hotel = ${input.businessName.trim()},
      location = ${input.businessArea.trim()},
      interest = ${`${input.hotelCategory} (${input.roomsCount} rms) · ${recommendation.packageName}`},
      budget_lkr = COALESCE(budget_lkr, ${recommendation.monthlyLKR}),
      status = 'qualified',
      form_status = 'submitted',
      assessment = ${assessmentJson(assessment)}::JSONB,
      updated_at = NOW()
    WHERE id = ${input.leadId}
    RETURNING *
  `;

  if (!rows[0]) throw new Error(`Lead ${input.leadId} was not found`);
  return toLead(rows[0]);
}
