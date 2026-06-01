import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { formatQuantity } from "@/lib/utils/formatters";

export type StockBadgeProps = {
  current: number;
  min?: number;
  reorderLevel?: number;
  unit?: string;
  className?: string;
};

export function StockBadge({
  current,
  min = 0,
  reorderLevel = 0,
  unit,
  className,
}: StockBadgeProps) {
  const threshold = reorderLevel > 0 ? reorderLevel : min;
  const isLow = current <= threshold && threshold > 0;
  const isOut = current <= 0;

  const variant = isOut ? "destructive" : isLow ? "warning" : "success";

  const classes = {
    destructive: "border-transparent bg-destructive text-destructive-foreground",
    warning: "border-transparent bg-amber-500 text-white",
    success: "border-transparent bg-emerald-600 text-white",
  };

  return (
    <Badge variant="outline" className={cn(classes[variant], "font-mono", className)}>
      {formatQuantity(current, unit)}
      {isLow && !isOut && " · Low"}
      {isOut && " · Out"}
    </Badge>
  );
}
