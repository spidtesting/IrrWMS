"use client";

import { Toaster } from "@/components/ui/toaster";

function GlobalToaster() {
  return <Toaster position="top-right" richColors closeButton duration={4000} />;
}

export { GlobalToaster };
