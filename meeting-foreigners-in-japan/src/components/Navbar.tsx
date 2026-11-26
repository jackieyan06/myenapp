"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plus,
  Users,
  Compass,
  BookOpen,
  CalendarHeart,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale, LOCALES } from "@/components/LocaleProvider";

export function Navbar() {
  const pathname = usePathname();
  const { user, openAuthModal, logout } = useAuth();
  const { locale, setLocale, t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Discover", icon: Compass },
    { href: "/community", label: "People", icon: Users },
    { href: "/guide", label: "Japan Guide", icon: BookOpen },
    ...(user
      ? [{ href: "/my-meetups", label: "My Hub", icon: CalendarHeart }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#E6E0D6] bg-[#FAF8F4]/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Hanko Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D94E34] text-white shadow-sm transition group-hover:scale-105">
            <span className="font-jp text-base font-bold leading-none">縁</span>
          </span>
          <div className="flex flex-col">
            <span className="font-display text-lg font-extrabold tracking-tight text-[#1A1D24] leading-none">
              En
            </span>
            <span className="text-[10px] font-medium tracking-wider text-[#5A5D66] uppercase mt-0.5">
              Meet in Japan
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-[#1A1D24] text-white"
                    : "text-[#5A5D66] hover:bg-[#EFE9DF] hover:text-[#1A1D24]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t(item.label)}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <label className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#5A5D66]">
            <span className="sr-only">{t("Language")}</span>
            <select aria-label={t("Language")} value={locale} onChange={(event) => setLocale(event.target.value as typeof locale)} className="rounded-full border border-[#E6E0D6] bg-white px-3 py-2 text-sm text-[#1A1D24]">
              {LOCALES.map((item) => <option key={item.code} value={item.code}>{item.nativeLabel}</option>)}
            </select>
          </label>

          <Link
            href="/host"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#D94E34] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#C04028]"
          >
            <Plus className="h-4 w-4" />
            {t("Host Meetup")}
          </Link>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-[#E6E0D6] bg-white py-1 pl-1.5 pr-3 text-sm font-semibold text-[#1A1D24] transition hover:border-[#D94E34]/50"
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {user.name[0]}
                </span>
                <span className="max-w-[110px] truncate">{user.name}</span>
                <span className="text-xs">{user.nationalityFlag}</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#5A5D66]" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-20 mt-2 w-60 rounded-2xl border border-[#E6E0D6] bg-white p-2 shadow-xl">
                    <div className="border-b border-[#E6E0D6] px-3 py-2.5">
                      <div className="text-sm font-bold text-[#1A1D24]">
                        {user.nationalityFlag} {user.name}
                      </div>
                      <div className="text-xs text-[#5A5D66]">
                        {user.roleLabel} · {user.homeCity}
                      </div>
                    </div>
                    <Link
                      href="/my-meetups"
                      onClick={() => setUserMenuOpen(false)}
                      className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-[#1A1D24] hover:bg-[#FAF8F4]"
                    >
                      <CalendarHeart className="h-4 w-4 text-[#D94E34]" />
                      {t("My RSVPs & Coffee Waves")}
                    </Link>
                    <Link
                      href="/my-meetups?tab=profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-[#1A1D24] hover:bg-[#FAF8F4]"
                    >
                      <UserIcon className="h-4 w-4 text-[#2B4C7E]" />
                      {t("Edit Cultural Profile")}
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        setUserMenuOpen(false);
                        await logout();
                      }}
                      className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("Sign Out")}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("Sign in or Try a Demo Account")}
              className="rounded-full border border-[#E6E0D6] bg-white px-4 py-2 text-sm font-semibold text-[#1A1D24] transition hover:border-[#1A1D24]"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-xl border border-[#E6E0D6] bg-white p-2 text-[#1A1D24] md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-[#E6E0D6] bg-[#FAF8F4] px-4 py-4 md:hidden">
          <div className="space-y-1.5">
            <div className="px-3 py-2">
              <label className="flex items-center justify-between gap-3 text-sm font-semibold text-[#5A5D66]">
                {t("Language")}
                <select aria-label={t("Language")} value={locale} onChange={(event) => setLocale(event.target.value as typeof locale)} className="rounded-lg border border-[#E6E0D6] bg-white px-3 py-2 text-sm text-[#1A1D24]">
                  {LOCALES.map((item) => <option key={item.code} value={item.code}>{item.nativeLabel}</option>)}
                </select>
              </label>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold ${
                    active
                      ? "bg-[#1A1D24] text-white"
                      : "text-[#1A1D24] hover:bg-[#EFE9DF]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/host"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 rounded-xl bg-[#D94E34] px-3.5 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Host a Meetup
            </Link>
          </div>
          <div className="mt-4 border-t border-[#E6E0D6] pt-3">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: user.avatarColor }}
                  >
                    {user.name[0]}
                  </span>
                  <div>
                    <div className="text-sm font-semibold">
                      {user.nationalityFlag} {user.name}
                    </div>
                    <div className="text-xs text-[#5A5D66]">{user.homeCity}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setMobileOpen(false);
                    await logout();
                  }}
                  className="rounded-lg border border-[#E6E0D6] bg-white px-3 py-1.5 text-xs font-semibold text-red-600"
                >
                  {t("Sign Out")}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openAuthModal("Sign in or Try a Demo Account");
                }}
                className="w-full rounded-xl border border-[#E6E0D6] bg-white py-2.5 text-sm font-semibold text-[#1A1D24]"
              >
                {t("Sign In / Try Demo Persona")}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
