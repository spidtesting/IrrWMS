import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export type LoadingSkeletonProps = {
  rows?: number;
  columns?: number;
  className?: string;
  showHeader?: boolean;
};

function LoadingSkeleton({
  rows = 5,
  columns = 4,
  className,
  showHeader = true,
}: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {showHeader && <Skeleton className="h-10 w-full" />}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((__, colIndex) => (
            <Skeleton key={colIndex} className="h-8 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export { LoadingSkeleton };
