import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hotel Mate · Marketing Panel",
    template: "%s · Hotel Mate",
  },
  description:
    "Hotel Mate Marketing Panel — social media lead monitoring, sales pipeline & follow-ups.",
  icons: {
    icon: "/hotelmate-icon.svg",
    apple: "/hotelmate-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
