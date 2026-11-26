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
import { useLanguage, categoryTranslationKey, languageFocusTranslationKey } from "@/components/LanguageProvider";

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
  const { t } = useLanguage();

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
        {t("backMeetups")}
      </Link>

      <div className="mt-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#D94E34]/10 px-3 py-1 text-xs font-semibold text-[#D94E34]">
          <Sparkles className="h-3.5 w-3.5" />
          {t("hostBadge")}
        </div>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#1A1D24]">
          {t("hostTitle")}
        </h1>
        <p className="mt-1.5 text-sm text-[#5A5D66]">
          {t("hostFormIntro")}
        </p>
      </div>

      {!user && (
        <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-[#D94E34]/30 bg-[#D94E34]/8 p-4 sm:flex-row sm:items-center">
          <div className="text-sm text-[#1A1D24]">
            <strong>{t("almostReady")}</strong> {t("signInToHost")}
          </div>
          <button
            type="button"
            onClick={() => openAuthModal("Sign in to host a meetup")}
            className="shrink-0 rounded-xl bg-[#D94E34] px-4 py-2 text-xs font-bold text-white hover:bg-[#C04028]"
          >
            {t("signInDemo")}
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
            {t("hostSection1")}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("meetupTitleRequired")}
              </label>
              <input
                type="text"
                required
                minLength={5}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Nakameguro Riverside Coffee & Bilingual Chat"
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-4 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("japaneseSubtitle")}
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
                {t("categoryRequired")}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3.5 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              >
                {MEETUP_CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {t(categoryTranslationKey(c.name))} ({c.jp})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("tags")}
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder={t("tagsPlaceholder")}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-4 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
              {t("descriptionVibeRequired")}
            </label>
            <textarea
              rows={4}
              required
              minLength={20}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("descriptionPlaceholder")}
              className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-4 py-3 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
            />
          </div>
        </div>

        {/* Section 2: Location & Train Station */}
        <div className="rounded-3xl border border-[#E6E0D6] bg-white p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2">
            <TrainFront className="h-5 w-5 text-[#2B4C7E]" />
            <h2 className="font-display text-lg font-bold text-[#1A1D24]">
              {t("hostSection2")}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("cityRequired")}
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3.5 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              >
                {JAPAN_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.jp})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("neighborhoodRequired")}
              </label>
              <input
                type="text"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder={t("neighborhoodPlaceholder")}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-4 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("nearestStationRequired")}
              </label>
              <input
                type="text"
                required
                value={station}
                onChange={(e) => setStation(e.target.value)}
                placeholder={t("stationPlaceholder")}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-4 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("venueRequired")}
              </label>
              <input
                type="text"
                required
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder={t("venuePlaceholder")}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-4 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("meetingPoint")}
              </label>
              <input
                type="text"
                value={meetingPoint}
                onChange={(e) => setMeetingPoint(e.target.value)}
                placeholder={t("meetingPointPlaceholder")}
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
              {t("hostSection3")}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("dateTimeRequired")}
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
                {t("duration")}
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
                  {t("tableSize")}
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
                  {t("languageFocus")}
                </span>
              </label>
              <select
                value={languageFocus}
                onChange={(e) => setLanguageFocus(e.target.value)}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              >
                {LANGUAGE_FOCUSES.map((lf) => (
                  <option key={lf} value={lf}>
                    {t(languageFocusTranslationKey(lf))}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("languageLevel")}
              </label>
              <select
                value={languageLevel}
                onChange={(e) => setLanguageLevel(e.target.value)}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              >
                {LANGUAGE_LEVELS.map((ll) => (
                  <option key={ll} value={ll}>
                    {t(languageFocusTranslationKey(ll))}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5A5D66]">
                {t("costNote")}
              </label>
              <input
                type="text"
                value={costNote}
                onChange={(e) => setCostNote(e.target.value)}
                placeholder="Free · Order your own drink"
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3.5 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Cover Photo Selection */}
        <div className="rounded-3xl border border-[#E6E0D6] bg-white p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-lg font-bold text-[#1A1D24]">
            {t("hostSection4")}
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
                      alt={cov.label}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="bg-white px-2.5 py-2 text-xs font-semibold text-[#1A1D24]">
                    {cov.label}
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
            {t("cancel")}
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#D94E34] px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#C04028] disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("publishMeetup")}
          </button>
        </div>
      </form>
    </div>
  );
}
