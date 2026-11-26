"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  LayoutGrid,
  List,
  Plus,
  RotateCcw,
  Users,
  BookOpen,
  SlidersHorizontal,
} from "lucide-react";
import type { MeetupSummary } from "@/lib/queries";
import {
  JAPAN_CITIES,
  MEETUP_CATEGORIES,
  LANGUAGE_FOCUSES,
} from "@/lib/constants";
import { MeetupCard } from "@/components/MeetupCard";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage, categoryTranslationKey, languageFocusTranslationKey } from "@/components/LanguageProvider";

export function HomeDiscoveryClient({
  initialMeetups,
  initialCity = "All",
  totalMembers,
}: {
  initialMeetups: MeetupSummary[];
  initialCity?: string;
  totalMembers: number;
}) {
  const { user, openAuthModal } = useAuth();
  const { t } = useLanguage();
  const [savedOverrides, setSavedOverrides] = useState<Record<number, boolean>>({});
  const [city, setCity] = useState<string>(initialCity);
  const [category, setCategory] = useState<string>("All");
  const [languageFocus, setLanguageFocus] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [openOnly, setOpenOnly] = useState<boolean>(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  const meetups = useMemo(
    () =>
      initialMeetups.map((m) =>
        m.id in savedOverrides ? { ...m, isSaved: savedOverrides[m.id] } : m
      ),
    [initialMeetups, savedOverrides]
  );

  const filtered = useMemo(() => {
    return meetups.filter((m) => {
      if (city !== "All" && m.city !== city) return false;
      if (category !== "All" && m.category !== category) return false;
      if (languageFocus !== "All" && m.languageFocus !== languageFocus)
        return false;
      if (openOnly && m.goingCount >= m.maxAttendees) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hay = [
          m.title,
          m.titleJp,
          m.city,
          m.neighborhood,
          m.station,
          m.venueName,
          m.description,
          m.host.name,
          ...m.tags,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [meetups, city, category, languageFocus, openOnly, search]);

  const hasActiveFilters =
    city !== "All" ||
    category !== "All" ||
    languageFocus !== "All" ||
    openOnly ||
    search.trim().length > 0;

  const resetFilters = () => {
    setCity("All");
    setCategory("All");
    setLanguageFocus("All");
    setOpenOnly(false);
    setSearch("");
  };

  const handleSaveToggle = (meetupId: number, isSaved: boolean) => {
    setSavedOverrides((prev) => ({ ...prev, [meetupId]: isSaved }));
  };

  return (
    <div className="pb-12">
      {/* Editorial Hero Section */}
      <section className="border-b border-[#E6E0D6] bg-gradient-to-b from-[#F5EFE6] to-[#FAF8F4]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            {/* Hero Copy & Search */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D94E34]/25 bg-white/80 px-3.5 py-1 text-xs font-semibold text-[#D94E34] shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{meetups.length} {t("upcoming")}</span>
                <span className="text-[#E6E0D6]">•</span>
                <span className="text-[#2B4C7E]">{totalMembers} {t("members")}</span>
              </div>

              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[#1A1D24] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
                {t("heroTitle")}{" "}
                <span className="text-[#D94E34]">{t("heroEmphasis")}</span>{" "}
                {t("heroTail")}
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#5A5D66]">
                {t("heroDescription")}
              </p>

              {/* Search Input */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A5D66]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="w-full rounded-2xl border border-[#E6E0D6] bg-white py-3 pl-10 pr-4 text-sm text-[#1A1D24] shadow-xs outline-none transition focus:border-[#D94E34] focus:ring-2 focus:ring-[#D94E34]/15"
                  />
                </div>
                <Link
                  href="/host"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#1A1D24] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#D94E34]"
                >
                  <Plus className="h-4 w-4" />
                  {t("hostGathering")}
                </Link>
              </div>

              {/* City Selector Pills */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCity("All")}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    city === "All"
                      ? "bg-[#D94E34] text-white shadow-xs"
                      : "border border-[#E6E0D6] bg-white text-[#5A5D66] hover:border-[#1A1D24] hover:text-[#1A1D24]"
                  }`}
                >
                  {t("allCities")}
                </button>
                {JAPAN_CITIES.map((c) => {
                  const active = city === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setCity(active ? "All" : c.name)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "bg-[#D94E34] text-white shadow-xs"
                          : "border border-[#E6E0D6] bg-white text-[#1A1D24] hover:border-[#D94E34]"
                      }`}
                    >
                      <span>{c.name}</span>
                      <span
                        className={`font-jp text-[11px] ${
                          active ? "text-white/85" : "text-[#8B867D]"
                        }`}
                      >
                        {c.jp}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hero Editorial Photo Card */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-[#E6E0D6] bg-white p-2 shadow-lg">
                <div className="relative aspect-[16/11] overflow-hidden rounded-2xl">
                  <img
                    src="/images/hero-tokyo-cafe.jpg"
                    alt="Friends from around the world meeting at a cozy Tokyo kissaten café"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D24]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="font-jp text-xs font-medium text-white/85">
                      東京・京都・大阪・福岡・札幌・横浜
                    </div>
                    <div className="mt-0.5 text-sm font-bold">
                      {t("realConversations")}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between px-2 py-1.5 text-xs">
                  <Link
                    href="/community"
                    className="inline-flex items-center gap-1.5 font-semibold text-[#2B4C7E] hover:underline"
                  >
                    <Users className="h-3.5 w-3.5" />
                    {t("browse")} {totalMembers} {t("members")}
                  </Link>
                  <Link
                    href="/guide"
                    className="inline-flex items-center gap-1.5 font-semibold text-[#D94E34] hover:underline"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    {t("meetupPhrases")} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Discovery Grid */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Welcome Demo Strip if Signed Out */}
        {!user && (
          <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-[#2B4C7E]/20 bg-[#2B4C7E]/5 px-4 py-3.5 sm:flex-row sm:items-center">
            <div className="text-sm text-[#1A1D24]">
              <span className="font-semibold text-[#2B4C7E]">
                {t("visitingJapan")}
              </span>{" "}
              {t("demoWelcome")}
            </div>
            <button
              type="button"
              onClick={() => openAuthModal("Choose a 1-Click Demo Persona or Sign Up")}
              className="shrink-0 rounded-xl bg-[#2B4C7E] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#223C66]"
            >
              Sign In / Try Demo
            </button>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="flex flex-col gap-4 border-b border-[#E6E0D6] pb-5">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setCategory("All")}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                category === "All"
                  ? "bg-[#1A1D24] text-white"
                  : "border border-[#E6E0D6] bg-white text-[#5A5D66] hover:text-[#1A1D24]"
              }`}
            >
              {t("allCategories")}
            </button>
            {MEETUP_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() =>
                  setCategory(category === cat.name ? "All" : cat.name)
                }
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  category === cat.name
                    ? "bg-[#1A1D24] text-white"
                    : "border border-[#E6E0D6] bg-white text-[#5A5D66] hover:border-[#1A1D24] hover:text-[#1A1D24]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Secondary controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-[#E6E0D6] bg-white px-3 py-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#5A5D66]" />
                <select
                  value={languageFocus}
                  onChange={(e) => setLanguageFocus(e.target.value)}
                  aria-label={t("filterLanguage")}
                  className="bg-transparent text-xs font-semibold text-[#1A1D24] outline-none"
                >
                  <option value="All">{t("allLanguages")}</option>
                  {LANGUAGE_FOCUSES.map((lf) => (
                    <option key={lf} value={lf}>
                      {t(languageFocusTranslationKey(lf))}
                    </option>
                  ))}
                </select>
              </div>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#E6E0D6] bg-white px-3 py-1.5 text-xs font-semibold text-[#1A1D24]">
                <input
                  type="checkbox"
                  checked={openOnly}
                  onChange={(e) => setOpenOnly(e.target.checked)}
                  className="accent-[#D94E34]"
                />
                {t("openSpots")}
              </label>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#D94E34] hover:bg-[#D94E34]/10"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {t("resetFilters")}
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-[#5A5D66]">
                {t("showingMeetups")} <strong className="text-[#1A1D24]">{filtered.length}</strong>{" "}{t(filtered.length === 1 ? "meetup" : "meetups")}
              </span>

              <div className="inline-flex rounded-xl border border-[#E6E0D6] bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  aria-label={t("gridView")}
                  className={`rounded-lg p-1.5 transition ${
                    view === "grid"
                      ? "bg-[#1A1D24] text-white"
                      : "text-[#5A5D66] hover:text-[#1A1D24]"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-label={t("listView")}
                  className={`rounded-lg p-1.5 transition ${
                    view === "list"
                      ? "bg-[#1A1D24] text-white"
                      : "text-[#5A5D66] hover:text-[#1A1D24]"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-[#D8D0C3] bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F2EDE4] text-xl">
              🍵
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-[#1A1D24]">
              {t("noMeetups")}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#5A5D66]">
              {t("tryClearFilters")}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-4 py-2 text-sm font-semibold text-[#1A1D24] hover:border-[#1A1D24]"
              >
                {t("showAllMeetups")}
              </button>
              <Link
                href="/host"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#D94E34] px-4 py-2 text-sm font-semibold text-white hover:bg-[#C04028]"
              >
                <Plus className="h-4 w-4" />
                {t("host")}
              </Link>
            </div>
          </div>
        ) : view === "grid" ? (
          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((meetup) => (
              <MeetupCard
                key={meetup.id}
                meetup={meetup}
                view="grid"
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>
        ) : (
          <div className="mt-7 space-y-4">
            {filtered.map((meetup) => (
              <MeetupCard
                key={meetup.id}
                meetup={meetup}
                view="list"
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
