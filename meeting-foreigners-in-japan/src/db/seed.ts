import { db } from "@/db";
import {
  users,
  meetups,
  rsvps,
  comments,
  connections,
  savedMeetups,
} from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { count } from "drizzle-orm";

let seedPromise: Promise<void> | null = null;

function addDays(base: Date, days: number, hour: number, minute = 0): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

export async function ensureSeeded() {
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    try {
      const [{ value: userCount }] = await db
        .select({ value: count() })
        .from(users);
      if (Number(userCount) > 0) return;

      const demoPassHash = hashPassword("demo1234");
      const now = new Date();

      const insertedUsers = await db
        .insert(users)
        .values([
          {
            email: "hana@en-japan.jp",
            passwordHash: demoPassHash,
            name: "Hana Sato",
            roleLabel: "Japanese Local",
            nationality: "Japan",
            nationalityFlag: "🇯🇵",
            homeCity: "Tokyo",
            neighborhood: "Shimokitazawa",
            languages: [
              { lang: "Japanese", level: "Native" },
              { lang: "English", level: "Fluent" },
              { lang: "Spanish", level: "Beginner" },
            ],
            interests: [
              "Kissaten Coffee",
              "Language Exchange",
              "Indie Cinema",
              "Neighborhood Walks",
            ],
            bio: "Born in Tokyo and spent two years studying in Melbourne. Love showing newcomers hidden kissaten coffee shops in Shimokitazawa and practicing casual Japanese & English.",
            avatarColor: "#D94E34",
            isVerified: true,
            openToCoffee: true,
          },
          {
            email: "lucas@en-japan.jp",
            passwordHash: demoPassHash,
            name: "Lucas Meyer",
            roleLabel: "Expat in Japan",
            nationality: "Germany",
            nationalityFlag: "🇩🇪",
            homeCity: "Tokyo",
            neighborhood: "Daikanyama",
            languages: [
              { lang: "German", level: "Native" },
              { lang: "English", level: "Fluent" },
              { lang: "Japanese", level: "Conversational (N3)" },
            ],
            interests: [
              "Coworking & Tech",
              "Specialty Coffee",
              "Running",
              "Izakaya Hopping",
            ],
            bio: "Product engineer from Berlin living in Tokyo for 1.5 years. Always happy to trade tips on Tokyo apartments, remote work cafes, and JLPT N3 study routines.",
            avatarColor: "#2B4C7E",
            isVerified: true,
            openToCoffee: true,
          },
          {
            email: "maya@en-japan.jp",
            passwordHash: demoPassHash,
            name: "Maya Lin",
            roleLabel: "Traveler / Visitor",
            nationality: "Taiwan",
            nationalityFlag: "🇹🇼",
            homeCity: "Kyoto",
            neighborhood: "Kawaramachi",
            languages: [
              { lang: "Mandarin", level: "Native" },
              { lang: "English", level: "Fluent" },
              { lang: "Japanese", level: "Beginner (N4)" },
            ],
            interests: [
              "Architecture",
              "Matcha & Tea Houses",
              "Evening Strolls",
              "Film Photography",
            ],
            bio: "Illustrator spending 6 weeks in Kyoto sketching machiya townhouses and shrines. Looking to meet friendly locals and travelers for evening Kamo River walks!",
            avatarColor: "#3E6B48",
            isVerified: true,
            openToCoffee: true,
          },
          {
            email: "kenji@en-japan.jp",
            passwordHash: demoPassHash,
            name: "Kenji Takahashi",
            roleLabel: "Japanese Local",
            nationality: "Japan",
            nationalityFlag: "🇯🇵",
            homeCity: "Osaka",
            neighborhood: "Namba",
            languages: [
              { lang: "Japanese", level: "Native" },
              { lang: "English", level: "Conversational" },
            ],
            interests: [
              "Osaka Street Food",
              "Izakaya & Dining",
              "Baseball",
              "Comedy",
            ],
            bio: "Osaka native and foodie! I host relaxed izakaya nights in Ura-Namba so visitors can taste real Kansai hospitality without worrying about Japanese menus.",
            avatarColor: "#D98A2B",
            isVerified: true,
            openToCoffee: true,
          },
          {
            email: "sophie@en-japan.jp",
            passwordHash: demoPassHash,
            name: "Sophie Laurent",
            roleLabel: "Exchange Student",
            nationality: "France",
            nationalityFlag: "🇫🇷",
            homeCity: "Kyoto",
            neighborhood: "Sakyo-ku",
            languages: [
              { lang: "French", level: "Native" },
              { lang: "English", level: "Fluent" },
              { lang: "Japanese", level: "Intermediate (N2)" },
            ],
            interests: [
              "Traditional Crafts",
              "Hiking",
              "Bakery Hopping",
              "Cultural Exchange",
            ],
            bio: "Studying Japanese urban design at Kyoto University. Love morning hikes up Mt. Daimonji and introducing travelers to quiet neighborhood temples.",
            avatarColor: "#7B4B94",
            isVerified: true,
            openToCoffee: true,
          },
          {
            email: "daniel@en-japan.jp",
            passwordHash: demoPassHash,
            name: "Daniel Park",
            roleLabel: "Digital Nomad",
            nationality: "South Korea",
            nationalityFlag: "🇰🇷",
            homeCity: "Fukuoka",
            neighborhood: "Tenjin",
            languages: [
              { lang: "Korean", level: "Native" },
              { lang: "English", level: "Fluent" },
              { lang: "Japanese", level: "Conversational" },
            ],
            interests: [
              "Seaside Coffee",
              "Startups",
              "Ramen",
              "Surfing",
            ],
            bio: "Remote UX researcher splitting time between Seoul and Fukuoka. Fukuoka's coastal vibe and friendly locals are unbeatable—join our weekend beach coffee!",
            avatarColor: "#1F7A8C",
            isVerified: true,
            openToCoffee: true,
          },
          {
            email: "liam@en-japan.jp",
            passwordHash: demoPassHash,
            name: "Liam O'Connor",
            roleLabel: "Expat in Japan",
            nationality: "Australia",
            nationalityFlag: "🇦🇺",
            homeCity: "Sapporo",
            neighborhood: "Odori",
            languages: [
              { lang: "English", level: "Native" },
              { lang: "Japanese", level: "Conversational" },
            ],
            interests: [
              "Board Games",
              "Craft Coffee",
              "Snowboarding",
              "Cooking",
            ],
            bio: "English teacher and board game nerd living in Sapporo for 3 years. Always welcoming new arrivals to Hokkaido for cozy timber-lounge game nights.",
            avatarColor: "#4A6FA5",
            isVerified: true,
            openToCoffee: true,
          },
          {
            email: "priya@en-japan.jp",
            passwordHash: demoPassHash,
            name: "Priya Sharma",
            roleLabel: "Expat in Japan",
            nationality: "India",
            nationalityFlag: "🇮🇳",
            homeCity: "Yokohama",
            neighborhood: "Minato Mirai",
            languages: [
              { lang: "English", level: "Native" },
              { lang: "Hindi", level: "Native" },
              { lang: "Japanese", level: "Beginner (N4)" },
            ],
            interests: [
              "Harbor Walks",
              "Vegetarian Food",
              "Language Exchange",
              "Tech",
            ],
            bio: "Data analyst who recently relocated to Yokohama! Looking to make international and Japanese friends around Kanagawa and Tokyo.",
            avatarColor: "#B84A62",
            isVerified: true,
            openToCoffee: true,
          },
        ])
        .returning();

      const [hana, lucas, maya, kenji, sophie, daniel, liam, priya] =
        insertedUsers;

      const insertedMeetups = await db
        .insert(meetups)
        .values([
          {
            hostId: hana.id,
            title: "Shibuya Morning Coffee & 50/50 Language Table",
            titleJp: "渋谷モーニング・日英カフェ交流",
            category: "Language Exchange",
            city: "Tokyo",
            neighborhood: "Shibuya",
            station: "Shibuya Station (Hachiko Exit, 4 min walk)",
            venueName: "Kissa & Roastery Mame (2F Communal Table)",
            meetingPoint:
              "Head to the 2nd floor communal cedar table. Look for the small red notebook on the table.",
            startsAt: addDays(now, 2, 10, 30),
            durationMinutes: 120,
            maxAttendees: 8,
            costNote: "Free · Order your own drink (~¥650)",
            languageFocus: "Bilingual EN / JP",
            languageLevel: "All Levels Welcome",
            description:
              "Start your morning with relaxed conversation in both English and Japanese! We alternate 25 minutes in Japanese and 25 minutes in English so everyone gets comfortable practice regardless of level. Beginners are warmly welcome—no textbooks needed, just bring curiosity and your favorite coffee order.",
            tags: ["Beginner Friendly", "50/50 EN-JP", "Specialty Coffee"],
            coverImage: "/images/meetup-language-shibuya.jpg",
            status: "upcoming",
          },
          {
            hostId: maya.id,
            title: "Twilight Lantern Walk Along Kamo River & Pontocho",
            titleJp: "鴨川・先斗町 夕暮れ散歩と抹茶タイム",
            category: "City Walk & Culture",
            city: "Kyoto",
            neighborhood: "Kawaramachi / Gion",
            station: "Gion-Shijo Station (Exit 4, right by the bridge)",
            venueName: "Izumo no Okuni Statue → Pontocho → Kamo Riverbank",
            meetingPoint:
              "Meet beside the Izumo no Okuni bronze statue outside Gion-Shijo Exit 4. I'll wear a forest-green tote bag.",
            startsAt: addDays(now, 3, 17, 30),
            durationMinutes: 150,
            maxAttendees: 10,
            costNote: "Free walk · Optional ¥800 matcha stop",
            languageFocus: "English & International",
            languageLevel: "All Levels Welcome",
            description:
              "Join travelers, Kyoto students, and locals for an easygoing blue-hour walk along the Kamo River and historic wooden alleys of Pontocho. We'll pause for photos as paper lanterns light up and end at a cozy teahouse near Kiyamachi for warm hojicha and stories from around the world.",
            tags: ["Travelers Welcome", "Photography", "Evening Walk"],
            coverImage: "/images/meetup-kyoto-walk.jpg",
            status: "upcoming",
          },
          {
            hostId: kenji.id,
            title: "Ura-Namba Cozy Izakaya Night (English Menu Help!)",
            titleJp: "裏なんば・みんなでわいわい居酒屋ナイト",
            category: "Izakaya & Dining",
            city: "Osaka",
            neighborhood: "Namba",
            station: "Nankai Namba Station (South Exit, 3 min walk)",
            venueName: "Yakitori & Kushikatsu Toranosuke",
            meetingPoint:
              "Meet outside Nankai Namba South Exit Ticket Gate at 18:50, then we'll walk 3 minutes together.",
            startsAt: addDays(now, 4, 19, 0),
            durationMinutes: 150,
            maxAttendees: 8,
            costNote: "Split bill (Warikan) ~¥2,800–¥3,500 · Bring cash just in case",
            languageFocus: "Bilingual EN / JP",
            languageLevel: "Beginner Friendly",
            description:
              "Always wanted to experience an authentic local Osaka izakaya without being intimidated by handwritten Japanese menus? I'll translate everything, help order classics like yakitori, dashimaki tamago, and okonomiyaki, and introduce you to Kansai dialect phrases over drinks or oolong tea!",
            tags: ["Local Foodie", "Vegetarian Options", "Cash Recommended"],
            coverImage: "/images/meetup-osaka-izakaya.jpg",
            status: "upcoming",
          },
          {
            hostId: lucas.id,
            title: "Daikanyama Remote Workers & Creators Coworking Coffee",
            titleJp: "代官山コワーキング＆クリエイター交流",
            category: "Coworking & Tech",
            city: "Tokyo",
            neighborhood: "Daikanyama",
            station: "Daikanyama Station (Central Exit, 3 min walk)",
            venueName: "Atelier Cedar Lounge (near T-Site)",
            meetingPoint:
              "Large concrete-and-oak lounge table near the courtyard window. Ask the barista for Lucas's group.",
            startsAt: addDays(now, 5, 14, 0),
            durationMinutes: 180,
            maxAttendees: 10,
            costNote: "Free entry · ¥600–¥1,000 café order",
            languageFocus: "English & International",
            languageLevel: "All Levels Welcome",
            description:
              "Bring your laptop, sketchbook, or current side project! We spend the first 90 minutes in focused quiet coworking (great Wi-Fi & outlets) followed by casual roundtable intros and coffee chats. Ideal for expats, remote workers, and Japanese designers/engineers looking to expand their network.",
            tags: ["Fast Wi-Fi", "Remote Work", "Design & Tech"],
            coverImage: "/images/meetup-tokyo-tech.jpg",
            status: "upcoming",
          },
          {
            hostId: daniel.id,
            title: "Momochi Seaside Sunset Coffee & International Picnic",
            titleJp: "百道浜サンセット・海辺カフェピクニック",
            category: "Coffee & Café",
            city: "Fukuoka",
            neighborhood: "Momochi Seaside",
            station: "Nishijin Station (Exit 1, 12 min walk to beach)",
            venueName: "Momochi Seaside Park Lawn (near Marizon pier)",
            meetingPoint:
              "On the grassy lawn just west of the Marizon archway—look for the striped picnic blanket!",
            startsAt: addDays(now, 6, 16, 0),
            durationMinutes: 120,
            maxAttendees: 12,
            costNote: "Free · Grab a coffee or snack from nearby cafés",
            languageFocus: "Multilingual Mix",
            languageLevel: "All Levels Welcome",
            description:
              "Fukuoka's best-kept secret is how relaxed life feels by the sea. Come unwind with expats, Korean/Taiwanese travelers, and local Kyushu students. Bring a takeaway iced latte or convenience store snacks and watch the sunset over Hakata Bay.",
            tags: ["Ocean View", "Picnic", "Laid-back"],
            coverImage: "/images/meetup-fukuoka-beach.jpg",
            status: "upcoming",
          },
          {
            hostId: liam.id,
            title: "Sapporo Timber Lounge: Hojicha & Strategy Board Games",
            titleJp: "札幌ボードゲーム＆ほうじ茶ナイト",
            category: "Board Games",
            city: "Sapporo",
            neighborhood: "Odori",
            station: "Odori Station (Exit 10, 2 min walk)",
            venueName: "Kita Café & Table Games",
            meetingPoint:
              "Upstairs wooden loft area—our reservation is under 'En Meetup'.",
            startsAt: addDays(now, 7, 18, 30),
            durationMinutes: 150,
            maxAttendees: 8,
            costNote: "¥1,000 table fee includes 1 hojicha or craft soda",
            languageFocus: "Bilingual EN / JP",
            languageLevel: "Beginner Friendly",
            description:
              "Easy-to-learn language-friendly games like Codenames Pictures, Azul, Scout, and Splendor! Games are one of the best icebreakers when speaking a second language because rules are visual and fun. Solo attendees always welcome—we teach all rules in 5 minutes.",
            tags: ["Solo Friendly", "Games Included", "Warm & Cozy"],
            coverImage: "/images/meetup-sapporo-craft.jpg",
            status: "upcoming",
          },
          {
            hostId: priya.id,
            title: "Yokohama Harbor Breeze Walk & Chinatown Tea Stop",
            titleJp: "横浜みなとみらい散歩＆中華街お茶会",
            category: "City Walk & Culture",
            city: "Yokohama",
            neighborhood: "Minato Mirai",
            station: "Nihon-Odori Station (Exit 2, 3 min walk)",
            venueName: "Osanbashi Pier → Yamashita Park → Chinatown Tea House",
            meetingPoint:
              "Meet outside Nihon-Odori Station Exit 2 (above ground by the brick courthouse).",
            startsAt: addDays(now, 8, 13, 30),
            durationMinutes: 150,
            maxAttendees: 10,
            costNote: "Free walk · Optional ¥700 tea & dumplings",
            languageFocus: "English & International",
            languageLevel: "All Levels Welcome",
            description:
              "Escape the Tokyo rush for a breezy afternoon by Yokohama's waterfront! Great chance for Tokyo/Kanagawa residents and short-term visitors to mingle while strolling across the wooden deck of Osanbashi Pier and sampling oolong tea in Chinatown.",
            tags: ["Waterfront", "Weekend", "Beginner Friendly"],
            coverImage: "/images/hero-tokyo-cafe.jpg",
            status: "upcoming",
          },
          {
            hostId: sophie.id,
            title: "Shimokitazawa Vinyl Kissaten & Gentle Japanese Practice",
            titleJp: "下北沢レトロ喫茶・やさしい日本語",
            category: "Coffee & Café",
            city: "Tokyo",
            neighborhood: "Shimokitazawa",
            station: "Shimokitazawa Station (East Exit, 4 min walk)",
            venueName: "Kissa Komorebi (Showa-era Jazz & Coffee)",
            meetingPoint:
              "Meet 5 minutes early outside East Exit next to the vintage record shop billboard.",
            startsAt: addDays(now, 10, 15, 0),
            durationMinutes: 90,
            maxAttendees: 6,
            costNote: "Free · Order 1 drink at the café (~¥600)",
            languageFocus: "Japanese Immersion",
            languageLevel: "Intermediate+",
            description:
              "An intimate 6-person table in Shimokitazawa's cozy vintage neighborhood. We practice Yasashii Nihongo (gentle, clear Japanese) with patient locals over hand-drip coffee and pudding. Perfect if you're at N4–N2 and want real conversational confidence!",
            tags: ["Small Group", "Gentle Japanese", "Vintage Vibes"],
            coverImage: "/images/hero-tokyo-cafe.jpg",
            status: "upcoming",
          },
        ])
        .returning();

      const [m1, m2, m3, m4, m5, m6, m7, m8] = insertedMeetups;

      await db.insert(rsvps).values([
        {
          meetupId: m1.id,
          userId: lucas.id,
          status: "going",
          introNote: "Coming from Daikanyama! Excited to practice N3 Japanese.",
          speakingLanguage: "German / English / JP (N3)",
        },
        {
          meetupId: m1.id,
          userId: priya.id,
          status: "going",
          introNote: "First month in Japan—can't wait to meet everyone!",
          speakingLanguage: "English / Hindi / JP (N4)",
        },
        {
          meetupId: m1.id,
          userId: maya.id,
          status: "going",
          introNote: "Stopping by Tokyo for a couple days before heading back to Kyoto.",
          speakingLanguage: "Mandarin / English / JP (N4)",
        },
        {
          meetupId: m2.id,
          userId: sophie.id,
          status: "going",
          introNote: "I know a great tucked-away matcha bar near Kiyamachi!",
          speakingLanguage: "French / English / JP (N2)",
        },
        {
          meetupId: m2.id,
          userId: hana.id,
          status: "going",
          introNote: "Visiting Kyoto that weekend—count me in!",
          speakingLanguage: "Japanese / English",
        },
        {
          meetupId: m3.id,
          userId: lucas.id,
          status: "going",
          introNote: "Taking the Shinkansen down for Osaka food!",
          speakingLanguage: "German / English / JP",
        },
        {
          meetupId: m3.id,
          userId: daniel.id,
          status: "going",
          introNote: "Always up for real Osaka yakitori.",
          speakingLanguage: "Korean / English / JP",
        },
        {
          meetupId: m4.id,
          userId: hana.id,
          status: "going",
          introNote: "Bringing my laptop to work on a photography portfolio.",
          speakingLanguage: "Japanese / English",
        },
        {
          meetupId: m4.id,
          userId: priya.id,
          status: "going",
          introNote: "Happy to chat about moving to Japan & tech work.",
          speakingLanguage: "English / Hindi",
        },
        {
          meetupId: m5.id,
          userId: kenji.id,
          status: "going",
          introNote: "Visiting Fukuoka for a conference, see you at the beach!",
          speakingLanguage: "Japanese / English",
        },
        {
          meetupId: m6.id,
          userId: sophie.id,
          status: "going",
          introNote: "Love Azul and Scout!",
          speakingLanguage: "French / English / JP",
        },
        {
          meetupId: m7.id,
          userId: lucas.id,
          status: "going",
          introNote: "Love Yokohama's waterfront breeze.",
          speakingLanguage: "German / English / JP",
        },
        {
          meetupId: m8.id,
          userId: hana.id,
          status: "going",
          introNote: "Shimokitazawa is my home turf! Happy to help with Japanese.",
          speakingLanguage: "Japanese / English",
        },
      ]);

      await db.insert(comments).values([
        {
          meetupId: m1.id,
          userId: hana.id,
          content:
            "Welcome everyone! Feel free to arrive a few minutes early—Mame Roastery has amazing iced matcha lattes and oat milk options too.",
          isPinned: true,
        },
        {
          meetupId: m1.id,
          userId: priya.id,
          content:
            "Thank you for hosting Hana! Quick question: is it okay if my Japanese is mostly basic phrases right now?",
          isPinned: false,
        },
        {
          meetupId: m1.id,
          userId: hana.id,
          content:
            "100% okay Priya! Half of our time is relaxed English and for the Japanese half we speak slowly and write down helpful words together.",
          isPinned: false,
        },
        {
          meetupId: m2.id,
          userId: maya.id,
          content:
            "Weather forecast looks crisp and clear! Bring a light jacket since Kamo River gets breezy after sunset.",
          isPinned: true,
        },
        {
          meetupId: m3.id,
          userId: kenji.id,
          content:
            "Note: I reserved the semi-private table in the back so we can hear each other clearly. Let me know in your RSVP if you have dietary restrictions!",
          isPinned: true,
        },
      ]);

      await db.insert(connections).values([
        {
          senderId: lucas.id,
          receiverId: hana.id,
          message:
            "Hi Hana! Loved chatting at the last Shibuya coffee table. Let's grab a quick pour-over in Shimokitazawa next week!",
          meetupContext: "Coffee & Language Chat",
          status: "accepted",
        },
        {
          senderId: maya.id,
          receiverId: hana.id,
          message:
            "Hello Hana! I'll be in Tokyo for 2 days next week and would love your kissaten recommendations!",
          meetupContext: "Tokyo Recommendations",
          status: "pending",
        },
      ]);

      await db.insert(savedMeetups).values([
        { meetupId: m2.id, userId: lucas.id },
        { meetupId: m4.id, userId: hana.id },
      ]);
    } catch (err) {
      seedPromise = null;
      console.error("Seed error:", err);
    }
  })();

  return seedPromise;
}
