import type {
  ClientAssessment,
  Deal,
  FindUsSource,
  FollowUp,
  FollowUpType,
  HotelCategory,
  Lead,
  LeadSource,
  OTAPlatform,
  PackageRecommendation,
  TeamMember,
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

const now = new Date();

function daysAgo(days: number, hour = 10, minute = 30): string {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function daysAhead(days: number, hour = 10, minute = 0): string {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const HOTLINE = "+94 78 860 7143";
export const HOTLINE_TEL = "+94788607143";

export const team: TeamMember[] = [
  { name: "Ashan Silva", role: "Sales Manager" },
  { name: "Nimmi Perera", role: "Sales Executive" },
  { name: "Ravindu Fernando", role: "Sales Executive" },
];

export const leads: Lead[] = [
  {
    id: "L-1042",
    name: "Nuwan Jayasuriya",
    hotel: "Serendipity Beach Resort",
    location: "Negombo",
    phone: "+94 77 555 2210",
    email: "nuwan@serendipitybeach.lk",
    source: "facebook",
    campaign: "HM FB Lead Gen — Luxury & Beachfront",
    interest: "Full PMS + Channel Manager",
    budgetLKR: 185000,
    status: "qualified",
    assignedTo: "Ashan Silva",
    createdAt: daysAgo(0, 8, 42),
    note: "42 rooms, currently using spreadsheets. Wants OTA sync urgently.",
    formStatus: "submitted",
    assessment: {
      submittedAt: daysAgo(0, 9, 15),
      businessName: "Serendipity Beach Resort",
      businessArea: "Negombo Beach Road",
      hotelCategory: "Boutique Hotel",
      roomsCount: 42,
      hasRestaurant: true,
      hasSpa: true,
      usedPmsBefore: true,
      currentlyUsingPms: false,
      usedChannelManagerBefore: false,
      currentlyUsingChannelManager: false,
      otasManaged: ["booking.com", "Agoda", "Airbnb"],
      foundUs: "Social Media",
      demoDate: daysAhead(1).split("T")[0],
      demoTime: "10:30 AM",
      recommendation: calculateRecommendation({
        businessName: "Serendipity Beach Resort",
        businessArea: "Negombo Beach Road",
        hotelCategory: "Boutique Hotel",
        roomsCount: 42,
        hasRestaurant: true,
        hasSpa: true,
        usedPmsBefore: true,
        currentlyUsingPms: false,
        usedChannelManagerBefore: false,
        currentlyUsingChannelManager: false,
        otasManaged: ["booking.com", "Agoda", "Airbnb"],
        foundUs: "Social Media",
        demoDate: daysAhead(1).split("T")[0],
        demoTime: "10:30 AM",
      }),
    },
  },
  {
    id: "L-1041",
    name: "Dilini Fernando",
    hotel: "Cinnamon Grove Boutique",
    location: "Colombo 07",
    phone: "+94 76 442 8871",
    email: "dilini@cinnamongrove.lk",
    source: "instagram",
    campaign: "IG Reels — HotelMate Demo Video",
    interest: "Direct Booking Engine",
    budgetLKR: 95000,
    status: "contacted",
    assignedTo: "Nimmi Perera",
    createdAt: daysAgo(1, 14, 15),
    note: "WhatsApp link sent with assessment form.",
    formStatus: "pending",
  },
  {
    id: "L-1040",
    name: "Kasun Bandara",
    hotel: "Hilltop Eco Retreat",
    location: "Kandy",
    phone: "+94 71 903 5544",
    email: "kasun@hilltopeco.lk",
    source: "facebook",
    campaign: "HM FB Lead Gen — Hill Country",
    interest: "PMS + POS bundle",
    budgetLKR: 140000,
    status: "qualified",
    assignedTo: "Ashan Silva",
    createdAt: daysAgo(2, 11, 5),
    note: "Demo scheduled via intake form.",
    formStatus: "submitted",
    assessment: {
      submittedAt: daysAgo(2, 11, 40),
      businessName: "Hilltop Eco Retreat",
      businessArea: "Hanthana, Kandy",
      hotelCategory: "Lodge",
      roomsCount: 16,
      hasRestaurant: true,
      hasSpa: false,
      usedPmsBefore: false,
      currentlyUsingPms: false,
      usedChannelManagerBefore: false,
      currentlyUsingChannelManager: false,
      otasManaged: ["booking.com", "Airbnb"],
      foundUs: "Social Media",
      demoDate: daysAhead(2).split("T")[0],
      demoTime: "02:30 PM",
      recommendation: calculateRecommendation({
        businessName: "Hilltop Eco Retreat",
        businessArea: "Hanthana, Kandy",
        hotelCategory: "Lodge",
        roomsCount: 16,
        hasRestaurant: true,
        hasSpa: false,
        usedPmsBefore: false,
        currentlyUsingPms: false,
        usedChannelManagerBefore: false,
        currentlyUsingChannelManager: false,
        otasManaged: ["booking.com", "Airbnb"],
        foundUs: "Social Media",
        demoDate: daysAhead(2).split("T")[0],
        demoTime: "02:30 PM",
      }),
    },
  },
  {
    id: "L-1039",
    name: "Tharushi Wickramasinghe",
    hotel: "Sunset Bay Villas",
    location: "Mirissa",
    phone: "+94 70 221 7788",
    email: "hello@sunsetbayvillas.lk",
    source: "whatsapp",
    campaign: "WhatsApp Direct Lead",
    interest: "Channel Manager (Booking + Agoda)",
    budgetLKR: 75000,
    status: "proposal",
    assignedTo: "Ravindu Fernando",
    createdAt: daysAgo(3, 16, 40),
    note: "Proposal v2 sent. Waiting for owner approval.",
    formStatus: "submitted",
    assessment: {
      submittedAt: daysAgo(3, 17, 10),
      businessName: "Sunset Bay Villas",
      businessArea: "Mirissa Coast",
      hotelCategory: "Villa",
      roomsCount: 8,
      hasRestaurant: false,
      hasSpa: false,
      usedPmsBefore: false,
      currentlyUsingPms: false,
      usedChannelManagerBefore: true,
      currentlyUsingChannelManager: false,
      otasManaged: ["booking.com", "Agoda", "Airbnb"],
      foundUs: "Recommendation",
      demoDate: daysAhead(0).split("T")[0],
      demoTime: "04:00 PM",
      recommendation: calculateRecommendation({
        businessName: "Sunset Bay Villas",
        businessArea: "Mirissa Coast",
        hotelCategory: "Villa",
        roomsCount: 8,
        hasRestaurant: false,
        hasSpa: false,
        usedPmsBefore: false,
        currentlyUsingPms: false,
        usedChannelManagerBefore: true,
        currentlyUsingChannelManager: false,
        otasManaged: ["booking.com", "Agoda", "Airbnb"],
        foundUs: "Recommendation",
        demoDate: daysAhead(0).split("T")[0],
        demoTime: "04:00 PM",
      }),
    },
  },
  {
    id: "L-1038",
    name: "Mohamed Rizwan",
    hotel: "Grand Palm Hotel",
    location: "Colombo 03",
    phone: "+94 77 810 3345",
    email: "rizwan@grandpalm.lk",
    source: "website",
    campaign: "hotelmate.co.uk — Direct",
    interest: "Enterprise PMS (3 properties)",
    budgetLKR: 420000,
    status: "won",
    assignedTo: "Ashan Silva",
    createdAt: daysAgo(6, 9, 20),
    note: "Signed 12-month contract. Onboarding next week.",
    formStatus: "submitted",
    assessment: {
      submittedAt: daysAgo(6, 10, 0),
      businessName: "Grand Palm Hotel",
      businessArea: "Colombo 03, Kollupitiya",
      hotelCategory: "4 Star",
      roomsCount: 68,
      hasRestaurant: true,
      hasSpa: true,
      usedPmsBefore: true,
      currentlyUsingPms: true,
      usedChannelManagerBefore: true,
      currentlyUsingChannelManager: true,
      otasManaged: ["booking.com", "Agoda", "Expedia"],
      foundUs: "Social Media",
      demoDate: daysAgo(4).split("T")[0],
      demoTime: "11:00 AM",
      recommendation: calculateRecommendation({
        businessName: "Grand Palm Hotel",
        businessArea: "Colombo 03, Kollupitiya",
        hotelCategory: "4 Star",
        roomsCount: 68,
        hasRestaurant: true,
        hasSpa: true,
        usedPmsBefore: true,
        currentlyUsingPms: true,
        usedChannelManagerBefore: true,
        currentlyUsingChannelManager: true,
        otasManaged: ["booking.com", "Agoda", "Expedia"],
        foundUs: "Social Media",
        demoDate: daysAgo(4).split("T")[0],
        demoTime: "11:00 AM",
      }),
    },
  },
  {
    id: "L-1037",
    name: "Anusha Perera",
    hotel: "Lotus Garden Hotel",
    location: "Nuwara Eliya",
    phone: "+94 75 667 1123",
    source: "facebook",
    campaign: "HM FB Lead Gen — Hill Country",
    interest: "PMS Starter",
    budgetLKR: 45000,
    status: "new",
    assignedTo: "Nimmi Perera",
    createdAt: daysAgo(0, 7, 55),
    formStatus: "pending",
  },
  {
    id: "L-1036",
    name: "Ruwan Silva",
    hotel: "Blue Horizon Beach Hotel",
    location: "Unawatuna",
    phone: "+94 72 334 9087",
    email: "ruwan@bluehorizon.lk",
    source: "facebook",
    campaign: "HM FB Lead Gen — Southern Coast",
    interest: "Full PMS + Channel Manager",
    budgetLKR: 160000,
    status: "contacted",
    assignedTo: "Ravindu Fernando",
    createdAt: daysAgo(4, 13, 25),
    note: "First call done. Sent assessment link.",
    formStatus: "pending",
  },
  {
    id: "L-1035",
    name: "Shanthi Kumari",
    hotel: "Queens Rest",
    location: "Anuradhapura",
    phone: "+94 78 445 6612",
    source: "walkin",
    campaign: "Walk-in / Referral",
    interest: "PMS Starter",
    status: "lost",
    assignedTo: "Nimmi Perera",
    createdAt: daysAgo(9, 10, 0),
    note: "Budget too low for now.",
    formStatus: "pending",
  },
  {
    id: "L-1034",
    name: "Dilan Weerasinghe",
    hotel: "Palm Breeze Surf Resort",
    location: "Arugam Bay",
    phone: "+94 76 882 4430",
    email: "dilan@palmbreeze.lk",
    source: "instagram",
    campaign: "IG Reels — Surfing & Resort Demo",
    interest: "PMS Pro + Booking Engine",
    budgetLKR: 120000,
    status: "qualified",
    assignedTo: "Ravindu Fernando",
    createdAt: daysAgo(5, 15, 10),
    formStatus: "submitted",
    assessment: {
      submittedAt: daysAgo(5, 16, 0),
      businessName: "Palm Breeze Surf Resort",
      businessArea: "Main Point, Arugam Bay",
      hotelCategory: "Cabana",
      roomsCount: 14,
      hasRestaurant: true,
      hasSpa: false,
      usedPmsBefore: false,
      currentlyUsingPms: false,
      usedChannelManagerBefore: true,
      currentlyUsingChannelManager: false,
      otasManaged: ["booking.com", "Airbnb"],
      foundUs: "Social Media",
      demoDate: daysAhead(3).split("T")[0],
      demoTime: "09:00 AM",
      recommendation: calculateRecommendation({
        businessName: "Palm Breeze Surf Resort",
        businessArea: "Main Point, Arugam Bay",
        hotelCategory: "Cabana",
        roomsCount: 14,
        hasRestaurant: true,
        hasSpa: false,
        usedPmsBefore: false,
        currentlyUsingPms: false,
        usedChannelManagerBefore: true,
        currentlyUsingChannelManager: false,
        otasManaged: ["booking.com", "Airbnb"],
        foundUs: "Social Media",
        demoDate: daysAhead(3).split("T")[0],
        demoTime: "09:00 AM",
      }),
    },
  },
  {
    id: "L-1033",
    name: "Fathima Nizar",
    hotel: "City Comfort Inn",
    location: "Kandy",
    phone: "+94 71 559 8873",
    source: "facebook",
    campaign: "HM FB Lead Gen — Central Province",
    interest: "Channel Manager only",
    budgetLKR: 55000,
    status: "new",
    assignedTo: "Ashan Silva",
    createdAt: daysAgo(1, 9, 35),
    formStatus: "pending",
  },
  {
    id: "L-1032",
    name: "Harsha Gunawardena",
    hotel: "Tranquil Lagoon Resort",
    location: "Bentota",
    phone: "+94 77 240 6691",
    email: "harsha@tranquillagoon.lk",
    source: "website",
    campaign: "hotelmate.co.uk — Direct",
    interest: "Full PMS + POS + Channel Manager",
    budgetLKR: 230000,
    status: "proposal",
    assignedTo: "Ashan Silva",
    createdAt: daysAgo(7, 12, 45),
    note: "Negotiating annual discount.",
    formStatus: "submitted",
    assessment: {
      submittedAt: daysAgo(7, 13, 20),
      businessName: "Tranquil Lagoon Resort",
      businessArea: "Bentota Lake Side",
      hotelCategory: "Boutique Hotel",
      roomsCount: 28,
      hasRestaurant: true,
      hasSpa: true,
      usedPmsBefore: true,
      currentlyUsingPms: true,
      usedChannelManagerBefore: true,
      currentlyUsingChannelManager: true,
      otasManaged: ["booking.com", "Agoda", "Airbnb"],
      foundUs: "Social Media",
      demoDate: daysAhead(2).split("T")[0],
      demoTime: "11:30 AM",
      recommendation: calculateRecommendation({
        businessName: "Tranquil Lagoon Resort",
        businessArea: "Bentota Lake Side",
        hotelCategory: "Boutique Hotel",
        roomsCount: 28,
        hasRestaurant: true,
        hasSpa: true,
        usedPmsBefore: true,
        currentlyUsingPms: true,
        usedChannelManagerBefore: true,
        currentlyUsingChannelManager: true,
        otasManaged: ["booking.com", "Agoda", "Airbnb"],
        foundUs: "Social Media",
        demoDate: daysAhead(2).split("T")[0],
        demoTime: "11:30 AM",
      }),
    },
  },
  {
    id: "L-1031",
    name: "Naduni Karunaratne",
    hotel: "Misty Meadows Homestay",
    location: "Ella",
    phone: "+94 70 118 2245",
    source: "facebook",
    campaign: "HM FB Lead Gen — Hill Country",
    interest: "PMS Starter",
    budgetLKR: 35000,
    status: "contacted",
    assignedTo: "Nimmi Perera",
    createdAt: daysAgo(8, 17, 30),
    formStatus: "pending",
  },
];

export const deals: Deal[] = [
  {
    id: "D-204",
    leadId: "L-1042",
    client: "Nuwan Jayasuriya",
    hotel: "Serendipity Beach Resort",
    plan: "PMS Pro + Channel Manager",
    valueLKR: 185000,
    stage: "inquiry",
    expectedClose: daysAhead(21),
    owner: "Ashan Silva",
  },
  {
    id: "D-203",
    leadId: "L-1040",
    client: "Kasun Bandara",
    hotel: "Hilltop Eco Retreat",
    plan: "PMS Pro + POS",
    valueLKR: 140000,
    stage: "negotiation",
    expectedClose: daysAhead(10),
    owner: "Ashan Silva",
  },
  {
    id: "D-202",
    leadId: "L-1039",
    client: "Tharushi Wickramasinghe",
    hotel: "Sunset Bay Villas",
    plan: "Channel Manager",
    valueLKR: 75000,
    stage: "negotiation",
    expectedClose: daysAhead(5),
    owner: "Ravindu Fernando",
  },
  {
    id: "D-201",
    leadId: "L-1032",
    client: "Harsha Gunawardena",
    hotel: "Tranquil Lagoon Resort",
    plan: "PMS Pro + POS + Channel Manager",
    valueLKR: 230000,
    stage: "negotiation",
    expectedClose: daysAhead(8),
    owner: "Ashan Silva",
  },
  {
    id: "D-200",
    leadId: "L-1041",
    client: "Dilini Fernando",
    hotel: "Cinnamon Grove Boutique",
    plan: "Direct Booking Engine",
    valueLKR: 95000,
    stage: "contacted",
    expectedClose: daysAhead(14),
    owner: "Nimmi Perera",
  },
  {
    id: "D-199",
    leadId: "L-1034",
    client: "Dilan Weerasinghe",
    hotel: "Palm Breeze Surf Resort",
    plan: "PMS Pro + Booking Engine",
    valueLKR: 120000,
    stage: "contacted",
    expectedClose: daysAhead(18),
    owner: "Ravindu Fernando",
  },
  {
    id: "D-198",
    leadId: "L-1036",
    client: "Ruwan Silva",
    hotel: "Blue Horizon Beach Hotel",
    plan: "PMS Pro + Channel Manager",
    valueLKR: 160000,
    stage: "contacted",
    expectedClose: daysAhead(25),
    owner: "Ravindu Fernando",
  },
  {
    id: "D-197",
    leadId: "L-1038",
    client: "Mohamed Rizwan",
    hotel: "Grand Palm Hotel",
    plan: "Enterprise PMS (3 properties)",
    valueLKR: 420000,
    stage: "won",
    expectedClose: daysAgo(1),
    owner: "Ashan Silva",
  },
  {
    id: "D-196",
    leadId: "L-1035",
    client: "Shanthi Kumari",
    hotel: "Queens Rest",
    plan: "PMS Starter",
    valueLKR: 45000,
    stage: "lost",
    owner: "Nimmi Perera",
  },
];

export const followUps: FollowUp[] = [
  {
    id: "F-501",
    leadId: "L-1042",
    leadName: "Nuwan Jayasuriya — Serendipity Beach Resort",
    dueAt: daysAhead(0, 9, 30),
    type: "call",
    note: "Review submitted assessment form + confirm 10:30 AM demo",
    owner: "Ashan Silva",
    done: false,
  },
  {
    id: "F-502",
    leadId: "L-1037",
    leadName: "Anusha Perera — Lotus Garden Hotel",
    dueAt: daysAhead(0, 11, 0),
    type: "whatsapp",
    note: "Send assessment form link via WhatsApp",
    owner: "Nimmi Perera",
    done: false,
  },
  {
    id: "F-503",
    leadId: "L-1039",
    leadName: "Tharushi Wickramasinghe — Sunset Bay Villas",
    dueAt: daysAhead(0, 14, 30),
    type: "whatsapp",
    note: "Follow up on proposal v2",
    owner: "Ravindu Fernando",
    done: false,
  },
  {
    id: "F-504",
    leadId: "L-1033",
    leadName: "Fathima Nizar — City Comfort Inn",
    dueAt: daysAhead(0, 16, 0),
    type: "whatsapp",
    note: "Send WhatsApp assessment form link",
    owner: "Ashan Silva",
    done: false,
  },
  {
    id: "F-505",
    leadId: "L-1036",
    leadName: "Ruwan Silva — Blue Horizon Beach Hotel",
    dueAt: daysAgo(1, 15, 0),
    type: "call",
    note: "Follow up on pending assessment form",
    owner: "Ravindu Fernando",
    done: false,
  },
  {
    id: "F-506",
    leadId: "L-1040",
    leadName: "Kasun Bandara — Hilltop Eco Retreat",
    dueAt: daysAhead(1, 10, 0),
    type: "meeting",
    note: "Live system demo (Google Meet) — Assessment reviewed",
    owner: "Ashan Silva",
    done: false,
  },
  {
    id: "F-507",
    leadId: "L-1041",
    leadName: "Dilini Fernando — Cinnamon Grove Boutique",
    dueAt: daysAhead(1, 13, 0),
    type: "whatsapp",
    note: "Follow up on WhatsApp form submission",
    owner: "Nimmi Perera",
    done: false,
  },
  {
    id: "F-508",
    leadId: "L-1032",
    leadName: "Harsha Gunawardena — Tranquil Lagoon Resort",
    dueAt: daysAhead(2, 11, 30),
    type: "call",
    note: "Discuss annual discount terms",
    owner: "Ashan Silva",
    done: false,
  },
  {
    id: "F-509",
    leadId: "L-1034",
    leadName: "Dilan Weerasinghe — Palm Breeze Surf Resort",
    dueAt: daysAhead(3, 9, 0),
    type: "meeting",
    note: "On-site demo & onboarding — Arugam Bay",
    owner: "Ravindu Fernando",
    done: false,
  },
  {
    id: "F-510",
    leadId: "L-1038",
    leadName: "Mohamed Rizwan — Grand Palm Hotel",
    dueAt: daysAhead(4, 10, 0),
    type: "meeting",
    note: "Kick-off onboarding call",
    owner: "Ashan Silva",
    done: false,
  },
];

/* ---------------- helpers ---------------- */

export function getLeadById(id: string): Lead | undefined {
  return leads.find((l) => l.id === id);
}

export const sourceLabels: Record<LeadSource, string> = {
  facebook: "Facebook Lead Form",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  website: "Website",
  walkin: "Walk-in / Referral",
  manual: "Manual Entry",
};

export const followUpLabels: Record<FollowUpType, string> = {
  call: "Phone call",
  whatsapp: "WhatsApp",
  email: "Email",
  meeting: "Meeting / Demo",
  sms: "SMS",
};
