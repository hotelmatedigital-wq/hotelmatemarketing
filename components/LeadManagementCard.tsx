"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Save, Trash2 } from "lucide-react";
import { Card, STATUS_LABELS } from "@/components/ui";
import type { Lead, LeadStatus } from "@/lib/types";

const STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
];
const inputClass =
  "w-full rounded-lg border border-mist-200 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

export default function LeadManagementCard({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [budget, setBudget] = useState(
    lead.budgetLKR ? String(lead.budgetLKR) : ""
  );
  const [assignedTo, setAssignedTo] = useState(
    lead.assignedTo === "Unassigned" ? "" : lead.assignedTo
  );
  const [note, setNote] = useState(lead.note ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/leads/${encodeURIComponent(lead.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          budgetLKR: budget,
          assignedTo,
          note,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to update the lead");
      }
      setMessage("Lead updated successfully.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update the lead");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (
      !window.confirm(
        `Delete ${lead.name}'s lead permanently? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeleting(true);
    setError("");
    try {
      const response = await fetch(`/api/leads/${encodeURIComponent(lead.id)}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Unable to delete the lead");
      }
      router.push("/leads");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to delete the lead");
      setDeleting(false);
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-ink-900">Manage Lead</h2>
          <p className="mt-0.5 text-xs text-ink-900/50">
            Update the real sales status, budget, owner and notes.
          </p>
        </div>
        <span className="rounded-md bg-mist-100 px-2 py-1 font-mono text-[11px] font-semibold text-ink-900/60">
          {lead.id}
        </span>
      </div>

      <form onSubmit={save} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="manage-status" className="mb-1 block text-xs font-bold text-ink-900/60">
              Sales Status
            </label>
            <select
              id="manage-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as LeadStatus)}
              className={inputClass}
            >
              {STATUSES.map((item) => (
                <option key={item} value={item}>{STATUS_LABELS[item]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="manage-budget" className="mb-1 block text-xs font-bold text-ink-900/60">
              Monthly Budget (LKR)
            </label>
            <input
              id="manage-budget"
              type="number"
              min={1}
              max={1_000_000_000}
              step={1}
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              placeholder="Not captured"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="manage-owner" className="mb-1 block text-xs font-bold text-ink-900/60">
              Assigned To
            </label>
            <input
              id="manage-owner"
              maxLength={100}
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
              placeholder="Unassigned"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="manage-note" className="mb-1 block text-xs font-bold text-ink-900/60">
            Sales Note
          </label>
          <textarea
            id="manage-note"
            rows={3}
            maxLength={2000}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Requirements, next action or call notes…"
            className={`${inputClass} resize-none`}
          />
        </div>

        {message && (
          <p className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <Check className="size-3.5" /> {message}
          </p>
        )}
        {error && (
          <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            disabled={deleting || saving}
            onClick={remove}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
          >
            {deleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
            Delete Lead
          </button>
          <button
            type="submit"
            disabled={saving || deleting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-bold text-white hover:bg-brand-600 disabled:opacity-50"
          >
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            Save Changes
          </button>
        </div>
      </form>
    </Card>
  );
}
