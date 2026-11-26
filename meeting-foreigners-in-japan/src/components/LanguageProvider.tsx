"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppLocale = "en" | "ja" | "zh-CN" | "zh-TW";

const messages: Record<AppLocale, Record<string, string>> = {
  en: {
    discover: "Discover", people: "People", guide: "Japan Guide", membership: "Membership",
    myHub: "My Hub", host: "Host Meetup", signIn: "Sign In", signOut: "Sign Out",
    browseMeetups: "Browse Meetups", meetPeople: "Meet Expats & Locals", hostGathering: "Host a Gathering",
    etiquette: "Japan Etiquette & Phrases", pricing: "Membership & Pricing", exploreCities: "Explore Cities",
    community: "Community", upcoming: "Upcoming Gatherings", members: "Members in Japan",
    heroTitle: "Meet friendly", heroEmphasis: "foreigners & locals", heroTail: "across Japan.",
    heroDescription: "Small-table coffee mornings, Japanese–English language exchanges, neighborhood walks, and welcoming evenings—with exact train station exits and zero awkwardness.",
    searchPlaceholder: "Search neighborhood, station, coffee, or language...", allCities: "All Cities",
    monthly: "Monthly", annual: "Annual", freeTrial: "7-day free trial", selectLanguage: "Language",
    pricingIntro: "Find your people, discover local experiences, and make every encounter count.",
    pricingTitle: "More meaningful connections.", pricingSubtitle: "More of Japan, together.",
    stayFlexible: "Stay flexible", makeYear: "Make it a year", benefits1: "Discover and join community meetups",
    benefits2: "Connect with international residents and Japanese locals",
    benefits3: "Create your cultural profile and share interests",
    benefits4: "Get updates about gatherings and community activities", selected: "Selected plan",
    chooseMonthly: "Choose monthly", chooseAnnual: "Choose annual", bestValue: "BEST VALUE",
    billingMonthly: "Flexible, cancel anytime", saveAnnual: "Save ¥1,960 compared with monthly billing",
    checkoutPreview: "Checkout preview — payments not connected yet",
    noPayments: "No payment details are collected and no charge can be made. Secure checkout will be enabled after Stripe is connected.",
    monthPeriod: "/ month", yearPeriod: "/ year", monthlyLabel: "MONTHLY", annualLabel: "ANNUAL",
    choosePlanIntro: "Choose a membership that fits the way you connect.", selectedHeading: "Your selection",
    previewTotal: "Preview total", afterTrial: "After 7-day trial", faqHeading: "A few things to know",
    billingQuestion: "When does billing start?", trialAnswer: "The proposed plan includes a 7-day free trial. Billing begins after the trial when live checkout is activated.",
  },
  ja: {
    discover: "見つける", people: "メンバー", guide: "日本ガイド", membership: "メンバーシップ",
    myHub: "マイページ", host: "交流会を開催", signIn: "ログイン", signOut: "ログアウト",
    browseMeetups: "交流会を探す", meetPeople: "外国人・日本人とつながる", hostGathering: "交流会を開催する",
    etiquette: "日本のマナーと言葉", pricing: "会員プラン・料金", exploreCities: "エリアから探す",
    community: "コミュニティ", upcoming: "開催予定の交流会", members: "日本のメンバー",
    heroTitle: "日本で", heroEmphasis: "外国人と地元の人々", heroTail: "との出会いを。",
    heroDescription: "少人数のカフェ交流会、日本語・英語の言語交換、街歩きなど。初めてでも安心して参加できます。",
    searchPlaceholder: "エリア、駅、カフェ、言語で検索...", allCities: "すべての都市",
    monthly: "月額", annual: "年額", freeTrial: "7日間無料トライアル", selectLanguage: "言語",
    pricingIntro: "仲間と出会い、地域の体験を見つけ、一つひとつの出会いを大切に。",
    pricingTitle: "もっと豊かなつながりを。", pricingSubtitle: "日本を一緒に楽しもう。",
    stayFlexible: "気軽に続ける", makeYear: "一年を楽しむ", benefits1: "コミュニティ交流会を探して参加",
    benefits2: "在日外国人や日本の地元の人々と交流", benefits3: "プロフィールを作成して興味を共有",
    benefits4: "交流会やコミュニティの最新情報を受け取る", selected: "選択中のプラン",
    chooseMonthly: "月額プランを選択", chooseAnnual: "年額プランを選択", bestValue: "お得なプラン",
    billingMonthly: "いつでも解約可能", saveAnnual: "月額払いより年間1,960円お得",
    checkoutPreview: "決済プレビュー — 決済は未接続です",
    noPayments: "お支払い情報の入力や請求は発生しません。Stripe接続後に安全な決済を有効化します。",
    monthPeriod: "/ 月", yearPeriod: "/ 年", monthlyLabel: "月額", annualLabel: "年額",
    choosePlanIntro: "ご利用スタイルに合ったプランをお選びください。", selectedHeading: "選択中のプラン",
    previewTotal: "お支払い予定額", afterTrial: "無料期間終了後", faqHeading: "ご利用前にご確認ください",
    billingQuestion: "料金の請求はいつ始まりますか？", trialAnswer: "7日間の無料トライアル終了後、決済機能の開始に合わせて請求が始まります。",
  },
  "zh-CN": {
    discover: "发现活动", people: "社区成员", guide: "日本指南", membership: "会员方案",
    myHub: "个人中心", host: "发起聚会", signIn: "登录", signOut: "退出登录",
    browseMeetups: "浏览聚会", meetPeople: "认识在日外国人与当地人", hostGathering: "发起聚会",
    etiquette: "日本礼仪与常用语", pricing: "会员与价格", exploreCities: "探索城市",
    community: "社区", upcoming: "即将举行的聚会", members: "在日会员",
    heroTitle: "在日本结识友善的", heroEmphasis: "外国人与当地居民", heroTail: "。",
    heroDescription: "参加小型咖啡聚会、日英语言交流和街区漫步，轻松结识新朋友。",
    searchPlaceholder: "搜索街区、车站、咖啡或语言...", allCities: "所有城市",
    monthly: "月付", annual: "年付", freeTrial: "7天免费试用", selectLanguage: "语言",
    pricingIntro: "结识朋友、探索当地体验，让每一次相遇都更有意义。",
    pricingTitle: "建立更有意义的联系。", pricingSubtitle: "一起探索更多日本。",
    stayFlexible: "灵活订阅", makeYear: "开启全年体验", benefits1: "发现并参加社区聚会",
    benefits2: "结识在日国际居民与日本当地人", benefits3: "创建个人文化档案并分享兴趣",
    benefits4: "获取聚会和社区活动的最新消息", selected: "当前选择",
    chooseMonthly: "选择月付", chooseAnnual: "选择年付", bestValue: "超值推荐",
    billingMonthly: "灵活订阅，随时取消", saveAnnual: "相比按月付款节省1,960日元",
    checkoutPreview: "结账预览 — 支付尚未连接",
    noPayments: "不会收集付款信息，也不会产生扣款。连接 Stripe 后才会启用安全支付。",
    monthPeriod: "/ 月", yearPeriod: "/ 年", monthlyLabel: "月付", annualLabel: "年付",
    choosePlanIntro: "请选择适合您社交方式的会员方案。", selectedHeading: "您选择的方案",
    previewTotal: "预览金额", afterTrial: "7天试用期后", faqHeading: "常见问题",
    billingQuestion: "何时开始扣费？", trialAnswer: "方案包含7天免费试用。正式启用支付后，试用期结束才会开始收费。",
  },
  "zh-TW": {
    discover: "探索活動", people: "社群成員", guide: "日本指南", membership: "會員方案",
    myHub: "個人中心", host: "發起聚會", signIn: "登入", signOut: "登出",
    browseMeetups: "瀏覽聚會", meetPeople: "認識在日外國人與當地居民", hostGathering: "發起聚會",
    etiquette: "日本禮儀與常用語", pricing: "會員與價格", exploreCities: "探索城市",
    community: "社群", upcoming: "即將舉行的聚會", members: "在日會員",
    heroTitle: "在日本結識友善的", heroEmphasis: "外國人與當地居民", heroTail: "。",
    heroDescription: "參加小型咖啡聚會、日日語言交流和街區漫步，輕鬆認識新朋友。",
    searchPlaceholder: "搜尋街區、車站、咖啡或語言...", allCities: "所有城市",
    monthly: "月付", annual: "年付", freeTrial: "7天免費試用", selectLanguage: "語言",
    pricingIntro: "認識朋友、探索在地體驗，讓每一次相遇都更有意義。",
    pricingTitle: "建立更有意義的連結。", pricingSubtitle: "一起探索更多日本。",
    stayFlexible: "彈性訂閱", makeYear: "開啟全年體驗", benefits1: "探索並參加社群聚會",
    benefits2: "認識在日國際居民與日本當地人", benefits3: "建立個人文化檔案並分享興趣",
    benefits4: "接收聚會與社群活動最新消息", selected: "目前選擇",
    chooseMonthly: "選擇月付", chooseAnnual: "選擇年付", bestValue: "超值推薦",
    billingMonthly: "彈性訂閱，隨時取消", saveAnnual: "相比按月付款節省1,960日圓",
    checkoutPreview: "結帳預覽 — 尚未連接付款",
    noPayments: "不會收集付款資訊，也不會產生扣款。連接 Stripe 後才會啟用安全付款。",
    monthPeriod: "/ 月", yearPeriod: "/ 年", monthlyLabel: "月付", annualLabel: "年付",
    choosePlanIntro: "請選擇適合您社交方式的會員方案。", selectedHeading: "您選擇的方案",
    previewTotal: "預覽金額", afterTrial: "7天試用期後", faqHeading: "常見問題",
    billingQuestion: "何時開始扣款？", trialAnswer: "方案包含7天免費試用。正式啟用付款後，試用期結束才會開始收費。",
  },
};

type LanguageContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => undefined,
  t: (key) => messages.en[key] ?? key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("en-locale") as AppLocale | null;
    if (saved && saved in messages) {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = (next: AppLocale) => {
    setLocaleState(next);
    window.localStorage.setItem("en-locale", next);
    document.documentElement.lang = next;
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: string) => messages[locale][key] ?? messages.en[key] ?? key,
    }),
    [locale],
  );

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
