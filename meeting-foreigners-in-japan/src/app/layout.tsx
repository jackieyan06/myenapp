import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Plus_Jakarta_Sans, Noto_Sans_JP } from "next/font/google";
import { cookies } from "next/headers";
import type { AppLocale } from "@/components/LanguageProvider";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";
import { getCurrentUser } from "@/lib/auth";

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
  const initialUser = await getCurrentUser();
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("en-locale")?.value;
  const initialLocale: AppLocale = savedLocale === "ja" || savedLocale === "zh-CN" || savedLocale === "zh-TW" ? savedLocale : "en";

  return (
    <html
      lang={initialLocale}
      className={`${inter.variable} ${plusJakarta.variable} ${notoSansJp.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#1A1D24] antialiased selection:bg-[#D94E34]/15 selection:text-[#D94E34]">
        <LanguageProvider initialLocale={initialLocale}>
        <AuthProvider initialUser={initialUser}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </LanguageProvider>
      </body>
    </html>
  );
}
