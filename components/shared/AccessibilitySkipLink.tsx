import { cn } from "@/lib/utils";

export type AccessibilitySkipLinkProps = {
  href?: string;
  label?: string;
  className?: string;
};

function AccessibilitySkipLink({
  href = "#main-content",
  label = "Skip to main content",
  className,
}: AccessibilitySkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className,
      )}
    >
      {label}
    </a>
  );
}

export { AccessibilitySkipLink };
