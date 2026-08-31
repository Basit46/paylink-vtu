"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SERVICES, ServiceIcon } from "@/components/paylink/service-icon";
import { ServiceTiles } from "@/components/paylink/service-tiles";
import { TransactionRow } from "@/components/paylink/transaction-row";
import { WalletCard } from "@/components/paylink/wallet-card";
import { DesktopTopBar } from "@/components/paylink/app-shell";
import { StatusBadge } from "@/components/paylink/status-badge";
import { Eyebrow } from "@/components/paylink/form-parts";
import { naira } from "@/lib/format";
import { spentThisMonth, useWalletStore } from "@/store/wallet";
import { useSessionStore } from "@/store/session";

const subscribeNever = () => () => {};

function useGreeting() {
  const mounted = React.useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  );
  if (!mounted) return "Good morning";
  const hour = new Date().getHours();
  return hour < 12
    ? "Good morning"
    : hour < 17
      ? "Good afternoon"
      : "Good evening";
}

const FIRST_RUN_STEPS = [
  {
    title: "Fund the wallet",
    body: "Transfer to your PayLink account number, or pay with a card.",
  },
  {
    title: "Buy, or ask",
    body: "Pick a service above, or tell the assistant what you need.",
  },
];

export default function DashboardPage() {
  const greeting = useGreeting();
  const fullName = useSessionStore((s) => s.fullName);
  const initials = useSessionStore((s) => s.initials);
  const firstName = fullName.split(" ")[0];
  const balance = useWalletStore((s) => s.balance);
  const transactions = useWalletStore((s) => s.transactions);

  const firstRun = balance === 0 && transactions.length === 0;
  const recent = transactions.slice(0, 3);
  const spent = spentThisMonth(transactions);
  const pending = transactions.filter((t) => t.status === "pending");
  const today = transactions.filter((t) => t.group === "Today");

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-1 flex-col lg:hidden">
        <header className="flex items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-brand-deep text-[13px] font-medium text-white">
              {initials}
            </span>
            <span className="flex flex-col">
              <span className="text-[12px] text-muted-foreground">
                {firstRun ? "Welcome" : greeting}
              </span>
              <span className="text-[16px] font-semibold tracking-[-0.02em]">
                {firstName}
              </span>
            </span>
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex size-[38px] items-center justify-center rounded-full border border-border text-secondary-foreground"
          >
            <Bell strokeWidth={1.75} className="size-[18px]" />
            <span className="absolute top-2 right-[9px] size-[7px] rounded-full border-[1.5px] border-card bg-failed" />
          </button>
        </header>

        <div className="flex flex-col gap-4 px-5 pb-6">
          <WalletCard />
          <ServiceTiles dimmed={firstRun} />

          <Link
            href="/assistant"
            className="flex items-center gap-2.5 rounded-[14px] border border-primary/25 bg-primary-subtle/60 px-4 py-3 text-[13px] text-[var(--primary-hover)]"
          >
            <Sparkles strokeWidth={1.75} className="size-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate">
              &ldquo;Send 1GB to my brother&rdquo; &mdash; ask the assistant
            </span>
            <ChevronRight strokeWidth={1.75} className="size-4 shrink-0" />
          </Link>

          {firstRun ? (
            <div className="flex flex-col gap-4 rounded-[16px] border border-border bg-card p-5">
              <h2 className="text-[15px] font-semibold">
                Two steps to your first purchase
              </h2>
              {FIRST_RUN_STEPS.map((step, i) => (
                <div key={step.title} className="flex gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-subtle font-mono text-[12px] font-medium text-[var(--primary-hover)]">
                    {i + 1}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-medium">{step.title}</span>
                    <span className="text-[13px] leading-relaxed text-muted-foreground">
                      {step.body}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="overflow-hidden rounded-[16px] border border-border bg-card">
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-[14px] font-semibold">Recent</span>
              {recent.length > 0 ? (
                <Link href="/history" className="text-[13px] font-medium">
                  See all
                </Link>
              ) : null}
            </div>
            {recent.length > 0 ? (
              <div className="flex flex-col divide-y divide-border border-t border-border">
                {recent.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} secondary="time" />
                ))}
              </div>
            ) : firstRun ? (
              <div className="border-t border-border px-5 py-8 text-center text-[13px] text-muted-foreground">
                Your transactions will appear here
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 border-t border-border px-5 py-8 text-center">
                <span className="text-[14px] font-medium">
                  No transactions yet
                </span>
                <span className="max-w-[34ch] text-[13px] leading-relaxed text-muted-foreground">
                  Anything you buy shows up here the moment the provider confirms
                  it.
                </span>
                <Button
                  render={<Link href="/buy/airtime" />}
                  size="sm"
                  variant="outline"
                >
                  Buy your first airtime
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden flex-1 flex-col lg:flex">
        <DesktopTopBar />
        <div className="flex flex-col gap-7 overflow-y-auto px-7 py-7">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[25px] font-semibold tracking-[-0.025em]">
              {greeting}, {firstName}
            </h1>
            <p className="text-[14px] text-muted-foreground">
              {transactions.length === 0
                ? "Nothing yet. Fund your wallet to make your first purchase."
                : `${today.length} transaction${today.length === 1 ? "" : "s"} today.${
                    pending.length
                      ? ` One still pending with ${pending[0].title.replace(" prepaid", "")}.`
                      : ""
                  }`}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2 rounded-[16px] bg-brand-deep p-5 text-white">
              <span className="text-[11.5px] tracking-[0.06em] text-brand-deep-muted uppercase">
                Wallet balance
              </span>
              <span className="font-mono tabular text-[28px] font-medium tracking-[-0.02em]">
                {naira(balance)}
              </span>
              <span className="text-[12px] text-[oklch(0.75_0.03_168)]">
                Last funded {naira(5000)} yesterday
              </span>
            </div>
            <div className="flex flex-col gap-2 rounded-[16px] border border-border bg-card p-5">
              <span className="text-[11.5px] tracking-[0.06em] text-muted-foreground uppercase">
                Spent this month
              </span>
              <span className="font-mono tabular text-[28px] font-medium tracking-[-0.02em]">
                {naira(spent)}
              </span>
              <span className="text-[12px] text-muted-foreground">
                18% more than July
              </span>
            </div>
            <div className="flex flex-col gap-2 rounded-[16px] border border-border bg-card p-5">
              <span className="text-[11.5px] tracking-[0.06em] text-muted-foreground uppercase">
                Needs attention
              </span>
              <span className="flex items-baseline gap-2">
                <span className="font-mono tabular text-[28px] font-medium">
                  {pending.length}
                </span>
                <span className="text-[13px] text-muted-foreground">
                  pending
                </span>
              </span>
              <span className="text-[12px] text-muted-foreground">
                {pending.length
                  ? `${pending[0].title.replace(" prepaid", "")} · ${naira(Math.abs(pending[0].amount))}`
                  : "Everything settled"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Eyebrow>Pay for</Eyebrow>
            <div className="grid grid-cols-4 gap-4">
              {SERVICES.map((service) => (
                <Link
                  key={service.id}
                  href={service.href}
                  className="flex flex-col gap-3 rounded-[16px] border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-primary-subtle/30"
                >
                  <ServiceIcon
                    service={service.id}
                    className="size-6 text-[oklch(0.45_0.11_168)]"
                  />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-medium">
                      {service.label}
                    </span>
                    <span className="text-[12.5px] text-muted-foreground">
                      {service.blurb}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[16px] border border-border bg-card">
            <div className="flex items-center justify-between px-5 py-3.5">
              <Eyebrow>Recent</Eyebrow>
              <Link href="/history" className="text-[13px] font-medium">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-[2fr_1.4fr_1fr_1fr_0.9fr] gap-4 border-y border-border bg-background px-[18px] py-2.5 font-mono text-[10.5px] tracking-[0.07em] text-muted-foreground uppercase">
              <span>Transaction</span>
              <span>Recipient</span>
              <span>Reference</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Status</span>
            </div>
            <div className="divide-y divide-border">
              {recent.map((tx) => (
                <Link
                  key={tx.id}
                  href={`/history/${tx.id}`}
                  className="grid grid-cols-[2fr_1.4fr_1fr_1fr_0.9fr] items-center gap-4 px-[18px] py-3.5 text-[13.5px] transition-colors hover:bg-muted"
                >
                  <span className="flex items-center gap-2.5">
                    <ServiceIcon
                      service={tx.service}
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                    <span className="truncate font-medium">{tx.title}</span>
                  </span>
                  <span className="truncate font-mono text-[12.5px] text-muted-foreground">
                    {tx.recipient}
                  </span>
                  <span className="truncate font-mono text-[12.5px] text-muted-foreground">
                    {tx.reference}
                  </span>
                  <span className="text-right font-mono tabular font-medium">
                    {naira(tx.amount, { sign: true })}
                  </span>
                  <span className="flex justify-end">
                    <StatusBadge status={tx.status} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
