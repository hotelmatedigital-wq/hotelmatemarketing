import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { leads as seedLeads } from "./data";
import type { Lead } from "./types";

/**
 * Server-side lead store (Step 2 — demo persistence).
 *
 * There is no real database yet: that arrives in Step 3 when we connect the
 * Hotel Mate PMS API. For now, dynamically added leads (from the public
 * intake form or the admin "Add Lead" modal) are persisted to a local JSON
 * file so the capture flow genuinely works end-to-end.
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

/** All leads = demo seed + dynamically captured ones. */
export async function getAllLeads(): Promise<Lead[]> {
  const stored = await readStored();
  const seedIds = new Set(seedLeads.map((l) => l.id));
  const merged = [
    ...seedLeads,
    ...stored.filter((l) => !seedIds.has(l.id)),
  ];
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
}

/** Create + persist a new lead. Returns the stored lead. */
export async function createLead(input: NewLeadInput): Promise<Lead> {
  const all = await getAllLeads();

  const lead: Lead = {
    id: nextId(all),
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || undefined,
    hotel: input.hotel?.trim() || "—",
    location: input.location?.trim() || "—",
    interest: input.interest?.trim() || "General inquiry",
    budgetLKR: input.budgetLKR,
    status: "new",
    assignedTo: "Unassigned",
    createdAt: new Date().toISOString(),
    source: input.source ?? "website",
    campaign: input.campaign ?? "Intake Form",
    note: input.note?.trim() || undefined,
  };

  const stored = await readStored();
  stored.push(lead);
  await writeStored(stored);
  return lead;
}
