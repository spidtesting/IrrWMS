"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { LoginForm } from "./login-form";

function LoginFallback() {
  return (
    <div className="flex min-h-[24rem] w-full max-w-md items-center justify-center rounded-2xl border border-white/10 bg-white/95 p-8 shadow-2xl">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
