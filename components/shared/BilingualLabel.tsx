import { cn } from "@/lib/utils";

export type BilingualLabelProps = {
  en: string;
  si: string;
  primary?: "en" | "si";
  className?: string;
  secondaryClassName?: string;
};

function BilingualLabel({
  en,
  si,
  primary = "en",
  className,
  secondaryClassName,
}: BilingualLabelProps) {
  const primaryText = primary === "en" ? en : si;
  const secondaryText = primary === "en" ? si : en;

  return (
    <span className={cn("inline-flex flex-col", className)}>
      <span className="leading-tight">{primaryText}</span>
      <span
        className={cn("text-xs leading-tight text-muted-foreground", secondaryClassName)}
        lang={primary === "en" ? "si" : "en"}
      >
        {secondaryText}
      </span>
    </span>
  );
}

export { BilingualLabel };
