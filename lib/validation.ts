import {
  FIND_US_OPTIONS,
  HOTEL_CATEGORIES,
  OTA_OPTIONS,
} from "./data";
import { dateInBusinessTimeZone } from "./date";
import type {
  FindUsSource,
  HotelCategory,
  LeadSource,
  LeadStatus,
  OTAPlatform,
} from "./types";

const LEAD_SOURCES: readonly LeadSource[] = [
  "facebook",
  "instagram",
  "whatsapp",
  "website",
  "walkin",
  "manual",
];

const LEAD_STATUSES: readonly LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
];

export class RequestValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RequestValidationError";
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new RequestValidationError("JSON body must be an object");
  }
  return value as Record<string, unknown>;
}

function text(
  value: unknown,
  label: string,
  options: { required?: boolean; maxLength: number }
): string | undefined {
  if (value === undefined || value === null || value === "") {
    if (options.required) {
      throw new RequestValidationError(`${label} is required`);
    }
    return undefined;
  }
  if (typeof value !== "string") {
    throw new RequestValidationError(`${label} must be text`);
  }

  const cleaned = value.trim();
  if (!cleaned) {
    if (options.required) {
      throw new RequestValidationError(`${label} is required`);
    }
    return undefined;
  }
  if (cleaned.length > options.maxLength) {
    throw new RequestValidationError(
      `${label} must be ${options.maxLength} characters or fewer`
    );
  }
  return cleaned;
}

function requiredText(
  value: unknown,
  label: string,
  maxLength: number
): string {
  return text(value, label, { required: true, maxLength })!;
}

function optionalText(
  value: unknown,
  label: string,
  maxLength: number
): string | undefined {
  return text(value, label, { maxLength });
}

function phoneNumber(value: unknown): string {
  const phone = requiredText(value, "Phone / WhatsApp number", 32);
  if (!/^[+\d\s().-]+$/.test(phone)) {
    throw new RequestValidationError(
      "Phone / WhatsApp number contains invalid characters"
    );
  }
  const digitCount = phone.replace(/\D/g, "").length;
  if (digitCount < 7 || digitCount > 15) {
    throw new RequestValidationError(
      "Phone / WhatsApp number must contain 7 to 15 digits"
    );
  }
  return phone;
}

function emailAddress(value: unknown): string | undefined {
  const email = optionalText(value, "Email address", 254);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new RequestValidationError("Email address looks invalid");
  }
  return email;
}

function enumValue<T extends string>(
  value: unknown,
  label: string,
  allowed: readonly T[],
  fallback?: T
): T {
  if (value === undefined || value === null || value === "") {
    if (fallback !== undefined) return fallback;
    throw new RequestValidationError(`${label} is required`);
  }
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new RequestValidationError(`${label} is invalid`);
  }
  return value as T;
}

function optionalEnumValue<T extends string>(
  value: unknown,
  label: string,
  allowed: readonly T[]
): T | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  return enumValue(value, label, allowed);
}

function budgetValue(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const budget = Number(value);
  if (!Number.isFinite(budget) || budget <= 0 || budget > 1_000_000_000) {
    throw new RequestValidationError(
      "Budget must be between 1 and 1,000,000,000 LKR"
    );
  }
  return Math.round(budget);
}

function booleanValue(value: unknown, label: string): boolean {
  if (value === undefined) return false;
  if (typeof value !== "boolean") {
    throw new RequestValidationError(`${label} must be true or false`);
  }
  return value;
}

function roomCount(value: unknown): number {
  if (typeof value !== "number" && typeof value !== "string") {
    throw new RequestValidationError("Number of rooms is required");
  }
  const rooms = Number(value);
  if (!Number.isInteger(rooms) || rooms < 1 || rooms > 2000) {
    throw new RequestValidationError(
      "Number of rooms must be a whole number between 1 and 2000"
    );
  }
  return rooms;
}

function otaValues(value: unknown): OTAPlatform[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    throw new RequestValidationError("OTAs managed must be a list");
  }

  const result: OTAPlatform[] = [];
  for (const item of value) {
    if (typeof item !== "string" || !OTA_OPTIONS.includes(item as OTAPlatform)) {
      throw new RequestValidationError("OTAs managed contains an invalid option");
    }
    const ota = item as OTAPlatform;
    if (!result.includes(ota)) result.push(ota);
  }
  return result;
}

function isRealIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function demoDateValue(value: unknown): string {
  const demoDate = requiredText(value, "Preferred demo date", 10);
  if (!isRealIsoDate(demoDate)) {
    throw new RequestValidationError(
      "Preferred demo date must use the YYYY-MM-DD format"
    );
  }
  if (demoDate < dateInBusinessTimeZone()) {
    throw new RequestValidationError("Preferred demo date cannot be in the past");
  }
  return demoDate;
}

