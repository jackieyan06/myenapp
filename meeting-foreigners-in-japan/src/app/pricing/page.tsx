"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";

const copy = {
  en: {
    eyebrow: "Simple, transparent pricing",
    title: "The EnJapan community is free.",
    intro: "Join EnJapan, discover people and gatherings, build friendships and exchange ideas without a membership fee.",
    freeTitle: "Free for everyone",
    freeIntro: "Everyday community features remain free:",
    freeItems: ["Create an account and build your profile", "Discover and join social meetups", "Language exchange and cultural activities", "Meet locals, expatriates and international professionals; general professional connections are free", "Community participation and connections"],
    paidTitle: "Business Networking",
    paidIntro: "A fee applies only when an event is explicitly designated as a paid Business Networking event. General professional networking and community connections remain free.",
    paidItems: ["Any event fee and its terms will be clearly shown before you RSVP or pay.", "There is no general monthly or annual membership subscription.", "You only pay when you choose to join a paid Business Networking event."],
    revenueTitle: "How paid event revenue is shared",
    revenueText: "When in-app paid checkout launches, the proposed split is 80% to the event host and 20% to EnJapan. The split is calculated before payment-processing fees, refunds and other applicable adjustments. Hosts will see and accept the final terms before enabling paid events.",
    statusTitle: "Payment status",
    statusText: "Stripe checkout and automatic host payouts are not active yet. No EnJapan event payment should be made until a secure checkout option is displayed on the event page. Until then, paid event registration is not available through EnJapan.",
    note: "Meetup hosts may separately note venue, food, drink or other shared expenses. Those costs are not an EnJapan membership fee and should be explained in the event details.",
    cta: "Explore meetups",
    host: "Host a gathering",
  },
  ja: {
    eyebrow: "シンプルで分かりやすい料金体系",
    title: "EnJapanのコミュニティは無料です。",
    intro: "会員費なしでEnJapanに登録し、交流会を探し、友人をつくり、さまざまなアイデアを交換できます。",
    freeTitle: "すべての方が無料で利用可能",
    freeIntro: "日常的なコミュニティ機能は無料です。",
    freeItems: ["アカウント作成とプロフィール登録", "一般交流会の検索・参加", "言語交換や文化交流イベント", "日本の地元の方、在住外国人、国際的なプロフェッショナルとの一般的な交流", "コミュニティへの参加とつながりづくり"],
    paidTitle: "ビジネスネットワーキング",
    paidIntro: "参加費が発生するのは、有料のビジネスネットワーキングイベントとして明示された場合のみです。一般的なプロフェッショナル交流やコミュニティでのつながりは無料です。",
    paidItems: ["参加費と条件は、参加登録または支払いの前に明確に表示します。", "一般向けの月額・年額会員サブスクリプションはありません。", "有料のビジネスネットワーキングイベントに参加する場合のみお支払いください。"],
    revenueTitle: "有料イベントの収益分配",
    revenueText: "アプリ内決済の開始後、イベント主催者80％・EnJapan20％の分配を予定しています。決済処理手数料、返金などの調整前の金額を基準とします。有料イベントを有効化する前に、主催者に最終条件を提示し、同意を得ます。",
    statusTitle: "決済の提供状況",
    statusText: "Stripeによる決済と主催者への自動送金は、まだ有効化されていません。イベントページに安全な決済方法が表示されるまでは、EnJapanへのイベント参加費の支払いは行わないでください。それまではEnJapan上で有料イベントの申込みはできません。",
    note: "会場費、飲食代などの実費は、主催者が別途設定する場合があります。これらはEnJapanの会員費ではなく、イベント詳細に明記されます。",
    cta: "交流会を探す",
    host: "交流会を主催する",
  },
  "zh-cn": {
    eyebrow: "简单透明的收费方式",
    title: "EnJapan 社区对所有人免费。",
    intro: "无需支付会员费即可加入 EnJapan、认识新朋友、参加聚会、建立友谊并交流想法。",
    freeTitle: "所有人均可免费使用",
    freeIntro: "日常社区功能全部免费：",
    freeItems: ["创建账户并完善个人资料", "浏览并参加一般社交聚会", "语言交流与文化活动", "结识日本当地居民、外籍人士及国际专业人士；一般职业交流免费", "参与社区活动并建立联系"],
    paidTitle: "商务交流活动",
    paidIntro: "只有明确标注为收费商务交流活动的项目才会收取参加费。一般职业交流及社区互动均免费。",
    paidItems: ["活动费用及相关条件会在报名或付款前清楚显示。", "没有面向所有用户的月度或年度会员订阅费。", "只有选择参加收费商务交流活动时才需要付款。"],
    revenueTitle: "付费活动收入分成",
    revenueText: "应用内付费结账启用后，拟按活动收入分配：主办方 80%，EnJapan 20%。分成以扣除支付处理费、退款及其他适用调整之前的金额为基础。主办方启用付费活动前会看到并确认最终条款。",
    statusTitle: "付款功能状态",
    statusText: "Stripe 结账和主办方自动收款目前尚未启用。在活动页面显示安全付款方式之前，请勿支付 EnJapan 活动费用。目前暂不能通过 EnJapan 报名付费活动。",
    note: "活动主办方可能另行收取场地、餐饮或其他共同费用。这些费用并非 EnJapan 会员费，并应在活动详情中说明。",
    cta: "浏览聚会",
    host: "发起聚会",
  },
  "zh-tw": {
    eyebrow: "簡單透明的收費方式",
    title: "EnJapan 社群對所有人免費。",
    intro: "無須支付會員費即可加入 EnJapan、認識新朋友、參加聚會、建立友誼並交流想法。",
    freeTitle: "所有人皆可免費使用",
    freeIntro: "日常社群功能全部免費：",
    freeItems: ["建立帳戶並完善個人資料", "瀏覽並參加一般社交聚會", "語言交流與文化活動", "認識日本在地居民、外籍人士及國際專業人士；一般職涯交流免費", "參與社群活動並建立連結"],
    paidTitle: "商務交流活動",
    paidIntro: "只有明確標示為收費商務交流活動的項目才會收取參加費。一般職涯交流及社群互動均免費。",
    paidItems: ["活動費用及相關條件會在報名或付款前清楚顯示。", "沒有面向所有使用者的月費或年費會員訂閱。", "只有選擇參加收費商務交流活動時才需要付款。"],
    revenueTitle: "付費活動收入分潤",
    revenueText: "應用程式內付費結帳啟用後，預計依活動收入分配：主辦人 80%，EnJapan 20%。分潤以扣除支付處理費、退款及其他適用調整之前的金額為基礎。主辦人啟用付費活動前會看到並確認最終條款。",
    statusTitle: "付款功能狀態",
    statusText: "Stripe 結帳和主辦人自動收款目前尚未啟用。在活動頁面顯示安全付款方式之前，請勿支付 EnJapan 活動費用。目前暫時無法透過 EnJapan 報名付費活動。",
    note: "活動主辦人可能另行收取場地、餐飲或其他共同費用。這些費用並非 EnJapan 會員費，並應在活動詳情中說明。",
    cta: "瀏覽聚會",
    host: "發起聚會",
  },
};

