import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { Inter, Plus_Jakarta_Sans, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";
import { LocaleProvider, type Locale } from "@/components/LocaleProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-jp",
});

export const metadata: Metadata = {
  title: "En (縁) — Meet Foreigners & Locals in Japan",
  description:
    "Discover curated language exchanges, café mornings, city walks, and izakaya dinners connecting expats, travelers, and locals across Tokyo, Kyoto, Osaka, Fukuoka, and beyond.",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [initialUser, cookieStore] = await Promise.all([getCurrentUser(), cookies()]);
  const savedLocale = cookieStore.get("en-locale")?.value;
  const initialLocale: Locale = savedLocale === "ja" || savedLocale === "zh-cn" || savedLocale === "zh-tw" ? savedLocale : "en";

  return (
    <html
      lang={initialLocale}
      className={`${inter.variable} ${plusJakarta.variable} ${notoSansJp.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#1A1D24] antialiased selection:bg-[#D94E34]/15 selection:text-[#D94E34]">
        <LocaleProvider initialLocale={initialLocale}>
        <AuthProvider initialUser={initialUser}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
