import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StatusVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning";

const STATUS_VARIANTS: Record<string, StatusVariant> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  CANCELLED: "secondary",
  DRAFT: "outline",
  IN_PROGRESS: "default",
  COMPLETED: "success",
  OVERDUE: "destructive",
  SUBMITTED: "default",
  PARTIALLY_RECEIVED: "warning",
  RECEIVED: "success",
  FULFILLED: "success",
  PLANNED: "outline",
  RECOUNT: "warning",
  IN_TRANSIT: "default",
  LOW: "secondary",
  MEDIUM: "default",
  HIGH: "warning",
  URGENT: "destructive",
};

const variantClasses: Record<StatusVariant, string> = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  destructive: "border-transparent bg-destructive text-destructive-foreground",
  outline: "text-foreground",
  success: "border-transparent bg-emerald-600 text-white hover:bg-emerald-600/80",
  warning: "border-transparent bg-amber-500 text-white hover:bg-amber-500/80",
};

export type StatusBadgeProps = {
  status: string;
  label?: string;
  className?: string;
};

function formatStatusLabel(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const variant = STATUS_VARIANTS[status] ?? "outline";

  return (
    <Badge variant="outline" className={cn(variantClasses[variant], className)}>
      {label ?? formatStatusLabel(status)}
    </Badge>
  );
}

export { StatusBadge };
