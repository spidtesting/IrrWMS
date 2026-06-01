"use client";

import { cn } from "@/lib/utils";

export type PrintWrapperProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
};

export function PrintWrapper({ children, title, className }: PrintWrapperProps) {
  return (
    <div className={cn("print-wrapper", className)}>
      {title && <h1 className="mb-6 hidden text-2xl font-bold print:block">{title}</h1>}
      <div className="print:bg-white print:text-black">{children}</div>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-wrapper,
          .print-wrapper * {
            visibility: visible;
          }
          .print-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          nav,
          header,
          aside,
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
