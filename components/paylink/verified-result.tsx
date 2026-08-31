import { CircleCheck, LoaderCircle } from "lucide-react";

export function VerifyingRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted px-4 py-3 text-[13px] text-muted-foreground">
      <LoaderCircle strokeWidth={1.75} className="size-4 animate-spin" />
      {label}
    </div>
  );
}

export function VerifiedResult({
  label,
  name,
  detail,
}: {
  label: string;
  name: string;
  detail?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-[oklch(0.85_0.06_150)] bg-[oklch(0.96_0.03_150)] px-4 py-3">
      <span className="flex items-center gap-1.5 text-[11.5px] tracking-[0.03em] text-[oklch(0.45_0.06_150)] uppercase">
        <CircleCheck strokeWidth={2} className="size-3.5" />
        {label}
      </span>
      <span className="font-mono text-[14px] font-medium">{name}</span>
      {detail ? (
        <span className="text-[12.5px] text-secondary-foreground">{detail}</span>
      ) : null}
    </div>
  );
}
