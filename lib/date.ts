export const BUSINESS_TIME_ZONE = "Asia/Colombo";

const DATE_PARTS_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: BUSINESS_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Current calendar date in the Hotel Mate business time zone. */
export function dateInBusinessTimeZone(date = new Date()): string {
  const values = Object.fromEntries(
    DATE_PARTS_FORMATTER.formatToParts(date).map((part) => [
      part.type,
      part.value,
    ])
  );
  return `${values.year}-${values.month}-${values.day}`;
}
