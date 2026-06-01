"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, Languages, Loader2, Lock, Mail, Warehouse } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const { language, toggleLanguage, t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        if (result.error === "account_locked") {
          setError(
            t(
              "Your account is locked after too many failed attempts. Try again in 15 minutes.",
              "අසාර්ථක උත්සාහයන් වැඩි නිසා ඔබගේ ගිණුම අගුළු දමා ඇත. විනාඩි 15කින් නැවත උත්සාහ කරන්න.",
            ),
          );
        } else {
          setError(
            t(
              "Invalid email or password. Please try again.",
              "වලංගු නොවන විද්‍යුත් තැපෑල හෝ මුරපදය. නැවත උත්සාහ කරන්න.",
            ),
          );
        }
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError(t("Something went wrong. Please try again.", "යමක් වැරදී ඇත. නැවත උත්සාහ කරන්න."));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/95 shadow-2xl shadow-black/30 backdrop-blur-sm dark:bg-[#252545]/95">
        <div className="bg-primary px-8 py-7 text-primary-foreground">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                <Warehouse className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/75">
                  {t("Irrigation Department", "ජල වාරි අංශය")}
                </p>
                <h1 className="text-2xl font-bold tracking-tight">IrrWMS</h1>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition hover:bg-white/20"
              aria-label={t("Switch language", "භාෂාව වෙනස් කරන්න")}
            >
              <Languages className="h-3.5 w-3.5" />
              {language === "en" ? "EN / SI" : "SI / EN"}
            </button>
          </div>
          <p className="text-sm text-white/85">
            {t("Warehouse Management System", "ගබඩා කළමනාකරණ පද්ධතිය")}
          </p>
        </div>

        <div className="px-8 py-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {t("Welcome back", "නැවත සාදරයෙන් පිළිගනිමු")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("Sign in with your employee credentials", "ඔබගේ සේවක අක්තපත්‍ර සමඟ පිවිසෙන්න")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                {t("Email address", "විද්‍යුත් තැපැල් ලිපිනය")}
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t("you@irrigation.gov.lk", "you@irrigation.gov.lk")}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-10 text-sm outline-none ring-primary transition focus:ring-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  {t("Password", "මුරපදය")}
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {t("Forgot password?", "මුරපදය අමතකද?")}
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t("Enter your password", "ඔබගේ මුරපදය ඇතුළත් කරන්න")}
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-10 pr-11 text-sm outline-none ring-primary transition focus:ring-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  aria-label={t("Toggle password visibility", "මුරපද දෘශ්‍යතාව මාරු කරන්න")}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error ? (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
              >
                {error}
              </motion.div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70",
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("Signing in...", "පිවිසෙමින්...")}
                </>
              ) : (
                t("Sign in", "පිවිසෙන්න")
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {t(
              "Authorized personnel only. All access is monitored.",
              "බලයලත් කාර්ය මණ්ඩලයට පමණි. සියලු ප්‍රවේශයන් නිරීක්ෂණය කෙරේ.",
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
