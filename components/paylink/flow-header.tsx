"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { naira } from "@/lib/format";
import { useWalletStore } from "@/store/wallet";

export function FlowHeader({
  title,
  showBalance = true,
}: {
  title: string;
  showBalance?: boolean;
}) {
  const router = useRouter();
  const balance = useWalletStore((s) => s.balance);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card px-4 py-3">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-secondary-foreground transition-colors hover:bg-muted"
      >
        <ArrowLeft strokeWidth={1.75} className="size-5" />
      </button>
      <span className="flex-1 truncate text-[16px] font-semibold tracking-[-0.02em]">
        {title}
      </span>
      {showBalance ? (
        <span className="shrink-0 rounded-full bg-muted px-3 py-1.5 font-mono tabular text-[12.5px] text-secondary-foreground">
          {naira(balance)}
        </span>
      ) : null}
    </header>
  );
}

export function FlowFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-20 border-t border-border bg-card px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      {children}
    </div>
  );
}
