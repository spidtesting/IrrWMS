"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Languages, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const { language, toggleLanguage, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setIsSubmitted(true);
    } catch {
      setError(
        t(
          "Unable to process your request. Please try again.",
          "ඔබගේ ඉල්ලීම සැකසීමට නොහැක. නැවත උත්සාහ කරන්න.",
        ),
      );
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
          <div className="mb-2 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {t("Reset password", "මුරපදය නැවත සකසන්න")}
              </h1>
              <p className="mt-1 text-sm text-white/85">
                {t(
                  "We'll send a secure reset link to your email",
                  "ඔබගේ විද්‍යුත් තැපෑලට ආරක්ෂිත නැවත සැකසුම් සබැඳියක් යවන්නෙමු",
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition hover:bg-white/20"
            >
              <Languages className="h-3.5 w-3.5" />
              {language === "en" ? "EN / SI" : "SI / EN"}
            </button>
          </div>
        </div>

        <div className="px-8 py-8">
          {isSubmitted ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t("Check your inbox", "ඔබගේ එන ලිපි පරීක්ෂා කරන්න")}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(
                    "If an account exists for that email, a reset link has been sent.",
                    "එම විද්‍යුත් තැපෑල සඳහා ගිණුමක් තිබේ නම්, නැවත සැකසුම් සබැඳියක් යවා ඇත.",
                  )}
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("Back to sign in", "පිවිසීමට ආපසු")}
              </Link>
            </div>
          ) : (
            <>
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

                {error ? (
                  <div
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                    role="alert"
                  >
                    {error}
                  </div>
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
                      {t("Sending...", "යවමින්...")}
                    </>
                  ) : (
                    t("Send reset link", "නැවත සැකසුම් සබැඳිය යවන්න")
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("Back to sign in", "පිවිසීමට ආපසු")}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
