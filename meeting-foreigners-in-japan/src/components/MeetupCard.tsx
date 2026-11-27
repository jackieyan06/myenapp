"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  TrainFront,
  Calendar,
  Bookmark,
  Globe2,
  MessageCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { MeetupSummary } from "@/lib/queries";
import { getCategoryStyle, getCityJp } from "@/lib/constants";
import { formatMeetupDate, formatMeetupTime } from "@/lib/format";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";

export function MeetupCard({
  meetup,
  view = "grid",
  onSaveToggle,
}: {
  meetup: MeetupSummary;
  view?: "grid" | "list";
  onSaveToggle?: (meetupId: number, saved: boolean) => void;
}) {
  const { user, openAuthModal } = useAuth();
  const { t, locale } = useLocale();
  const localizeMeetupText = (value: string) => {
    const translations: Record<string, Partial<Record<"ja" | "zh-cn" | "zh-tw", string>>> = {
      "Shibuya": { ja: "渋谷", "zh-cn": "涩谷", "zh-tw": "澀谷" },
      "Shibuya Station (Hachiko Exit, 4 min walk)": { ja: "渋谷駅（ハチ公口から徒歩4分）", "zh-cn": "涩谷站（八公出口，步行4分钟）", "zh-tw": "澀谷站（八公出口，步行4分鐘）" },
      "Shibuya Morning Coffee & 50/50 Language Table": { ja: "渋谷モーニング・日英カフェ交流", "zh-cn": "涩谷晨间咖啡与英语日语交流", "zh-tw": "澀谷晨間咖啡與英日語交流" },
      "渋谷モーニング・日英カフェ交流": { ja: "渋谷モーニング・日英カフェ交流", "zh-cn": "涩谷晨间咖啡与英语日语交流", "zh-tw": "澀谷晨間咖啡與英日語交流" },
      "Free · Order your own drink (~¥650)": { ja: "無料・飲み物は各自注文（約650円）", "zh-cn": "免费·饮品各自点单（约650日元）", "zh-tw": "免費・飲品各自點單（約650日圓）" },
      "Free · Order your own drink": { ja: "無料・飲み物は各自注文", "zh-cn": "免费·饮品各自点单", "zh-tw": "免費・飲品各自點單" },
    };
    return translations[value]?.[locale as "ja" | "zh-cn" | "zh-tw"] ?? value;
  };
  const [localSaved, setLocalSaved] = useState<{
    propVal: boolean;
    val: boolean;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const saved =
    localSaved && localSaved.propVal === meetup.isSaved
      ? localSaved.val
      : meetup.isSaved;

  const spotsLeft = Math.max(0, meetup.maxAttendees - meetup.goingCount);
  const isFull = spotsLeft === 0;
  const isHost = user?.id === meetup.hostId;

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openAuthModal(t("Sign in to bookmark meetups"));
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/meetups/${meetup.id}/save`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setLocalSaved({
          propVal: meetup.isSaved,
          val: Boolean(data.saved),
        });
        onSaveToggle?.(meetup.id, Boolean(data.saved));
      }
    } finally {
      setSaving(false);
    }
  };

  if (view === "list") {
    return (
      <Link
        href={`/meetups/${meetup.id}`}
        className="group flex flex-col gap-4 rounded-2xl border border-[#E6E0D6] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#D94E34]/40 hover:shadow-md sm:flex-row sm:items-center"
      >
        <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-44">
          <img
            src={meetup.coverImage}
            alt={meetup.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <span className="absolute left-2 top-2 rounded-full bg-[#1A1D24]/80 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            {localizeMeetupText(meetup.city)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getCategoryStyle(
                meetup.category
              )}`}
            >
              {t(meetup.category)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF8F4] border border-[#E6E0D6] px-2.5 py-0.5 text-[11px] font-medium text-[#5A5D66]">
              <Globe2 className="h-3 w-3 text-[#2B4C7E]" />
              {t(meetup.languageFocus)}
            </span>
            {meetup.viewerRsvpStatus === "going" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#3E6B48]/12 px-2.5 py-0.5 text-[11px] font-semibold text-[#3E6B48]">
                <CheckCircle2 className="h-3 w-3" />
              {t("Going")}
              </span>
            )}
            {isHost && (
              <span className="rounded-full bg-[#D94E34]/12 px-2.5 py-0.5 text-[11px] font-semibold text-[#D94E34]">
              {t("Hosting")}
              </span>
            )}
          </div>

          <h3 className="mt-1.5 truncate font-display text-lg font-bold text-[#1A1D24] group-hover:text-[#D94E34] transition">
            {meetup.title}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5A5D66]">
            <span className="inline-flex items-center gap-1 font-medium text-[#1A1D24]">
              <Calendar className="h-3.5 w-3.5 text-[#D94E34]" />
              {formatMeetupDate(meetup.startsAt, locale)} · {formatMeetupTime(meetup.startsAt, locale)}
            </span>
            <span className="inline-flex items-center gap-1">
              <TrainFront className="h-3.5 w-3.5 text-[#2B4C7E]" />
              {meetup.station}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-[#E6E0D6] pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
          <div className="text-right">
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isFull
                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                  : "bg-[#3E6B48]/10 text-[#3E6B48]"
              }`}
            >
              {isFull
                ? `${t("Waitlist")} (${meetup.waitlistCount})`
                : `${spotsLeft} ${t("spot left")}`}
            </span>
            <div className="mt-1 text-[11px] text-[#5A5D66]">
              {meetup.goingCount} / {meetup.maxAttendees} {t("joined")}
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleSave}
            aria-label={saved ? t("Remove bookmark") : t("Save meetup")}
            className={`rounded-full border p-2 transition ${
              saved
                ? "border-[#D94E34] bg-[#D94E34]/10 text-[#D94E34]"
                : "border-[#E6E0D6] bg-white text-[#5A5D66] hover:border-[#1A1D24]"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
          </button>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/meetups/${meetup.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#E6E0D6] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#D94E34]/45 hover:shadow-[0_14px_34px_rgba(26,29,36,0.08)]"
    >
      {/* Image Cover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F2EDE4]">
        <img
          src={meetup.coverImage}
          alt={meetup.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D24]/60 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#1A1D24]/82 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <MapPin className="h-3 w-3 text-[#D94E34]" />
            {t(meetup.city)}
            <span className="font-jp text-[11px] opacity-85">
              {getCityJp(meetup.city)}
            </span>
          </span>

          <button
            type="button"
            onClick={handleToggleSave}
            aria-label={saved ? t("Remove bookmark") : t("Bookmark meetup")}
            className={`rounded-full p-2 backdrop-blur-sm transition ${
              saved
                ? "bg-[#D94E34] text-white shadow-sm"
                : "bg-white/85 text-[#1A1D24] hover:bg-white"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Bottom image overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-white/92 px-2.5 py-0.5 text-[11px] font-semibold text-[#1A1D24] backdrop-blur-sm">
            {t(meetup.languageFocus)}
          </span>

          {isHost ? (
            <span className="rounded-full bg-[#D94E34] px-2.5 py-0.5 text-[11px] font-semibold text-white">
              {t("Hosting")}
            </span>
          ) : meetup.viewerRsvpStatus === "going" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#3E6B48] px-2.5 py-0.5 text-[11px] font-semibold text-white">
              <CheckCircle2 className="h-3 w-3" />
              {t("Going")}
            </span>
          ) : meetup.viewerRsvpStatus === "waitlist" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#D98A2B] px-2.5 py-0.5 text-[11px] font-semibold text-white">
              <Clock className="h-3 w-3" />
              {t("Waitlisted")}
            </span>
          ) : null}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getCategoryStyle(
              meetup.category
            )}`}
          >
            {t(meetup.category)}
          </span>
          <span className="text-xs font-medium text-[#5A5D66]">
            {formatMeetupDate(meetup.startsAt, locale)} · {formatMeetupTime(meetup.startsAt, locale)}
          </span>
        </div>

        {meetup.titleJp && locale !== "zh-cn" && locale !== "zh-tw" && (
          <p className="mt-2.5 font-jp text-[11px] font-medium text-[#8B867D] line-clamp-1">
            {meetup.titleJp}
          </p>
        )}

        <h3 className="mt-1 font-display text-lg font-bold leading-snug text-[#1A1D24] group-hover:text-[#D94E34] transition line-clamp-2">
          {localizeMeetupText(meetup.title)}
        </h3>

        <div className="mt-3 space-y-1.5 text-xs text-[#5A5D66]">
          <div className="flex items-start gap-1.5">
            <TrainFront className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2B4C7E]" />
            <span className="line-clamp-1 font-medium text-[#1A1D24]/85">
              {localizeMeetupText(meetup.neighborhood)} · {localizeMeetupText(meetup.station)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe2 className="h-3.5 w-3.5 shrink-0 text-[#3E6B48]" />
            <span>{t(meetup.languageLevel)}</span>
            <span>·</span>
            <span className="truncate">{localizeMeetupText(meetup.costNote)}</span>
          </div>
        </div>

        {/* Footer with Host + Attendees */}
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between border-t border-[#E6E0D6] pt-3.5">
            {/* Host */}
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: meetup.host.avatarColor }}
              >
                {meetup.host.name[0]}
              </span>
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-[#1A1D24]">
                  {meetup.host.nationalityFlag} {meetup.host.name}
                </div>
                <div className="truncate text-[10px] text-[#5A5D66]">
                  {t(meetup.host.roleLabel)}
                </div>
              </div>
            </div>

            {/* Spots & Attendee Avatars */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex -space-x-1.5">
                {meetup.attendeePreviews.slice(0, 3).map((att) => (
                  <span
                    key={att.id}
                    title={att.name}
                    className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white"
                    style={{ backgroundColor: att.avatarColor }}
                  >
                    {att.name[0]}
                  </span>
                ))}
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  isFull
                    ? "bg-amber-50 text-amber-800"
                    : "bg-[#3E6B48]/10 text-[#3E6B48]"
                }`}
              >
                {isFull ? t("Full") : `${spotsLeft} ${t("spot left")}`}
              </span>
              {meetup.commentCount > 0 && (
                <span className="inline-flex items-center gap-0.5 text-[11px] text-[#5A5D66]">
                  <MessageCircle className="h-3 w-3" />
                  {meetup.commentCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
