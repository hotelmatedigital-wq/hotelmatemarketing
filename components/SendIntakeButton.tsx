"use client";

import { MessageCircle } from "lucide-react";
import { useBrowserOrigin } from "@/lib/browser";
import { generateLeadWhatsAppMessage, waLink } from "@/lib/wa";

/**
 * Opens WhatsApp addressed to the lead's number with the intake-form link
 * prefilled. The href is enabled after hydration so it uses the real origin.
 */
export default function SendIntakeButton({
  name,
  phone,
  leadId,
}: {
  name: string;
  phone: string;
  leadId?: string;
}) {
  const origin = useBrowserOrigin();
  const formUrl = origin
    ? leadId
      ? `${origin}/intake?leadId=${encodeURIComponent(leadId)}`
      : `${origin}/intake`
    : "";
  const href = formUrl
    ? waLink(
        phone,
        generateLeadWhatsAppMessage({
          clientName: name,
          formUrl,
        })
      )
    : null;

  return (
    <a
      href={href ?? "#"}
      target="_blank"
      rel="noreferrer"
      aria-disabled={href === null}
      onClick={(event) => {
        if (href === null) event.preventDefault();
      }}
      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ink-900 px-3 py-2 text-xs font-bold text-white hover:bg-ink-800 aria-disabled:cursor-wait aria-disabled:opacity-60"
    >
      <MessageCircle className="size-3.5" /> Send Form
    </a>
  );
}
