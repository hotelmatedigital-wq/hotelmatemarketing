import React from "react";

/**
 * Official Hotel Mate Icon Mark
 * High-precision vector representation of the stylized blue 'H+M' monogram.
 */
export function HotelMateIcon({
  className = "size-8",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Hotel Mate"
    >
      <path
        fill="#00AEEF"
        fillRule="evenodd"
        d="
          M 32 12
          A 13.5 13.5 0 0 1 45.5 25.5
          L 45.5 33
          A 4.5 4.5 0 0 0 54.5 33
          L 54.5 25.5
          A 13.5 13.5 0 0 1 68 12
          A 13.5 13.5 0 0 1 81.5 25.5
          L 81.5 74.5
          A 13.5 13.5 0 0 1 68 88
          A 13.5 13.5 0 0 1 54.5 74.5
          L 54.5 49
          L 45.5 49
          L 45.5 74.5
          A 13.5 13.5 0 0 1 32 88
          A 13.5 13.5 0 0 1 18.5 74.5
          L 18.5 25.5
          A 13.5 13.5 0 0 1 32 12 Z

          M 32 21
          A 4.5 4.5 0 0 0 27.5 25.5
          L 27.5 74.5
          A 4.5 4.5 0 0 0 36.5 74.5
          L 36.5 25.5
          A 4.5 4.5 0 0 0 32 21 Z

          M 68 21
          A 4.5 4.5 0 0 0 63.5 25.5
          L 63.5 74.5
          A 4.5 4.5 0 0 0 72.5 74.5
          L 72.5 25.5
          A 4.5 4.5 0 0 0 68 21 Z

          M 44.5 39
          C 46 44.5 48 46.5 50 46.5
          C 52 46.5 54 44.5 55.5 39
          C 54 43.5 52 45.2 50 45.2
          C 48 45.2 46 43.5 44.5 39
          Z
        "
      />
    </svg>
  );
}

/**
 * Official Hotel Mate Full Horizontal Logo
 * Combines the blue monogram mark and bold geometric typography.
 */
export function HotelMateLogo({
  className = "h-8",
  variant = "light",
  showSubtitle = false,
}: {
  className?: string;
  variant?: "light" | "dark";
  showSubtitle?: boolean;
}) {
  const textColor = variant === "light" ? "text-white" : "text-ink-950";

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <HotelMateIcon className="h-full w-auto aspect-square shrink-0" />
      <div className="leading-tight">
        <span
          className={`block text-base font-black tracking-wider ${textColor}`}
          style={{ letterSpacing: "0.06em" }}
        >
          HOTEL MATE
        </span>
        {showSubtitle && (
          <span className="block text-[10px] font-bold tracking-wide text-brand-300">
            Marketing Panel
          </span>
        )}
      </div>
    </div>
  );
}

export default HotelMateLogo;
