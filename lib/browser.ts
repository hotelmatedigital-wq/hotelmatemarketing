"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => undefined;
const getServerSnapshot = () => "";

/**
 * Returns the current browser origin after hydration while keeping the server
 * snapshot deterministic. The origin cannot change during a page session, so
 * no external subscription is required.
 */
export function useBrowserOrigin(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.origin,
    getServerSnapshot
  );
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** A hydration-safe YYYY-MM-DD date calculated in the visitor's time zone. */
export function useBrowserDate(daysAhead = 0): string {
  return useSyncExternalStore(
    subscribe,
    () => {
      const date = new Date();
      date.setDate(date.getDate() + daysAhead);
      return formatLocalDate(date);
    },
    getServerSnapshot
  );
}
