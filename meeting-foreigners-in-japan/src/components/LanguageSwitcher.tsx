"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { LANGUAGE_OPTIONS, useLanguage } from "@/components/LanguageProvider";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useLanguage();
  const router = useRouter();
  return (
    <label className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5A5D66]">
      <Languages className="h-4 w-4 shrink-0" />
      {!compact && <span className="sr-only">{t("selectLanguage")}</span>}
      <select
        aria-label={t("selectLanguage")}
        value={locale}
        onChange={(event) => { setLocale(event.target.value as typeof locale); router.refresh(); }}
        className="max-w-[122px] cursor-pointer rounded-full border border-[#E6E0D6] bg-white px-2.5 py-2 text-xs font-semibold text-[#1A1D24] outline-none focus:border-[#D94E34]"
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
