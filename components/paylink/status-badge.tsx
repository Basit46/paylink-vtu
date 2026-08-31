import { cn } from "@/lib/utils";
import type { TxStatus } from "@/lib/types";

const STATUS: Record<TxStatus, { label: string; className: string }> = {
  success: { label: "Success", className: "bg-success-bg text-success-fg" },
  pending: { label: "Pending", className: "bg-pending-bg text-pending-fg" },
  failed: { label: "Failed", className: "bg-failed-bg text-failed-fg" },
  reversed: { label: "Reversed", className: "bg-reversed-bg text-reversed-fg" },
};

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: TxStatus;
  label?: string;
  className?: string;
}) {
  const tone = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex h-[22px] shrink-0 items-center rounded-full px-2 text-[11px] font-medium",
        tone.className,
        className
      )}
    >
      {label ?? tone.label}
    </span>
  );
}

export const statusLabel = (status: TxStatus) => STATUS[status].label;