export default function PricingPage() {
  const { locale } = useLocale();
  const text = copy[locale] ?? copy.en;

  return (
    <main className="min-h-screen bg-[#FAF8F4] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D94E34]">{text.eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-[#1A1D24] sm:text-5xl">{text.title}</h1>
          <p className="mt-5 text-base leading-8 text-[#5A5D66]">{text.intro}</p>
        </header>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-[#D8E4D8] bg-white p-7 shadow-sm sm:p-9">
            <span className="inline-flex rounded-full bg-[#EAF3EA] px-3 py-1 text-xs font-bold text-[#32613B]">¥0</span>
            <h2 className="mt-5 text-2xl font-bold text-[#1A1D24]">{text.freeTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-[#5A5D66]">{text.freeIntro}</p>
            <ul className="mt-6 space-y-3">
              {text.freeItems.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[#343943]"><span className="font-bold text-[#3E6B48]">✓</span><span>{item}</span></li>)}
            </ul>
          </section>

          <section className="rounded-3xl border border-[#E7D7C9] bg-white p-7 shadow-sm sm:p-9">
            <span className="inline-flex rounded-full bg-[#F8EDE5] px-3 py-1 text-xs font-bold text-[#9A4B2D]">{locale === "ja" ? "イベントごとに表示" : locale.startsWith("zh") ? "按活动显示" : "Priced per event"}</span>
            <h2 className="mt-5 text-2xl font-bold text-[#1A1D24]">{text.paidTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-[#5A5D66]">{text.paidIntro}</p>
            <ul className="mt-6 space-y-3">
              {text.paidItems.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[#343943]"><span className="font-bold text-[#D94E34]">•</span><span>{item}</span></li>)}
            </ul>
          </section>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <section className="rounded-3xl border border-[#E6E0D6] bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#1A1D24]">{text.revenueTitle}</h2>
            <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-[#EFE9DF]" role="img" aria-label="Proposed revenue share: 80 percent host, 20 percent EnJapan">
              <div className="w-4/5 bg-[#477B56]" />
              <div className="w-1/5 bg-[#D94E34]" />
            </div>
            <div className="mt-3 flex justify-between text-xs font-semibold text-[#5A5D66]">
              <span>80% {locale === "ja" ? "主催者" : locale.startsWith("zh") ? "主办方" : "Host"}</span>
              <span>20% EnJapan</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#5A5D66]">{text.revenueText}</p>
          </section>
          <section className="rounded-3xl border border-[#E7D7C9] bg-[#FFFDFC] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#1A1D24]">{text.statusTitle}</h2>
            <p className="mt-4 text-sm leading-6 text-[#5A5D66]">{text.statusText}</p>
          </section>
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-[#77736C]">{text.note}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-2xl bg-[#D94E34] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#C04028]">{text.cta}</Link>
          <Link href="/host" className="rounded-2xl border border-[#D8D1C7] bg-white px-6 py-3 text-sm font-bold text-[#343943] transition hover:border-[#D94E34]">{text.host}</Link>
        </div>
      </div>
    </main>
  );
}
