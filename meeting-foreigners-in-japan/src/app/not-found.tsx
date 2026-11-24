import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="rounded-3xl border border-[#E6E0D6] bg-white p-10 shadow-sm">
        <div className="font-jp text-3xl font-bold text-[#D94E34]">縁</div>
        <h1 className="mt-3 font-display text-2xl font-extrabold text-[#1A1D24]">
          Gathering Not Found
        </h1>
        <p className="mt-2 text-sm text-[#5A5D66]">
          This meetup may have been cancelled by the host or the link is no
          longer available.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-2xl bg-[#1A1D24] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#D94E34]"
        >
          Back to All Meetups
        </Link>
      </div>
    </div>
  );
}
