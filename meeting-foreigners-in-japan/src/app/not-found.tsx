import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import type { AppLocale } from "@/components/LanguageProvider";

const copy: Record<AppLocale, { heading: string; body: string; back: string }> = {
  en: { heading: "Gathering Not Found", body: "This meetup may have been cancelled by the host or the link is no longer available.", back: "Back to All Meetups" },
  ja: { heading: "イベントが見つかりません", body: "このイベントは主催者によってキャンセルされたか、リンクが無効になった可能性があります。", back: "すべてのイベントに戻る" },
  "zh-CN": { heading: "未找到活动", body: "此活动可能已被主办方取消，或链接已失效。", back: "返回所有活动" },
  "zh-TW": { heading: "找不到聚會", body: "此聚會可能已由主辦人取消，或連結已失效。", back: "返回所有聚會" },
};

export default async function NotFound() {
  const saved = (await cookies()).get("en-locale")?.value as AppLocale | undefined;
  const locale: AppLocale = saved && ["en", "ja", "zh-CN", "zh-TW"].includes(saved) ? saved : "en";
  const text = copy[locale];
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="rounded-3xl border border-[#E6E0D6] bg-white p-10 shadow-sm">
        <div className="font-jp text-3xl font-bold text-[#D94E34]">縁</div>
        <h1 className="mt-3 font-display text-2xl font-extrabold text-[#1A1D24]">{text.heading}</h1>
        <p className="mt-2 text-sm text-[#5A5D66]">{text.body}</p>
        <Link href="/" className="mt-6 inline-block rounded-2xl bg-[#1A1D24] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#D94E34]">{text.back}</Link>
      </div>
    </div>
  );
}
