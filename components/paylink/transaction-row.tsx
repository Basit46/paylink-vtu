import Link from "next/link";
import { naira } from "@/lib/format";
import type { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ServiceIcon } from "./service-icon";
import { StatusBadge } from "./status-badge";

export function TransactionRow({
  tx,
  secondary = "meta",
  className,
}: {
  tx: Transaction;
  secondary?: "meta" | "time";
  className?: string;
}) {
  const credit = tx.amount > 0;
  return (
    <Link
      href={`/history/${tx.id}`}
      className={cn(
        "flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted",
        className
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-secondary-foreground">
        <ServiceIcon service={tx.service} className="size-[18px]" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[14px] font-medium">{tx.title}</span>
        <span className="truncate text-[12px] text-muted-foreground">
          {secondary === "time" ? `${tx.time} \u00b7 ${tx.recipient}` : tx.meta}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={cn(
            "font-mono tabular text-[14px] font-medium",
            credit && "text-success-fg"
          )}
        >
          {naira(tx.amount, { sign: true })}
        </span>
        <StatusBadge status={tx.status} />
      </span>
    </Link>
  );
}
