import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { getUserHubData } from "@/lib/queries";
import { MyHubClient } from "@/components/MyHubClient";

export const dynamic = "force-dynamic";

export default async function MyMeetupsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const sp = await searchParams;
  const user = await getCurrentUser();
  const hubData = user ? await getUserHubData(user.id) : null;

  const activeTab = sp?.tab || "attending";
  return (
    <MyHubClient
      key={`${user?.id ?? "anon"}-${activeTab}`}
      initialTab={activeTab}
      hubData={hubData}
    />
  );
}