function demoTimeValue(value: unknown): string {
  const demoTime = requiredText(value, "Preferred demo time", 20)
    .replace(/\s+/g, " ")
    .toUpperCase();
  const twelveHour = /^(?:0?[1-9]|1[0-2]):[0-5]\d (?:AM|PM)$/;
  const twentyFourHour = /^(?:[01]?\d|2[0-3]):[0-5]\d$/;
  if (!twelveHour.test(demoTime) && !twentyFourHour.test(demoTime)) {
    throw new RequestValidationError(
      "Preferred demo time must look like 10:30 AM or 14:30"
    );
  }
  return demoTime;
}

function optionalLeadId(value: unknown): string | undefined {
  const leadId = optionalText(value, "Lead ID", 24);
  if (leadId && !/^L-\d+$/.test(leadId)) {
    throw new RequestValidationError("Lead ID is invalid");
  }
  return leadId;
}

export interface ValidatedLeadInput {
  name: string;
  phone: string;
  email?: string;
  hotel?: string;
  location?: string;
  interest?: string;
  budgetLKR?: number;
  note?: string;
  source: LeadSource;
  campaign?: string;
  status: LeadStatus;
  assignedTo?: string;
}

export function validateLeadInput(value: unknown): ValidatedLeadInput {
  const body = asRecord(value);

  return {
    name: requiredText(body.name, "Name", 100),
    phone: phoneNumber(body.phone),
    email: emailAddress(body.email),
    hotel: optionalText(body.hotel, "Hotel / property", 160),
    location: optionalText(body.location, "Location", 120),
    interest: optionalText(body.interest, "Interest", 240),
    budgetLKR: budgetValue(body.budgetLKR),
    note: optionalText(body.note, "Note", 2000),
    source: enumValue(body.source, "Lead source", LEAD_SOURCES, "manual"),
    campaign: optionalText(body.campaign, "Campaign", 160),
    status: enumValue(body.status, "Lead status", LEAD_STATUSES, "new"),
    assignedTo: optionalText(body.assignedTo, "Assigned person", 100),
  };
}

export interface ValidatedLeadUpdate {
  status?: LeadStatus;
  budgetLKR?: number | null;
  assignedTo?: string;
  note?: string | null;
}

export function validateLeadUpdate(value: unknown): ValidatedLeadUpdate {
  const body = asRecord(value);
  const update: ValidatedLeadUpdate = {};

  if (body.status !== undefined) {
    update.status = optionalEnumValue(body.status, "Lead status", LEAD_STATUSES);
  }
  if (body.budgetLKR !== undefined) {
    update.budgetLKR =
      body.budgetLKR === null || body.budgetLKR === ""
        ? null
        : budgetValue(body.budgetLKR);
  }
  if (body.assignedTo !== undefined) {
    update.assignedTo =
      optionalText(body.assignedTo, "Assigned person", 100) ?? "Unassigned";
  }
  if (body.note !== undefined) {
    update.note = optionalText(body.note, "Note", 2000) ?? null;
  }

  if (Object.keys(update).length === 0) {
    throw new RequestValidationError("No editable lead fields were provided");
  }
  return update;
}

export interface ValidatedAssessmentInput {
  leadId?: string;
  name: string;
  phone: string;
  email?: string;
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
  demoDate: string;
  demoTime: string;
}

export function validateAssessmentInput(
  value: unknown
): ValidatedAssessmentInput {
  const body = asRecord(value);
  const otasManaged = otaValues(body.otasManaged);
  const foundUs = enumValue(
    body.foundUs,
    "How you found us",
    FIND_US_OPTIONS,
    "Social Media"
  );

  return {
    leadId: optionalLeadId(body.leadId),
    name: requiredText(body.name, "Your name", 100),
    phone: phoneNumber(body.phone),
    email: emailAddress(body.email),
    businessName: requiredText(body.businessName, "Business / hotel name", 160),
    businessArea: requiredText(body.businessArea, "Business area / location", 120),
    hotelCategory: enumValue(
      body.hotelCategory,
      "Hotel category",
      HOTEL_CATEGORIES,
      "Boutique Hotel"
    ),
    roomsCount: roomCount(body.roomsCount),
    hasRestaurant: booleanValue(body.hasRestaurant, "Restaurant selection"),
    hasSpa: booleanValue(body.hasSpa, "Spa selection"),
    usedPmsBefore: booleanValue(body.usedPmsBefore, "Previous PMS selection"),
    currentlyUsingPms: booleanValue(
      body.currentlyUsingPms,
      "Current PMS selection"
    ),
    usedChannelManagerBefore: booleanValue(
      body.usedChannelManagerBefore,
      "Previous channel manager selection"
    ),
    currentlyUsingChannelManager: booleanValue(
      body.currentlyUsingChannelManager,
      "Current channel manager selection"
    ),
    otasManaged,
    otasOtherText: otasManaged.includes("Other")
      ? optionalText(body.otasOtherText, "Other OTA", 200)
      : undefined,
    foundUs,
    foundUsOtherText:
      foundUs === "Other"
        ? optionalText(body.foundUsOtherText, "Other referral source", 200)
        : undefined,
    demoDate: demoDateValue(body.demoDate),
    demoTime: demoTimeValue(body.demoTime),
  };
}
