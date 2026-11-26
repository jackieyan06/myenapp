"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppLocale = "en" | "ja" | "zh-CN" | "zh-TW";

const messages: Record<AppLocale, Record<string, string>> = {
  en: {
    discover: "Discover", people: "People", guide: "Japan Guide", membership: "Membership",
    myHub: "My Hub", host: "Host Meetup", signIn: "Sign In", signOut: "Sign Out",
    browseMeetups: "Browse Meetups", meetPeople: "Meet Expats & Locals",
    hostGathering: "Host a Gathering", etiquette: "Japan Etiquette & Phrases",
    pricing: "Membership & Pricing", exploreCities: "Explore Cities", community: "Community",
    upcoming: "Upcoming Gatherings", members: "Members in Japan",
    heroTitle: "Meet friendly", heroEmphasis: "foreigners & locals", heroTail: "across Japan.",
    heroDescription: "Small-table coffee mornings, Japanese–English language exchanges, neighborhood walks, and welcoming evenings—with exact train station exits and zero awkwardness.",
    searchPlaceholder: "Search neighborhood, station, coffee, or language...",
    allCities: "All Cities", all: "All", monthly: "Monthly", annual: "Annual",
    freeTrial: "7-day free trial", selectLanguage: "Language",
  },
  ja: {
    discover: "見つける", people: "メンバー", guide: "日本ガイド", membership: "メンバーシップ",
    myHub: "マイページ", host: "交流会を開催", signIn: "ログイン", signOut: "ログアウト",
    browseMeetups: "交流会を探す", meetPeople: "外国人・日本人とつながる",
    hostGathering: "交流会を開催する", etiquette: "日本のマナーと言葉",
    pricing: "会員プラン・料金", exploreCities: "エリアから探す", community: "コミュニティ",
    upcoming: "開催予定の交流会", members: "日本のメンバー",
    heroTitle: "日本で", heroEmphasis: "外国人と地元の人々", heroTail: "との出会いを。",
    heroDescription: "少人数のカフェ交流会、日本語・英語の言語交換、街歩きなど。初めてでも安心して参加できます。",
    searchPlaceholder: "エリア、駅、カフェ、言語で検索...",
    allCities: "すべての都市", all: "すべて", monthly: "月額", annual: "年額",
    freeTrial: "7日間無料トライアル", selectLanguage: "言語",
  },
  "zh-CN": {
    discover: "发现活动", people: "社区成员", guide: "日本指南", membership: "会员方案",
    myHub: "个人中心", host: "发起聚会", signIn: "登录", signOut: "退出登录",
    browseMeetups: "浏览聚会", meetPeople: "认识在日外国人与当地人",
    hostGathering: "发起聚会", etiquette: "日本礼仪与常用语",
    pricing: "会员与价格", exploreCities: "探索城市", community: "社区",
    upcoming: "即将举行的聚会", members: "在日会员",
    heroTitle: "在日本结识友善的", heroEmphasis: "外国人与当地居民", heroTail: "。",
    heroDescription: "参加小型咖啡聚会、日英语言交流和街区漫步，轻松结识新朋友。",
    searchPlaceholder: "搜索街区、车站、咖啡或语言...",
    allCities: "所有城市", all: "全部", monthly: "月付", annual: "年付",
    freeTrial: "7天免费试用", selectLanguage: "语言",
  },
  "zh-TW": {
    discover: "探索活動", people: "社群成員", guide: "日本指南", membership: "會員方案",
    myHub: "個人中心", host: "發起聚會", signIn: "登入", signOut: "登出",
    browseMeetups: "瀏覽聚會", meetPeople: "認識在日外國人與當地居民",
    hostGathering: "發起聚會", etiquette: "日本禮儀與常用語",
    pricing: "會員與價格", exploreCities: "探索城市", community: "社群",
    upcoming: "即將舉行的聚會", members: "在日會員",
    heroTitle: "在日本結識友善的", heroEmphasis: "外國人與當地居民", heroTail: "。",
    heroDescription: "參加小型咖啡聚會、日英語言交流和街區漫步，輕鬆認識新朋友。",
    searchPlaceholder: "搜尋街區、車站、咖啡或語言...",
    allCities: "所有城市", all: "全部", monthly: "月付", annual: "年付",
    freeTrial: "7天免費試用", selectLanguage: "語言",
  },
};

type LanguageContextValue = { locale: AppLocale; setLocale: (locale: AppLocale) => void; t: (key: string) => string };
const LanguageContext = createContext<LanguageContextValue>({
  locale: "en", setLocale: () => undefined, t: (key) => messages.en[key] ?? key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>("en");
  useEffect(() => {
    const saved = window.localStorage.getItem("en-locale") as AppLocale | null;
    if (saved && saved in messages) setLocaleState(saved);
  }, []);
  const setLocale = (next: AppLocale) => {
    setLocaleState(next);
    window.localStorage.setItem("en-locale", next);
    document.documentElement.lang = next;
  };
  const value = useMemo(() => ({
    locale, setLocale, t: (key: string) => messages[locale][key] ?? messages.en[key] ?? key,
  }), [locale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export const LANGUAGE_OPTIONS: { value: AppLocale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
  { value: "zh-CN", label: "简体中文" },
  { value: "zh-TW", label: "繁體中文" },
];
