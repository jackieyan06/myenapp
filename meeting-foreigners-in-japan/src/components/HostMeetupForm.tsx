"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  TrainFront,
  Calendar,
  Users,
  Globe2,
  Loader2,
  ArrowLeft,
  Check,
} from "lucide-react";
import {
  JAPAN_CITIES,
  MEETUP_CATEGORIES,
  LANGUAGE_FOCUSES,
  LANGUAGE_LEVELS,
  CURATED_COVERS,
} from "@/lib/constants";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";

function getDefaultDateTimeLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  d.setHours(14, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function HostMeetupForm() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const { t, locale } = useLocale();
  const copy = {
    intro: { en: "Whether it’s a 6-person kissaten coffee morning, an English–Japanese language exchange, or an izakaya evening—share the exact station exit so newcomers find you easily.", ja: "6人で楽しむ喫茶店の朝のコーヒー会、日英言語交換、居酒屋での夕べなど、初めての方にも分かるように駅の出口を正確に記載してください。", "zh-cn": "无论是6人咖啡馆早晨聚会、英日语言交流，还是居酒屋之夜，请注明具体的车站出口，方便新朋友轻松找到集合地点。", "zh-tw": "無論是6人咖啡館早晨聚會、英日語言交流，還是居酒屋之夜，請註明確切的車站出口，方便新朋友輕鬆找到集合地點。" },
    almost: { en: "Sign in (or choose a 1-click Demo Persona) so guests know who is hosting.", ja: "ログイン（またはワンクリックのデモアカウントを選択）して、参加者に主催者が分かるようにしましょう。", "zh-cn": "请登录（或选择一键体验身份），让参加者知道活动由谁发起。", "zh-tw": "請登入（或選擇一鍵體驗身分），讓參加者知道活動由誰發起。" },
    signIn: { en: "Sign In / Try Demo", ja: "ログイン／デモを試す", "zh-cn": "登录／体验示范账号", "zh-tw": "登入／體驗示範帳號" },
    titlePlaceholder: { en: "e.g., Nakameguro Riverside Coffee & Bilingual Chat", ja: "例：中目黒の川沿いカフェで日英交流", "zh-cn": "例如：中目黑河畔咖啡与双语交流", "zh-tw": "例如：中目黑河畔咖啡與雙語交流" },
    tagsPlaceholder: { en: "Beginner Friendly, Matcha, Walk", ja: "例：初心者歓迎、抹茶、散歩", "zh-cn": "例如：欢迎初学者、抹茶、散步", "zh-tw": "例如：歡迎初學者、抹茶、散步" },
    descriptionPlaceholder: { en: "Share what the meetup feels like, whether beginners are welcome, and how you organize conversation...", ja: "交流会の雰囲気、初心者の参加可否、会話の進め方などを紹介してください…", "zh-cn": "请介绍活动氛围、是否欢迎初学者，以及交流活动将如何进行……", "zh-tw": "請介紹活動氛圍、是否歡迎初學者，以及交流活動將如何進行……" },
    neighborhoodPlaceholder: { en: "e.g., Nakameguro, Gion, Umeda", ja: "例：中目黒、祇園、梅田", "zh-cn": "例如：中目黑、祇园、梅田", "zh-tw": "例如：中目黑、祇園、梅田" },
    stationPlaceholder: { en: "e.g., Nakameguro Station (Main Exit, 3 min walk)", ja: "例：中目黒駅（正面改札口、徒歩3分）", "zh-cn": "例如：中目黑站（主要出口，步行3分钟）", "zh-tw": "例如：中目黑站（主要出口，步行3分鐘）" },
    venuePlaceholder: { en: "e.g., Streamer Coffee Company", ja: "例：Streamer Coffee Company", "zh-cn": "例如：Streamer Coffee Company 咖啡馆", "zh-tw": "例如：Streamer Coffee Company 咖啡館" },
    meetingPointPlaceholder: { en: "e.g., I’ll sit at the long wooden table near the window with a small blue notebook", ja: "例：窓際の長い木のテーブルで青いノートを持っています", "zh-cn": "例如：我会坐在靠窗的长木桌旁，桌上放着一本蓝色小笔记本", "zh-tw": "例如：我會坐在靠窗的長木桌旁，桌上放著一本藍色小筆記本" },
    costPlaceholder: { en: "Free · Order your own drink", ja: "無料・飲み物は各自注文", "zh-cn": "免费·饮品请各自点单", "zh-tw": "免費・飲品請各自點單" },
    publish: { en: "Publish Meetup", ja: "交流会を公開", "zh-cn": "发布聚会", "zh-tw": "發布聚會" },
    cancel: { en: "Cancel", ja: "キャンセル", "zh-cn": "取消", "zh-tw": "取消" }
  } as const;
  const textFor = (key: keyof typeof copy) => copy[key][locale] || copy[key].en;
  const coverLabels: Record<string, Record<string, string>> = {
    "Tokyo Café Language Table": { en: "Tokyo Café Language Table", ja: "東京カフェでの言語交流会", "zh-cn": "东京咖啡馆语言交流会", "zh-tw": "東京咖啡館語言交流會" },
    "Kyoto Lantern Evening Walk": { en: "Kyoto Lantern Evening Walk", ja: "京都の灯籠が彩る夕暮れ散歩", "zh-cn": "京都灯笼夜间漫步", "zh-tw": "京都燈籠夜間漫步" },
    "Osaka Izakaya Counter": { en: "Osaka Izakaya Counter", ja: "大阪の居酒屋カウンター", "zh-cn": "大阪居酒屋吧台", "zh-tw": "大阪居酒屋吧台" },
    "Fukuoka Seaside Picnic": { en: "Fukuoka Seaside Picnic", ja: "福岡の海辺ピクニック", "zh-cn": "福冈海滨野餐", "zh-tw": "福岡海濱野餐" },
    "Sapporo Cozy Lounge": { en: "Sapporo Cozy Lounge", ja: "札幌のくつろぎラウンジ", "zh-cn": "札幌温馨休闲空间", "zh-tw": "札幌溫馨休憩空間" },
    "Daikanyama Coworking Session": { en: "Daikanyama Coworking Session", ja: "代官山のコワーキング交流会", "zh-cn": "代官山联合办公交流会", "zh-tw": "代官山共享辦公交流會" },
  };
  const coverLabel = (label: string) => coverLabels[label]?.[locale] ?? coverLabels[label]?.en ?? label;

  const [title, setTitle] = useState("");
  const [titleJp, setTitleJp] = useState("");
  const [category, setCategory] = useState<string>(MEETUP_CATEGORIES[0].name);
  const [city, setCity] = useState<string>(user?.homeCity || "Tokyo");
  const [neighborhood, setNeighborhood] = useState("");
  const [station, setStation] = useState("");
  const [venueName, setVenueName] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");
  const [startsAt, setStartsAt] = useState(getDefaultDateTimeLocal);
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [maxAttendees, setMaxAttendees] = useState(8);
  const [costNote, setCostNote] = useState("Free · Order your own drink (~¥600)");
  const [languageFocus, setLanguageFocus] = useState<string>(
    LANGUAGE_FOCUSES[0]
  );
  const [languageLevel, setLanguageLevel] = useState<string>(
    LANGUAGE_LEVELS[0]
  );
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState(
    "Beginner Friendly, Solo Welcome, Coffee"
  );
  const [coverImage, setCoverImage] = useState<string>(CURATED_COVERS[0].url);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal("Sign in to publish your meetup");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/meetups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          titleJp,
          category,
          city,
          neighborhood,
          station,
          venueName,
          meetingPoint,
          startsAt: new Date(startsAt).toISOString(),
          durationMinutes,
          maxAttendees,
          costNote,
          languageFocus,
          languageLevel,
          description,
          tags,
          coverImage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to create meetup.");
      } else {
        router.push(`/meetups/${data.meetup.id}`);
        router.refresh();
      }
    } catch {
      setError("Network error while publishing meetup.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5A5D66] hover:text-[#1A1D24]"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("Back to Meetups")}
      </Link>

      <div className="mt-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#D94E34]/10 px-3 py-1 text-xs font-semibold text-[#D94E34]">
          <Sparkles className="h-3.5 w-3.5" />
          {t("Host a Small-Table Gathering")}
        </div>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#1A1D24]">
          {t("Create a Meetup in Japan")}
        </h1>
        <p className="mt-1.5 text-sm text-[#5A5D66]">
          {textFor("intro")}
        </p>
      </div>

      {!user && (
        <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-[#D94E34]/30 bg-[#D94E34]/8 p-4 sm:flex-row sm:items-center">
          <div className="text-sm text-[#1A1D24]">
            <strong>{t("Almost ready!")}</strong> Sign in (or choose a 1-click Demo
            Persona) so guests know who is hosting.
          </div>
          <button
            type="button"
            onClick={() => openAuthModal("Sign in to host a meetup")}
            className="shrink-0 rounded-xl bg-[#D94E34] px-4 py-2 text-xs font-bold text-white hover:bg-[#C04028]"
          >
            {textFor("signIn")}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-7 space-y-6">
        {/* Section 1: Core Info */}
        <div className="rounded-3xl border border-[#E6E0D6] bg-white p-6 sm:p-8 space-y-5">
          <h2 className="font-display text-lg font-bold text-[#1A1D24]">
            {t("1. What are we doing?")}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("Meetup Title *")}
              </label>
              <input
                type="text"
                required
                minLength={5}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={textFor("titlePlaceholder")}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-4 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("Japanese Subtitle (optional)")}
              </label>
              <input
                type="text"
                value={titleJp}
                onChange={(e) => setTitleJp(e.target.value)}
                placeholder="e.g., 中目黒カフェ・日英交流会"
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-4 py-2.5 font-jp text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("Category *")}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3.5 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              >
                {MEETUP_CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {t(c.name)} ({c.jp})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("Tags (comma separated)")}
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder={textFor("tagsPlaceholder")}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-4 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
              {t("Description & Vibe *")}
            </label>
            <textarea
              rows={4}
              required
              minLength={20}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={textFor("descriptionPlaceholder")}
              className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-4 py-3 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
            />
          </div>
        </div>

        {/* Section 2: Location & Train Station */}
        <div className="rounded-3xl border border-[#E6E0D6] bg-white p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2">
            <TrainFront className="h-5 w-5 text-[#2B4C7E]" />
            <h2 className="font-display text-lg font-bold text-[#1A1D24]">
              2. {t("2. Where in Japan & Which Train Exit?")}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("City *")}
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3.5 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              >
                {JAPAN_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {t(c.name)}{locale === "ja" ? ` (${c.jp})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("Neighborhood / Area *")}
              </label>
              <input
                type="text"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder={textFor("neighborhoodPlaceholder")}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-4 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("Nearest Train Station + Exit *")}
              </label>
              <input
                type="text"
                required
                value={station}
                onChange={(e) => setStation(e.target.value)}
                placeholder={textFor("stationPlaceholder")}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-4 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("Café, Venue or Park Name *")}
              </label>
              <input
                type="text"
                required
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder={textFor("venuePlaceholder")}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-4 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("How to Spot the Group (optional)")}
              </label>
              <input
                type="text"
                value={meetingPoint}
                onChange={(e) => setMeetingPoint(e.target.value)}
                placeholder={textFor("meetingPointPlaceholder")}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-4 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Time, Capacity & Languages */}
        <div className="rounded-3xl border border-[#E6E0D6] bg-white p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#D94E34]" />
            <h2 className="font-display text-lg font-bold text-[#1A1D24]">
              3. {t("3. Schedule, Languages & Group Size")}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("Date & Start Time (JST) *")}
              </label>
              <input
                type="datetime-local"
                required
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("Duration (minutes)")}
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              >
                <option value={60}>60 min (1 hour)</option>
                <option value={90}>90 min (1.5 hours)</option>
                <option value={120}>120 min (2 hours)</option>
                <option value={150}>150 min (2.5 hours)</option>
                <option value={180}>180 min (3 hours)</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {t("Max Table Size (incl. you)")}
                </span>
              </label>
              <input
                type="number"
                min={2}
                max={30}
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(Number(e.target.value))}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3.5 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                <span className="inline-flex items-center gap-1">
                  <Globe2 className="h-3.5 w-3.5" />
                  {t("Language Focus")}
                </span>
              </label>
              <select
                value={languageFocus}
                onChange={(e) => setLanguageFocus(e.target.value)}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              >
                {LANGUAGE_FOCUSES.map((lf) => (
                  <option key={t(lf)} value={lf}>
                    {lf}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("Language Comfort Level")}
              </label>
              <select
                value={languageLevel}
                onChange={(e) => setLanguageLevel(e.target.value)}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              >
                {LANGUAGE_LEVELS.map((ll) => (
                  <option key={t(ll)} value={ll}>
                    {ll}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("Cost / Warikan Note")}
              </label>
              <input
                type="text"
                value={costNote}
                onChange={(e) => setCostNote(e.target.value)}
                placeholder={textFor("costPlaceholder")}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3.5 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Cover Photo Selection */}
        <div className="rounded-3xl border border-[#E6E0D6] bg-white p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-lg font-bold text-[#1A1D24]">
            {t("4. Choose a Cover Atmosphere")}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CURATED_COVERS.map((cov) => {
              const selected = coverImage === cov.url;
              return (
                <button
                  key={cov.url}
                  type="button"
                  onClick={() => setCoverImage(cov.url)}
                  className={`group relative overflow-hidden rounded-2xl border-2 text-left transition ${
                    selected
                      ? "border-[#D94E34] ring-2 ring-[#D94E34]/20"
                      : "border-[#E6E0D6] hover:border-[#1A1D24]"
                  }`}
                >
                  <div className="aspect-[16/10] w-full overflow-hidden">
                    <img
                      src={cov.url}
                      alt={t(cov.label)}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="bg-white px-2.5 py-2 text-xs font-semibold text-[#1A1D24]">
                    {coverLabel(cov.label)}
                  </div>
                  {selected && (
                    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#D94E34] text-white shadow">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/"
            className="rounded-2xl border border-[#E6E0D6] bg-white px-5 py-3 text-sm font-semibold text-[#5A5D66] hover:text-[#1A1D24]"
          >
            {textFor("cancel")}
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#D94E34] px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#C04028] disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {textFor("publish")}
          </button>
        </div>
      </form>
    </div>
  );
}
