import { db } from "@/db";
import {
  users,
  meetups,
  rsvps,
  comments,
  savedMeetups,
  connections,
  type UserLanguage,
} from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { eq, asc, desc, inArray } from "drizzle-orm";

export interface MeetupSummary {
  id: number;
  hostId: number;
  title: string;
  titleJp: string;
  category: string;
  city: string;
  neighborhood: string;
  station: string;
  venueName: string;
  meetingPoint: string;
  startsAt: string;
  durationMinutes: number;
  maxAttendees: number;
  costNote: string;
  languageFocus: string;
  languageLevel: string;
  description: string;
  tags: string[];
  coverImage: string;
  status: string;
  host: {
    id: number;
    name: string;
    roleLabel: string;
    nationality: string;
    nationalityFlag: string;
    avatarColor: string;
    isVerified: boolean;
  };
  goingCount: number;
  waitlistCount: number;
  commentCount: number;
  attendeePreviews: {
    id: number;
    name: string;
    nationalityFlag: string;
    avatarColor: string;
  }[];
  viewerRsvpStatus: string | null;
  isSaved: boolean;
}

export interface MeetupDetail extends MeetupSummary {
  host: {
    id: number;
    name: string;
    roleLabel: string;
    nationality: string;
    nationalityFlag: string;
    homeCity: string;
    neighborhood: string;
    languages: UserLanguage[];
    bio: string;
    avatarColor: string;
    isVerified: boolean;
    hostedCount: number;
  };
  goingAttendees: {
    rsvpId: number;
    userId: number;
    name: string;
    roleLabel: string;
    nationality: string;
    nationalityFlag: string;
    languages: UserLanguage[];
    avatarColor: string;
    introNote: string;
    speakingLanguage: string;
    createdAt: string;
  }[];
  waitlistAttendees: {
    rsvpId: number;
    userId: number;
    name: string;
    nationalityFlag: string;
    avatarColor: string;
    introNote: string;
    createdAt: string;
  }[];
  comments: {
    id: number;
    meetupId: number;
    userId: number;
    userName: string;
    userFlag: string;
    userRole: string;
    userColor: string;
    isHost: boolean;
    content: string;
    isPinned: boolean;
    createdAt: string;
  }[];
}

export interface CommunityMember {
  id: number;
  name: string;
  roleLabel: string;
  nationality: string;
  nationalityFlag: string;
  homeCity: string;
  neighborhood: string;
  languages: UserLanguage[];
  interests: string[];
  bio: string;
  avatarColor: string;
  isVerified: boolean;
  openToCoffee: boolean;
  hostedCount: number;
  goingCount: number;
}

