"use client";

import type { Locale } from "@/components/LocaleProvider";

const translations: Record<string, Partial<Record<Locale, string>>> = {
  "Shibuya": { ja: "渋谷", "zh-cn": "涩谷", "zh-tw": "澀谷" },
  "Tokyo": { ja: "東京", "zh-cn": "东京", "zh-tw": "東京" },
  "Kyoto": { ja: "京都", "zh-cn": "京都", "zh-tw": "京都" },
  "Osaka": { ja: "大阪", "zh-cn": "大阪", "zh-tw": "大阪" },
  "Fukuoka": { ja: "福岡", "zh-cn": "福冈", "zh-tw": "福岡" },
  "Sapporo": { ja: "札幌", "zh-cn": "札幌", "zh-tw": "札幌" },
  "Yokohama": { ja: "横浜", "zh-cn": "横滨", "zh-tw": "橫濱" },
  "Shibuya Station (Hachiko Exit, 4 min walk)": { ja: "渋谷駅（ハチ公口から徒歩4分）", "zh-cn": "涩谷站（八公出口，步行4分钟）", "zh-tw": "澀谷站（八公出口，步行4分鐘）" },
  "Shibuya Morning Coffee & 50/50 Language Table": { ja: "渋谷モーニング・日英カフェ交流", "zh-cn": "涩谷晨间咖啡与英语日语交流", "zh-tw": "澀谷晨間咖啡與英日語交流" },
  "渋谷モーニング・日英カフェ交流": { ja: "渋谷モーニング・日英カフェ交流", "zh-cn": "涩谷晨间咖啡与英语日语交流", "zh-tw": "澀谷晨間咖啡與英日語交流" },
  "Kissa & Roastery Mame (2F Communal Table)": { ja: "喫茶＆ロースタリー Mame（2階共有テーブル）", "zh-cn": "Kissa & Roastery Mame（2楼公共桌）", "zh-tw": "Kissa & Roastery Mame（2樓公共桌）" },
  "Head to the 2nd floor communal cedar table. Look for the small red notebook on the table.": { ja: "2階の共有の杉材テーブルへお越しください。テーブルの上にある小さな赤いノートが目印です。", "zh-cn": "请前往二楼的公共雪松木桌，桌上的红色小笔记本就是集合标志。", "zh-tw": "請前往二樓的公共雪松木桌，桌上的紅色小筆記本就是集合標誌。" },
  "Free · Order your own drink (~¥650)": { ja: "無料・飲み物は各自注文（約650円）", "zh-cn": "免费·饮品各自点单（约650日元）", "zh-tw": "免費・飲品各自點單（約650日圓）" },
  "Start your morning with relaxed conversation in both English and Japanese! We alternate 25 minutes in Japanese and 25 minutes in English so everyone gets comfortable practice regardless of level. Beginners are warmly welcome—no textbooks needed, just bring curiosity and your favorite coffee order.": { ja: "英語と日本語の両方で、リラックスした朝の会話を楽しみましょう。日本語25分、英語25分を交互に行い、レベルに関係なく安心して練習できます。初心者も大歓迎です。教科書は不要です。好奇心とお気に入りのコーヒーの注文を持ってお越しください。", "zh-cn": "用轻松的英语和日语对话开启美好早晨！活动将交替进行 25 分钟日语和 25 分钟英语交流，让不同水平的参加者都能自在练习。欢迎初学者，无需课本，只需带着好奇心和你喜欢的咖啡点单来参加。", "zh-tw": "用輕鬆的英語與日語對話開啟美好早晨！活動將交替進行 25 分鐘日語與 25 分鐘英語交流，讓不同程度的參加者都能自在練習。歡迎初學者，不需要課本，只要帶著好奇心和喜歡的咖啡點單來參加。" },
  "Free · Order your own drink": { ja: "無料・飲み物は各自注文", "zh-cn": "免费·饮品各自点单", "zh-tw": "免費・飲品各自點單" },
  "Twilight Lantern Walk Along Kamo River & Pontocho": { ja: "鴨川と先斗町の夕暮れ提灯散歩", "zh-cn": "鸭川与先斗町的黄昏灯笼漫步", "zh-tw": "鴨川與先斗町的黃昏燈籠散步" },
  "Ura-Namba Cozy Izakaya Night (English Menu Help!)": { ja: "裏なんばの居酒屋ナイト（英語メニュー案内あり）", "zh-cn": "里难波温馨居酒屋之夜（提供英文菜单协助）", "zh-tw": "裏難波溫馨居酒屋之夜（提供英文菜單協助）" },
  "Daikanyama Remote Workers & Creators Coworking Coffee": { ja: "代官山リモートワーカー＆クリエイターのコワーキングカフェ", "zh-cn": "代官山远程工作者与创作者咖啡共工", "zh-tw": "代官山遠端工作者與創作者咖啡共工" },
  "Momochi Seaside Sunset Coffee & International Picnic": { ja: "百道海滨日落咖啡与国际野餐", "zh-cn": "百道海滨日落咖啡与国际野餐", "zh-tw": "百道海濱日落咖啡與國際野餐" },
  "Sapporo Timber Lounge: Hojicha & Strategy Board Games": { ja: "札幌ティンバーラウンジ：ほうじ茶と戦略ボードゲーム", "zh-cn": "札幌木质休闲厅：焙茶与策略桌游", "zh-tw": "札幌木質休憩廳：焙茶與策略桌遊" },
  "Yokohama Harbor Breeze Walk & Chinatown Tea Stop": { ja: "横浜港のそよ風散歩と中華街のお茶休憩", "zh-cn": "横滨港海风漫步与中华街茶歇", "zh-tw": "橫濱港海風散步與中華街茶歇" },
  "Shimokitazawa Vinyl Kissaten & Gentle Japanese Practice": { ja: "下北沢のレコード喫茶とやさしい日本語練習", "zh-cn": "下北泽黑胶咖啡馆与轻松日语练习", "zh-tw": "下北澤黑膠咖啡館與輕鬆日語練習" },
};

export function localizeMeetupText(value: string, locale: Locale): string {
  return translations[value]?.[locale] ?? value;
}
