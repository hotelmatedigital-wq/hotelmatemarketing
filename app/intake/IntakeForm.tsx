"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Hotel,
  Loader2,
  Phone,
  Sparkles,
} from "lucide-react";
import {
  FIND_US_OPTIONS,
  HOTEL_CATEGORIES,
  HOTLINE,
  HOTLINE_TEL,
  OTA_OPTIONS,
} from "@/lib/data";
import type { FindUsSource, HotelCategory, OTAPlatform } from "@/lib/types";

const inputCls =
  "w-full rounded-xl border border-mist-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition-all placeholder:text-ink-900/30 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

const labelCls =
  "mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-900/70";

function YesNoToggle({
  value,
  onChange,
  id,
}: {
  value: boolean;
  onChange: (val: boolean) => void;
  id: string;
}) {
  return (
    <div className="inline-flex rounded-xl border border-mist-200 bg-mist-50/70 p-1">
      <button
        type="button"
        id={`${id}-yes`}
        onClick={() => onChange(true)}
        className={`rounded-lg px-5 py-2 text-xs font-bold transition-all ${
          value
            ? "bg-brand-500 text-white shadow-sm"
            : "text-ink-900/60 hover:text-ink-900"
        }`}
      >
        Yes
      </button>
      <button
        type="button"
        id={`${id}-no`}
        onClick={() => onChange(false)}
        className={`rounded-lg px-5 py-2 text-xs font-bold transition-all ${
          !value
            ? "bg-ink-900 text-white shadow-sm"
            : "text-ink-900/60 hover:text-ink-900"
        }`}
      >
        No
      </button>
    </div>
  );
}

