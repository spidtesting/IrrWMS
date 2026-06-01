"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  onDebouncedChange?: (value: string) => void;
};

function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className,
  debounceMs = 300,
  onDebouncedChange,
}: SearchBarProps) {
  React.useEffect(() => {
    if (!onDebouncedChange) return;

    const timer = window.setTimeout(() => {
      onDebouncedChange(value);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [value, debounceMs, onDebouncedChange]);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
        aria-label={placeholder}
      />
      {value.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export { SearchBar };
