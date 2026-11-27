import type { Locale } from "@/components/LocaleProvider";

function getDateLocale(locale: Locale): string {
  if (locale === "ja") return "ja-JP";
  if (locale === "zh-cn") return "zh-CN";
  if (locale === "zh-tw") return "zh-TW";
  return "en-US";
}

export function formatMeetupDate(iso: string, locale: Locale = "en"): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(getDateLocale(locale), {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Tokyo",
  }).format(date);
}

export function formatMeetupTime(iso: string, locale: Locale = "en"): string {
  const date = new Date(iso);
  const time = new Intl.DateTimeFormat(getDateLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Tokyo",
  }).format(date);
  const suffix = locale === "en" ? " JST" : locale === "ja" ? "（日本時間）" : locale === "zh-cn" ? "（日本时间）" : "（日本時間）";
  return time + suffix;
}

export function formatMeetupFullDate(iso: string, locale: Locale = "en"): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(getDateLocale(locale), {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Tokyo",
  }).format(date);
}

export function formatShortTimestamp(iso: string, locale: Locale = "en"): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(getDateLocale(locale), {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Tokyo",
  }).format(date);
}
