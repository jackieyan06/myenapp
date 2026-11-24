"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Copy, Check, Sparkles, Compass } from "lucide-react";
import { JAPAN_PHRASES, JAPAN_ETIQUETTE_TIPS } from "@/lib/constants";

export function GuideClient() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1800);
    } catch {
      // ignore clipboard limitations
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="rounded-3xl border border-[#E6E0D6] bg-gradient-to-br from-[#F5EFE6] via-white to-[#FAF8F4] p-7 sm:p-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#3E6B48]/12 px-3.5 py-1 text-xs font-semibold text-[#3E6B48]">
          <BookOpen className="h-3.5 w-3.5" />
          Cultural Field Guide
        </div>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#1A1D24] sm:text-4xl">
          Meeting in Japan: Etiquette &amp; Essential Phrases
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5A5D66] sm:text-base">
          Practical tips for navigating Japanese train station exits, splitting
          izakaya bills smoothly, and breaking the ice with helpful Japanese
          phrases.
        </p>
      </div>

      {/* Essential Phrases */}
      <section className="mt-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#D94E34]" />
          <h2 className="font-display text-2xl font-bold text-[#1A1D24]">
            5 Essential Meetup Phrases
          </h2>
        </div>
        <p className="mt-1 text-sm text-[#5A5D66]">
          Tap copy to paste into a meetup discussion thread or practice before
          you arrive.
        </p>

        <div className="mt-4 space-y-3.5">
          {JAPAN_PHRASES.map((phrase, idx) => (
            <div
              key={phrase.romaji}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E6E0D6] bg-white p-5 sm:flex-row sm:items-center"
            >
              <div>
                <span className="inline-block rounded-full bg-[#F2EDE4] px-2.5 py-0.5 text-[11px] font-bold text-[#5A5D66]">
                  {phrase.context}
                </span>
                <div className="mt-2 font-jp text-lg font-bold text-[#1A1D24]">
                  {phrase.jp}
                </div>
                <div className="mt-0.5 text-sm font-medium italic text-[#2B4C7E]">
                  {phrase.romaji}
                </div>
                <div className="mt-1 text-sm text-[#5A5D66]">{phrase.en}</div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(phrase.jp, idx)}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-4 py-2 text-xs font-semibold text-[#1A1D24] transition hover:border-[#D94E34] hover:text-[#D94E34]"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#3E6B48]" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy JP
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Etiquette Tips */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-[#1A1D24]">
          Local Meetup Etiquette in Japan
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {JAPAN_ETIQUETTE_TIPS.map((tip) => (
            <div
              key={tip.title}
              className="rounded-2xl border border-[#E6E0D6] bg-white p-6"
            >
              <div className="font-jp text-xs font-bold text-[#D94E34]">
                {tip.jp}
              </div>
              <h3 className="mt-1 font-display text-lg font-bold text-[#1A1D24]">
                {tip.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5A5D66]">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl border border-[#E6E0D6] bg-[#1A1D24] p-7 text-white sm:flex-row sm:items-center">
        <div>
          <h3 className="font-display text-xl font-bold">
            Ready to put it into practice?
          </h3>
          <p className="mt-1 text-sm text-white/75">
            Join an upcoming coffee table, city walk, or izakaya night near
            you.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-[#D94E34] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#C04028]"
        >
          <Compass className="h-4 w-4" />
          Browse Japan Meetups
        </Link>
      </div>
    </div>
  );
}
