"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles, Check, Loader2 } from "lucide-react";
import type { PublicUser } from "@/lib/auth";
import { JAPAN_CITIES, NATIONALITIES, ROLE_LABELS } from "@/lib/constants";
import { useLocale } from "@/components/LocaleProvider";

interface AuthContextValue {
  user: PublicUser | null;
  setUser: (user: PublicUser | null) => void;
  refreshUser: () => Promise<void>;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

const DEMO_PERSONAS = [
  {
    email: "hana@en-japan.jp",
    name: "Hana Sato",
    flag: "🇯🇵",
    subtitle: "Japanese Local · Tokyo (Shimokitazawa)",
    langs: "Japanese (Native) · English (Fluent)",
    color: "#D94E34",
  },
  {
    email: "lucas@en-japan.jp",
    name: "Lucas Meyer",
    flag: "🇩🇪",
    subtitle: "Expat from Germany · Tokyo (Daikanyama)",
    langs: "German · English · Japanese (N3)",
    color: "#2B4C7E",
  },
  {
    email: "maya@en-japan.jp",
    name: "Maya Lin",
    flag: "🇹🇼",
    subtitle: "Traveler from Taiwan · Kyoto (Kawaramachi)",
    langs: "Mandarin · English · Japanese (N4)",
    color: "#3E6B48",
  },
];

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: PublicUser | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { t } = useLocale();
  const [user, setUser] = useState<PublicUser | null>(initialUser);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState<string | undefined>();
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sign in form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<string>(ROLE_LABELS[1]);
  const [regNationality, setRegNationality] = useState<string>("United States");
  const [regCity, setRegCity] = useState<string>("Tokyo");
  const [regNativeLang, setRegNativeLang] = useState("English");
  const [regJpLevel, setRegJpLevel] = useState("Beginner (N5/N4)");
  const [regBio, setRegBio] = useState("");

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      }
    } catch {
      // ignore
    }
  };

  const openAuthModal = (reason?: string) => {
    setModalReason(reason);
    setError("");
    setModalOpen(true);
  };

  const closeAuthModal = () => {
    setModalOpen(false);
    setError("");
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.refresh();
  };

  const handleDemoLogin = async (email: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, demo: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign in failed.");
      } else {
        setUser(data.user);
        setModalOpen(false);
        router.refresh();
      }
    } catch {
      setError("Network error while signing in.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Incorrect credentials.");
      } else {
        setUser(data.user);
        setModalOpen(false);
        router.refresh();
      }
    } catch {
      setError("Network error while signing in.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const nat = NATIONALITIES.find((n) => n.name === regNationality);
      const languages = [
        { lang: regNativeLang.trim() || "English", level: "Native" },
        ...(regJpLevel !== "None"
          ? [{ lang: "Japanese", level: regJpLevel }]
          : []),
      ];
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          roleLabel: regRole,
          nationality: regNationality,
          nationalityFlag: nat?.flag ?? "🌏",
          homeCity: regCity,
          languages,
          bio: regBio,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create account.");
      } else {
        setUser(data.user);
        setModalOpen(false);
        router.refresh();
      }
    } catch {
      setError("Network error while creating account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        refreshUser,
        openAuthModal,
        closeAuthModal,
        logout,
      }}
    >
      {children}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1D24]/55 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border border-[#E6E0D6] bg-[#FAF8F4] p-6 shadow-2xl">
            <button
              onClick={closeAuthModal}
              className="absolute right-4 top-4 rounded-full p-2 text-[#5A5D66] transition hover:bg-[#E6E0D6]/50 hover:text-[#1A1D24]"
              aria-label={t("Close sign in dialog")}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-5 pr-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#D94E34]/10 px-3 py-1 text-xs font-semibold text-[#D94E34]">
                <Sparkles className="h-3.5 w-3.5" />
                En (縁) Japan Community
              </div>
              <h2 className="mt-2.5 text-2xl font-bold text-[#1A1D24]">
                {t(modalReason || "Welcome to En")}
              </h2>
              <p className="mt-1 text-sm text-[#5A5D66]">
                Connect with foreigners, expats, travelers, and locals across Japan.
              </p>
            </div>

            {/* 1-Click Demo Personas */}
            <div className="mb-5 rounded-2xl border border-[#E6E0D6] bg-white p-4">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5A5D66]">
                  Instant Demo Accounts (1-Click)
                </span>
                <span className="text-[11px] text-[#3E6B48] font-medium">
                  Try as local or expat
                </span>
              </div>
              <div className="grid gap-2">
                {DEMO_PERSONAS.map((persona) => (
                  <button
                    key={persona.email}
                    type="button"
                    disabled={loading}
                    onClick={() => handleDemoLogin(persona.email)}
                    className="flex items-center justify-between rounded-xl border border-[#E6E0D6] bg-[#FAF8F4]/70 px-3.5 py-2.5 text-left transition hover:border-[#D94E34] hover:bg-white disabled:opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ backgroundColor: persona.color }}
                      >
                        {persona.name[0]}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1A1D24]">
                          <span>{persona.flag}</span>
                          <span>{persona.name}</span>
                        </div>
                        <div className="text-xs text-[#5A5D66]">
                          {t(persona.subtitle)}
                        </div>
                      </div>
                    </div>
                    <span className="rounded-lg bg-[#1A1D24] px-2.5 py-1 text-xs font-medium text-white">
                      Use
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-4 grid grid-cols-2 rounded-xl bg-[#EFE9DF] p-1">
              <button
                type="button"
                onClick={() => {
                  setTab("signin");
                  setError("");
                }}
                className={`rounded-lg py-2 text-sm font-semibold transition ${
                  tab === "signin"
                    ? "bg-white text-[#1A1D24] shadow-sm"
                    : "text-[#5A5D66] hover:text-[#1A1D24]"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setError("");
                }}
                className={`rounded-lg py-2 text-sm font-semibold transition ${
                  tab === "register"
                    ? "bg-white text-[#1A1D24] shadow-sm"
                    : "text-[#5A5D66] hover:text-[#1A1D24]"
                }`}
              >
                Create Profile
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}

            {tab === "signin" ? (
              <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3.5 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3.5 py-2.5 text-sm text-[#1A1D24] outline-none focus:border-[#D94E34]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D94E34] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C04028] disabled:opacity-60"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Alex Chen"
                      className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#D94E34]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#D94E34]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                      Password (min 6 chars) *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#D94E34]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                      You are a...
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#D94E34]"
                    >
                      {ROLE_LABELS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                      Country / Origin
                    </label>
                    <select
                      value={regNationality}
                      onChange={(e) => setRegNationality(e.target.value)}
                      className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#D94E34]"
                    >
                      {NATIONALITIES.map((n) => (
                        <option key={n.name} value={n.name}>
                          {n.flag} {t(n.name)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                      City in Japan
                    </label>
                    <select
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#D94E34]"
                    >
                      {JAPAN_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {t(c.name)} ({c.jp})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                      Primary Language
                    </label>
                    <input
                      type="text"
                      value={regNativeLang}
                      onChange={(e) => setRegNativeLang(e.target.value)}
                      placeholder="English, French, Mandarin..."
                      className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#D94E34]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                      Japanese Level
                    </label>
                    <select
                      value={regJpLevel}
                      onChange={(e) => setRegJpLevel(e.target.value)}
                      className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#D94E34]"
                    >
                      <option value="None">{t("Just starting (0 words)")}</option>
                      <option value="Beginner (N5/N4)">{t("Beginner (N5/N4)")}</option>
                      <option value="Conversational (N3)">{t("Conversational (N3)")}</option>
                      <option value="Intermediate (N2)">{t("Intermediate (N2)")}</option>
                      <option value="Fluent (N1)">{t("Fluent (N1)")}</option>
                      <option value="Native">{t("Native Japanese")}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#5A5D66]">
                    Short Intro (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={regBio}
                    onChange={(e) => setRegBio(e.target.value)}
                    placeholder="Moving to Tokyo next month, love specialty coffee & indie music..."
                    className="w-full rounded-xl border border-[#E6E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#D94E34]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D94E34] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C04028] disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Join En Community
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}
