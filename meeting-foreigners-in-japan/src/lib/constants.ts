export const JAPAN_CITIES = [
  { name: "Tokyo", jp: "東京", region: "Kanto" },
  { name: "Kyoto", jp: "京都", region: "Kansai" },
  { name: "Osaka", jp: "大阪", region: "Kansai" },
  { name: "Fukuoka", jp: "福岡", region: "Kyushu" },
  { name: "Sapporo", jp: "札幌", region: "Hokkaido" },
  { name: "Yokohama", jp: "横浜", region: "Kanto" },
] as const;

export const MEETUP_CATEGORIES = [
  { name: "Language Exchange", jp: "言語交換", badgeColor: "bg-[#2B4C7E]/10 text-[#2B4C7E] border-[#2B4C7E]/20" },
  { name: "Coffee & Café", jp: "カフェ交流", badgeColor: "bg-[#D94E34]/10 text-[#D94E34] border-[#D94E34]/20" },
  { name: "Izakaya & Dining", jp: "居酒屋・食事", badgeColor: "bg-[#D98A2B]/15 text-[#9C5C14] border-[#D98A2B]/30" },
  { name: "City Walk & Culture", jp: "街歩き・文化", badgeColor: "bg-[#3E6B48]/12 text-[#3E6B48] border-[#3E6B48]/25" },
  { name: "Outdoor & Hiking", jp: "アウトドア", badgeColor: "bg-[#3E6B48]/12 text-[#3E6B48] border-[#3E6B48]/25" },
  { name: "Coworking & Tech", jp: "コワーキング", badgeColor: "bg-[#1A1D24]/8 text-[#1A1D24] border-[#1A1D24]/15" },
  { name: "Board Games", jp: "ボードゲーム", badgeColor: "bg-[#7B4B94]/10 text-[#6B3A84] border-[#7B4B94]/20" },
] as const;

export const LANGUAGE_FOCUSES = [
  "Bilingual EN / JP",
  "Beginner JP Welcome",
  "English & International",
  "Japanese Immersion",
  "Multilingual Mix",
] as const;

export const LANGUAGE_LEVELS = [
  "All Levels Welcome",
  "Beginner Friendly",
  "Intermediate+",
  "Native / Fluent Mix",
] as const;

export const ROLE_LABELS = [
  "Japanese Local",
  "Expat in Japan",
  "Traveler / Visitor",
  "Exchange Student",
  "Digital Nomad",
] as const;

const COUNTRY_CODES = "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(" ");

function countryFlag(code: string): string {
  return String.fromCodePoint(...code.toUpperCase().split("").map((char) => 127397 + char.charCodeAt(0)));
}

export function getNationalities(locale: string = "en") {
  const displayNames = new Intl.DisplayNames([locale], { type: "region" });
  return COUNTRY_CODES.map((code) => ({
    name: new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code,
    label: displayNames.of(code) ?? code,
    flag: countryFlag(code),
    code,
  })).sort((a, b) => a.name.localeCompare(b.name, locale));
}

export const NATIONALITIES = getNationalities("en");


export const CURATED_COVERS = [
  {
    url: "/images/meetup-language-shibuya.jpg",
    label: "Tokyo Café Language Table",
  },
  {
    url: "/images/meetup-kyoto-walk.jpg",
    label: "Kyoto Lantern Evening Walk",
  },
  {
    url: "/images/meetup-osaka-izakaya.jpg",
    label: "Osaka Izakaya Counter",
  },
  {
    url: "/images/meetup-fukuoka-beach.jpg",
    label: "Fukuoka Seaside Picnic",
  },
  {
    url: "/images/meetup-sapporo-craft.jpg",
    label: "Sapporo Cozy Lounge",
  },
  {
    url: "/images/meetup-tokyo-tech.jpg",
    label: "Daikanyama Coworking Session",
  },
] as const;

export const JAPAN_PHRASES = [
  {
    jp: "はじめまして、よろしくお願いします。",
    romaji: "Hajimemashite, yoroshiku onegaishimasu.",
    en: "Nice to meet you — looking forward to getting to know you.",
    context: "First greeting",
  },
  {
    jp: "日本語を勉強中なので、ゆっくり話してもらえますか？",
    romaji: "Nihongo o benkyō-chū na no de, yukkuri hanashite moraemasu ka?",
    en: "I'm studying Japanese, could you speak a little slowly?",
    context: "Language exchange",
  },
  {
    jp: "割り勘にしましょうか？",
    romaji: "Warikan ni shimashō ka?",
    en: "Shall we split the bill evenly?",
    context: "Cafés & Izakayas",
  },
  {
    jp: "駅のどの出口で待ち合わせですか？",
    romaji: "Eki no dono deguchi de machiawase desu ka?",
    en: "Which train station exit are we meeting at?",
    context: "Finding the group",
  },
  {
    jp: "今日は楽しかったです！また会いましょう。",
    romaji: "Kyō wa tanoshikatta desu! Mata aimashō.",
    en: "I had a great time today! Let's meet again.",
    context: "Saying goodbye",
  },
];

export const JAPAN_ETIQUETTE_TIPS = [
  {
    title: "Specify exact train station exits",
    jp: "出口を指定する",
    description:
      "Major stations like Shinjuku, Shibuya, and Umeda have dozens of exits. Always include the exact exit name (e.g., Hachiko Exit or East Exit B) and walk time.",
  },
  {
    title: "Arrive 5 minutes early (5分前行動)",
    jp: "時間厳守",
    description:
      "In Japan, trains run to the second and punctuality is deeply appreciated. If your train is delayed, drop a quick message in the meetup discussion thread.",
  },
  {
    title: "Cash & IC Cards alongside PayPay",
    jp: "現金とキャッシュレス",
    description:
      "Small kissaten cafés and cozy izakayas often still prefer cash (¥1,000 bills & coins) when splitting bills (warikan 割り勘), even in central Tokyo.",
  },
  {
    title: "Keep indoor voices relaxed & welcoming",
    jp: "思いやり",
    description:
      "Cafés in Japan tend to be intimate spaces. Keep table sizes comfortable (4–10 people) so everyone gets a chance to talk without overwhelming the café.",
  },
];

export function getCategoryStyle(category: string): string {
  const found = MEETUP_CATEGORIES.find((c) => c.name === category);
  return (
    found?.badgeColor ?? "bg-slate-100 text-slate-700 border-slate-200"
  );
}

export function getCityJp(city: string): string {
  const found = JAPAN_CITIES.find((c) => c.name === city);
  return found?.jp ?? "";
}
