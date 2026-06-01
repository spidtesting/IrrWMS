"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type DateRange = {
  from?: Date;
  to?: Date;
};

export type DateRangePickerProps = {
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

function DateRangePicker({
  value,
  onChange,
  placeholder = "Pick a date range",
  className,
  disabled,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selecting, setSelecting] = React.useState<"from" | "to">("from");

  const label =
    value.from && value.to
      ? `${format(value.from, "LLL dd, y")} – ${format(value.to, "LLL dd, y")}`
      : value.from
        ? format(value.from, "LLL dd, y")
        : placeholder;

  const handleSelect = (date: Date) => {
    if (selecting === "from") {
      onChange({ from: date, to: undefined });
      setSelecting("to");
      return;
    }

    if (value.from && date < value.from) {
      onChange({ from: date, to: value.from });
    } else {
      onChange({ from: value.from, to: date });
    }

    setSelecting("from");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value.from && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar selected={selecting === "from" ? value.from : value.to} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}

export { DateRangePicker };
