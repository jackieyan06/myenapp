"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import Link from "next/link";
import { Check, Sparkles, ShieldCheck, CreditCard, ArrowRight } from "lucide-react";

type Plan = "monthly" | "annual";

export default function PricingPage() {
  const { t } = useLanguage();
  const plans = {
    monthly: { name: t("monthly"), price: "¥980", period: "/ month", detail: t("billingMonthly") },
    annual: { name: t("annual"), price: "¥9,800", period: "/ year", detail: t("saveAnnual") },
  };
  const benefits = [t("benefits1"), t("benefits2"), t("benefits3"), t("benefits4")];
  const [selectedPlan, setSelectedPlan] = useState<Plan>("annual");
  const selected = plans[selectedPlan];

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <section className="relative overflow-hidden border-b border-[#E6E0D6] bg-[#F2EDE4]">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#D94E34]/20 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#D94E34]">
            <Sparkles className="h-4 w-4" /> En Membership
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight text-[#1A1D24] sm:text-5xl">
            {t("pricingTitle")}
            <span className="block text-[#D94E34]">{t("pricingSubtitle")}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#5A5D66] sm:text-lg">
            {t("pricingIntro")}
            Choose a membership that fits the way you connect.
          </p>
          <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#24634A] shadow-sm">
            <Check className="h-4 w-4" /> {t("freeTrial")} on either plan
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <article className={`relative rounded-3xl border bg-white p-7 shadow-sm transition ${selectedPlan === "monthly" ? "border-[#D94E34] ring-2 ring-[#D94E34]/10" : "border-[#E6E0D6]"}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-[#5A5D66]">MONTHLY</p>
                <h2 className="mt-2 text-2xl font-extrabold text-[#1A1D24]">{t("stayFlexible")}</h2>
              </div>
              <div className="rounded-2xl bg-[#FAF1ED] p-3 text-[#D94E34]"><CreditCard className="h-6 w-6" /></div>
            </div>
            <div className="mt-7 flex items-end gap-1">
              <span className="text-4xl font-extrabold tracking-tight text-[#1A1D24]">¥980</span>
              <span className="pb-1 text-sm text-[#77736D]">/ month</span>
            </div>
            <p className="mt-2 text-sm text-[#77736D]">{t("billingMonthly")}</p>
            <ul className="mt-7 space-y-3">
              {benefits.map((benefit) => <li key={benefit} className="flex gap-3 text-sm text-[#454851]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#D94E34]" />{benefit}</li>)}
            </ul>
            <button onClick={() => setSelectedPlan("monthly")} className={`mt-8 w-full rounded-full px-5 py-3 text-sm font-bold transition ${selectedPlan === "monthly" ? "bg-[#1A1D24] text-white" : "border border-[#D8D0C4] bg-white text-[#1A1D24] hover:border-[#D94E34]"}`}>
              {selectedPlan === "monthly" ? "Selected plan" : "Choose monthly"}
            </button>
          </article>

          <article className={`relative rounded-3xl border bg-white p-7 shadow-sm transition ${selectedPlan === "annual" ? "border-[#D94E34] ring-2 ring-[#D94E34]/10" : "border-[#E6E0D6]"}`}>
            <div className="absolute -top-3 right-7 rounded-full bg-[#D94E34] px-3 py-1 text-xs font-bold text-white">{t("bestValue")}</div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-[#5A5D66]">ANNUAL</p>
                <h2 className="mt-2 text-2xl font-extrabold text-[#1A1D24]">{t("makeYear")}</h2>
              </div>
              <div className="rounded-2xl bg-[#FAF1ED] p-3 text-[#D94E34]"><Sparkles className="h-6 w-6" /></div>
            </div>
            <div className="mt-7 flex items-end gap-1">
              <span className="text-4xl font-extrabold tracking-tight text-[#1A1D24]">¥9,800</span>
              <span className="pb-1 text-sm text-[#77736D]">/ year</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-[#24634A]">{t("saveAnnual")}</p>
            <ul className="mt-7 space-y-3">
              {benefits.map((benefit) => <li key={benefit} className="flex gap-3 text-sm text-[#454851]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#D94E34]" />{benefit}</li>)}
            </ul>
            <button onClick={() => setSelectedPlan("annual")} className={`mt-8 w-full rounded-full px-5 py-3 text-sm font-bold transition ${selectedPlan === "annual" ? "bg-[#D94E34] text-white hover:bg-[#C04028]" : "border border-[#D8D0C4] bg-white text-[#1A1D24] hover:border-[#D94E34]"}`}>
              {selectedPlan === "annual" ? "Selected plan" : "Choose annual"}
            </button>
          </article>
        </div>

        <section className="mx-auto mt-10 max-w-4xl rounded-3xl border border-[#E6E0D6] bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#24634A]"><ShieldCheck className="h-4 w-4" /> 7-day free trial</div>
              <h2 className="mt-2 text-xl font-extrabold text-[#1A1D24]">Your selection: {selected.name}</h2>
              <p className="mt-1 text-sm text-[#5A5D66]">{selected.price}{selected.period} · {selected.detail}</p>
            </div>
            <div className="rounded-2xl bg-[#FAF8F4] px-5 py-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#77736D]">Preview total</p>
              <p className="mt-1 text-2xl font-extrabold text-[#1A1D24]">{selected.price}</p>
              <p className="text-xs text-[#77736D]">After 7-day trial</p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-[#D8D0C4] bg-[#FAF8F4] p-4">
            <p className="text-sm font-bold text-[#1A1D24]">{t("checkoutPreview")}</p>
            <p className="mt-1 text-sm leading-6 text-[#5A5D66]">{t("noPayments")}</p>
            <button type="button" disabled className="mt-4 inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-[#BDB8AF] px-5 py-3 text-sm font-bold text-white">
              Continue to secure checkout <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section id="faq" className="mx-auto mt-14 max-w-3xl text-center">
          <h2 className="text-2xl font-extrabold text-[#1A1D24]">A few things to know</h2>
          <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
            <div className="rounded-2xl bg-[#F2EDE4] p-5"><h3 className="font-bold text-[#1A1D24]">When does billing start?</h3><p className="mt-2 text-sm leading-6 text-[#5A5D66]">The proposed plan includes a 7-day free trial. Billing begins after the trial when live checkout is activated.</p></div>
            <div className="rounded-2xl bg-[#F2EDE4] p-5"><h3 className="font-bold text-[#1A1D24]">Can I cancel?</h3><p className="mt-2 text-sm leading-6 text-[#5A5D66]">The monthly plan is designed to be flexible. Cancellation and account management will be available through the secure billing portal once payments are connected.</p></div>
          </div>
          <p className="mt-8 text-sm text-[#77736D]">Have questions? <Link href="/community" className="font-bold text-[#D94E34] hover:underline">Explore the community</Link>.</p>
        </section>
      </main>
    </div>
  );
}
