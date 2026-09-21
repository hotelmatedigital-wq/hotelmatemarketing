import { HOTLINE } from "./data";

/** Build a wa.me deep link to open WhatsApp with a prefilled message. */
export function waLink(phone: string, text: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates the official WhatsApp outreach message for leads captured via FB & IG.
 *
 * Requirements:
 * - Begins with a thank you note for contacting Hotel Mate.
 * - Includes the personalized form link.
 * - Asks the client to fill out required property details so we can arrange a demo for them.
 * - Pre-filled with client name and loaded into WhatsApp ready for review before sending.
 */
export function generateLeadWhatsAppMessage(params: {
  clientName: string;
  formUrl: string;
}): string {
  const name = params.clientName.trim();
  const greeting = name ? `Hi ${name}` : "Hello";

  return (
    `Thank you for contacting Hotel Mate! 👋\n\n` +
    `${greeting}, we are excited to connect with you regarding your property.\n\n` +
    `To help us understand your requirements and arrange a personalized demo for you, please take 2 minutes to fill out this quick form:\n\n` +
    `👉 ${params.formUrl}\n\n` +
    `Once you submit the details, our team will review your hotel's capacity and confirm your preferred demo time.\n\n` +
    `Best regards,\n` +
    `Hotel Mate Team\n` +
    `All-in-One · Integrated · AI Powered Hotel Management\n` +
    `Hotline: ${HOTLINE}`
  );
}

/** Legacy alias for backwards compatibility */
export function intakeFormMessage(name: string, origin: string): string {
  return generateLeadWhatsAppMessage({
    clientName: name,
    formUrl: `${origin}/intake`,
  });
}
