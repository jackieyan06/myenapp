"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  TrainFront,
  Wallet,
  Globe2,
  Bookmark,
  Share2,
  CheckCircle2,
  Users,
  MessageSquare,
  Send,
  Trash2,
  Pin,
  Edit3,
  Loader2,
  Hand,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import type { MeetupDetail } from "@/lib/queries";
import { getCategoryStyle, getCityJp, JAPAN_PHRASES } from "@/lib/constants";
import {
  formatMeetupFullDate,
  formatMeetupTime,
  formatShortTimestamp,
} from "@/lib/format";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/LocaleProvider";
import { localizeMeetupText } from "@/lib/meetup-localization";

export function MeetupDetailClient({
  initialMeetup,
}: {
  initialMeetup: MeetupDetail;
}) {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const { t, locale } = useLocale();
  const [meetup, setMeetup] = useState<MeetupDetail>(initialMeetup);
  const [saved, setSaved] = useState(initialMeetup.isSaved);
  const [copied, setCopied] = useState(false);

  // RSVP states
  const [introNote, setIntroNote] = useState("");
  const [speakingLang, setSpeakingLang] = useState("");
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpFeedback, setRsvpFeedback] = useState("");

  // Comment states
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // Host edit / delete states
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    title: meetup.title,
    venueName: meetup.venueName,
    station: meetup.station,
    meetingPoint: meetup.meetingPoint,
    costNote: meetup.costNote,
    maxAttendees: meetup.maxAttendees,
    description: meetup.description,
  });

  // Wave modal to host
  const [waveOpen, setWaveOpen] = useState(false);
  const [waveMsg, setWaveMsg] = useState("");
  const [waveSent, setWaveSent] = useState(false);
  const [waveLoading, setWaveLoading] = useState(false);

  const isHost = user?.id === meetup.hostId;
  const spotsLeft = Math.max(0, meetup.maxAttendees - meetup.goingCount);
  const isFull = spotsLeft === 0;
  const fillPercent = Math.min(
    100,
    Math.round((meetup.goingCount / meetup.maxAttendees) * 100)
  );

  const refreshDetail = async () => {
    const res = await fetch(`/api/meetups/${meetup.id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setMeetup(data.meetup);
      setSaved(data.meetup.isSaved);
    }
  };

  const handleRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal(t("Sign in to join this meetup"));
      return;
    }
    setRsvpLoading(true);
    setRsvpFeedback("");
    try {
      const res = await fetch(`/api/meetups/${meetup.id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          introNote,
          speakingLanguage: speakingLang,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRsvpFeedback(t(data.error || "Could not complete RSVP."));
      } else {
        setRsvpFeedback(
          data.status === "waitlist"
            ? t("Added to waitlist! You'll automatically move up if a spot opens.")
            : t("Spot confirmed! See you there.")
        );
        setIntroNote("");
        await refreshDetail();
        router.refresh();
      }
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleCancelRsvp = async () => {
    if (!user) return;
    setRsvpLoading(true);
    setRsvpFeedback("");
    try {
      const res = await fetch(`/api/meetups/${meetup.id}/rsvp`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRsvpFeedback(t("Your RSVP has been cancelled."));
        await refreshDetail();
        router.refresh();
      }
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleToggleSave = async () => {
    if (!user) {
      openAuthModal(t("Sign in to save meetups"));
      return;
    }
    const res = await fetch(`/api/meetups/${meetup.id}/save`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      setSaved(Boolean(data.saved));
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard restrictions
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal(t("Sign in to ask a question or say hello"));
      return;
    }
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const res = await fetch(`/api/meetups/${meetup.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });
      if (res.ok) {
        setCommentText("");
        await refreshDetail();
      }
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const res = await fetch(
      `/api/meetups/${meetup.id}/comments?commentId=${commentId}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      await refreshDetail();
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await fetch(`/api/meetups/${meetup.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setEditOpen(false);
        await refreshDetail();
        router.refresh();
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteMeetup = async () => {
    const res = await fetch(`/api/meetups/${meetup.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/");
      router.refresh();
    }
  };

  const handleSendWave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal(t("Sign in to message the host"));
      return;
    }
    setWaveLoading(true);
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: meetup.hostId,
          message: waveMsg,
          meetupContext: `Re: ${meetup.title}`,
        }),
      });
      if (res.ok) {
        setWaveSent(true);
        setWaveMsg("");
      }
    } finally {
      setWaveLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5A5D66] transition hover:text-[#1A1D24]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("Back to Japan Meetups")}
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E6E0D6] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1A1D24] transition hover:border-[#1A1D24]"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#3E6B48]" />
                {t("Copied Link")}
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                {t("Share")}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleToggleSave}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              saved
                ? "border-[#D94E34] bg-[#D94E34]/10 text-[#D94E34]"
                : "border-[#E6E0D6] bg-white text-[#1A1D24] hover:border-[#D94E34]"
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-current" : ""}`} />
            {saved ? t("Saved") : t("Save")}
          </button>
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Main Content */}
        <div className="space-y-7 lg:col-span-8">
          {/* Hero Cover + Header */}
          <div className="overflow-hidden rounded-3xl border border-[#E6E0D6] bg-white shadow-xs">
            <div className="relative aspect-[16/9] max-h-[380px] w-full overflow-hidden bg-[#F2EDE4]">
              <img
                src={meetup.coverImage}
                alt={meetup.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D24]/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/92 px-3 py-1 text-xs font-bold text-[#1A1D24] backdrop-blur-sm">
                  <MapPin className="h-3.5 w-3.5 text-[#D94E34]" />
                  {t(meetup.city)}{" "}
                  <span className="font-jp">{getCityJp(meetup.city)}</span> ·{" "}
                  {t(meetup.neighborhood)}
                </span>
                <span className="rounded-full bg-[#1A1D24]/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {t(meetup.languageFocus)}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${getCategoryStyle(
                    meetup.category
                  )}`}
                >
                  {t(meetup.category)}
                </span>
                <span className="rounded-full border border-[#E6E0D6] bg-[#FAF8F4] px-3 py-0.5 text-xs font-medium text-[#5A5D66]">
                  {t(meetup.languageLevel)}
                </span>
              </div>

              {meetup.titleJp && locale === "ja" && (
                <p className="mt-3 font-jp text-sm font-medium text-[#8B867D]">
                  {meetup.titleJp}
                </p>
              )}

              <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-[#1A1D24] sm:text-3xl">
                {localizeMeetupText(meetup.title, locale)}
              </h1>

              {/* Logistics Grid */}
              <div className="mt-6 grid gap-4 rounded-2xl border border-[#E6E0D6] bg-[#FAF8F4] p-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D94E34]/10 text-[#D94E34]">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#5A5D66]">
                      {t("Date & Time")}
                    </div>
                    <div className="mt-0.5 text-sm font-bold text-[#1A1D24]">
                      {formatMeetupFullDate(meetup.startsAt, locale)}
                    </div>
                    <div className="text-xs text-[#5A5D66]">
                      {formatMeetupTime(meetup.startsAt, locale)} ({meetup.durationMinutes} {t("minutes")})
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2B4C7E]/10 text-[#2B4C7E]">
                    <TrainFront className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#5A5D66]">
                      {t("Nearest Train Station")}
                    </div>
                    <div className="mt-0.5 text-sm font-bold text-[#1A1D24]">
                      {localizeMeetupText(meetup.station, locale)}
                    </div>
                    <div className="text-xs text-[#5A5D66]">
                      {localizeMeetupText(meetup.neighborhood, locale)}, {localizeMeetupText(meetup.city, locale)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3E6B48]/10 text-[#3E6B48]">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#5A5D66]">
                      {t("Venue & Meeting Spot")}
                    </div>
                    <div className="mt-0.5 text-sm font-bold text-[#1A1D24]">
                      {localizeMeetupText(meetup.venueName, locale)}
                    </div>
                    {meetup.meetingPoint && (
                      <div className="mt-0.5 text-xs text-[#5A5D66]">
                        {localizeMeetupText(meetup.meetingPoint, locale)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D98A2B]/15 text-[#9C5C14]">
                    <Wallet className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#5A5D66]">
                      {t("Cost / Warikan Note")}
                    </div>
                    <div className="mt-0.5 text-sm font-bold text-[#1A1D24]">
                      {localizeMeetupText(meetup.costNote, locale)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="font-display text-lg font-bold text-[#1A1D24]">
                  {t("About this Gathering")}
                </h2>
                <p className="mt-2.5 whitespace-pre-line text-[15px] leading-relaxed text-[#373A42]">
                  {localizeMeetupText(meetup.description, locale)}
                </p>

                {meetup.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {meetup.tags.map((tag) => (
                      <span
                        key={localizeMeetupText(tag, locale)}
                        className="rounded-full bg-[#F2EDE4] px-3 py-1 text-xs font-semibold text-[#5A5D66]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Attendee Roster */}
          <div className="rounded-3xl border border-[#E6E0D6] bg-white p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users className="h-5 w-5 text-[#D94E34]" />
                <h2 className="font-display text-xl font-bold text-[#1A1D24]">
                  {t("Who's Coming")} ({meetup.goingCount} / {meetup.maxAttendees})
                </h2>
              </div>
              {meetup.waitlistCount > 0 && (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                  {meetup.waitlistCount} {t("on waitlist")}
                </span>
              )}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {/* Host always included at the table */}
              <div className="flex items-start gap-3 rounded-2xl border border-[#D94E34]/30 bg-[#D94E34]/5 p-3.5">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: meetup.host.avatarColor }}
                >
                  {meetup.host.name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-bold text-[#1A1D24]">
                      {meetup.host.nationalityFlag} {meetup.host.name}
                    </span>
                    <span className="rounded-full bg-[#D94E34] px-2 py-0.5 text-[10px] font-bold text-white">
                      {t("Host")}
                    </span>
                  </div>
                  <div className="text-xs text-[#5A5D66]">
                    {t(meetup.host.roleLabel)} · {t(meetup.host.homeCity)}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {meetup.host.languages.slice(0, 3).map((l) => (
                      <span
                        key={l.lang}
                        className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-[#1A1D24] border border-[#E6E0D6]"
                      >
                        {l.lang} ({l.level})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {meetup.goingAttendees.map((att) => (
                <div
                  key={att.rsvpId}
                  className="flex items-start gap-3 rounded-2xl border border-[#E6E0D6] bg-[#FAF8F4]/70 p-3.5"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: att.avatarColor }}
                  >
                    {att.name[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-bold text-[#1A1D24]">
                        {att.nationalityFlag} {att.name}
                      </span>
                    </div>
                    <div className="text-xs text-[#5A5D66]">
                      {t(att.roleLabel)}
                      {att.speakingLanguage ? ` · ${att.speakingLanguage}` : ""}
                    </div>
                    {att.introNote && (
                      <p className="mt-1.5 text-xs italic text-[#373A42]">
                        &ldquo;{att.introNote}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {meetup.waitlistAttendees.length > 0 && (
              <div className="mt-5 border-t border-[#E6E0D6] pt-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#5A5D66]">
                  {t("Waitlist Queue")}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {meetup.waitlistAttendees.map((w, idx) => (
                    <span
                      key={w.rsvpId}
                      className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900"
                    >
                      <span>#{idx + 1}</span>
                      <span>{w.nationalityFlag}</span>
                      <span>{w.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Discussion / Q&A Thread */}
          <div className="rounded-3xl border border-[#E6E0D6] bg-white p-6 sm:p-7">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="h-5 w-5 text-[#2B4C7E]" />
              <h2 className="font-display text-xl font-bold text-[#1A1D24]">
                {t("Discussion & Questions")} ({meetup.comments.length})
              </h2>
            </div>
            <p className="mt-1 text-xs text-[#5A5D66]">
              {t("Ask about train exits, arriving slightly late, dietary preferences, or say hello before meeting!")}
            </p>

            {/* Comments List */}
            <div className="mt-5 space-y-3.5">
              {meetup.comments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#E6E0D6] bg-[#FAF8F4] px-4 py-6 text-center text-sm text-[#5A5D66]">
                  {t("No messages yet. Be the first to say")}{" "}
                  <span className="font-jp font-semibold">こんにちは!</span>
                </div>
              ) : (
                meetup.comments.map((c) => (
                  <div
                    key={c.id}
                    className={`rounded-2xl border p-4 ${
                      c.isPinned
                        ? "border-[#D94E34]/30 bg-[#D94E34]/5"
                        : "border-[#E6E0D6] bg-[#FAF8F4]/70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: c.userColor }}
                        >
                          {c.userName[0]}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-sm font-bold text-[#1A1D24]">
                              {c.userFlag} {c.userName}
                            </span>
                            {c.isHost && (
                              <span className="rounded-full bg-[#D94E34] px-2 py-0.5 text-[10px] font-bold text-white">
                                {t("Host")}
                              </span>
                            )}
                            {c.isPinned && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-[#D94E34] border border-[#D94E34]/20">
                                <Pin className="h-2.5 w-2.5" />
                                {t("Pinned note")}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#5A5D66]">
                            {t(c.userRole)} · {formatShortTimestamp(c.createdAt, locale)}
                          </div>
                        </div>
                      </div>

                      {(user?.id === c.userId || isHost) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(c.id)}
                          aria-label={t("Delete message")}
                          className="rounded-lg p-1.5 text-[#5A5D66] hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#1A1D24]">
                      {c.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Post Comment Form */}
            <form onSubmit={handlePostComment} className="mt-5">
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={
                    user
                      ? t("Write a question or say hello to the group...")
                      : t("Sign in to join the meetup discussion...")
                  }
                  className="flex-1 rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-4 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={commentLoading}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#1A1D24] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#D94E34] disabled:opacity-60"
                >
                  {commentLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {t("Post")}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Sticky Action Sidebar */}
        <div className="space-y-6 lg:col-span-4">
          <div className="sticky top-22 space-y-6">
            {/* RSVP / Host Control Card */}
            <div className="rounded-3xl border border-[#E6E0D6] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#1A1D24]">
                  {isFull
                    ? t("Table is currently full")
                    : `${spotsLeft} ${t(spotsLeft === 1 ? "spot remaining" : "spots remaining")}`}
                </span>
                <span className="text-xs font-semibold text-[#5A5D66]">
                  {meetup.goingCount} / {meetup.maxAttendees}
                </span>
              </div>
              <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-[#F2EDE4]">
                <div
                  className={`h-full rounded-full transition-all ${
                    isFull ? "bg-[#D98A2B]" : "bg-[#3E6B48]"
                  }`}
                  style={{ width: `${fillPercent}%` }}
                />
              </div>

              {rsvpFeedback && (
                <div className="mt-4 rounded-xl border border-[#3E6B48]/25 bg-[#3E6B48]/10 px-3.5 py-2.5 text-xs font-medium text-[#2A4C32]">
                  {rsvpFeedback}
                </div>
              )}

              {isHost ? (
                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-2 rounded-xl bg-[#D94E34]/10 px-3.5 py-2.5 text-xs font-semibold text-[#D94E34]">
                    <Sparkles className="h-4 w-4" />
                    {t("You are hosting this gathering")}
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-4 py-2.5 text-sm font-semibold text-[#1A1D24] transition hover:border-[#1A1D24]"
                  >
                    <Edit3 className="h-4 w-4" />
                    {t("Edit Details")}
                  </button>
                  {!deleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {t("Cancel Meetup")}
                    </button>
                  ) : (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
                      <p className="text-xs font-semibold text-red-800">
                        {t("Cancel and remove this meetup?")}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={handleDeleteMeetup}
                          className="flex-1 rounded-lg bg-red-600 py-1.5 text-xs font-semibold text-white"
                        >
                          {t("Yes, Delete")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(false)}
                          className="flex-1 rounded-lg bg-white py-1.5 text-xs font-semibold text-[#1A1D24] border border-[#E6E0D6]"
                        >
                          {t("Keep")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : meetup.viewerRsvpStatus === "going" ? (
                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-2 rounded-xl bg-[#3E6B48]/12 px-4 py-3 text-sm font-bold text-[#3E6B48]">
                    <CheckCircle2 className="h-5 w-5" />
                    {t("You're Confirmed!")}
                  </div>
                  <p className="text-xs text-[#5A5D66]">
                    {t("Look for the host at the venue. If your plans change, please cancel so someone else can join.")} {meetup.host.name} · {meetup.venueName}
                  </p>
                  <button
                    type="button"
                    disabled={rsvpLoading}
                    onClick={handleCancelRsvp}
                    className="w-full rounded-xl border border-[#E6E0D6] bg-white py-2.5 text-xs font-semibold text-[#5A5D66] transition hover:border-red-300 hover:text-red-600"
                  >
                    {rsvpLoading ? t("Updating...") : t("Cancel my RSVP")}
                  </button>
                </div>
              ) : meetup.viewerRsvpStatus === "waitlist" ? (
                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm font-bold text-amber-900">
                    <Clock className="h-5 w-5" />
                    {t("You're on the Waitlist")}
                  </div>
                  <p className="text-xs text-[#5A5D66]">
                    {t("You'll automatically be promoted to Going if a spot opens up.")}
                  </p>
                  <button
                    type="button"
                    disabled={rsvpLoading}
                    onClick={handleCancelRsvp}
                    className="w-full rounded-xl border border-[#E6E0D6] bg-white py-2.5 text-xs font-semibold text-[#5A5D66] hover:text-red-600"
                  >
                    {t("Leave Waitlist")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRsvp} className="mt-5 space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                      {t("Quick intro for the host (optional)")}
                    </label>
                    <textarea
                      rows={2}
                      value={introNote}
                      onChange={(e) => setIntroNote(e.target.value)}
                      placeholder={t("Hi! Visiting from Canada / living in Tokyo, excited to chat!")}
                      className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3 py-2 text-xs text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                      {t("Languages you'd like to speak")}
                    </label>
                    <input
                      type="text"
                      value={speakingLang}
                      onChange={(e) => setSpeakingLang(e.target.value)}
                      placeholder={t("e.g. English / Japanese (N4)") }
                      className="w-full rounded-xl border border-[#E6E0D6] bg-[#FAF8F4] px-3 py-2 text-xs text-[#1A1D24] outline-none focus:border-[#D94E34] focus:bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={rsvpLoading}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-sm transition disabled:opacity-60 ${
                      isFull
                        ? "bg-[#D98A2B] hover:bg-[#BF7620]"
                        : "bg-[#D94E34] hover:bg-[#C04028]"
                    }`}
                  >
                    {rsvpLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isFull ? t("Join Waitlist") : t("Join This Meetup")}
                  </button>
                </form>
              )}
            </div>

            {/* Host Card */}
            <div className="rounded-3xl border border-[#E6E0D6] bg-white p-6">
              <div className="text-xs font-bold uppercase tracking-wider text-[#5A5D66]">
                {t("Hosted By")}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
                  style={{ backgroundColor: meetup.host.avatarColor }}
                >
                  {meetup.host.name[0]}
                </span>
                <div>
                  <div className="text-base font-bold text-[#1A1D24]">
                    {meetup.host.nationalityFlag} {meetup.host.name}
                  </div>
                  <div className="text-xs text-[#5A5D66]">
                    {meetup.host.roleLabel} · {meetup.host.homeCity}
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-[#5A5D66]">
                {meetup.host.bio}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {meetup.host.languages.map((l) => (
                  <span
                    key={l.lang}
                    className="inline-flex items-center gap-1 rounded-full border border-[#E6E0D6] bg-[#FAF8F4] px-2.5 py-0.5 text-[11px] font-medium text-[#1A1D24]"
                  >
                    <Globe2 className="h-3 w-3 text-[#2B4C7E]" />
                    {t(l.lang)} · {t(l.level)}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#E6E0D6] pt-3.5 text-xs">
                <span className="font-semibold text-[#5A5D66]">
                  {meetup.host.hostedCount} {t("meetup")} {t("hosted")}
                </span>
                {!isHost && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!user) {
                        openAuthModal(t("Sign in to wave to the host"));
                        return;
                      }
                      setWaveOpen(true);
                      setWaveSent(false);
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-[#2B4C7E]/10 px-3 py-1 font-semibold text-[#2B4C7E] hover:bg-[#2B4C7E] hover:text-white transition"
                  >
                    <Hand className="h-3.5 w-3.5" />
                    {t("Say Hello")}
                  </button>
                )}
              </div>
            </div>

            {/* Handy Japan Meetup Phrase */}
            <div className="rounded-3xl border border-[#E6E0D6] bg-[#F2EDE4]/70 p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#D94E34]">
                {t("Handy Phrase for Today")}
              </div>
              <div className="mt-2 font-jp text-sm font-bold text-[#1A1D24]">
                {JAPAN_PHRASES[0].jp}
              </div>
              <div className="mt-0.5 text-xs italic text-[#5A5D66]">
                {JAPAN_PHRASES[0].romaji}
              </div>
              <div className="mt-1 text-xs text-[#1A1D24]">
                &ldquo;{t(JAPAN_PHRASES[0].en)}&rdquo;
              </div>
              <Link
                href="/guide"
                className="mt-3 inline-block text-xs font-semibold text-[#2B4C7E] hover:underline"
              >
                {t("Open full phrasebook & etiquette →")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Host Edit Meetup Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1D24]/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-[#E6E0D6] bg-[#FAF8F4] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-[#1A1D24]">
                {t("Edit Meetup Details")}
              </h3>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="rounded-full p-1.5 text-[#5A5D66] hover:bg-[#E6E0D6]/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                  {t("Title")}
                </label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#D94E34]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                  {t("Nearest Train Station & Exit")}
                </label>
                <input
                  type="text"
                  required
                  value={editForm.station}
                  onChange={(e) =>
                    setEditForm({ ...editForm, station: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#D94E34]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                  {t("Venue Name")}
                </label>
                <input
                  type="text"
                  required
                  value={editForm.venueName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, venueName: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#D94E34]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                  {t("Meeting Point Cue")}
                </label>
                <input
                  type="text"
                  value={editForm.meetingPoint}
                  onChange={(e) =>
                    setEditForm({ ...editForm, meetingPoint: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#D94E34]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                    {t("Capacity")}
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={30}
                    value={editForm.maxAttendees}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        maxAttendees: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#D94E34]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                    {t("Cost Note")}
                  </label>
                  <input
                    type="text"
                    value={editForm.costNote}
                    onChange={(e) =>
                      setEditForm({ ...editForm, costNote: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#D94E34]"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                  {t("Description")}
                </label>
                <textarea
                  rows={4}
                  required
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#D94E34]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="rounded-xl border border-[#E6E0D6] bg-white px-4 py-2 text-sm font-semibold"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="rounded-xl bg-[#D94E34] px-5 py-2 text-sm font-semibold text-white hover:bg-[#C04028]"
                >
                  {editLoading ? t("Saving...") : t("Save Changes")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Wave to Host Modal */}
      {waveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1D24]/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#E6E0D6] bg-[#FAF8F4] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-[#1A1D24]">
                {t("Send a Wave to")} {meetup.host.nationalityFlag} {meetup.host.name}
              </h3>
              <button
                type="button"
                onClick={() => setWaveOpen(false)}
                className="rounded-full p-1.5 text-[#5A5D66] hover:bg-[#E6E0D6]/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {waveSent ? (
              <div className="mt-4 space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#3E6B48]/15 text-[#3E6B48]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="text-sm text-[#1A1D24]">
                  {t("Your message was sent! You can track it in")}{" "}
                  <Link
                    href="/my-meetups?tab=connections"
                    className="font-semibold text-[#D94E34] underline"
                  >
                    {t("My Hub")}
                  </Link>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setWaveOpen(false)}
                  className="w-full rounded-xl bg-[#1A1D24] py-2.5 text-sm font-semibold text-white"
                >
                  {t("Done")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendWave} className="mt-4 space-y-3">
                <p className="text-xs text-[#5A5D66]">
                  {t("Introduce yourself or ask about grabbing a coffee around")}{" "}
                  {t(meetup.host.homeCity)}.
                </p>
                <textarea
                  rows={3}
                  required
                  minLength={5}
                  value={waveMsg}
                  onChange={(e) => setWaveMsg(e.target.value)}
                  placeholder={t("Write a friendly message to the host")}
                  className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#D94E34]"
                />
                <button
                  type="submit"
                  disabled={waveLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D94E34] py-2.5 text-sm font-semibold text-white hover:bg-[#C04028]"
                >
                  {waveLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t("Send Hello")}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
