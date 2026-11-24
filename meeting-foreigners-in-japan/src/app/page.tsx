import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { getMeetupsWithMeta, getCommunityMembers } from "@/lib/queries";
import { HomeDiscoveryClient } from "@/components/HomeDiscoveryClient";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const sp = await searchParams;
  const user = await getCurrentUser();
  const [meetups, members] = await Promise.all([
    getMeetupsWithMeta({ viewerId: user?.id ?? null }),
    getCommunityMembers(),
  ]);

  const initialCity = sp?.city || "All";

  return (
    <HomeDiscoveryClient
      key={`${initialCity}-${user?.id ?? "anon"}`}
      initialMeetups={meetups}
      initialCity={initialCity}
      totalMembers={members.length}
    />
  );
}
