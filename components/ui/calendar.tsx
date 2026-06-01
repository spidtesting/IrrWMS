"use client";

import * as React from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type CalendarProps = {
  selected?: Date;
  onSelect?: (date: Date) => void;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
};

function Calendar({
  selected,
  onSelect,
  month: controlledMonth,
  onMonthChange,
  disabled,
  className,
}: CalendarProps) {
  const [internalMonth, setInternalMonth] = React.useState(
    controlledMonth ?? selected ?? new Date(),
  );

  const month = controlledMonth ?? internalMonth;

  const setMonth = (next: Date) => {
    if (!controlledMonth) {
      setInternalMonth(next);
    }
    onMonthChange?.(next);
  };

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = eachDayOfInterval({
    start: calendarStart,
    end: endOfWeek(calendarStart, { weekStartsOn: 0 }),
  });

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between pb-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => setMonth(subMonths(month, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">{format(month, "MMMM yyyy")}</div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => setMonth(addMonths(month, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="text-center text-xs font-normal text-muted-foreground"
          >
            {format(day, "EEE")}
          </div>
        ))}

        {days.map((day) => {
          const isSelected = selected ? isSameDay(day, selected) : false;
          const isOutside = !isSameMonth(day, month);
          const isDisabled = disabled?.(day) ?? false;

          return (
            <Button
              key={day.toISOString()}
              type="button"
              variant={isSelected ? "default" : "ghost"}
              size="icon"
              disabled={isDisabled}
              className={cn(
                "h-9 w-9 p-0 font-normal",
                isOutside && "text-muted-foreground opacity-50",
                isToday(day) && !isSelected && "bg-accent text-accent-foreground",
              )}
              onClick={() => onSelect?.(day)}
            >
              {format(day, "d")}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export { Calendar };
