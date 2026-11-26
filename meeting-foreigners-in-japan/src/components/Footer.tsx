"use client";

import React from "react";
import Link from "next/link";
import { JAPAN_CITIES } from "@/lib/constants";
import { useLanguage } from "@/components/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-16 border-t border-[#E6E0D6] bg-[#F2EDE4]/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D94E34] text-white">
                <span className="font-jp text-sm font-bold">縁</span>
              </span>
              <span className="font-display text-lg font-extrabold text-[#1A1D24]">
                En · Japan Meetups
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5A5D66]">
              {t("footerIntro")}
            </p>
            <p className="mt-3 font-jp text-xs font-medium text-[#8B867D]">
              一期一会 · Ichigo Ichie — Treasure every encounter.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1D24]">
              {t("exploreCities")}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-[#5A5D66]">
              {JAPAN_CITIES.map((city) => (
                <li key={city.name}>
                  <Link
                    href={`/?city=${city.name}`}
                    className="hover:text-[#D94E34] transition"
                  >
                    {city.name} <span className="font-jp text-xs">({city.jp})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1D24]">
              Community
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-[#5A5D66]">
              <li>
                <Link href="/" className="hover:text-[#D94E34] transition">
                  {t("browseMeetups")}
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-[#D94E34] transition">
                  {t("meetPeople")}
                </Link>
              </li>
              <li>
                <Link href="/host" className="hover:text-[#D94E34] transition">
                  {t("hostGathering")}
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-[#D94E34] transition">
                  {t("etiquette")}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#D94E34] transition">
                  {t("pricing")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[#E6E0D6] pt-6 text-xs text-[#5A5D66] sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} En (縁) Japan Community Platform</span>
          <span>{t("footerTagline")}</span>
        </div>
      </div>
    </footer>
  );
}
