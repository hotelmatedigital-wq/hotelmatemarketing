import type {
  ClientAssessment,
  FindUsSource,
  HotelCategory,
  LeadSource,
  OTAPlatform,
  PackageRecommendation,
} from "./types";

export const HOTEL_CATEGORIES: HotelCategory[] = [
  "Boutique Hotel",
  "Lodge",
  "Villa",
  "Cabana",
  "Hostel",
  "Guest House",
  "3 Star",
  "4 Star",
  "5 Star",
  "7 Star",
];

export const OTA_OPTIONS: OTAPlatform[] = [
  "booking.com",
  "Agoda",
  "Airbnb",
  "Expedia",
  "Other",
];

export const FIND_US_OPTIONS: FindUsSource[] = [
  "Social Media",
  "Recommendation",
  "Other",
];

/**
 * Intelligent recommendation engine that analyzes client assessment data:
 * - Hotel capacity & category
 * - F&B (Restaurant) and Spa facilities
 * - Past & current PMS / Channel Manager usage
 * - OTAs currently managed
 * Determines: recommended package tier, monthly estimate, add-ons, and communication pitch strategy.
 */
export function calculateRecommendation(
  assessment: Omit<ClientAssessment, "recommendation" | "submittedAt">
): PackageRecommendation {
  const rooms = Number(assessment.roomsCount) || 1;
  const category = assessment.hotelCategory;

  let tier: "Starter" | "Professional" | "Enterprise" = "Starter";
  let packageName = "Hotel Mate Starter (Front Desk + Direct Booking Engine)";
  let monthlyLKR = 45000;

  if (
    rooms >= 35 ||
    category === "4 Star" ||
    category === "5 Star" ||
    category === "7 Star"
  ) {
    tier = "Enterprise";
    packageName = "Hotel Mate Enterprise Suite (Multi-Department & Yield)";
    monthlyLKR = Math.max(180000, 100000 + rooms * 2500);
  } else if (rooms >= 12 || category === "Boutique Hotel" || category === "3 Star") {
    tier = "Professional";
    packageName = "Hotel Mate Professional (Full PMS + 2-Way Channel Manager)";
    monthlyLKR = Math.max(85000, 50000 + rooms * 2200);
  } else {
    tier = "Starter";
    packageName = "Hotel Mate Starter (Front Desk & Direct Bookings)";
    monthlyLKR = Math.max(35000, 25000 + rooms * 1800);
  }

  const addons: string[] = [];
  if (assessment.hasRestaurant) {
    addons.push("Hotel Mate Restaurant POS & Kitchen Display (KDS)");
    monthlyLKR += 25000;
  }
  if (assessment.hasSpa) {
    addons.push("Spa & Wellness Appointment Booking Module");
    monthlyLKR += 15000;
  }
  if (assessment.otasManaged.length > 0) {
    addons.push(
      `2-Way Channel Manager Sync (${assessment.otasManaged.join(", ")})`
    );
  }
  if (rooms >= 20) {
    addons.push("Housekeeping & Maintenance Mobile Companion App");
  }

  // Determine communication approach
  let communicationApproach = "";
  const pitchPoints: string[] = [];

  if (assessment.currentlyUsingPms) {
    communicationApproach =
      "Competitive Migration Strategy: Focus on modern cloud speed, local 24/7 hotline (+94 78 860 7143), free data migration, and cost savings over foreign legacy PMS.";
    pitchPoints.push(
      "Offer 100% free migration of current guest history, room bookings & profiles."
    );
    pitchPoints.push(
      "Demonstrate Hotel Mate's 3-second check-in speed and automated WhatsApp guest receipts."
    );
  } else if (assessment.usedPmsBefore) {
    communicationApproach =
      "Frictionless Re-adoption Strategy: Client experienced previous software friction. Highlight extreme ease of use — front desk staff learn Hotel Mate within 30 minutes.";
    pitchPoints.push(
      "Focus on intuitive visual calendar, zero complex jargon, and guided onboarding."
    );
  } else {
    communicationApproach =
      "Educational & High-Value Strategy: Client is moving from paper/Excel to cloud software. Walk them step-by-step through how Hotel Mate prevents lost reservations and saves 2+ hours daily.";
    pitchPoints.push(
      "Demonstrate live calendar view replacing physical reservation book."
    );
    pitchPoints.push(
      "Show how WhatsApp guest confirmation messages build a 5-star professional image."
    );
  }

  // OTA specific strategy
  if (
    assessment.otasManaged.length > 0 &&
    !assessment.currentlyUsingChannelManager
  ) {
    pitchPoints.push(
      `HIGH PRIORITY: Client manually manages ${assessment.otasManaged.join(", ")} without a Channel Manager. Pitch our instantaneous 2-way sync to eliminate double-booking panic.`
    );
  } else if (assessment.otasManaged.length > 0) {
    pitchPoints.push(
      "Showcase zero-commission Direct Booking Engine widget to convert OTA guests into direct, commission-free bookers."
    );
  }

  if (assessment.hasRestaurant) {
    pitchPoints.push(
      "Highlight seamless Room Charge posting: restaurant / bar bills post straight to the room folio for one-tap checkout."
    );
  }

  return {
    packageName,
    tier,
    monthlyLKR,
    addons,
    communicationApproach,
    pitchPoints,
  };
}

export const HOTLINE = "+94 78 860 7143";
export const HOTLINE_TEL = "+94788607143";

export const sourceLabels: Record<LeadSource, string> = {
  facebook: "Facebook Lead Form",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  website: "Website",
  walkin: "Walk-in / Referral",
  manual: "Manual Entry",
};
