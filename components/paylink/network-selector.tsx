"use client";

import { NETWORKS } from "@/lib/catalog";
import type { NetworkId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function NetworkSelector({
  value,
  onChange,
}: {
  value: NetworkId | null;
  onChange: (id: NetworkId) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {NETWORKS.map((network) => {
        const active = network.id === value;
        return (
          <button
            key={network.id}
            type="button"
            onClick={() => onChange(network.id)}
            aria-pressed={active}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border py-3 transition-colors",
              active
                ? "border-primary bg-[oklch(0.97_0.015_168)]"
                : "border-border bg-card hover:border-input"
            )}
          >
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-full font-mono text-[11px] font-medium",
                active
                  ? "bg-primary text-white"
                  : "bg-muted text-secondary-foreground"
              )}
            >
              {network.short}
            </span>
            <span className="text-[12px] font-medium">{network.name}</span>
          </button>
        );
      })}
    </div>
  );
}
