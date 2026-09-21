import type { Metadata } from "next";
import IntakeForm from "./IntakeForm";

export const metadata: Metadata = {
  title: "Quick Inquiry Form",
  description: "Tell us about your property — Hotel Mate team will contact you.",
};

export default function IntakePage() {
  return (
    <div className="min-h-screen bg-ink-900">
      {/* subtle brand glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-brand-500/20 to-transparent" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col px-4 py-10">
        {/* header */}
        <div className="flex items-center justify-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-brand-500 text-xl font-extrabold text-white shadow-lg shadow-brand-500/40">
            H
          </div>
          <div className="leading-tight">
            <p className="text-base font-extrabold tracking-widest text-white">
              HOTEL MATE
            </p>
            <p className="text-[11px] font-medium tracking-wide text-brand-300">
              All-in-One · Integrated · AI Powered
            </p>
          </div>
        </div>

        <div className="mt-8">
          <IntakeForm />
        </div>

        <p className="mt-8 text-center text-xs text-white/35">
          © {new Date().getFullYear()} Hotel Mate · hotelmate.co.uk
        </p>
      </div>
    </div>
  );
}
