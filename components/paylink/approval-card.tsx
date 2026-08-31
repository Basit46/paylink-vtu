"use client";

import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { naira } from "@/lib/format";
import type { AssistantMessage } from "@/lib/types";
import { Eyebrow } from "./form-parts";

export function ApprovalCard({
  approval,
  onConfirm,
  onCancel,
}: {
  approval: NonNullable<AssistantMessage["approval"]>;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[16px] border-[1.5px] border-primary bg-card p-5">
      <div className="flex items-center gap-2 text-[var(--primary-hover)]">
        <Lock strokeWidth={2} className="size-3.5" />
        <Eyebrow className="tracking-[0.08em] text-[var(--primary-hover)]">
          Your approval required
        </Eyebrow>
      </div>

      <span className="font-mono tabular text-[26px] leading-none font-medium tracking-[-0.02em]">
        {naira(approval.amount)}
      </span>

      <div className="flex flex-col gap-2.5 border-t border-border pt-3.5">
        {approval.lines.map((line) => (
          <div
            key={line.label}
            className="flex items-baseline justify-between gap-4"
          >
            <span className="text-[13px] text-muted-foreground">
              {line.label}
            </span>
            <span className="text-right font-mono text-[13px] font-medium">
              {line.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2.5">
        <Button onClick={onConfirm} className="flex-1">
          Confirm · Enter PIN
        </Button>
        <Button onClick={onCancel} variant="ghost">
          Cancel
        </Button>
      </div>
    </div>
  );
}
