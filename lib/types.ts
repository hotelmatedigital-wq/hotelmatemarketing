/**
 * Hotel Mate Marketing Panel — core data model.
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

export type HotelCategory =
  | "Boutique Hotel"
  | "Lodge"
  | "Villa"
  | "Cabana"
  | "Hostel"
  | "Guest House"
  | "3 Star"
  | "4 Star"
  | "5 Star"
  | "7 Star";

export type OTAPlatform =
  | "booking.com"
  | "Agoda"
  | "Airbnb"
  | "Expedia"
  | "Other";

export type FindUsSource =
  | "Social Media"
  | "Recommendation"
  | "Other";

export interface PackageRecommendation {
  packageName: string;
  tier: "Starter" | "Professional" | "Enterprise";
  monthlyLKR: number;
  addons: string[];
  communicationApproach: string;
  pitchPoints: string[];
}

export interface ClientAssessment {
  submittedAt: string; // ISO datetime
  businessName: string;
  businessArea: string;
  hotelCategory: HotelCategory;
  roomsCount: number;
  hasRestaurant: boolean;
  hasSpa: boolean;
  usedPmsBefore: boolean;
  currentlyUsingPms: boolean;
  usedChannelManagerBefore: boolean;
  currentlyUsingChannelManager: boolean;
  otasManaged: OTAPlatform[];
  otasOtherText?: string;
  foundUs: FindUsSource;
  foundUsOtherText?: string;
  demoDate: string; // YYYY-MM-DD
  demoTime: string; // e.g. "10:30 AM" or "14:00"
  recommendation?: PackageRecommendation;
}

export interface Lead {
  id: string;
  name: string;
  hotel: string;
  location: string;
  phone: string;
  email?: string;
  source: LeadSource;
  /** Facebook / Instagram campaign or ad set that generated the lead */
  campaign: string;
  interest: string;
  budgetLKR?: number;
  status: LeadStatus;
  assignedTo: string;
  createdAt: string; // ISO datetime
  note?: string;

  /** Assessment form status and collected details */
  formStatus: "pending" | "submitted";
  assessment?: ClientAssessment;
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
