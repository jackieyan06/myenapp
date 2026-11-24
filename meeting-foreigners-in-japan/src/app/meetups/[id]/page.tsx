import React from "react";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getMeetupDetail } from "@/lib/queries";
import { MeetupDetailClient } from "@/components/MeetupDetailClient";

export const dynamic = "force-dynamic";

export default async function MeetupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meetupId = Number(id);
  if (!Number.isInteger(meetupId) || meetupId <= 0) {
    notFound();
  }

  const user = await getCurrentUser();
  const detail = await getMeetupDetail(meetupId, user?.id ?? null);
  if (!detail) {
    notFound();
  }

  return <MeetupDetailClient initialMeetup={detail} />;
}
