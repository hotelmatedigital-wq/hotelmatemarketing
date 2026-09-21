"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  PlusCircle,
  RotateCw,
  Send,
  Sparkles,
} from "lucide-react";
import { Card, SourceBadge, StatusBadge } from "@/components/ui";
import { FacebookIcon, InstagramIcon } from "@/components/brand-icons";
import { generateLeadWhatsAppMessage, waLink } from "@/lib/wa";
import { relTime } from "@/lib/format";
import type { Lead, LeadSource } from "@/lib/types";

const CHANNELS: Array<{ id: LeadSource; label: string; icon: React.ReactNode }> = [
  {
    id: "facebook",
    label: "Facebook Lead Ad / Page",
    icon: <FacebookIcon className="size-4 text-blue-600" />,
  },
  {
    id: "instagram",
    label: "Instagram Ad / Direct Message",
    icon: <InstagramIcon className="size-4 text-pink-600" />,
  },
  {
    id: "whatsapp",
    label: "WhatsApp Direct Inquiry",
    icon: <MessageCircle className="size-4 text-emerald-600" />,
  },
];

const inputCls =
  "w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none transition-all placeholder:text-ink-900/30 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

const labelCls = "mb-1 block text-xs font-bold text-ink-900/70";

export default function GeneratorClient({
  initialLeads,
}: {
  initialLeads: Lead[];
}) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [source, setSource] = useState<LeadSource>("facebook");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [campaign, setCampaign] = useState("FB & IG Lead Outreach");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [activeResult, setActiveResult] = useState<{
    lead: Lead;
    formUrl: string;
    waMessage: string;
    waUrl: string;
  } | null>(null);

  const [origin, setOrigin] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Client name is required.");
      return;
    }
    if (!phone.trim()) {
      setError("Mobile / WhatsApp number is required.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          source,
          campaign: campaign.trim() || "FB & IG Lead Generator",
          note: note.trim() || undefined,
          hotel: "Pending Assessment",
          location: "—",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate lead.");
      }

      const newLead = data as Lead;
      const currentOrigin =
        typeof window !== "undefined" ? window.location.origin : "";
      const formUrl = `${currentOrigin}/intake?leadId=${newLead.id}`;
      const waMessage = generateLeadWhatsAppMessage({
        clientName: newLead.name,
        formUrl,
      });
      const generatedWaUrl = waLink(newLead.phone, waMessage);

      setActiveResult({
        lead: newLead,
        formUrl,
        waMessage,
        waUrl: generatedWaUrl,
      });

      setLeads((prev) => [newLead, ...prev]);

      // Reset fields for the next one
      setName("");
      setPhone("");
      setEmail("");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  function handleSelectExisting(lead: Lead) {
    const currentOrigin =
      typeof window !== "undefined" ? window.location.origin : "";
    const formUrl = `${currentOrigin}/intake?leadId=${lead.id}`;
    const waMessage = generateLeadWhatsAppMessage({
      clientName: lead.name,
      formUrl,
    });
    const generatedWaUrl = waLink(lead.phone, waMessage);

    setActiveResult({
      lead,
      formUrl,
      waMessage,
      waUrl: generatedWaUrl,
    });
  }

  async function copyToClipboard(text: string, type: "link" | "msg") {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "link") {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        setCopiedMsg(true);
        setTimeout(() => setCopiedMsg(false), 2000);
      }
    } catch {
      window.prompt("Copy content:", text);
    }
  }

  return (
    <div className="space-y-6">
      {/* TOP ROW: Generation Form + Ready-to-Send WhatsApp card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Input Form */}
        <Card className="p-6 lg:col-span-6">
          <div className="flex items-center gap-2 border-b border-mist-200 pb-3">
            <PlusCircle className="size-5 text-brand-500" />
            <h2 className="text-base font-extrabold text-ink-900">
              Input Social Media Lead
            </h2>
          </div>
          <p className="mt-2 text-xs text-ink-900/60">
            Paste the client details from Facebook Lead Forms or Instagram Direct
            inquiries.
          </p>

          <form onSubmit={handleGenerate} className="mt-5 space-y-4">
            {/* Channel selector */}
            <div>
              <label className={labelCls}>Acquisition Channel</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {CHANNELS.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setSource(ch.id)}
                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                      source === ch.id
                        ? "border-brand-500 bg-brand-50/70 text-ink-900 shadow-sm"
                        : "border-mist-200 bg-white text-ink-900/60 hover:bg-mist-50"
                    }`}
                  >
                    {ch.icon}
                    <span className="truncate">{ch.label.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="client-name" className={labelCls}>
                Client Name *
              </label>
              <input
                id="client-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Asoka Rajapakse"
                className={inputCls}
              />
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="client-phone" className={labelCls}>
                  Mobile / WhatsApp Number *
                </label>
                <input
                  id="client-phone"
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 7X XXX XXXX"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="client-email" className={labelCls}>
                  Email Address
                </label>
                <input
                  id="client-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@hotel.lk"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Campaign & Notes */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="campaign-name" className={labelCls}>
                  Campaign / Ad Name
                </label>
                <input
                  id="campaign-name"
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  placeholder="e.g. FB Luxury Resort Ad"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="client-note" className={labelCls}>
                  Initial Inquiry Note
                </label>
                <input
                  id="client-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Inquired about booking engine"
                  className={inputCls}
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-extrabold text-white shadow-lg shadow-brand-500/30 transition-all hover:bg-brand-600 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <RotateCw className="size-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Generate Form Link & WhatsApp
                  Message
                </>
              )}
            </button>
          </form>
        </Card>

        {/* Right: Auto-Generated WhatsApp Launch Box */}
        <Card className="flex flex-col justify-between p-6 lg:col-span-6">
          <div>
            <div className="flex items-center justify-between border-b border-mist-200 pb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="size-5 text-emerald-600" />
                <h2 className="text-base font-extrabold text-ink-900">
                  Ready-to-Send WhatsApp Message
                </h2>
              </div>
              {activeResult && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  {activeResult.lead.id}
                </span>
              )}
            </div>

            {activeResult ? (
              <div className="mt-4 space-y-4">
                {/* Client Target Pill */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-mist-200 bg-mist-50/70 p-3">
                  <div>
                    <p className="text-xs font-bold text-ink-900">
                      Sending To: {activeResult.lead.name}
                    </p>
                    <p className="text-xs text-ink-900/60">
                      {activeResult.lead.phone}
                    </p>
                  </div>
                  <Link
                    href={`/leads/${activeResult.lead.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
                  >
                    View Lead <ExternalLink className="size-3" />
                  </Link>
                </div>

                {/* Primary Action Button: Open WhatsApp */}
                <a
                  href={activeResult.waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-700 active:scale-[0.99]"
                >
                  <Send className="size-4" /> Open WhatsApp & Review Message
                </a>

                {/* Generated Personalized Link */}
                <div className="rounded-xl border border-mist-200 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink-900/50">
                      Personalized Intake Link
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(activeResult.formUrl, "link")
                      }
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="size-3 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" /> Copy Link
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-1 truncate font-mono text-xs text-ink-900/70">
                    {activeResult.formUrl}
                  </p>
                </div>

                {/* WhatsApp Chat Preview */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink-900/50">
                      Pre-filled Message Preview
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(activeResult.waMessage, "msg")
                      }
                      className="inline-flex items-center gap-1 text-xs font-bold text-ink-900/60 hover:text-ink-900"
                    >
                      {copiedMsg ? (
                        <>
                          <Check className="size-3 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" /> Copy Text
                        </>
                      )}
                    </button>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-[#e7f8ef] p-4 text-xs leading-relaxed text-ink-900 shadow-inner">
                    <pre className="font-sans whitespace-pre-wrap">
                      {activeResult.waMessage}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="grid size-12 place-items-center rounded-2xl bg-mist-100 text-ink-900/40">
                  <Send className="size-6" />
                </div>
                <p className="mt-3 text-sm font-bold text-ink-900">
                  No Message Generated Yet
                </p>
                <p className="mt-1 max-w-xs text-xs text-ink-900/50">
                  Fill in the client name, phone number, and email on the left,
                  or select an existing lead below to launch WhatsApp.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-mist-100 pt-3 text-[11px] text-ink-900/40">
            * Opening WhatsApp will pre-fill the message in WhatsApp Web or the
            desktop/mobile app for your final review before sending.
          </div>
        </Card>
      </div>

      {/* BOTTOM SECTION: Recent FB & IG Leads & Form Status */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-mist-200 bg-mist-50/60 px-6 py-4">
          <div>
            <h3 className="text-sm font-extrabold text-ink-900">
              Recent Social Media Inquiries ({leads.length})
            </h3>
            <p className="text-xs text-ink-900/50">
              Track whether clients have submitted their property assessment
              form.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-mist-200 bg-white text-[11px] font-bold uppercase tracking-wider text-ink-900/50">
                <th className="px-6 py-3">Lead / Hotel</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Form Status</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist-100 bg-white">
              {leads.map((lead) => {
                const isSubmitted = lead.formStatus === "submitted";
                return (
                  <tr
                    key={lead.id}
                    className="transition-colors hover:bg-mist-50/50"
                  >
                    <td className="px-6 py-3.5">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-bold text-ink-900 hover:text-brand-600 hover:underline"
                      >
                        {lead.hotel}
                      </Link>
                      <p className="text-xs text-ink-900/50">
                        {lead.name} {lead.location !== "—" && `· ${lead.location}`}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <SourceBadge source={lead.source} />
                    </td>

                    <td className="px-4 py-3.5 text-xs">
                      <p className="font-semibold text-ink-900">{lead.phone}</p>
                      {lead.email && (
                        <p className="text-ink-900/50">{lead.email}</p>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      {isSubmitted ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                          <Check className="size-3 text-emerald-600" /> Submitted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                          Pending Form
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={lead.status} />
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 text-xs text-ink-900/50">
                      {relTime(lead.createdAt)}
                    </td>

                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectExisting(lead)}
                          className="inline-flex items-center gap-1 rounded-lg border border-mist-200 bg-white px-2.5 py-1.5 text-xs font-bold text-ink-900 hover:bg-mist-50"
                        >
                          <MessageCircle className="size-3 text-emerald-600" />
                          Launch WA
                        </button>
                        <Link
                          href={`/leads/${lead.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-ink-900 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-ink-800"
                        >
                          Profile
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
