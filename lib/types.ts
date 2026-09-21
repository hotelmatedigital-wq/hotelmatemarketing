/**
 * Hotel Mate Marketing Panel — core data model (Step 1: demo/in-memory).
 *
 * These shapes mirror what the Facebook Lead Ads API returns and what the
 * Hotel Mate PMS exposes, so Step 2+ can swap the demo data source for the
 * real APIs without changing the UI.
 */

export type LeadSource =
  | "facebook"
  | "instagram"
  | "whatsapp"
  | "website"
  | "walkin"
  | "manual";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost";

export interface Lead {
  id: string;
  name: string;
  hotel: string;
  location: string;
  phone: string;
  email?: string;
  source: LeadSource;
  /** Facebook campaign / ad set that generated the lead */
  campaign: string;
  interest: string;
  budgetLKR?: number;
  status: LeadStatus;
  assignedTo: string;
  createdAt: string; // ISO datetime
  note?: string;
}

export type DealStage =
  | "inquiry"
  | "contacted"
  | "negotiation"
  | "won"
  | "lost";

export interface Deal {
  id: string;
  leadId: string;
  client: string;
  hotel: string;
  plan: string; // Hotel Mate package e.g. "PMS Pro + Channel Manager"
  valueLKR: number; // monthly contract value
  stage: DealStage;
  expectedClose?: string; // ISO date
  owner: string;
}

export type FollowUpType = "call" | "whatsapp" | "email" | "meeting" | "sms";

export interface FollowUp {
  id: string;
  leadId: string;
  leadName: string;
  dueAt: string; // ISO datetime
  type: FollowUpType;
  note: string;
  owner: string;
  done: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
}
