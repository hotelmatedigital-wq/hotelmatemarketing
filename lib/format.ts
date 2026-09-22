import {
  BUSINESS_TIME_ZONE,
  dateInBusinessTimeZone,
} from "./date";

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: BUSINESS_TIME_ZONE,
});

const DATE_YEAR_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: BUSINESS_TIME_ZONE,
});

const TIME_FMT = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: BUSINESS_TIME_ZONE,
});

export function fmtDate(iso: string): string {
  return DATE_FMT.format(new Date(iso));
}

export function fmtDateYear(iso: string): string {
  return DATE_YEAR_FMT.format(new Date(iso));
}

export function fmtTime(iso: string): string {
  return TIME_FMT.format(new Date(iso));
}

export function fmtMoney(lkr: number): string {
  return `Rs ${lkr.toLocaleString("en-US")}`;
}

export function relTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return fmtDate(iso);
}

export function isWithinLastDays(iso: string, days: number): boolean {
  const timestamp = new Date(iso).getTime();
  return (
    Number.isFinite(timestamp) &&
    Date.now() - timestamp >= 0 &&
    Date.now() - timestamp < days * 24 * 60 * 60 * 1000
  );
}

export function isOverdue(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

export function isToday(iso: string): boolean {
  const date = new Date(iso);
  return (
    Number.isFinite(date.getTime()) &&
    dateInBusinessTimeZone(date) === dateInBusinessTimeZone()
  );
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
