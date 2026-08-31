"use client";

import Link from "next/link";
import { ArrowLeftRight, Eye, EyeOff, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { naira } from "@/lib/format";
import { spentThisMonth, useWalletStore } from "@/store/wallet";

export function WalletCard() {
  const { balance, hideBalance, toggleHideBalance, transactions } =
    useWalletStore();
  const spent = spentThisMonth(transactions);
  const firstRun = balance === 0 && transactions.length === 0;

  return (
    <div className="flex flex-col gap-[18px] rounded-[18px] bg-brand-deep p-5 text-white">
      <div className="flex items-center justify-between">
        <span className="text-[11px] tracking-[0.08em] text-brand-deep-muted uppercase">
          Wallet balance
        </span>
        <button
          type="button"
          onClick={toggleHideBalance}
          aria-label={hideBalance ? "Show balance" : "Hide balance"}
          className="text-brand-deep-muted transition-colors hover:text-white"
        >
          {hideBalance ? (
            <EyeOff strokeWidth={1.75} className="size-[17px]" />
          ) : (
            <Eye strokeWidth={1.75} className="size-[17px]" />
          )}
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="font-mono tabular text-[34px] leading-none font-medium tracking-[-0.02em]">
          {hideBalance ? "\u20A6\u2022\u2022\u2022\u2022\u2022\u2022" : naira(balance)}
        </span>
        {firstRun ? (
          <span className="max-w-[30ch] text-[13px] leading-relaxed text-[oklch(0.75_0.03_168)]">
            Add money once and every purchase after that takes four taps.
          </span>
        ) : (
          <span className="text-[12px] text-[oklch(0.75_0.03_168)]">
            {naira(spent)} spent this month
          </span>
        )}
      </div>

      {firstRun ? (
        <Button
          render={<Link href="/fund" />}
          variant="on-deep"
          size="lg"
          className="w-full rounded-[11px]"
        >
          <Plus strokeWidth={2.5} className="size-4" />
          Fund your wallet
        </Button>
      ) : (
        <div className="flex gap-2.5">
          <Button
            render={<Link href="/fund" />}
            variant="on-deep"
            size="lg"
            className="flex-1 rounded-[11px]"
          >
            <Plus strokeWidth={2.5} className="size-4" />
            Fund
          </Button>
          <Button
            render={<Link href="/history" />}
            variant="on-deep-outline"
            size="lg"
            className="flex-1 rounded-[11px]"
          >
            <ArrowLeftRight strokeWidth={1.75} className="size-4" />
            History
          </Button>
        </div>
      )}
    </div>
  );
}
