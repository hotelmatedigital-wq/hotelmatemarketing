/**
 * Brand icons as inline SVGs (lucide removed brand icons in v1).
 */

export function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5H16.6V4.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V11H8v3h2.4v7h3.1Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12.04 3c-4.9 0-8.9 3.98-8.9 8.87 0 1.56.41 3.08 1.19 4.42L3 21l4.83-1.26a8.93 8.93 0 0 0 4.2 1.06h.01c4.9 0 8.9-3.98 8.9-8.87a8.8 8.8 0 0 0-2.6-6.26A8.86 8.86 0 0 0 12.04 3Zm5.2 12.6c-.22.62-1.3 1.19-1.8 1.23-.46.04-1.04.06-1.68-.11a15.4 15.4 0 0 1-1.53-.56c-2.7-1.16-4.46-3.87-4.6-4.05-.13-.18-1.1-1.46-1.1-2.79 0-1.33.7-1.98.95-2.25.25-.27.54-.34.72-.34l.52.01c.17.01.39-.06.61.47.22.54.76 1.85.83 1.98.07.13.11.29.02.47-.09.18-.14.29-.27.45l-.4.47c-.13.13-.27.28-.12.54.15.27.68 1.12 1.46 1.82 1 .9 1.85 1.17 2.11 1.3.27.14.42.12.58-.07.15-.18.66-.77.84-1.03.18-.27.36-.22.6-.13.25.09 1.57.74 1.84.88.27.13.45.2.51.31.07.11.07.66-.15 1.3Z" />
    </svg>
  );
}
