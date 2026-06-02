import type { Metadata } from "next";
import { Inter, Noto_Sans_Sinhala } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { AppProviders } from "@/providers";
import { GlobalToaster } from "@/components/shared/GlobalToaster";
import { AccessibilitySkipLink } from "@/components/shared/AccessibilitySkipLink";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala", "latin"],
  variable: "--font-noto-sinhala",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "IrrWMS",
    template: "%s | IrrWMS",
  },
  description: "Irrigation Department Warehouse Management System — bilingual WMS for Sri Lanka",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoSinhala.variable} min-h-screen font-sans antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>
            <AccessibilitySkipLink />
            {children}
            <GlobalToaster />
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
