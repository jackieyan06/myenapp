"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type Locale = "en" | "ja" | "zh-cn" | "zh-tw";

export const LOCALES: { code: Locale; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語" },
  { code: "zh-cn", label: "Simplified Chinese", nativeLabel: "简体中文" },
  { code: "zh-tw", label: "Traditional Chinese", nativeLabel: "繁體中文" },
];

const messages: Record<Locale, Record<string, string>> = {
  en: {},
  ja: {
    "Discover": "見つける", "People": "メンバー", "Japan Guide": "日本ガイド", "My Hub": "マイページ",
    "Host Meetup": "交流会を開催", "Host a Meetup": "交流会を開催", "Host a Gathering": "集まりを主催",
    "Sign In": "ログイン", "Sign Out": "ログアウト", "Sign In / Try Demo Persona": "ログイン／デモを試す",
    "Browse Meetups": "交流会を探す", "Meet Expats & Locals": "外国人・地元の人と出会う",
    "Japan Etiquette & Phrases": "日本のマナーと言葉", "Explore Cities": "都市から探す", "Community": "コミュニティ",
    "About us": "EnJapanについて", "Terms of Service": "利用規約", "Privacy Policy": "プライバシーポリシー",
    "Commercial Disclosure": "特定商取引法に基づく表記", "Advertising with EnJapan": "EnJapanへの広告掲載",
    "Connect with us": "お問い合わせ・SNS", "Follow our social channels as official accounts launch.": "公式アカウントの開設に合わせてSNSでお知らせします。",
    "Email EnJapan": "EnJapanにメールする", "Official link coming soon": "公式リンクは準備中",
    "Meet in Japan": "日本で出会おう", "Made for respectful cross-cultural friendship in Japan": "日本での相互理解と国際交流のために",
    "My RSVPs & Coffee Waves": "参加予定・コーヒー交流", "Edit Cultural Profile": "プロフィールを編集",
    "Sign in or Try a Demo Account": "ログインまたはデモアカウントを試す",
    "Browse Meetups": "交流会を探す", "Find your people": "気の合う仲間を見つけよう",
    "All": "すべて", "Search": "検索", "Save": "保存", "Cancel": "キャンセル", "Submit": "送信",
    "Loading...": "読み込み中...", "No results found": "結果が見つかりません", "Learn more": "詳しく見る",
    "Tokyo": "東京", "Kyoto": "京都", "Osaka": "大阪", "Fukuoka": "福岡", "Sapporo": "札幌", "Yokohama": "横浜",
    "Language": "言語", "English": "英語", "Japanese": "日本語", "Simplified Chinese": "簡体字中国語", "Traditional Chinese": "繁体字中国語",
  },
  "zh-cn": {
    "Discover": "发现", "People": "社区成员", "Japan Guide": "日本指南", "My Hub": "个人中心",
    "Host Meetup": "发起聚会", "Host a Meetup": "发起聚会", "Host a Gathering": "组织活动",
    "Sign In": "登录", "Sign Out": "退出登录", "Sign In / Try Demo Persona": "登录／试用演示账号",
    "Browse Meetups": "浏览聚会", "Meet Expats & Locals": "认识外国居民与当地人",
    "Japan Etiquette & Phrases": "日本礼仪与常用语", "Explore Cities": "探索城市", "Community": "社区",
    "About us": "关于我们", "Terms of Service": "服务条款", "Privacy Policy": "隐私政策",
    "Commercial Disclosure": "商业信息披露", "Advertising with EnJapan": "在 EnJapan 投放广告",
    "Connect with us": "联系我们", "Follow our social channels as official accounts launch.": "官方社交账号上线后，欢迎关注我们的社交媒体。",
    "Email EnJapan": "发送邮件联系 EnJapan", "Official link coming soon": "官方链接即将上线",
    "Meet in Japan": "在日本相遇", "Made for respectful cross-cultural friendship in Japan": "致力于促进日本的跨文化友谊与交流",
    "My RSVPs & Coffee Waves": "我的报名与咖啡邀约", "Edit Cultural Profile": "编辑个人资料",
    "Sign in or Try a Demo Account": "登录或试用演示账号",
    "Find your people": "找到志同道合的朋友", "All": "全部", "Search": "搜索", "Save": "保存", "Cancel": "取消", "Submit": "提交",
    "Loading...": "正在加载…", "No results found": "没有找到结果", "Learn more": "了解更多",
    "Tokyo": "东京", "Kyoto": "京都", "Osaka": "大阪", "Fukuoka": "福冈", "Sapporo": "札幌", "Yokohama": "横滨",
    "Language": "语言", "English": "英语", "Japanese": "日语", "Simplified Chinese": "简体中文", "Traditional Chinese": "繁体中文",
  },
  "zh-tw": {
    "Discover": "探索", "People": "社群成員", "Japan Guide": "日本指南", "My Hub": "個人中心",
    "Host Meetup": "發起聚會", "Host a Meetup": "發起聚會", "Host a Gathering": "舉辦活動",
    "Sign In": "登入", "Sign Out": "登出", "Sign In / Try Demo Persona": "登入／試用示範帳號",
    "Browse Meetups": "瀏覽聚會", "Meet Expats & Locals": "認識外國居民與當地人",
    "Japan Etiquette & Phrases": "日本禮儀與常用語", "Explore Cities": "探索城市", "Community": "社群",
    "About us": "關於我們", "Terms of Service": "服務條款", "Privacy Policy": "隱私權政策",
    "Commercial Disclosure": "商業資訊揭露", "Advertising with EnJapan": "在 EnJapan 刊登廣告",
    "Connect with us": "聯絡我們", "Follow our social channels as official accounts launch.": "官方社群帳號上線後，歡迎追蹤我們。",
    "Email EnJapan": "寄信聯絡 EnJapan", "Official link coming soon": "官方連結即將推出",
    "Meet in Japan": "在日本相遇", "Made for respectful cross-cultural friendship in Japan": "致力於促進日本的跨文化友誼與交流",
    "My RSVPs & Coffee Waves": "我的報名與咖啡邀約", "Edit Cultural Profile": "編輯個人資料",
    "Sign in or Try a Demo Account": "登入或試用示範帳號",
    "Find your people": "找到志同道合的朋友", "All": "全部", "Search": "搜尋", "Save": "儲存", "Cancel": "取消", "Submit": "送出",
    "Loading...": "載入中…", "No results found": "找不到結果", "Learn more": "了解更多",
    "Tokyo": "東京", "Kyoto": "京都", "Osaka": "大阪", "Fukuoka": "福岡", "Sapporo": "札幌", "Yokohama": "橫濱",
    "Language": "語言", "English": "英文", "Japanese": "日文", "Simplified Chinese": "簡體中文", "Traditional Chinese": "繁體中文",
  },
};

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (message: string) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => undefined,
  t: (message) => message,
});

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    document.cookie = `en-locale=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
    window.localStorage.setItem("en-locale", next);
    window.location.reload();
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (message: string) => messages[locale][message] ?? message,
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
