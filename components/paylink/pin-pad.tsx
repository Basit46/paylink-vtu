"use client";

import { Delete } from "lucide-react";
import { cn } from "@/lib/utils";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

export function PinDots({
  length,
  filled,
  error,
}: {
  length: number;
  filled: number;
  error?: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-3.5">
      {Array.from({ length }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "size-3.5 rounded-full border transition-colors",
            i < filled
              ? error
                ? "border-failed bg-failed"
                : "border-primary bg-primary"
              : "border-input bg-transparent"
          )}
        />
      ))}
    </div>
  );
}

export function PinPad({
  onKey,
  onBackspace,
  variant = "light",
  className,
}: {
  onKey: (digit: string) => void;
  onBackspace: () => void;
  variant?: "light" | "sheet";
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {KEYS.map((key, i) => {
        if (key === "") return <span key={i} />;
        const isBack = key === "back";
        return (
          <button
            key={i}
            type="button"
            aria-label={isBack ? "Delete" : key}
            onClick={() => (isBack ? onBackspace() : onKey(key))}
            className={cn(
              "flex h-[52px] items-center justify-center rounded-xl font-mono text-[21px] font-medium transition-colors select-none",
              variant === "sheet"
                ? "bg-muted hover:bg-border"
                : "bg-card border border-border hover:bg-muted",
              isBack && "text-muted-foreground"
            )}
          >
            {isBack ? <Delete strokeWidth={1.75} className="size-5" /> : key}
          </button>
        );
      })}
    </div>
  );
}
