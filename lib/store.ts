import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { calculateRecommendation, leads as seedLeads } from "./data";
import type { ClientAssessment, Lead } from "./types";

/**
 * Server-side lead store.
 *
 * Persists dynamically added leads (from FB/IG generator, public intake form,
 * or panel entry) into a local JSON file until Step 3 connects the Hotel Mate PMS database.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

type StoredLead = Lead;

async function readStored(): Promise<StoredLead[]> {
  try {
    const raw = await fs.readFile(LEADS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as StoredLead[];
    return [];
  } catch {
    return [];
  }
}

async function writeStored(leads: StoredLead[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf8");
}

function nextId(existing: Lead[]): string {
  let max = 1000;
  for (const l of existing) {
    const n = parseInt(l.id.replace(/^L-/, ""), 10);
    if (!Number.isNaN(n) && n > max) max = n;
  }
  return `L-${max + 1}`;
}

/** All leads = demo seeds (with stored overrides) + dynamically captured ones. */
export async function getAllLeads(): Promise<Lead[]> {
  const stored = await readStored();
  const storedMap = new Map(stored.map((l) => [l.id, l]));

  // Merge seed leads (overridden by stored version if updated)
  const merged: Lead[] = [];
  for (const seed of seedLeads) {
    if (storedMap.has(seed.id)) {
      merged.push(storedMap.get(seed.id)!);
      storedMap.delete(seed.id);
    } else {
      merged.push(seed);
    }
  }

  // Add any purely new stored leads
  for (const extra of storedMap.values()) {
    merged.push(extra);
  }

  // newest first
  return merged.sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

export async function getLead(id: string): Promise<Lead | undefined> {
  const all = await getAllLeads();
  return all.find((l) => l.id === id);
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
  const all = await getAllLeads();

  const lead: Lead = {
    id: nextId(all),
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || undefined,
    hotel: input.hotel?.trim() || "Pending Assessment",
    location: input.location?.trim() || "—",
    interest: input.interest?.trim() || "Social Media Lead (FB/IG)",
    budgetLKR: input.budgetLKR,
    status: input.assessment ? "qualified" : "new",
    assignedTo: "Unassigned",
    createdAt: new Date().toISOString(),
    source: input.source ?? "facebook",
    campaign: input.campaign ?? "FB & IG Lead Generator",
    note: input.note?.trim() || undefined,
    formStatus: input.formStatus ?? (input.assessment ? "submitted" : "pending"),
    assessment: input.assessment,
  };

  const stored = await readStored();
  const existingIdx = stored.findIndex((s) => s.id === lead.id);
  if (existingIdx >= 0) {
    stored[existingIdx] = lead;
  } else {
    stored.push(lead);
  }
  await writeStored(stored);
  return lead;
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
 * Handle form submission:
 * Computes recommendation, updates existing lead or creates a new one.
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

  const stored = await readStored();

  if (input.leadId) {
    const existing = await getLead(input.leadId);
    if (existing) {
      const updated: Lead = {
        ...existing,
        name: input.name?.trim() || existing.name,
        phone: input.phone?.trim() || existing.phone,
        email: input.email?.trim() || existing.email,
        hotel: input.businessName.trim(),
        location: input.businessArea.trim(),
        interest: `${input.hotelCategory} (${input.roomsCount} rms) · ${recommendation.packageName}`,
        budgetLKR: existing.budgetLKR || recommendation.monthlyLKR,
        status: "qualified",
        formStatus: "submitted",
        assessment,
      };

      const idx = stored.findIndex((l) => l.id === existing.id);
      if (idx >= 0) {
        stored[idx] = updated;
      } else {
        stored.push(updated);
      }
      await writeStored(stored);
      return updated;
    }
  }

  // Create brand new assessed lead
  const all = await getAllLeads();
  const newLead: Lead = {
    id: nextId(all),
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || undefined,
    hotel: input.businessName.trim(),
    location: input.businessArea.trim(),
    interest: `${input.hotelCategory} (${input.roomsCount} rms) · ${recommendation.packageName}`,
    budgetLKR: recommendation.monthlyLKR,
    status: "qualified",
    assignedTo: "Unassigned",
    createdAt: new Date().toISOString(),
    source: "whatsapp",
    campaign: "WhatsApp Assessment Form",
    formStatus: "submitted",
    assessment,
  };

  stored.push(newLead);
  await writeStored(stored);
  return newLead;
}
