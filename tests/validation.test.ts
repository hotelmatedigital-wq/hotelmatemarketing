import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { dateInBusinessTimeZone } from "../lib/date";
import {
  RequestValidationError,
  validateAssessmentInput,
  validateLeadInput,
  validateLeadUpdate,
} from "../lib/validation";

function addDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days))
    .toISOString()
    .slice(0, 10);
}

function validAssessment(): Record<string, unknown> {
  return {
    name: "Nuwan Jayasuriya",
    phone: "+94 77 555 2210",
    email: "nuwan@example.com",
    businessName: "Serendipity Beach Resort",
    businessArea: "Negombo",
    hotelCategory: "Boutique Hotel",
    roomsCount: 42,
    hasRestaurant: true,
    hasSpa: false,
    usedPmsBefore: true,
    currentlyUsingPms: false,
    usedChannelManagerBefore: false,
    currentlyUsingChannelManager: false,
    otasManaged: ["booking.com", "Agoda", "booking.com"],
    foundUs: "Social Media",
    demoDate: addDays(dateInBusinessTimeZone(), 1),
    demoTime: "2:30 pm",
  };
}

function expectValidationError(
  operation: () => unknown,
  message: RegExp
): void {
  assert.throws(
    operation,
    (error) =>
      error instanceof RequestValidationError && message.test(error.message)
  );
}

describe("lead request validation", () => {
  test("accepts and normalizes a valid lead", () => {
    const lead = validateLeadInput({
      name: "  Nuwan Jayasuriya  ",
      phone: "+94 77 555 2210",
      email: "nuwan@example.com",
      source: "facebook",
      budgetLKR: "85000.4",
    });

    assert.equal(lead.name, "Nuwan Jayasuriya");
    assert.equal(lead.source, "facebook");
    assert.equal(lead.budgetLKR, 85000);
  });

  test("defaults new records to manual source and new status", () => {
    const lead = validateLeadInput({ name: "Test", phone: "1234567" });
    assert.equal(lead.source, "manual");
    assert.equal(lead.status, "new");
  });

  test("validates manual sales fields", () => {
    const lead = validateLeadInput({
      name: "Test",
      phone: "1234567",
      status: "proposal",
      assignedTo: "Sales Agent",
      budgetLKR: "125000",
    });
    assert.equal(lead.status, "proposal");
    assert.equal(lead.assignedTo, "Sales Agent");
    assert.equal(lead.budgetLKR, 125000);
  });

  test("rejects non-object and malformed fields", () => {
    expectValidationError(() => validateLeadInput([]), /must be an object/);
    expectValidationError(
      () => validateLeadInput({ name: "Test", phone: "letters1234567" }),
      /invalid characters/
    );
    expectValidationError(
      () =>
        validateLeadInput({
          name: "Test",
          phone: "1234567",
          source: "unknown",
        }),
      /source is invalid/
    );
  });

  test("validates lead updates and supports clearing optional fields", () => {
    assert.deepEqual(
      validateLeadUpdate({
        status: "won",
        budgetLKR: "95000",
        assignedTo: "",
        note: "",
      }),
      {
        status: "won",
        budgetLKR: 95000,
        assignedTo: "Unassigned",
        note: null,
      }
    );
    expectValidationError(() => validateLeadUpdate({}), /No editable/);
    expectValidationError(
      () => validateLeadUpdate({ status: "invalid" }),
      /status is invalid/
    );
  });
});

describe("assessment request validation", () => {
  test("accepts valid input, removes duplicate OTAs and normalizes time", () => {
    const assessment = validateAssessmentInput(validAssessment());

    assert.deepEqual(assessment.otasManaged, ["booking.com", "Agoda"]);
    assert.equal(assessment.demoTime, "2:30 PM");
    assert.equal(assessment.roomsCount, 42);
  });

  const invalidCases: Array<{
    name: string;
    patch: Record<string, unknown>;
    message: RegExp;
  }> = [
    {
      name: "invalid email",
      patch: { email: "not-an-email" },
      message: /Email address looks invalid/,
    },
    {
      name: "unknown hotel category",
      patch: { hotelCategory: "Mansion" },
      message: /Hotel category is invalid/,
    },
    {
      name: "out-of-range room count",
      patch: { roomsCount: 2001 },
      message: /between 1 and 2000/,
    },
    {
      name: "string boolean",
      patch: { hasSpa: "false" },
      message: /must be true or false/,
    },
    {
      name: "unknown OTA",
      patch: { otasManaged: ["Unknown OTA"] },
      message: /invalid option/,
    },
    {
      name: "past date",
      patch: { demoDate: addDays(dateInBusinessTimeZone(), -1) },
      message: /cannot be in the past/,
    },
    {
      name: "malformed time",
      patch: { demoTime: "afternoon" },
      message: /must look like/,
    },
  ];

  for (const invalidCase of invalidCases) {
    test(`rejects ${invalidCase.name}`, () => {
      expectValidationError(
        () =>
          validateAssessmentInput({
            ...validAssessment(),
            ...invalidCase.patch,
          }),
        invalidCase.message
      );
    });
  }
});

describe("business time-zone helper", () => {
  test("uses Asia/Colombo for calendar dates", () => {
    const base = new Date("2026-09-22T20:00:00.000Z");
    assert.equal(dateInBusinessTimeZone(base), "2026-09-23");
  });
});
