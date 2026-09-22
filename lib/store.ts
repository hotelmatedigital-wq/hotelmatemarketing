import "server-only";
import type { Prisma } from "@/lib/generated/prisma/client";
import type { Lead as LeadRow } from "@/lib/generated/prisma/client";
import { prisma } from "./db";
import { calculateRecommendation } from "./data";
import type { ClientAssessment, Lead, LeadSource, LeadStatus } from "./types";

/**
 * Server-side lead store — PostgreSQL via Prisma.
 *
 * Leads captured from the FB/IG generator, the public intake form, or panel
 * entry are persisted permanently (Vercel-safe). Public lead IDs use the
 * human-friendly `L-####` format backed by the `leads.seq` identity column.
 */

const LEAD_ID_PATTERN = /^L-(\d+)$/;

/** Parse a public lead id (`L-1001`) into its database sequence number. */
function parseLeadSeq(id: string): number | null {
  const match = LEAD_ID_PATTERN.exec(id);
  if (!match) return null;
  const seq = parseInt(match[1], 10);
  return Number.isFinite(seq) && seq > 0 ? seq : null;
}

function toLead(row: LeadRow): Lead {
  return {
    id: `L-${row.seq}`,
    name: row.name,
    phone: row.phone,
    email: row.email ?? undefined,
    hotel: row.hotel,
    location: row.location,
    interest: row.interest,
    budgetLKR: row.budgetLkr ?? undefined,
    status: row.status as LeadStatus,
    assignedTo: row.assignedTo,
    createdAt: row.createdAt.toISOString(),
    source: row.source as LeadSource,
    campaign: row.campaign,
    note: row.note ?? undefined,
    formStatus: row.formStatus === "submitted" ? "submitted" : "pending",
    assessment:
      (row.assessment as ClientAssessment | null) ?? undefined,
  };
}

/** All leads, newest first. */
export async function getAllLeads(): Promise<Lead[]> {
  const rows = await prisma.lead.findMany({
    orderBy: [{ createdAt: "desc" }, { seq: "desc" }],
  });
  return rows.map(toLead);
}

export async function getLead(id: string): Promise<Lead | undefined> {
  const seq = parseLeadSeq(id);
  if (seq === null) return undefined;
  const row = await prisma.lead.findUnique({ where: { seq } });
  return row ? toLead(row) : undefined;
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
  formStatus?: "pending" | "submitted";
  assessment?: ClientAssessment;
}

/** Create + persist a new lead. */
export async function createLead(input: NewLeadInput): Promise<Lead> {
  const row = await prisma.lead.create({
    data: {
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email?.trim() || null,
      hotel: input.hotel?.trim() || "Pending Assessment",
      location: input.location?.trim() || "—",
      interest: input.interest?.trim() || "Social Media Lead (FB/IG)",
      budgetLkr: input.budgetLKR ?? null,
      status: input.assessment ? "qualified" : "new",
      assignedTo: "Unassigned",
      source: input.source ?? "facebook",
      campaign: input.campaign ?? "FB & IG Lead Generator",
      note: input.note?.trim() || null,
      formStatus: input.formStatus ?? (input.assessment ? "submitted" : "pending"),
      assessment:
        (input.assessment as unknown as Prisma.InputJsonValue | undefined) ??
        undefined,
    },
  });
  return toLead(row);
}

export interface SubmitAssessmentInput {
  leadId?: string; // existing lead ID if client followed personal link
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

/**
 * Handle assessment form submission:
 * Computes the recommendation, updates the existing lead or creates a new one.
 */
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
    roomsCount: Number(input.roomsCount) || 1,
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

  const assessmentJson =
    assessment as unknown as Prisma.InputJsonValue | undefined;

  // Update the existing lead when the client followed a personal link.
  if (input.leadId) {
    const existing = await getLead(input.leadId);
    if (existing) {
      const row = await prisma.lead.update({
        where: { seq: parseLeadSeq(existing.id)! },
        data: {
          name: input.name?.trim() || existing.name,
          phone: input.phone?.trim() || existing.phone,
          email: input.email?.trim() || existing.email || null,
          hotel: input.businessName.trim(),
          location: input.businessArea.trim(),
          interest: `${input.hotelCategory} (${input.roomsCount} rms) · ${recommendation.packageName}`,
          budgetLkr: existing.budgetLKR || recommendation.monthlyLKR,
          status: "qualified",
          formStatus: "submitted",
          assessment: assessmentJson,
        },
      });
      return toLead(row);
    }
  }

  // Create a brand new assessed lead.
  const row = await prisma.lead.create({
    data: {
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email?.trim() || null,
      hotel: input.businessName.trim(),
      location: input.businessArea.trim(),
      interest: `${input.hotelCategory} (${input.roomsCount} rms) · ${recommendation.packageName}`,
      budgetLkr: recommendation.monthlyLKR,
      status: "qualified",
      assignedTo: "Unassigned",
      source: "whatsapp",
      campaign: "WhatsApp Assessment Form",
      formStatus: "submitted",
      assessment: assessmentJson,
    },
  });
  return toLead(row);
}
