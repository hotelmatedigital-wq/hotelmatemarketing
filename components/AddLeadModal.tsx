"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import type { Lead, LeadSource } from "@/lib/types";
import { sourceLabels } from "@/lib/data";

const inputCls =
  "w-full rounded-lg border border-mist-200 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-900/30 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

const labelCls = "mb-1 block text-xs font-bold text-ink-900/60";

const MANUAL_SOURCES: LeadSource[] = [
  "manual",
  "facebook",
  "instagram",
  "whatsapp",
  "walkin",
];

export default function AddLeadModal({
  open,
  onClose,
  onAdded,
}: {
  open: boolean;
  onClose: () => void;
  onAdded: (lead: Lead) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

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
      source: fd.get("source"),
      campaign: "Manual entry (panel)",
    };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      onAdded(data as Lead);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink-950/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-ink-900">
            Add Lead Manually
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-900/40 hover:bg-mist-100 hover:text-ink-900"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Name *</label>
              <input name="name" required placeholder="Contact person" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Phone / WhatsApp *</label>
              <input name="phone" required type="tel" placeholder="+94 7X XXX XXXX" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input name="email" type="email" placeholder="name@hotel.lk" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Source</label>
              <select name="source" defaultValue="manual" className={inputCls}>
                {MANUAL_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {sourceLabels[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Hotel / Property</label>
              <input name="hotel" placeholder="Property name" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input name="location" placeholder="City" className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Interested in</label>
            <input name="interest" placeholder="e.g. PMS + Channel Manager" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Note</label>
            <textarea name="note" rows={2} placeholder="Anything useful for the sales team…" className={`${inputCls} resize-none`} />
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-mist-200 px-4 py-2.5 text-sm font-semibold text-ink-900/70 hover:bg-mist-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-brand-500/30 hover:bg-brand-600 disabled:opacity-60"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              Save Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
