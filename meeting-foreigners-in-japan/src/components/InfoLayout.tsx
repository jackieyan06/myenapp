import React, { type ReactNode } from "react";
import Link from "next/link";

export function InfoLayout({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <Link href="/" className="text-sm font-semibold text-[#D94E34] hover:underline">← EnJapan home</Link>
      <header className="mt-6 border-b border-[#E6E0D6] pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D94E34]">EnJapan · 縁</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-[#1A1D24] sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[#5A5D66]">{intro}</p>
      </header>
      <article className="prose prose-stone mt-8 max-w-none prose-headings:font-display prose-headings:text-[#1A1D24] prose-p:leading-7 prose-a:text-[#D94E34]">{children}</article>
    </div>
  );
}
