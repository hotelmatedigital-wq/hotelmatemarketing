"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import type { Lead, LeadSource, LeadStatus } from "@/lib/types";
import { sourceLabels } from "@/lib/data";
import { STATUS_LABELS } from "@/components/ui";

const inputCls =
  "w-full rounded-lg border border-mist-200 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-900/30 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";
const labelCls = "mb-1 block text-xs font-bold text-ink-900/60";

const SOURCES: LeadSource[] = [
  "manual",
  "facebook",
  "instagram",
  "whatsapp",
  "website",
  "walkin",
];
const STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
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

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name"),
      phone: form.get("phone"),
      email: form.get("email"),
      hotel: form.get("hotel"),
      location: form.get("location"),
      interest: form.get("interest"),
      budgetLKR: form.get("budgetLKR"),
      assignedTo: form.get("assignedTo"),
      status: form.get("status"),
      note: form.get("note"),
      source: form.get("source"),
      campaign: form.get("campaign"),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save the lead");
      }
      onAdded(data as Lead);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save the lead");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink-950/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-lead-title"
        className="my-4 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 id="add-lead-title" className="text-base font-extrabold text-ink-900">
              Add a Real Lead
            </h2>
            <p className="mt-0.5 text-xs text-ink-900/50">
              Enter the details received by phone, WhatsApp, social media or walk-in.
            </p>
          </div>
          <button
            type="button"
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
              <label htmlFor="lead-name" className={labelCls}>Contact Name *</label>
              <input id="lead-name" name="name" required maxLength={100} placeholder="Contact person" className={inputCls} />
            </div>
            <div>
              <label htmlFor="lead-phone" className={labelCls}>Phone / WhatsApp *</label>
              <input id="lead-phone" name="phone" required type="tel" maxLength={32} placeholder="+94 7X XXX XXXX" className={inputCls} />
            </div>
            <div>
              <label htmlFor="lead-email" className={labelCls}>Email</label>
              <input id="lead-email" name="email" type="email" maxLength={254} placeholder="name@hotel.lk" className={inputCls} />
            </div>
            <div>
              <label htmlFor="lead-source" className={labelCls}>Lead Source</label>
              <select id="lead-source" name="source" defaultValue="manual" className={inputCls}>
                {SOURCES.map((source) => (
                  <option key={source} value={source}>{sourceLabels[source]}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="lead-hotel" className={labelCls}>Hotel / Property</label>
              <input id="lead-hotel" name="hotel" maxLength={160} placeholder="Property name" className={inputCls} />
            </div>
            <div>
              <label htmlFor="lead-location" className={labelCls}>Location</label>
              <input id="lead-location" name="location" maxLength={120} placeholder="City / area" className={inputCls} />
            </div>
            <div>
              <label htmlFor="lead-status" className={labelCls}>Sales Status</label>
              <select id="lead-status" name="status" defaultValue="new" className={inputCls}>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="lead-budget" className={labelCls}>Estimated Monthly Budget (LKR)</label>
              <input id="lead-budget" name="budgetLKR" type="number" min={1} max={1_000_000_000} step={1} placeholder="e.g. 85000" className={inputCls} />
            </div>
            <div>
              <label htmlFor="lead-owner" className={labelCls}>Assigned To</label>
              <input id="lead-owner" name="assignedTo" maxLength={100} placeholder="Sales person (optional)" className={inputCls} />
            </div>
            <div>
              <label htmlFor="lead-campaign" className={labelCls}>Campaign / Reference</label>
              <input id="lead-campaign" name="campaign" maxLength={160} placeholder="Ad name or referral" className={inputCls} />
            </div>
          </div>

          <div>
            <label htmlFor="lead-interest" className={labelCls}>Interested In</label>
            <input id="lead-interest" name="interest" maxLength={240} placeholder="e.g. PMS + Channel Manager" className={inputCls} />
          </div>
          <div>
            <label htmlFor="lead-note" className={labelCls}>Sales Note</label>
            <textarea id="lead-note" name="note" rows={3} maxLength={2000} placeholder="Requirements, next action or any useful context…" className={`${inputCls} resize-none`} />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">
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
              Save Real Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
