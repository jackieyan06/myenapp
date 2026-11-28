"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarHeart,
  Bookmark,
  Coffee,
  User as UserIcon,
  Sparkles,
  Check,
  X,
  Plus,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import type { MeetupSummary } from "@/lib/queries";
import { MeetupCard } from "@/components/MeetupCard";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import {
  JAPAN_CITIES,
  NATIONALITIES,
  ROLE_LABELS,
} from "@/lib/constants";
import { formatShortTimestamp } from "@/lib/format";

interface ConnectionItem {
  id: number;
  direction: "incoming" | "outgoing";
  message: string;
  meetupContext: string;
  status: string;
  createdAt: string;
  peer: {
    id: number;
    name: string;
    nationality: string;
    nationalityFlag: string;
    homeCity: string;
    roleLabel: string;
    avatarColor: string;
  };
}

export function MyHubClient({
  initialTab = "attending",
  hubData,
}: {
  initialTab?: string;
  hubData: {
    hosting: MeetupSummary[];
    attending: MeetupSummary[];
    saved: MeetupSummary[];
    connections: ConnectionItem[];
  } | null;
}) {
  const router = useRouter();
  const { user, setUser, openAuthModal } = useAuth();
  const { t } = useLocale();
  const [tab, setTab] = useState(initialTab);
  const [statusOverrides, setStatusOverrides] = useState<
    Record<number, string>
  >({});

  const connectionsList = React.useMemo(
    () =>
      (hubData?.connections ?? []).map((c) =>
        c.id in statusOverrides ? { ...c, status: statusOverrides[c.id] } : c
      ),
    [hubData?.connections, statusOverrides]
  );

  // Profile edit state
  const [name, setName] = useState(user?.name ?? "");
  const [roleLabel, setRoleLabel] = useState(user?.roleLabel ?? ROLE_LABELS[1]);
  const [nationality, setNationality] = useState(
    user?.nationality ?? "United States"
  );
  const [homeCity, setHomeCity] = useState(user?.homeCity ?? "Tokyo");
  const [neighborhood, setNeighborhood] = useState(user?.neighborhood ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [openToCoffee, setOpenToCoffee] = useState(user?.openToCoffee ?? true);
  const [languagesText, setLanguagesText] = useState(
    user?.languages.map((l) => `${l.lang}:${l.level}`).join(", ") ??
      "English:Fluent, Japanese:Beginner"
  );
  const [interestsText, setInterestsText] = useState(
    user?.interests.join(", ") ?? "Coffee, Language Exchange"
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState("");

  if (!user || !hubData) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <div className="rounded-3xl border border-[#E6E0D6] bg-white p-10 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D94E34]/10 text-[#D94E34]">
            <CalendarHeart className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-[#1A1D24]">
            {t("Your Japan Meetup Hub")}
          </h1>
          <p className="mt-2 text-sm text-[#5A5D66]">
            {t("Sign in or select a 1-click Demo Persona to view your upcoming RSVPs, hosted gatherings, saved meetups, and coffee invitations.")}
          </p>
          <button
            type="button"
            onClick={() => openAuthModal(t("Sign in to open My Hub"))}
            className="mt-6 rounded-2xl bg-[#D94E34] px-6 py-3 text-sm font-bold text-white hover:bg-[#C04028]"
          >
            {t("Sign In / Choose Demo Account")}
          </button>
        </div>
      </div>
    );
  }

  const pendingIncomingCount = connectionsList.filter(
    (c) => c.direction === "incoming" && c.status === "pending"
  ).length;

  const handleConnectionResponse = async (
    connectionId: number,
    status: "accepted" | "declined"
  ) => {
    const res = await fetch("/api/connections", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ connectionId, status }),
    });
    if (res.ok) {
      setStatusOverrides((prev) => ({ ...prev, [connectionId]: status }));
      router.refresh();
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSavedMsg("");
    try {
      const nat = NATIONALITIES.find((n) => n.name === nationality);
      const parsedLangs = languagesText
        .split(",")
        .map((chunk) => chunk.trim())
        .filter(Boolean)
        .map((chunk) => {
          const [lang, level] = chunk.split(":").map((s) => s.trim());
          return {
            lang: lang || chunk,
            level: level || "Conversational",
          };
        });
      const parsedInterests = interestsText
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          roleLabel,
          nationality,
          nationalityFlag: nat?.flag ?? user.nationalityFlag,
          homeCity,
          neighborhood,
          bio,
          openToCoffee,
          languages: parsedLangs,
          interests: parsedInterests,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setProfileSavedMsg(t("Profile updated!"));
        router.refresh();
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const tabs = [
    {
      id: "attending",
      label: `${t("Going")} (${hubData.attending.length})`,
      icon: CalendarHeart,
    },
    {
      id: "hosting",
      label: `${t("Hosting")} (${hubData.hosting.length})`,
      icon: Sparkles,
    },
    {
      id: "saved",
      label: `${t("Saved")} (${hubData.saved.length})`,
      icon: Bookmark,
    },
    {
      id: "connections",
      label: `${t("Coffee Waves")} (${connectionsList.length})`,
      badge: pendingIncomingCount,
      icon: Coffee,
    },
    {
      id: "profile",
      label: t("Edit Profile"),
      icon: UserIcon,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-[#E6E0D6] bg-white p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
            style={{ backgroundColor: user.avatarColor }}
          >
            {user.name[0]}
          </span>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-[#1A1D24]">
              {user.nationalityFlag} {user.name}
            </h1>
            <p className="text-sm text-[#5A5D66]">
              {t(user.roleLabel)} · {t(user.homeCity)}
              {user.neighborhood ? ` (${user.neighborhood})` : ""}
            </p>
          </div>
        </div>
        <Link
          href="/host"
          className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#D94E34] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#C04028]"
        >
          <Plus className="h-4 w-4" />
          {t("Host New Meetup")}
        </Link>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                active
                  ? "bg-[#1A1D24] text-white"
                  : "border border-[#E6E0D6] bg-white text-[#5A5D66] hover:text-[#1A1D24]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
              {t.badge ? (
                <span className="rounded-full bg-[#D94E34] px-1.5 py-0.5 text-[10px] text-white">
                  {t.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tab === "attending" && (
          <div>
            {hubData.attending.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#E6E0D6] bg-white p-12 text-center">
                <p className="font-display text-lg font-bold text-[#1A1D24]">
                  You haven&apos;t joined any upcoming meetups yet
                </p>
                <p className="mt-1 text-sm text-[#5A5D66]">
                  Explore coffee mornings, language tables, and city walks across Japan.
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-block rounded-xl bg-[#D94E34] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Discover Meetups
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {hubData.attending.map((m) => (
                  <MeetupCard key={m.id} meetup={m} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "hosting" && (
          <div>
            {hubData.hosting.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#E6E0D6] bg-white p-12 text-center">
                <p className="font-display text-lg font-bold text-[#1A1D24]">
                  {t("You aren't hosting any meetups yet")}
                </p>
                <p className="mt-1 text-sm text-[#5A5D66]">
                  {t("Hosting a 4–8 person café meetup is one of the easiest ways to meet foreigners and locals in your neighborhood!")}
                </p>
                <Link
                  href="/host"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#D94E34] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  <Plus className="h-4 w-4" />
                  {t("Host Your First Meetup")}
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {hubData.hosting.map((m) => (
                  <MeetupCard key={m.id} meetup={m} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "saved" && (
          <div>
            {hubData.saved.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#E6E0D6] bg-white p-12 text-center">
                <p className="font-display text-lg font-bold text-[#1A1D24]">
                  {t("No bookmarked meetups yet")}
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-block rounded-xl bg-[#1A1D24] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {t("Browse Meetups")}
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {hubData.saved.map((m) => (
                  <MeetupCard key={m.id} meetup={m} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "connections" && (
          <div className="space-y-4">
            {connectionsList.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#E6E0D6] bg-white p-12 text-center">
                <p className="font-display text-lg font-bold text-[#1A1D24]">
                  {t("No coffee waves or invites yet")}
                </p>
                <p className="mt-1 text-sm text-[#5A5D66]">
                  {t("Visit the People directory to say hello and invite someone for a coffee chat.")}
                </p>
                <Link
                  href="/community"
                  className="mt-4 inline-block rounded-xl bg-[#2B4C7E] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {t("Explore People Directory")}
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {connectionsList.map((conn) => (
                  <div
                    key={conn.id}
                    className="rounded-2xl border border-[#E6E0D6] bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                          style={{ backgroundColor: conn.peer.avatarColor }}
                        >
                          {conn.peer.name[0]}
                        </span>
                        <div>
                          <div className="text-sm font-bold text-[#1A1D24]">
                            {conn.peer.nationalityFlag} {conn.peer.name}
                          </div>
                          <div className="text-xs text-[#5A5D66]">
                            {conn.direction === "incoming"
                              ? t("Invited you")
                              : t("You invited")}{" "}
                            · {conn.meetupContext}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${
                          conn.status === "accepted"
                            ? "bg-[#3E6B48]/12 text-[#3E6B48]"
                            : conn.status === "declined"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {t(conn.status)}
                      </span>
                    </div>

                    <p className="mt-3 rounded-xl bg-[#FAF8F4] p-3 text-xs leading-relaxed text-[#1A1D24]">
                      &ldquo;{conn.message}&rdquo;
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-[#5A5D66]">
                      <span>{formatShortTimestamp(conn.createdAt)}</span>
                      {conn.direction === "incoming" &&
                        conn.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleConnectionResponse(conn.id, "declined")
                              }
                              className="inline-flex items-center gap-1 rounded-lg border border-[#E6E0D6] px-2.5 py-1 font-semibold text-[#5A5D66] hover:bg-red-50 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                              {t("Decline")}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleConnectionResponse(conn.id, "accepted")
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-[#3E6B48] px-3 py-1 font-semibold text-white hover:bg-[#315539]"
                            >
                              <Check className="h-3 w-3" />
                              {t("Accept Coffee")}
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "profile" && (
          <form
            onSubmit={handleSaveProfile}
            className="max-w-2xl rounded-3xl border border-[#E6E0D6] bg-white p-6 sm:p-8 space-y-4"
          >
            <h2 className="font-display text-xl font-bold text-[#1A1D24]">
              {t("Edit Cultural Profile")}
            </h2>

            {profileSavedMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-[#3E6B48]/12 px-4 py-2.5 text-sm font-semibold text-[#3E6B48]">
                <CheckCircle2 className="h-4 w-4" />
                {profileSavedMsg}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#5A5D66]">
                  {t("Display Name")}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3.5 py-2 text-sm outline-none focus:border-[#D94E34] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#5A5D66]">
                  {t("Role in Japan")}
                </label>
                <select
                  value={roleLabel}
                  onChange={(e) => setRoleLabel(e.target.value)}
                  className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3.5 py-2 text-sm outline-none focus:border-[#D94E34] focus:bg-white"
                >
                  {ROLE_LABELS.map((r) => (
                    <option key={r} value={r}>
                      {t(r)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#5A5D66]">
                  {t("Country / Origin")}
                </label>
                <select
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3.5 py-2 text-sm outline-none focus:border-[#D94E34] focus:bg-white"
                >
                  {NATIONALITIES.map((n) => (
                    <option key={n.name} value={n.name}>
                      {n.flag} {t(n.name)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#5A5D66]">
                  {t("Base City in Japan")}
                </label>
                <select
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3.5 py-2 text-sm outline-none focus:border-[#D94E34] focus:bg-white"
                >
                  {JAPAN_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {t(c.name)} ({c.jp})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[#5A5D66]">
                {t("Favorite Neighborhood")}
              </label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder={t("e.g., Shimokitazawa, Gion, Tenjin")}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3.5 py-2 text-sm outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[#5A5D66]">
                {t("Languages (format: Language:Level, comma separated)")}
              </label>
              <input
                type="text"
                value={languagesText}
                onChange={(e) => setLanguagesText(e.target.value)}
                placeholder={t("English:Native, Japanese:Conversational (N3)")}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3.5 py-2 text-sm outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[#5A5D66]">
                {t("Interests (comma separated)")}
              </label>
              <input
                type="text"
                value={interestsText}
                onChange={(e) => setInterestsText(e.target.value)}
                placeholder={t("Specialty Coffee, Hiking, Ramen, Film")}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3.5 py-2 text-sm outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[#5A5D66]">
                Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3.5 py-2 text-sm outline-none focus:border-[#D94E34] focus:bg-white"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-[#1A1D24]">
              <input
                type="checkbox"
                checked={openToCoffee}
                onChange={(e) => setOpenToCoffee(e.target.checked)}
                className="accent-[#D94E34]"
              />
              {t("Show “Open to Coffee Chats” badge on my directory card")}
            </label>

            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D94E34] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#C04028] disabled:opacity-60"
            >
              {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("Save Profile")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
