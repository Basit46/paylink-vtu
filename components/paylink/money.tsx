import { naira } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Money({
  value,
  signed = false,
  className,
}: {
  value: number;
  signed?: boolean;
  className?: string;
}) {
  const positive = value > 0;
  return (
    <span
      className={cn(
        "font-mono tabular tracking-[-0.01em]",
        signed && positive && "text-success-fg",
        className
      )}
    >
      {signed ? naira(value, { sign: true }) : naira(value)}
    </span>
  );
}
