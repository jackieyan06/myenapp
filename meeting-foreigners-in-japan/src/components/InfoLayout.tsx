import React, { type ReactNode } from "react";
import Link from "next/link";

const locales = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "zh-cn", label: "简体中文" },
  { code: "zh-tw", label: "繁體中文" },
];

export function InfoLayout({
  title,
  intro,
  children,
  pageKey,
  locale = "en",
}: {
  title: string;
  intro: string;
  children: ReactNode;
  pageKey?: string;
  locale?: string;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <Link href="/" className="text-sm font-semibold text-[#D94E34] hover:underline">← EnJapan home</Link>
      <header className="mt-6 border-b border-[#E6E0D6] pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D94E34]">EnJapan · 縁</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-[#1A1D24] sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[#5A5D66]">{intro}</p>
        {pageKey && <nav aria-label="Page language" className="mt-6 flex flex-wrap gap-2">
          {locales.map((item) => {
            const href = item.code === "en" ? `/${pageKey}` : `/${item.code}/${pageKey}`;
            const active = locale === item.code;
            return <Link key={item.code} href={href} hrefLang={item.code} lang={item.code} aria-current={active ? "page" : undefined} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? "border-[#1A1D24] bg-[#1A1D24] text-white" : "border-[#E6E0D6] bg-white text-[#5A5D66] hover:border-[#D94E34] hover:text-[#D94E34]"}`}>{item.label}</Link>;
          })}
        </nav>}
      </header>
      <article className="prose prose-stone mt-8 max-w-none prose-headings:font-display prose-headings:text-[#1A1D24] prose-p:leading-7 prose-a:text-[#D94E34]">{children}</article>
    </div>
  );
}
