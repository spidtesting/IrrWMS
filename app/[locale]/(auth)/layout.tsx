import type { Metadata } from "next";
import { AppProviders } from "@/providers";

export const metadata: Metadata = {
  title: "Sign In | IrrWMS",
  description: "Irrigation Department Warehouse Management System",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      <div className="relative min-h-screen overflow-hidden bg-[#1A1A2E]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,26,26,0.18),_transparent_55%)]" />
        </div>
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
          {children}
        </div>
      </div>
    </AppProviders>
  );
}
