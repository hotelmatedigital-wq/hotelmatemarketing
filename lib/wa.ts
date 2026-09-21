import { HOTLINE } from "./data";

/** Build a wa.me deep link to open WhatsApp with a prefilled message. */
export function waLink(phone: string, text: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/** Message used to send the intake form link to a lead's WhatsApp. */
export function intakeFormMessage(name: string, origin: string): string {
  const first = name.split(" ")[0] || "there";
  return (
    `Hi ${first}! Thank you for contacting Hotel Mate. 🙂\n\n` +
    `Please fill out this quick form so our team can prepare the best solution for your property:\n` +
    `${origin}/intake\n\n` +
    `Hotel Mate — All-in-One Hotel Management\nHotline: ${HOTLINE}`
  );
}
