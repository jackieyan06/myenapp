"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Globe2,
  Coffee,
  CheckCircle2,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import type { CommunityMember } from "@/lib/queries";
import { JAPAN_CITIES, ROLE_LABELS } from "@/lib/constants";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage, roleTranslationKey } from "@/components/LanguageProvider";

export function CommunityDirectoryClient({
  initialMembers,
}: {
  initialMembers: CommunityMember[];
}) {
  const { user, openAuthModal } = useAuth();
  const { t } = useLanguage();
  const [city, setCity] = useState("All");
  const [roleLabel, setRoleLabel] = useState("All");
  const [search, setSearch] = useState("");
  const [coffeeOnly, setCoffeeOnly] = useState(false);

  // Invite modal state
  const [selectedMember, setSelectedMember] =
    useState<CommunityMember | null>(null);
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteContext, setInviteContext] = useState("Coffee & Language Chat");
  const [sending, setSending] = useState(false);
  const [sentIds, setSentIds] = useState<number[]>([]);
  const [inviteError, setInviteError] = useState("");

  const filtered = useMemo(() => {
    return initialMembers.filter((m) => {
      if (city !== "All" && m.homeCity !== city) return false;
      if (roleLabel !== "All" && m.roleLabel !== roleLabel) return false;
      if (coffeeOnly && !m.openToCoffee) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hay = [
          m.name,
          m.nationality,
          m.homeCity,
          m.neighborhood,
          m.roleLabel,
          m.bio,
          ...m.languages.map((l) => `${l.lang} ${l.level}`),
          ...m.interests,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [initialMembers, city, roleLabel, coffeeOnly, search]);

  const openWaveModal = (member: CommunityMember) => {
    if (!user) {
      openAuthModal(`Sign in to send a coffee chat invite to ${member.name}`);
      return;
    }
    setSelectedMember(member);
    setInviteMessage(
      `Hi ${member.name}! I saw your profile on En and would love to grab a coffee or practice languages around ${member.homeCity} soon.`
    );
    setInviteError("");
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    setSending(true);
    setInviteError("");
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedMember.id,
          message: inviteMessage,
          meetupContext: inviteContext,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setInviteError(data.error || t("inviteFailed"));
      } else {
        setSentIds((prev) => [...prev, selectedMember.id]);
        setSelectedMember(null);
      }
    } catch {
      setInviteError(t("networkInviteError"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="rounded-3xl border border-[#E6E0D6] bg-gradient-to-r from-[#F5EFE6] to-white p-6 sm:p-9">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#2B4C7E]/10 px-3.5 py-1 text-xs font-semibold text-[#2B4C7E]">
          <Sparkles className="h-3.5 w-3.5" />
          {t("communityBadge")}
        </div>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#1A1D24] sm:text-4xl">
          {t("communityTitle")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5A5D66] sm:text-base">
          {t("communityIntro")}
        </p>

        {/* Search & Filters */}
        <div className="mt-6 grid gap-3 sm:grid-cols-12">
          <div className="relative sm:col-span-5">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A5D66]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("communitySearch")}
              className="w-full rounded-xl border border-[#E6E0D6] bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#D94E34]"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3.5 py-2.5 text-sm font-medium text-[#1A1D24] outline-none focus:border-[#D94E34]"
            >
              <option value="All">{t("allCitiesOption")}</option>
              {JAPAN_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.jp})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={roleLabel}
              onChange={(e) => setRoleLabel(e.target.value)}
              className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3.5 py-2.5 text-sm font-medium text-[#1A1D24] outline-none focus:border-[#D94E34]"
            >
              <option value="All">{t("allRoles")}</option>
              {ROLE_LABELS.map((r) => (
                <option key={r} value={r}>
                  {t(roleTranslationKey(r))}
                </option>
              ))}
            </select>
          </div>

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E6E0D6] bg-white px-3 py-2 text-xs font-semibold text-[#1A1D24] sm:col-span-2">
            <input
              type="checkbox"
              checked={coffeeOnly}
              onChange={(e) => setCoffeeOnly(e.target.checked)}
              className="accent-[#D94E34]"
            />
            {t("coffeeOnly")}
          </label>
        </div>
      </div>

      {/* Results count */}
      <div className="mt-6 flex items-center justify-between text-xs font-medium text-[#5A5D66]">
        <span>
          {t("showing")} <strong className="text-[#1A1D24]">{filtered.length}</strong>{" "}
          {t("communityMembers")}
        </span>
        {user && (
          <Link
            href="/my-meetups?tab=connections"
            className="font-semibold text-[#2B4C7E] hover:underline"
          >
            {t("viewInvites")} →
          </Link>
        )}
      </div>

      {/* Members Grid */}
      {filtered.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-[#E6E0D6] bg-white p-12 text-center">
          <p className="text-base font-bold text-[#1A1D24]">
            {t("noMembers")}
          </p>
          <button
            type="button"
            onClick={() => {
              setCity("All");
              setRoleLabel("All");
              setSearch("");
              setCoffeeOnly(false);
            }}
            className="mt-4 rounded-xl bg-[#1A1D24] px-4 py-2 text-xs font-semibold text-white"
          >
            {t("clearFilters")}
          </button>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((member) => {
            const isSelf = user?.id === member.id;
            const justSent = sentIds.includes(member.id);

            return (
              <div
                key={member.id}
                className="flex flex-col rounded-2xl border border-[#E6E0D6] bg-white p-5 transition hover:border-[#D94E34]/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
                      style={{ backgroundColor: member.avatarColor }}
                    >
                      {member.name[0]}
                    </span>
                    <div>
                      <h2 className="font-display text-base font-bold text-[#1A1D24]">
                        {member.nationalityFlag} {member.name}
                      </h2>
                      <div className="text-xs font-medium text-[#5A5D66]">
                        {t(roleTranslationKey(member.roleLabel))} · {member.nationality}
                      </div>
                    </div>
                  </div>
                  {member.openToCoffee && (
                    <span
                      title={`${t("coffeeOnly")} chats`}
                      className="inline-flex items-center gap-1 rounded-full bg-[#3E6B48]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#3E6B48]"
                    >
                      <Coffee className="h-3 w-3" />
                      Coffee OK
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#2B4C7E]">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>
                    {member.homeCity}
                    {member.neighborhood ? ` · ${member.neighborhood}` : ""}
                  </span>
                </div>

                <p className="mt-2.5 text-xs leading-relaxed text-[#5A5D66] line-clamp-3">
                  {member.bio}
                </p>

                {/* Languages */}
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {member.languages.map((l) => (
                    <span
                      key={l.lang}
                      className="inline-flex items-center gap-1 rounded-full border border-[#E6E0D6] bg-[#FAF8F4] px-2.5 py-0.5 text-[11px] font-medium text-[#1A1D24]"
                    >
                      <Globe2 className="h-3 w-3 text-[#D94E34]" />
                      {l.lang} ({l.level})
                    </span>
                  ))}
                </div>

                {/* Interests */}
                {member.interests.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {member.interests.slice(0, 4).map((int) => (
                      <span
                        key={int}
                        className="rounded-md bg-[#F2EDE4] px-2 py-0.5 text-[10px] font-semibold text-[#5A5D66]"
                      >
                        {int}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between border-t border-[#E6E0D6] pt-3.5">
                    <span className="text-[11px] text-[#5A5D66]">
                      {member.hostedCount} hosted · {member.goingCount} joined
                    </span>

                    {isSelf ? (
                      <Link
                        href="/my-meetups?tab=profile"
                        className="rounded-xl border border-[#E6E0D6] px-3 py-1.5 text-xs font-semibold text-[#1A1D24] hover:border-[#1A1D24]"
                      >
                        {t("editProfile")}
                      </Link>
                    ) : justSent ? (
                      <span className="inline-flex items-center gap-1 rounded-xl bg-[#3E6B48]/12 px-3 py-1.5 text-xs font-semibold text-[#3E6B48]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t("inviteSent")}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openWaveModal(member)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#1A1D24] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#D94E34]"
                      >
                        <Coffee className="h-3.5 w-3.5" />
                        {t("coffeeWave")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Send Coffee Chat Invite Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1D24]/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#E6E0D6] bg-[#FAF8F4] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-[#1A1D24]">
                {t("inviteMember")} {selectedMember.nationalityFlag} {selectedMember.name}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="rounded-full p-1.5 text-[#5A5D66] hover:bg-[#E6E0D6]/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-xs text-[#5A5D66]">
              {t(roleTranslationKey(selectedMember.roleLabel))} · {selectedMember.homeCity}
            </p>

            {inviteError && (
              <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
                {inviteError}
              </div>
            )}

            <form onSubmit={handleSendInvite} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                  {t("activityIdea")}
                </label>
                <select
                  value={inviteContext}
                  onChange={(e) => setInviteContext(e.target.value)}
                  className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#D94E34]"
                >
                  <option>{t("activityCoffeeChat")}</option>
                  <option>{t("activityLunch")}</option>
                  <option>{t("activityWalk")}</option>
                  <option>{t("activityCoworking")}</option>
                  <option>{t("activityTravelTips")}</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                  {t("personalMessage")}
                </label>
                <textarea
                  rows={3}
                  required
                  minLength={5}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#D94E34]"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D94E34] py-2.5 text-sm font-bold text-white hover:bg-[#C04028]"
              >
                {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("sendInvite")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
