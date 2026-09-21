"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Phone } from "lucide-react";
import { HOTLINE, HOTLINE_TEL } from "@/lib/data";

const INTERESTS = [
  "Full PMS (Property Management System)",
  "PMS + Channel Manager",
  "Channel Manager only",
  "Direct Booking Engine",
  "Point of Sale (POS)",
  "Guest Self Services",
  "Not sure — need advice",
];

const inputCls =
  "w-full rounded-xl border border-mist-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-900/30 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

const labelCls =
  "mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-900/60";

export default function IntakeForm() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ name: string; phone: string } | null>(
    null
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      hotel: fd.get("hotel"),
      location: fd.get("location"),
      interest: fd.get("interest"),
      note: fd.get("note"),
      source: "whatsapp",
      campaign: "WhatsApp Intake Form",
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setDone({
        name: String(fd.get("name")),
        phone: String(fd.get("phone")),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
        <CheckCircle2 className="mx-auto size-14 text-emerald-500" />
        <h1 className="mt-4 text-xl font-extrabold text-ink-900">
          Thank you, {done.name.split(" ")[0]}! 🎉
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-900/60">
          Your details are saved. Our team will contact you on{" "}
          <strong className="text-ink-900">{done.phone}</strong> shortly —
          usually within one business day.
        </p>
        <a
          href={`tel:${HOTLINE_TEL}`}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600"
        >
          <Phone className="size-4" /> Need us now? {HOTLINE}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
      <h1 className="text-lg font-extrabold text-ink-900">
        Tell us about your property
      </h1>
      <p className="mt-1 text-sm text-ink-900/55">
        2 minutes — we&apos;ll prepare the best solution for your hotel.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className={labelCls}>
            Your name *
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="e.g. Nuwan Jayasuriya"
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelCls}>
            Phone / WhatsApp number *
          </label>
          <input
            id="phone"
            name="phone"
            required
            type="tel"
            placeholder="+94 7X XXX XXXX"
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelCls}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@hotel.lk"
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="hotel" className={labelCls}>
              Hotel / Property name
            </label>
            <input
              id="hotel"
              name="hotel"
              placeholder="e.g. Sunset Bay Villas"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="location" className={labelCls}>
              Location
            </label>
            <input
              id="location"
              name="location"
              placeholder="e.g. Mirissa"
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label htmlFor="interest" className={labelCls}>
            What do you need?
          </label>
          <select id="interest" name="interest" className={inputCls} defaultValue={INTERESTS[0]}>
            {INTERESTS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="note" className={labelCls}>
            Anything else?
          </label>
          <textarea
            id="note"
            name="note"
            rows={3}
            placeholder="Rooms, current system, questions…"
            className={`${inputCls} resize-none`}
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition-colors hover:bg-brand-600 disabled:opacity-60"
      >
        {saving ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Saving…
          </>
        ) : (
          "Send my details"
        )}
      </button>

      <p className="mt-3 text-center text-[11px] text-ink-900/40">
        By submitting you agree to be contacted by the Hotel Mate team.
      </p>
    </form>
  );
}
