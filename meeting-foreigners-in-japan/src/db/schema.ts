import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export interface UserLanguage {
  lang: string;
  level: string;
}

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  roleLabel: text("role_label").notNull().default("Expat in Japan"),
  nationality: text("nationality").notNull().default("International"),
  nationalityFlag: text("nationality_flag").notNull().default("🌏"),
  homeCity: text("home_city").notNull().default("Tokyo"),
  neighborhood: text("neighborhood").notNull().default(""),
  languages: jsonb("languages").$type<UserLanguage[]>().notNull().default([]),
  interests: jsonb("interests").$type<string[]>().notNull().default([]),
  bio: text("bio").notNull().default(""),
  avatarColor: text("avatar_color").notNull().default("#D94E34"),
  isVerified: boolean("is_verified").notNull().default(true),
  openToCoffee: boolean("open_to_coffee").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const meetups = pgTable("meetups", {
  id: serial("id").primaryKey(),
  hostId: integer("host_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  titleJp: text("title_jp").notNull().default(""),
  category: text("category").notNull(),
  city: text("city").notNull(),
  neighborhood: text("neighborhood").notNull(),
  station: text("station").notNull(),
  venueName: text("venue_name").notNull(),
  meetingPoint: text("meeting_point").notNull().default(""),
  startsAt: timestamp("starts_at").notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(120),
  maxAttendees: integer("max_attendees").notNull().default(10),
  costNote: text("cost_note").notNull().default("Free · Order your own drink"),
  languageFocus: text("language_focus").notNull().default("Bilingual EN / JP"),
  languageLevel: text("language_level").notNull().default("All Levels Welcome"),
  description: text("description").notNull(),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  coverImage: text("cover_image")
    .notNull()
    .default("/images/meetup-language-shibuya.jpg"),
  status: text("status").notNull().default("upcoming"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rsvps = pgTable(
  "rsvps",
  {
    id: serial("id").primaryKey(),
    meetupId: integer("meetup_id")
      .notNull()
      .references(() => meetups.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("going"),
    introNote: text("intro_note").notNull().default(""),
    speakingLanguage: text("speaking_language").notNull().default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("rsvps_meetup_user_idx").on(table.meetupId, table.userId),
  ]
);

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  meetupId: integer("meetup_id")
    .notNull()
    .references(() => meetups.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  isPinned: boolean("is_pinned").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedMeetups = pgTable(
  "saved_meetups",
  {
    id: serial("id").primaryKey(),
    meetupId: integer("meetup_id")
      .notNull()
      .references(() => meetups.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("saved_meetups_meetup_user_idx").on(table.meetupId, table.userId),
  ]
);

export const connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  receiverId: integer("receiver_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  meetupContext: text("meetup_context")
    .notNull()
    .default("Coffee & Language Chat"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
