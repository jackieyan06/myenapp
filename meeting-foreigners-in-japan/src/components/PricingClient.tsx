"use client";

import React, { useState } from "react";
import { Check, Sparkles, Users, CalendarDays, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";

const copy = {
  en: {
    eyebrow: "Simple membership",
    title: "Find your people in Japan.",
    intro: "Start for free and upgrade when you want more from your EnJapan community experience.",
    free: "FREE", monthly: "MONTHLY", annual: "ANNUAL",
    freeDesc: "A welcoming place to start",
    monthlyDesc: "Stay flexible",
    annualDesc: "Best value for committed members",
    forever: "Forever free", month: "/ month", year: "/ year",
    cancel: "Cancel anytime", save: "Save ¥1,960 compared with monthly",
    freeFeatures: ["Create your cultural profile", "Discover community meetups", "Browse community members and activities", "Join available gatherings"],
    premiumFeatures: ["Everything in Free", "Unlimited meetup participation (when available)", "More ways to connect with international residents and Japanese locals", "Updates about gatherings and community activities", "Access to premium community features as they launch"],
    trial: "7-day free trial planned for Premium",
    freeCta: "Create a free account",
    premiumCta: "Premium subscriptions coming soon",
    noteTitle: "A note about payments",
    note: "Free membership is available now through account registration. Monthly and annual prices are published for planning; paid checkout will be enabled after Stripe setup is completed. No payment is taken on this page.",
    question: "Every connection starts somewhere.",
    questionText: "Join EnJapan to meet locals, international residents and people who share your interests.",
    signIn: "Already a member? Sign in",
  },
  ja: {
    eyebrow: "わかりやすい会員プラン",
    title: "日本で、つながる仲間を見つけよう。",
    intro: "まずは無料で始めて、EnJapanをもっと楽しみたくなったら有料プランへ。",
    free: "無料", monthly: "月額", annual: "年額",
    freeDesc: "気軽に始められるプラン",
    monthlyDesc: "自分のペースで楽しむ",
    annualDesc: "長く楽しむ方におすすめ",
    forever: "ずっと無料", month: "/ 月", year: "/ 年",
    cancel: "いつでも解約可能", save: "月額払いより年間1,960円お得",
    freeFeatures: ["文化プロフィールを作成", "コミュニティ交流会を探す", "メンバーやコミュニティ活動を見る", "参加可能な交流会に申し込む"],
    premiumFeatures: ["無料プランのすべての機能", "交流会への参加（開催状況に応じて無制限）", "在住外国人や日本人との交流機能", "交流会やコミュニティ活動のお知らせ", "今後追加されるプレミアム機能"],
    trial: "プレミアムは7日間無料トライアルを予定",
    freeCta: "無料アカウントを作成",
    premiumCta: "有料プランは近日公開予定",
    noteTitle: "お支払いについて",
    note: "無料会員はアカウント登録後すぐに利用できます。月額・年額料金は予定価格です。有料決済はStripeの設定完了後に開始します。このページで料金が請求されることはありません。",
    question: "新しい出会いを、ここから。",
    questionText: "EnJapanで日本の地元の方や海外出身の方、共通の興味を持つ仲間とつながりましょう。",
    signIn: "すでに会員の方はこちら：ログイン",
  },
  "zh-cn": {
    eyebrow: "简单透明的会员方案",
    title: "在日本，找到志同道合的人。",
    intro: "先免费加入，想体验更多 EnJapan 社区服务时再升级。",
    free: "免费", monthly: "月付", annual: "年付",
    freeDesc: "轻松开启社区生活",
    monthlyDesc: "灵活加入",
    annualDesc: "适合长期参与的会员",
    forever: "永久免费", month: "/ 月", year: "/ 年",
    cancel: "可随时取消", save: "相比按月支付节省 ¥1,960",
    freeFeatures: ["创建个人文化档案", "发现社区聚会活动", "浏览社区成员与活动", "报名参加开放的聚会"],
    premiumFeatures: ["包含免费版全部功能", "不限次数参加聚会（视活动安排而定）", "更多机会认识在日国际居民和日本当地人", "获取聚会及社区活动更新", "陆续开放的高级社区功能"],
    trial: "高级会员计划提供 7 天免费试用（即将推出）",
    freeCta: "创建免费账户",
    premiumCta: "高级会员即将开放",
    noteTitle: "关于付款",
    note: "现在即可通过注册账户免费加入。月付和年付价格为计划价格；Stripe 设置完成后才会开放付费结账。本页面不会收取任何费用。",
    question: "每一次相遇，都有一个开始。",
    questionText: "加入 EnJapan，认识日本当地居民、国际社区成员和拥有共同兴趣的朋友。",
    signIn: "已经是会员？登录",
  },
  "zh-tw": {
    eyebrow: "簡單透明的會員方案",
    title: "在日本，找到志同道合的人。",
    intro: "先免費加入，想體驗更多 EnJapan 社群服務時再升級。",
    free: "免費", monthly: "月付", annual: "年付",
    freeDesc: "輕鬆展開社群生活",
    monthlyDesc: "彈性參與",
    annualDesc: "適合長期參與的會員",
    forever: "永久免費", month: "/ 月", year: "/ 年",
    cancel: "隨時可以取消", save: "比按月付款省下 ¥1,960",
    freeFeatures: ["建立個人文化檔案", "探索社群聚會活動", "瀏覽社群成員與活動", "報名參加開放的聚會"],
    premiumFeatures: ["包含免費版所有功能", "不限次數參加聚會（依活動安排而定）", "更多機會認識在日國際居民與日本當地人", "接收聚會及社群活動更新", "陸續推出的進階社群功能"],
    trial: "進階會員預計提供 7 天免費試用",
    freeCta: "建立免費帳戶",
    premiumCta: "進階會員即將開放",
    noteTitle: "關於付款",
    note: "現在即可透過註冊帳戶免費加入。月付與年付價格為規劃價格；Stripe 設定完成後才會開放付費結帳。本頁面不會收取任何費用。",
    question: "每一次相遇，都有一個開始。",
    questionText: "加入 EnJapan，認識日本當地居民、國際社群成員與擁有共同興趣的朋友。",
    signIn: "已經是會員？登入",
  },
};

export default function PricingClient() {
  const { locale } = useLocale();
  const { user, openAuthModal } = useAuth();
  const [notice, setNotice] = useState(false);
  const t = copy[locale] ?? copy.en;

  const features = (items: string[]) => (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-[#454852]">
          <Check className="mt-1 h-4 w-4 shrink-0 text-[#3E6B48]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <main className="min-h-screen bg-[#FAF8F4] px-4 py-12 text-[#1A1D24] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#D94E34]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#D94E34]">
            <Sparkles className="h-3.5 w-3.5" /> {t.eyebrow}
          </span>
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">{t.title}</h1>
          <p className="mt-4 text-base leading-7 text-[#5A5D66]">{t.intro}</p>
        </div>

        <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
          <section className="flex flex-col rounded-3xl border border-[#E6E0D6] bg-white p-6 shadow-sm">
            <div className="text-xs font-bold tracking-widest text-[#5A5D66]">{t.free}</div>
            <h2 className="mt-3 text-2xl font-extrabold">¥0</h2>
            <p className="mt-1 text-sm text-[#5A5D66]">{t.freeDesc}</p>
            <p className="mt-3 text-xs font-semibold text-[#3E6B48]">{t.forever}</p>
            {features(t.freeFeatures)}
            <button onClick={() => openAuthModal(user ? "Welcome to En" : "Sign in or Try a Demo Account")} className="mt-auto rounded-full border border-[#1A1D24] px-5 py-3 text-sm font-bold text-[#1A1D24] transition hover:bg-[#1A1D24] hover:text-white">
              {user ? "Explore EnJapan" : t.freeCta}
            </button>
          </section>

          <section className="relative flex flex-col rounded-3xl border-2 border-[#D94E34] bg-white p-6 shadow-md">
            <div className="absolute -top-3 left-6 rounded-full bg-[#D94E34] px-3 py-1 text-[11px] font-bold tracking-wide text-white">{t.monthly}</div>
            <h2 className="mt-3 text-2xl font-extrabold">¥980 <span className="text-sm font-medium text-[#5A5D66]">{t.month}</span></h2>
            <p className="mt-1 text-sm text-[#5A5D66]">{t.monthlyDesc}</p>
            <p className="mt-3 text-xs font-semibold text-[#5A5D66]">{t.cancel}</p>
            {features(t.premiumFeatures)}
            <button onClick={() => setNotice(true)} className="mt-auto rounded-full bg-[#D94E34] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#C04028]">
              {t.premiumCta}
            </button>
          </section>

          <section className="flex flex-col rounded-3xl border border-[#E6E0D6] bg-white p-6 shadow-sm">
            <div className="text-xs font-bold tracking-widest text-[#5A5D66]">{t.annual}</div>
            <h2 className="mt-3 text-2xl font-extrabold">¥9,800 <span className="text-sm font-medium text-[#5A5D66]">{t.year}</span></h2>
            <p className="mt-1 text-sm text-[#5A5D66]">{t.annualDesc}</p>
            <p className="mt-3 text-xs font-semibold text-[#3E6B48]">{t.save}</p>
            {features(t.premiumFeatures)}
            <button onClick={() => setNotice(true)} className="mt-auto rounded-full border border-[#D94E34] px-5 py-3 text-sm font-bold text-[#D94E34] transition hover:bg-[#D94E34] hover:text-white">
              {t.premiumCta}
            </button>
          </section>
        </div>

        <p className="mt-6 text-center text-xs font-medium text-[#5A5D66]">{t.trial}</p>

        {notice && (
          <div role="status" className="mx-auto mt-6 max-w-2xl rounded-2xl border border-[#E6E0D6] bg-white p-4 text-sm text-[#454852]">
            <strong className="block text-[#1A1D24]">{t.noteTitle}</strong>
            <span>{t.note}</span>
          </div>
        )}

        <div className="mx-auto mt-12 max-w-2xl rounded-3xl bg-[#EFE9DF] p-7 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#D94E34]"><Users className="h-5 w-5" /></div>
          <h2 className="mt-4 text-xl font-bold">{t.question}</h2>
          <p className="mt-2 text-sm leading-6 text-[#5A5D66]">{t.questionText}</p>
          <p className="mt-4 text-sm font-semibold text-[#D94E34]">{user ? user.name : t.signIn}</p>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#777A82]">
          <ShieldCheck className="h-4 w-4" /> EnJapan membership · Japan
        </div>
      </div>
    </main>
  );
}