export default function IntakeForm() {
  const searchParams = useSearchParams();
  const paramLeadId = searchParams.get("leadId") || searchParams.get("id") || "";
  const paramName = searchParams.get("name") || "";
  const paramPhone = searchParams.get("phone") || "";
  const paramEmail = searchParams.get("email") || "";

  const [leadId, setLeadId] = useState(paramLeadId);
  const [loadingPrefill, setLoadingPrefill] = useState(Boolean(paramLeadId));

  // Form states
  const [name, setName] = useState(paramName);
  const [phone, setPhone] = useState(paramPhone);
  const [email, setEmail] = useState(paramEmail);
  const [businessName, setBusinessName] = useState("");
  const [businessArea, setBusinessArea] = useState("");
  const [hotelCategory, setHotelCategory] =
    useState<HotelCategory>("Boutique Hotel");
  const [roomsCount, setRoomsCount] = useState<number | string>(12);
  const [hasRestaurant, setHasRestaurant] = useState(false);
  const [hasSpa, setHasSpa] = useState(false);
  const [usedPmsBefore, setUsedPmsBefore] = useState(false);
  const [currentlyUsingPms, setCurrentlyUsingPms] = useState(false);
  const [usedChannelManagerBefore, setUsedChannelManagerBefore] =
    useState(false);
  const [currentlyUsingChannelManager, setCurrentlyUsingChannelManager] =
    useState(false);
  const [otasManaged, setOtasManaged] = useState<OTAPlatform[]>([
    "booking.com",
    "Agoda",
  ]);
  const [otasOtherText, setOtasOtherText] = useState("");
  const [foundUs, setFoundUs] = useState<FindUsSource>("Social Media");
  const [foundUsOtherText, setFoundUsOtherText] = useState("");

  // Default demo date tomorrow, 10:30 AM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split("T")[0];

  const [demoDate, setDemoDate] = useState(defaultDateStr);
  const [demoTime, setDemoTime] = useState("10:30 AM");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    leadId: string;
    demoDate: string;
    demoTime: string;
  } | null>(null);

  // Prefill fetch if leadId provided
  useEffect(() => {
    if (!paramLeadId) return;
    let active = true;

    async function load() {
      try {
        const res = await fetch(`/api/intake?leadId=${encodeURIComponent(paramLeadId)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.prefill && active) {
          if (data.prefill.name) setName(data.prefill.name);
          if (data.prefill.phone) setPhone(data.prefill.phone);
          if (data.prefill.email) setEmail(data.prefill.email);
          if (data.prefill.hotel) setBusinessName(data.prefill.hotel);
          if (data.prefill.location) setBusinessArea(data.prefill.location);
          setLeadId(data.prefill.leadId);
        }
      } catch {
        // silent fallback to manual inputs
      } finally {
        if (active) setLoadingPrefill(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [paramLeadId]);

  function toggleOta(ota: OTAPlatform) {
    setOtasManaged((prev) =>
      prev.includes(ota) ? prev.filter((o) => o !== ota) : [...prev, ota]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please provide your name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please provide your phone / WhatsApp number.");
      return;
    }
    if (!businessName.trim()) {
      setError("Please provide your property / business name.");
      return;
    }
    if (!businessArea.trim()) {
      setError("Please specify your business area / location (e.g. Negombo, Galle, Kandy).");
      return;
    }
    if (!demoDate) {
      setError("Please pick a preferred demo date.");
      return;
    }

    setSubmitting(true);

    const payload = {
      leadId: leadId || undefined,
      name,
      phone,
      email,
      businessName,
      businessArea,
      hotelCategory,
      roomsCount: Number(roomsCount) || 1,
      hasRestaurant,
      hasSpa,
      usedPmsBefore,
      currentlyUsingPms,
      usedChannelManagerBefore,
      currentlyUsingChannelManager,
      otasManaged,
      otasOtherText: otasManaged.includes("Other") ? otasOtherText : undefined,
      foundUs,
      foundUsOtherText: foundUs === "Other" ? foundUsOtherText : undefined,
      demoDate,
      demoTime,
    };

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit assessment.");
      }

      setSuccess({
        leadId: data.leadId || leadId,
        demoDate,
        demoTime,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingPrefill) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Loader2 className="size-8 animate-spin text-brand-500" />
        <p className="mt-3 text-sm font-semibold text-ink-900/60">
          Loading your personalized form…
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="py-6 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner">
          <CheckCircle2 className="size-10" />
        </div>

        <span className="mt-4 inline-block rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
          Assessment Completed
        </span>

        <h2 className="mt-3 text-2xl font-black text-ink-900 sm:text-3xl">
          Thank you, {name.split(" ")[0]}!
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-900/70">
          We have received your property details for{" "}
          <strong className="text-ink-900">{businessName}</strong>.
        </p>

        {/* Demo Confirmation Badge */}
        <div className="mx-auto mt-6 max-w-md rounded-2xl border border-brand-200 bg-brand-50/60 p-5 text-left">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-700">
            <Sparkles className="size-4" /> Requested Demo Time
          </div>
          <p className="mt-2 text-lg font-black text-ink-900">
            {success.demoDate} at {success.demoTime}
          </p>
          <p className="mt-1 text-xs text-ink-900/60">
            Our team will reach out to{" "}
            <strong className="text-ink-900">{phone}</strong> on WhatsApp to
            confirm your calendar invite and demo link.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={`tel:${HOTLINE_TEL}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600 sm:w-auto"
          >
            <Phone className="size-4" /> Call Specialist: {HOTLINE}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* SECTION 1: Client & Business Info */}
      <div>
        <div className="flex items-center gap-2 border-b border-mist-200 pb-2">
          <span className="grid size-6 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">
            1
          </span>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink-900">
            Client & Property Details
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelCls}>
              Your Name *
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nuwan Jayasuriya"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="phone" className={labelCls}>
              Mobile Number (WhatsApp) *
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+94 7X XXX XXXX"
              className={inputCls}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="email" className={labelCls}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hotelowner@property.lk"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="businessName" className={labelCls}>
              Business Name (Hotel / Property) *
            </label>
            <input
              id="businessName"
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Palm Grove Villa"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="businessArea" className={labelCls}>
              Business Area / City *
            </label>
            <input
              id="businessArea"
              type="text"
              required
              value={businessArea}
              onChange={(e) => setBusinessArea(e.target.value)}
              placeholder="e.g. Negombo, Galle, Ella"
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Capacity & Category */}
      <div>
        <div className="flex items-center gap-2 border-b border-mist-200 pb-2">
          <span className="grid size-6 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">
            2
          </span>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink-900">
            Hotel Category & Capacity
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="hotelCategory" className={labelCls}>
              Hotel Category *
            </label>
            <select
              id="hotelCategory"
              value={hotelCategory}
              onChange={(e) => setHotelCategory(e.target.value as HotelCategory)}
              className={inputCls}
            >
              {HOTEL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="roomsCount" className={labelCls}>
              Number of Rooms *
            </label>
            <input
              id="roomsCount"
              type="number"
              min={1}
              max={2000}
              required
              value={roomsCount}
              onChange={(e) => setRoomsCount(e.target.value)}
              placeholder="e.g. 15"
              className={inputCls}
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-mist-200 bg-mist-50/40 p-4">
            <div>
              <p className="text-sm font-bold text-ink-900">Restaurant</p>
              <p className="text-xs text-ink-900/50">Does property have F&B / dining?</p>
            </div>
            <YesNoToggle
              id="restaurant"
              value={hasRestaurant}
              onChange={setHasRestaurant}
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-mist-200 bg-mist-50/40 p-4">
            <div>
              <p className="text-sm font-bold text-ink-900">Spa</p>
              <p className="text-xs text-ink-900/50">Does property offer spa / wellness?</p>
            </div>
            <YesNoToggle id="spa" value={hasSpa} onChange={setHasSpa} />
          </div>
        </div>
      </div>

      {/* SECTION 3: Systems & Channels */}
      <div>
        <div className="flex items-center gap-2 border-b border-mist-200 pb-2">
          <span className="grid size-6 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">
            3
          </span>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink-900">
            Software Experience & OTAs
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-2xl border border-mist-200 bg-mist-50/40 p-4">
            <div className="pr-3">
              <p className="text-xs font-bold text-ink-900">
                Have you used a Hotel Management System before?
              </p>
            </div>
            <YesNoToggle
              id="usedPmsBefore"
              value={usedPmsBefore}
              onChange={setUsedPmsBefore}
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-mist-200 bg-mist-50/40 p-4">
            <div className="pr-3">
              <p className="text-xs font-bold text-ink-900">
                Are you currently using a Hotel Management System?
              </p>
            </div>
            <YesNoToggle
              id="currentlyUsingPms"
              value={currentlyUsingPms}
              onChange={setCurrentlyUsingPms}
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-mist-200 bg-mist-50/40 p-4">
            <div className="pr-3">
              <p className="text-xs font-bold text-ink-900">
                Have you used a Channel Manager before?
              </p>
            </div>
            <YesNoToggle
              id="usedCmBefore"
              value={usedChannelManagerBefore}
              onChange={setUsedChannelManagerBefore}
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-mist-200 bg-mist-50/40 p-4">
            <div className="pr-3">
              <p className="text-xs font-bold text-ink-900">
                Are you currently using a Channel Manager?
              </p>
            </div>
            <YesNoToggle
              id="currentlyUsingCm"
              value={currentlyUsingChannelManager}
              onChange={setCurrentlyUsingChannelManager}
            />
          </div>
        </div>

        {/* OTAs Checkboxes */}
        <div className="mt-4 rounded-2xl border border-mist-200 bg-mist-50/30 p-4">
          <label className={labelCls}>OTAs Currently Managed</label>
          <p className="mb-3 text-xs text-ink-900/50">
            Select the online booking channels your property currently uses:
          </p>
          <div className="flex flex-wrap gap-2">
            {OTA_OPTIONS.map((ota) => {
              const active = otasManaged.includes(ota);
              return (
                <button
                  key={ota}
                  type="button"
                  onClick={() => toggleOta(ota)}
                  className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                    active
                      ? "border-brand-500 bg-brand-500 text-white shadow-sm shadow-brand-500/25"
                      : "border-mist-200 bg-white text-ink-900/70 hover:border-mist-300"
                  }`}
                >
                  {ota}
                </button>
              );
            })}
          </div>

          {otasManaged.includes("Other") && (
            <div className="mt-3">
              <input
                type="text"
                value={otasOtherText}
                onChange={(e) => setOtasOtherText(e.target.value)}
                placeholder="Please specify other OTA channels…"
                className={inputCls}
              />
            </div>
          )}
        </div>
      </div>

      {/* SECTION 4: Demo Scheduling */}
      <div>
        <div className="flex items-center gap-2 border-b border-mist-200 pb-2">
          <span className="grid size-6 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">
            4
          </span>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink-900">
            Demo Preference & Referral
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="demoDate" className={labelCls}>
              Preferred Demo Date *
            </label>
            <div className="relative">
              <input
                id="demoDate"
                type="date"
                required
                value={demoDate}
                onChange={(e) => setDemoDate(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label htmlFor="demoTime" className={labelCls}>
              Preferred Demo Time *
            </label>
            <div className="relative">
              <input
                id="demoTime"
                type="text"
                required
                value={demoTime}
                onChange={(e) => setDemoTime(e.target.value)}
                placeholder="e.g. 10:30 AM or 03:00 PM"
                className={inputCls}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="foundUs" className={labelCls}>
              How did you find out about us?
            </label>
            <select
              id="foundUs"
              value={foundUs}
              onChange={(e) => setFoundUs(e.target.value as FindUsSource)}
              className={inputCls}
            >
              {FIND_US_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            {foundUs === "Other" && (
              <div className="mt-3">
                <input
                  type="text"
                  value={foundUsOtherText}
                  onChange={(e) => setFoundUsOtherText(e.target.value)}
                  placeholder="Please specify how you found us…"
                  className={inputCls}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 py-4 text-base font-extrabold text-white shadow-xl shadow-brand-500/30 transition-all hover:bg-brand-600 disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="size-5 animate-spin" /> Saving Property
            Assessment…
          </>
        ) : (
          <>
            <Hotel className="size-5" /> Submit Assessment & Request Demo
          </>
        )}
      </button>

      <p className="text-center text-xs text-ink-900/40">
        By submitting, you agree to receive a demo invitation and message from
        Hotel Mate Digital via WhatsApp / Phone.
      </p>
    </form>
  );
}