export async function getMeetupsWithMeta(params: {
  city?: string;
  category?: string;
  languageFocus?: string;
  search?: string;
  openOnly?: boolean;
  viewerId?: number | null;
}): Promise<MeetupSummary[]> {
  await ensureSeeded();

  const allMeetups = await db
    .select()
    .from(meetups)
    .where(eq(meetups.status, "upcoming"))
    .orderBy(asc(meetups.startsAt));

  if (allMeetups.length === 0) return [];

  const allUsers = await db.select().from(users);
  const userMap = new Map(allUsers.map((u) => [u.id, u]));

  const meetupIds = allMeetups.map((m) => m.id);
  const allRsvps = await db
    .select()
    .from(rsvps)
    .where(inArray(rsvps.meetupId, meetupIds));
  const allComments = await db
    .select()
    .from(comments)
    .where(inArray(comments.meetupId, meetupIds));

  const savedSet = new Set<number>();
  if (params.viewerId) {
    const savedRows = await db
      .select()
      .from(savedMeetups)
      .where(eq(savedMeetups.userId, params.viewerId));
    for (const s of savedRows) savedSet.add(s.meetupId);
  }

  let results: MeetupSummary[] = allMeetups.map((m) => {
    const hostUser = userMap.get(m.hostId);
    const meetupRsvps = allRsvps.filter((r) => r.meetupId === m.id);
    const going = meetupRsvps.filter((r) => r.status === "going");
    const waitlist = meetupRsvps.filter((r) => r.status === "waitlist");
    const viewerRsvp = params.viewerId
      ? meetupRsvps.find((r) => r.userId === params.viewerId)
      : undefined;

    const attendeePreviews = going
      .slice(0, 5)
      .map((r) => {
        const u = userMap.get(r.userId);
        return u
          ? {
              id: u.id,
              name: u.name,
              nationalityFlag: u.nationalityFlag,
              avatarColor: u.avatarColor,
            }
          : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    return {
      id: m.id,
      hostId: m.hostId,
      title: m.title,
      titleJp: m.titleJp,
      category: m.category,
      city: m.city,
      neighborhood: m.neighborhood,
      station: m.station,
      venueName: m.venueName,
      meetingPoint: m.meetingPoint,
      startsAt: m.startsAt.toISOString(),
      durationMinutes: m.durationMinutes,
      maxAttendees: m.maxAttendees,
      costNote: m.costNote,
      languageFocus: m.languageFocus,
      languageLevel: m.languageLevel,
      description: m.description,
      tags: m.tags ?? [],
      coverImage: m.coverImage,
      status: m.status,
      host: {
        id: hostUser?.id ?? m.hostId,
        name: hostUser?.name ?? "Community Host",
        roleLabel: hostUser?.roleLabel ?? "Host",
        nationality: hostUser?.nationality ?? "Japan",
        nationalityFlag: hostUser?.nationalityFlag ?? "🇯🇵",
        avatarColor: hostUser?.avatarColor ?? "#D94E34",
        isVerified: hostUser?.isVerified ?? true,
      },
      goingCount: going.length + 1, // +1 includes the host at the table
      waitlistCount: waitlist.length,
      commentCount: allComments.filter((c) => c.meetupId === m.id).length,
      attendeePreviews,
      viewerRsvpStatus: viewerRsvp?.status ?? null,
      isSaved: savedSet.has(m.id),
    };
  });

  if (params.city && params.city !== "All") {
    results = results.filter((m) => m.city === params.city);
  }
  if (params.category && params.category !== "All") {
    results = results.filter((m) => m.category === params.category);
  }
  if (params.languageFocus && params.languageFocus !== "All") {
    results = results.filter((m) => m.languageFocus === params.languageFocus);
  }
  if (params.openOnly) {
    results = results.filter((m) => m.goingCount < m.maxAttendees);
  }
  if (params.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    results = results.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.titleJp.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.neighborhood.toLowerCase().includes(q) ||
        m.station.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.host.name.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return results;
}

export async function getMeetupDetail(
  meetupId: number,
  viewerId?: number | null
): Promise<MeetupDetail | null> {
  await ensureSeeded();

  const [m] = await db
    .select()
    .from(meetups)
    .where(eq(meetups.id, meetupId))
    .limit(1);
  if (!m) return null;

  const allUsers = await db.select().from(users);
  const userMap = new Map(allUsers.map((u) => [u.id, u]));

  const hostUser = userMap.get(m.hostId);
  const hostMeetups = await db
    .select()
    .from(meetups)
    .where(eq(meetups.hostId, m.hostId));

  const meetupRsvps = await db
    .select()
    .from(rsvps)
    .where(eq(rsvps.meetupId, m.id))
    .orderBy(asc(rsvps.createdAt));

  const meetupComments = await db
    .select()
    .from(comments)
    .where(eq(comments.meetupId, m.id))
    .orderBy(desc(comments.isPinned), asc(comments.createdAt));

  let isSaved = false;
  if (viewerId) {
    const saved = await db
      .select()
      .from(savedMeetups)
      .where(eq(savedMeetups.userId, viewerId));
    isSaved = saved.some((s) => s.meetupId === m.id);
  }

  const goingRsvps = meetupRsvps.filter((r) => r.status === "going");
  const waitlistRsvps = meetupRsvps.filter((r) => r.status === "waitlist");
  const viewerRsvp = viewerId
    ? meetupRsvps.find((r) => r.userId === viewerId)
    : undefined;

  return {
    id: m.id,
    hostId: m.hostId,
    title: m.title,
    titleJp: m.titleJp,
    category: m.category,
    city: m.city,
    neighborhood: m.neighborhood,
    station: m.station,
    venueName: m.venueName,
    meetingPoint: m.meetingPoint,
    startsAt: m.startsAt.toISOString(),
    durationMinutes: m.durationMinutes,
    maxAttendees: m.maxAttendees,
    costNote: m.costNote,
    languageFocus: m.languageFocus,
    languageLevel: m.languageLevel,
    description: m.description,
    tags: m.tags ?? [],
    coverImage: m.coverImage,
    status: m.status,
    goingCount: goingRsvps.length + 1,
    waitlistCount: waitlistRsvps.length,
    commentCount: meetupComments.length,
    attendeePreviews: goingRsvps.slice(0, 5).map((r) => {
      const u = userMap.get(r.userId);
      return {
        id: u?.id ?? r.userId,
        name: u?.name ?? "Member",
        nationalityFlag: u?.nationalityFlag ?? "🌏",
        avatarColor: u?.avatarColor ?? "#2B4C7E",
      };
    }),
    viewerRsvpStatus: viewerRsvp?.status ?? null,
    isSaved,
    host: {
      id: hostUser?.id ?? m.hostId,
      name: hostUser?.name ?? "Community Host",
      roleLabel: hostUser?.roleLabel ?? "Host",
      nationality: hostUser?.nationality ?? "Japan",
      nationalityFlag: hostUser?.nationalityFlag ?? "🇯🇵",
      homeCity: hostUser?.homeCity ?? m.city,
      neighborhood: hostUser?.neighborhood ?? m.neighborhood,
      languages: hostUser?.languages ?? [],
      bio: hostUser?.bio ?? "",
      avatarColor: hostUser?.avatarColor ?? "#D94E34",
      isVerified: hostUser?.isVerified ?? true,
      hostedCount: hostMeetups.length,
    },
    goingAttendees: goingRsvps.map((r) => {
      const u = userMap.get(r.userId);
      return {
        rsvpId: r.id,
        userId: r.userId,
        name: u?.name ?? "Member",
        roleLabel: u?.roleLabel ?? "Member",
        nationality: u?.nationality ?? "International",
        nationalityFlag: u?.nationalityFlag ?? "🌏",
        languages: u?.languages ?? [],
        avatarColor: u?.avatarColor ?? "#2B4C7E",
        introNote: r.introNote,
        speakingLanguage: r.speakingLanguage,
        createdAt: r.createdAt.toISOString(),
      };
    }),
    waitlistAttendees: waitlistRsvps.map((r) => {
      const u = userMap.get(r.userId);
      return {
        rsvpId: r.id,
        userId: r.userId,
        name: u?.name ?? "Member",
        nationalityFlag: u?.nationalityFlag ?? "🌏",
        avatarColor: u?.avatarColor ?? "#5A5D66",
        introNote: r.introNote,
        createdAt: r.createdAt.toISOString(),
      };
    }),
    comments: meetupComments.map((c) => {
      const u = userMap.get(c.userId);
      return {
        id: c.id,
        meetupId: c.meetupId,
        userId: c.userId,
        userName: u?.name ?? "Member",
        userFlag: u?.nationalityFlag ?? "🌏",
        userRole: u?.roleLabel ?? "Member",
        userColor: u?.avatarColor ?? "#2B4C7E",
        isHost: c.userId === m.hostId,
        content: c.content,
        isPinned: c.isPinned,
        createdAt: c.createdAt.toISOString(),
      };
    }),
  };
}

export async function getCommunityMembers(params?: {
  city?: string;
  roleLabel?: string;
  search?: string;
}): Promise<CommunityMember[]> {
  await ensureSeeded();

  const allUsers = await db.select().from(users).orderBy(asc(users.id));
  const allMeetups = await db.select().from(meetups);
  const allRsvps = await db
    .select()
    .from(rsvps)
    .where(eq(rsvps.status, "going"));

  let members: CommunityMember[] = allUsers.map((u) => ({
    id: u.id,
    name: u.name,
    roleLabel: u.roleLabel,
    nationality: u.nationality,
    nationalityFlag: u.nationalityFlag,
    homeCity: u.homeCity,
    neighborhood: u.neighborhood,
    languages: u.languages ?? [],
    interests: u.interests ?? [],
    bio: u.bio,
    avatarColor: u.avatarColor,
    isVerified: u.isVerified,
    openToCoffee: u.openToCoffee,
    hostedCount: allMeetups.filter((m) => m.hostId === u.id).length,
    goingCount: allRsvps.filter((r) => r.userId === u.id).length,
  }));

  if (params?.city && params.city !== "All") {
    members = members.filter((m) => m.homeCity === params.city);
  }
  if (params?.roleLabel && params.roleLabel !== "All") {
    members = members.filter((m) => m.roleLabel === params.roleLabel);
  }
  if (params?.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    members = members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.nationality.toLowerCase().includes(q) ||
        m.homeCity.toLowerCase().includes(q) ||
        m.neighborhood.toLowerCase().includes(q) ||
        m.bio.toLowerCase().includes(q) ||
        m.languages.some((l) => l.lang.toLowerCase().includes(q)) ||
        m.interests.some((i) => i.toLowerCase().includes(q))
    );
  }

  return members;
}

export async function getUserHubData(userId: number) {
  await ensureSeeded();

  const allMeetups = await getMeetupsWithMeta({ viewerId: userId });
  const hosting = allMeetups.filter((m) => m.hostId === userId);
  const attending = allMeetups.filter(
    (m) =>
      m.viewerRsvpStatus === "going" || m.viewerRsvpStatus === "waitlist"
  );
  const saved = allMeetups.filter((m) => m.isSaved);

  const allUsers = await db.select().from(users);
  const userMap = new Map(allUsers.map((u) => [u.id, u]));

  const allConnections = await db
    .select()
    .from(connections)
    .orderBy(desc(connections.createdAt));

  const incoming = allConnections
    .filter((c) => c.receiverId === userId)
    .map((c) => {
      const peer = userMap.get(c.senderId);
      return {
        id: c.id,
        direction: "incoming" as const,
        message: c.message,
        meetupContext: c.meetupContext,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
        peer: {
          id: peer?.id ?? c.senderId,
          name: peer?.name ?? "Member",
          nationality: peer?.nationality ?? "International",
          nationalityFlag: peer?.nationalityFlag ?? "🌏",
          homeCity: peer?.homeCity ?? "Japan",
          roleLabel: peer?.roleLabel ?? "Member",
          avatarColor: peer?.avatarColor ?? "#2B4C7E",
        },
      };
    });

  const outgoing = allConnections
    .filter((c) => c.senderId === userId)
    .map((c) => {
      const peer = userMap.get(c.receiverId);
      return {
        id: c.id,
        direction: "outgoing" as const,
        message: c.message,
        meetupContext: c.meetupContext,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
        peer: {
          id: peer?.id ?? c.receiverId,
          name: peer?.name ?? "Member",
          nationality: peer?.nationality ?? "International",
          nationalityFlag: peer?.nationalityFlag ?? "🌏",
          homeCity: peer?.homeCity ?? "Japan",
          roleLabel: peer?.roleLabel ?? "Member",
          avatarColor: peer?.avatarColor ?? "#2B4C7E",
        },
      };
    });

  return {
    hosting,
    attending,
    saved,
    connections: [...incoming, ...outgoing].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
  };
}
