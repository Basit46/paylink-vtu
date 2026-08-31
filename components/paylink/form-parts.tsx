"use client";

import * as React from "react";
import { nairaShort } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  error,
  children,
  className,
  action,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-medium">{label}</span>
        {action}
      </div>
      {children}
      {error ? (
        <span className="text-[12px] text-failed-fg">{error}</span>
      ) : hint ? (
        <span className="text-[12px] text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  );
}

export function FormCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 rounded-[16px] border border-border bg-card p-5",
        className
      )}
    >
      {children}
    </div>
  );
}

export const AmountInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(function AmountInput({ className, ...props }, ref) {
  return (
    <div className="flex h-[58px] items-center gap-2 rounded-xl border border-border bg-card px-4 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/15">
      <span className="font-mono text-[22px] text-muted-foreground">
        {"\u20A6"}
      </span>
      <input
        ref={ref}
        inputMode="numeric"
        autoComplete="off"
        className={cn(
          "w-full min-w-0 bg-transparent font-mono tabular text-[26px] font-medium tracking-[-0.02em] outline-none placeholder:text-[oklch(0.78_0.01_264)]",
          className
        )}
        {...props}
      />
    </div>
  );
});

export function PresetChips({
  presets,
  value,
  onSelect,
}: {
  presets: number[];
  value: number | null;
  onSelect: (amount: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => (
        <button
          key={preset}
          type="button"
          onClick={() => onSelect(preset)}
          className={cn(
            "h-9 rounded-full border px-3.5 font-mono text-[13px] transition-colors",
            value === preset
              ? "border-primary bg-primary-subtle text-[var(--primary-hover)]"
              : "border-border bg-card text-secondary-foreground hover:border-input"
          )}
        >
          {nairaShort(preset)}
        </button>
      ))}
    </div>
  );
}

export function SummaryRow({
  label,
  value,
  mono = true,
  strong = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-right text-[13px]",
          mono && "font-mono tabular",
          strong && "text-[15px] font-medium"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-[10.5px] tracking-[0.09em] text-muted-foreground uppercase",
        className
      )}
    >
      {children}
    </span>
  );
}
