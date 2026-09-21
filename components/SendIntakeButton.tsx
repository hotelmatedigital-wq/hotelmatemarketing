"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { generateLeadWhatsAppMessage, waLink } from "@/lib/wa";

/**
 * Opens WhatsApp addressed to the lead's number with the intake-form link
 * prefilled. The href is built after mount so it always uses the real origin.
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
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    const origin = window.location.origin;
    const formUrl = leadId
      ? `${origin}/intake?leadId=${encodeURIComponent(leadId)}`
      : `${origin}/intake`;
    const message = generateLeadWhatsAppMessage({
      clientName: name,
      formUrl,
    });
    setHref(waLink(phone, message));
  }, [name, phone, leadId]);

  return (
    <a
      href={href ?? "#"}
      target="_blank"
      rel="noreferrer"
      aria-disabled={href === null}
      onClick={(e) => {
        if (href === null) e.preventDefault();
      }}
      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ink-900 px-3 py-2 text-xs font-bold text-white hover:bg-ink-800"
    >
      <MessageCircle className="size-3.5" /> Send Form
    </a>
  );
}
