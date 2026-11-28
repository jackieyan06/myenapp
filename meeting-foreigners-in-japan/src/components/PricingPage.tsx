import { InfoLayout } from "@/components/InfoLayout";

type Locale = "en" | "ja" | "zh-cn" | "zh-tw";

const copy = {
  en: {
    title: "Pricing",
    intro: "EnJapan is free to join. Most community events are free; selected Business Networking events may have a clearly disclosed participation fee.",
    freeTitle: "Free community events",
    freeIntro: "There is no mandatory membership or subscription fee to discover and join regular EnJapan community events.",
    freeItems: ["Language exchange and conversation meetups", "Coffee, friendship and social gatherings", "Cultural activities, city walks and outdoor meetups", "Coworking and general community events"],
    costsTitle: "Personal expenses",
    costsText: "Participants pay their own optional or venue-related expenses, such as food, drinks, transport, admission tickets or a venue's required minimum order. These are separate from any EnJapan platform fee.",
    businessTitle: "Business Networking events",
    businessText: "Selected professional, executive, entrepreneur or industry networking events may carry a participation fee. The event host sets the price, and the exact amount, what is included and the cancellation terms must be shown before you register or pay.",
    commissionTitle: "Host revenue share",
    commissionText: "When paid event checkout is introduced, the proposed revenue share is 80% to the host and 20% to EnJapan, calculated on the event amount collected before payment-processing fees, refunds and other applicable adjustments. The final terms will be shown to hosts before they activate paid events.",
    statusTitle: "Are paid events available now?",
    statusText: "Online payment and automatic host payouts are not yet enabled. Until paid checkout is available on EnJapan, do not send payment to EnJapan or assume a paid booking is confirmed. Any future paid event will clearly show its payment method and confirmation status.",
    membershipTitle: "Membership",
    membershipText: "There is currently no paid EnJapan membership plan. You can use the free community features without a subscription.",
    contact: "Questions about pricing? Contact enjapan.support@gmail.com."
  },
  ja: {
    title: "料金について",
    intro: "EnJapanへの登録は無料です。通常のコミュニティイベントは無料で、対象となるビジネス交流イベントのみ参加費が設定される場合があります。",
    freeTitle: "無料のコミュニティイベント",
    freeIntro: "通常のEnJapanコミュニティイベントの閲覧・参加に、必須の会費やサブスクリプション料金はありません。",
    freeItems: ["言語交換・会話交流会", "コーヒー交流・友人づくり・懇親会", "文化体験・街歩き・アウトドア活動", "コワーキング・一般コミュニティイベント"],
    costsTitle: "個人負担の費用",
    costsText: "飲食代、交通費、入場料、会場の最低利用料金など、参加者自身に発生する費用は各自でご負担ください。これらはEnJapanの利用料金とは別です。",
    businessTitle: "ビジネス交流イベント",
    businessText: "一部の専門職、経営者、起業家、業界別ネットワーキングイベントでは参加費が設定される場合があります。料金は主催者が設定し、金額、料金に含まれる内容、キャンセル条件を登録・支払い前に明示します。",
    commissionTitle: "主催者との収益分配",
    commissionText: "有料イベント決済の導入時には、決済処理手数料、返金その他の調整前のイベント参加費を基準に、主催者80％・EnJapan20％の分配を予定しています。有料イベントを有効化する前に、最終条件を主催者に提示します。",
    statusTitle: "現在、有料イベントに参加できますか？",
    statusText: "オンライン決済および主催者への自動送金は、まだ有効化されていません。EnJapan上で有料決済が利用可能になるまでは、EnJapan宛てに支払いを行わず、有料予約が確定したとみなさないでください。将来、有料イベントを提供する際は、決済方法と予約確定状況を明示します。",
    membershipTitle: "会員プラン",
    membershipText: "現在、有料のEnJapan会員プランはありません。サブスクリプションなしで無料のコミュニティ機能をご利用いただけます。",
    contact: "料金に関するお問い合わせ：enjapan.support@gmail.com"
  },
  "zh-cn": {
    title: "价格说明",
    intro: "注册 EnJapan 完全免费。大多数社区活动免费；部分商务交流活动可能收取明确标示的参加费用。",
    freeTitle: "免费社区活动",
    freeIntro: "浏览和参加 EnJapan 的常规社区活动无需强制会员费或订阅费。",
    freeItems: ["语言交换与交流聚会", "咖啡、交友及社交活动", "文化体验、城市漫步及户外活动", "共享办公及一般社区活动"],
    costsTitle: "个人开销",
    costsText: "参与者自行承担个人或场地方要求的费用，例如餐饮、交通、门票或场地最低消费。这些费用与 EnJapan 平台费用不同。",
    businessTitle: "商务交流活动",
    businessText: "部分专业人士、高管、创业者或行业交流活动可能收取参加费。费用由活动主办方设定，报名或付款前会显示具体金额、费用包含内容及取消条款。",
    commissionTitle: "主办方收入分成",
    commissionText: "未来启用付费活动结账后，拟按活动实收金额分配：主办方 80%，EnJapan 20%。计算时尚未扣除支付处理费、退款及其他适用调整。主办方启用付费活动前会看到最终条款。",
    statusTitle: "目前可以参加付费活动吗？",
    statusText: "在线支付和主办方自动收款目前尚未启用。在 EnJapan 正式提供付费结账前，请勿向 EnJapan 付款，也不要将付费报名视为已确认。未来的付费活动会明确显示付款方式和确认状态。",
    membershipTitle: "会员计划",
    membershipText: "目前 EnJapan 没有付费会员计划。无需订阅即可使用免费社区功能。",
    contact: "价格相关问题请联系：enjapan.support@gmail.com"
  },
  "zh-tw": {
    title: "費用說明",
    intro: "註冊 EnJapan 完全免費。大多數社群活動免費；部分商務交流活動可能收取清楚標示的參加費。",
    freeTitle: "免費社群活動",
    freeIntro: "瀏覽及參加 EnJapan 一般社群活動，不需要強制會員費或訂閱費。",
    freeItems: ["語言交換與交流聚會", "咖啡、交友及社交活動", "文化體驗、城市散步及戶外活動", "共享工作空間及一般社群活動"],
    costsTitle: "個人支出",
    costsText: "參加者自行負擔個人或場地方要求的費用，例如餐飲、交通、門票或場地最低消費。這些費用與 EnJapan 平台費用不同。",
    businessTitle: "商務交流活動",
    businessText: "部分專業人士、高階主管、創業者或產業交流活動可能收取參加費。費用由活動主辦人設定，報名或付款前會顯示確切金額、費用包含項目及取消條款。",
    commissionTitle: "主辦人收入分潤",
    commissionText: "未來啟用付費活動結帳後，預計依活動實收金額分配：主辦人 80%，EnJapan 20%。計算時尚未扣除支付處理費、退款及其他適用調整。主辦人啟用付費活動前會看到最終條款。",
    statusTitle: "目前可以參加付費活動嗎？",
    statusText: "線上付款及主辦人自動收款目前尚未啟用。在 EnJapan 正式提供付費結帳前，請勿向 EnJapan 付款，也不要將付費報名視為已確認。未來的付費活動會清楚顯示付款方式及確認狀態。",
    membershipTitle: "會員方案",
    membershipText: "目前 EnJapan 沒有付費會員方案。無需訂閱即可使用免費社群功能。",
    contact: "費用相關問題請聯絡：enjapan.support@gmail.com"
  }
} satisfies Record<Locale, Record<string, string | string[]>>;

export function PricingPage({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const lang = locale;
  return (
    <InfoLayout pageKey="pricing" locale={lang} title={c.title as string} intro={c.intro as string}>
      <section>
        <h2>{c.freeTitle as string}</h2>
        <p>{c.freeIntro as string}</p>
        <ul>{(c.freeItems as string[]).map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
      <section>
        <h2>{c.costsTitle as string}</h2>
        <p>{c.costsText as string}</p>
      </section>
      <section>
        <h2>{c.businessTitle as string}</h2>
        <p>{c.businessText as string}</p>
      </section>
      <section>
        <h2>{c.commissionTitle as string}</h2>
        <p>{c.commissionText as string}</p>
      </section>
      <section>
        <h2>{c.statusTitle as string}</h2>
        <p>{c.statusText as string}</p>
      </section>
      <section>
        <h2>{c.membershipTitle as string}</h2>
        <p>{c.membershipText as string}</p>
      </section>
      <p><strong>{c.contact as string}</strong></p>
    </InfoLayout>
  );
}
