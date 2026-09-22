"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Hotel,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui";
import { generateLeadWhatsAppMessage, waLink } from "@/lib/wa";
import { fmtDateYear, fmtMoney } from "@/lib/format";
import { useBrowserOrigin } from "@/lib/browser";
import type { Lead } from "@/lib/types";

export default function ClientAssessmentCard({ lead }: { lead: Lead }) {
  const origin = useBrowserOrigin();
  const [copiedLink, setCopiedLink] = useState(false);

  const formUrl = origin
    ? `${origin}/intake?leadId=${lead.id}`
    : `/intake?leadId=${lead.id}`;

  const waMsg = generateLeadWhatsAppMessage({
    clientName: lead.name,
    formUrl,
  });
  const waUrl = waLink(lead.phone, waMsg);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      window.prompt("Copy intake link:", formUrl);
    }
  }

  // If assessment has NOT been submitted yet
  if (!lead.assessment) {
    return (
      <Card className="overflow-hidden border-dashed border-mist-300">
        <div className="border-b border-mist-200 bg-amber-50/50 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-amber-500 text-xs font-black text-white">
                !
              </span>
              <h2 className="text-sm font-extrabold text-ink-900">
                Client Assessment Form Pending
              </h2>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-800">
              Awaiting Client Submission
            </span>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm leading-relaxed text-ink-900/70">
            Send the property assessment form to{" "}
            <strong className="text-ink-900">{lead.name}</strong> over WhatsApp.
            Once they submit their room count, hotel category, and software
            needs, Hotel Mate will automatically compute the ideal package and
            sales pitch.
          </p>

          {/* Form link row */}
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-mist-200 bg-mist-50/70 p-3">
            <span className="text-xs font-bold text-ink-900/60">
              Personalized Link:
            </span>
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-ink-900">
              {formUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-lg border border-mist-200 bg-white px-2.5 py-1 text-xs font-bold text-ink-900 hover:bg-mist-50"
            >
              {copiedLink ? (
                <>
                  <Check className="size-3 text-emerald-600" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-3" /> Copy Link
                </>
              )}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white shadow-sm shadow-emerald-600/30 hover:bg-emerald-700"
            >
              <MessageCircle className="size-4" /> Send Form via WhatsApp
            </a>
            <Link
              href={`/intake?leadId=${lead.id}`}
              target="_blank"
              className="flex items-center gap-1.5 rounded-xl border border-mist-200 bg-white px-4 py-2.5 text-xs font-bold text-ink-900 hover:bg-mist-50"
            >
              <ExternalLink className="size-3.5" /> Fill on Behalf of Client
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  const a = lead.assessment;
  const rec = a.recommendation;

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-mist-200 bg-mist-50/70 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-lg bg-brand-500 text-white shadow-sm shadow-brand-500/30">
            <Hotel className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-ink-900">
              Client Onboarding & Property Assessment
            </h2>
            <p className="text-xs text-ink-900/50">
              Submitted on {fmtDateYear(a.submittedAt)}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          <CheckCircle2 className="size-3.5 text-emerald-600" /> Assessment
          Verified
        </span>
      </div>

      <div className="divide-y divide-mist-100 p-6 space-y-6">
        {/* Row 1: Property Capacity & Category */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-mist-200 bg-mist-50/40 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-900/50">
              Category
            </span>
            <p className="mt-1 text-sm font-black text-ink-900">
              {a.hotelCategory}
            </p>
          </div>

          <div className="rounded-xl border border-mist-200 bg-mist-50/40 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-900/50">
              Room Capacity
            </span>
            <p className="mt-1 text-sm font-black text-ink-900">
              {a.roomsCount} Rooms
            </p>
          </div>

          <div className="rounded-xl border border-mist-200 bg-mist-50/40 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-900/50">
              Restaurant (F&B)
            </span>
            <p className="mt-1 text-sm font-black text-ink-900">
              {a.hasRestaurant ? "Yes" : "No"}
            </p>
          </div>

          <div className="rounded-xl border border-mist-200 bg-mist-50/40 p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-900/50">
              Spa & Wellness
            </span>
            <p className="mt-1 text-sm font-black text-ink-900">
              {a.hasSpa ? "Yes" : "No"}
            </p>
          </div>
        </div>

        {/* Row 2: Software Background & OTAs */}
        <div className="pt-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink-900/60">
            Software Experience & Channels
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-mist-200 bg-white p-3.5 text-xs">
              <span className="text-ink-900/50">PMS (Hotel Management):</span>
              <p className="mt-1 font-bold text-ink-900">
                Currently using: {a.currentlyUsingPms ? "Yes" : "No"} · Used
                before: {a.usedPmsBefore ? "Yes" : "No"}
              </p>
            </div>

            <div className="rounded-xl border border-mist-200 bg-white p-3.5 text-xs">
              <span className="text-ink-900/50">Channel Manager:</span>
              <p className="mt-1 font-bold text-ink-900">
                Currently using: {a.currentlyUsingChannelManager ? "Yes" : "No"}{" "}
                · Used before: {a.usedChannelManagerBefore ? "Yes" : "No"}
              </p>
            </div>
          </div>

          {/* OTAs */}
          <div className="mt-3 rounded-xl border border-mist-200 bg-white p-3.5 text-xs">
            <span className="text-ink-900/50">OTAs Currently Managed:</span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {a.otasManaged.map((ota) => (
                <span
                  key={ota}
                  className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700"
                >
                  {ota}
                </span>
              ))}
              {a.otasOtherText && (
                <span className="rounded-md bg-mist-100 px-2.5 py-1 text-xs font-semibold text-ink-900">
                  {a.otasOtherText}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Row 3: Requested Demo Schedule */}
        <div className="pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50/50 p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-brand-500 text-white shadow-sm">
                <Calendar className="size-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                  Client Requested Demo Time
                </span>
                <p className="text-base font-black text-ink-900">
                  {a.demoDate} at {a.demoTime}
                </p>
              </div>
            </div>

            <a
              href={waLink(
                lead.phone,
                `Hi ${lead.name.split(" ")[0]}! Confirming your Hotel Mate demo scheduled for ${a.demoDate} at ${a.demoTime}. We look forward to meeting with your team.`
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-ink-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-ink-800"
            >
              <MessageCircle className="size-3.5 text-emerald-400" /> Confirm
              Demo on WhatsApp
            </a>
          </div>
        </div>

        {/* Row 4: Intelligent Package Recommendation & Sales Approach */}
        {rec && (
          <div className="pt-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-brand-500" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-700">
                Recommended Package & Communication Strategy
              </h3>
            </div>

            <div className="mt-3 rounded-2xl border border-mist-200 bg-gradient-to-br from-mist-50/60 to-white p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-mist-200 pb-3">
                <div>
                  <span className="rounded-full bg-brand-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                    {rec.tier} Tier
                  </span>
                  <h4 className="mt-1.5 text-base font-extrabold text-ink-900">
                    {rec.packageName}
                  </h4>
                </div>
                <p className="text-right">
                  <span className="text-xs font-semibold text-ink-900/50">
                    Suggested Pricing:
                  </span>{" "}
                  <strong className="text-base font-black text-ink-900">
                    {fmtMoney(rec.monthlyLKR)}
                  </strong>
                  <span className="text-xs text-ink-900/50">/mo</span>
                </p>
              </div>

              {/* Add-ons */}
              {rec.addons.length > 0 && (
                <div className="mt-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-900/50">
                    Recommended Add-ons:
                  </span>
                  <ul className="mt-1.5 flex flex-wrap gap-2">
                    {rec.addons.map((addon) => (
                      <li
                        key={addon}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-mist-200 bg-white px-2.5 py-1 text-xs font-semibold text-ink-900"
                      >
                        <Check className="size-3 text-emerald-600" /> {addon}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Communication Approach */}
              <div className="mt-4 rounded-xl border border-brand-200/80 bg-brand-50/40 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                  Recommended Communication Approach:
                </span>
                <p className="mt-1 text-xs leading-relaxed text-ink-900/80">
                  {rec.communicationApproach}
                </p>
              </div>

              {/* Key Pitch Points */}
              {rec.pitchPoints.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-900/50">
                    Key Pitch Points for the Call:
                  </span>
                  <ul className="space-y-1">
                    {rec.pitchPoints.map((pt, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-ink-900/80"
                      >
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-brand-500" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
