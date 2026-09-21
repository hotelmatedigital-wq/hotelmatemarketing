import { Suspense } from "react";
import type { Metadata } from "next";
import IntakeForm from "./IntakeForm";

export const metadata: Metadata = {
  title: "Property Assessment & Demo Request",
  description:
    "Complete your property details so Hotel Mate can prepare your customized hotel management demo and package.",
};

export default function IntakePage() {
  return (
    <div className="min-h-screen bg-ink-900 text-mist-50">
      {/* subtle brand glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-brand-500/20 via-brand-500/5 to-transparent" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-8 sm:px-6 sm:py-12">
        {/* Header Branding */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-xl bg-brand-500 text-2xl font-black text-white shadow-lg shadow-brand-500/40">
              H
            </div>
            <div className="text-left leading-tight">
              <p className="text-lg font-black tracking-widest text-white">
                HOTEL MATE
              </p>
              <p className="text-xs font-semibold tracking-wide text-brand-300">
                All-in-One · Integrated · AI Powered
              </p>
            </div>
          </div>
          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Client Onboarding & Property Assessment
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-mist-200/70">
            Please share a few details about your property so our hospitality
            specialists can tailor the best package and prepare your demo.
          </p>
        </div>

        {/* Main Card */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white p-6 text-ink-900 shadow-2xl sm:p-10">
          <Suspense
            fallback={
              <div className="py-20 text-center text-sm font-medium text-ink-900/50">
                Loading assessment form…
              </div>
            }
          >
            <IntakeForm />
          </Suspense>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-white/40">
          <p>© {new Date().getFullYear()} Hotel Mate Digital · hotelmate.co.uk</p>
          <p className="mt-1">
            Need urgent assistance? Call our hotline:{" "}
            <a
              href="tel:+94788607143"
              className="font-semibold text-brand-300 hover:underline"
            >
              +94 78 860 7143
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
