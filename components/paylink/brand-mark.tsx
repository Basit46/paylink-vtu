import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-6", className)}
      aria-hidden
    >
      <g transform="rotate(-45 16 16)">
        <rect
          x="3.6" y="11.6" width="13.2" height="8.8" rx="4.4"
          stroke="currentColor" strokeWidth="3.1"
        />
        <path
          d="M15.4 11.6h8.2a4.4 4.4 0 0 1 0 8.8h-8.2"
          stroke="currentColor" strokeWidth="3.1" strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function BrandLockup({
  className,
  tileClassName,
}: {
  className?: string;
  tileClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex size-8 items-center justify-center rounded-[10px] bg-primary text-white",
          tileClassName
        )}
      >
        <BrandMark className="size-5" />
      </div>
      <span className="text-[17px] font-semibold tracking-[-0.02em]">
        PayLink
      </span>
    </div>
  );
}
