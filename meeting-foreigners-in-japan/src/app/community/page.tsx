import React from "react";
import { getCommunityMembers } from "@/lib/queries";
import { CommunityDirectoryClient } from "@/components/CommunityDirectoryClient";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const members = await getCommunityMembers();
  return <CommunityDirectoryClient initialMembers={members} />;
}
