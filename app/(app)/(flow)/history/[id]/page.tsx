"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Check, Copy, Repeat2, Share2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLockup } from "@/components/paylink/brand-mark";
import { FlowHeader } from "@/components/paylink/flow-header";
import { StatusBadge, statusLabel } from "@/components/paylink/status-badge";
import { naira } from "@/lib/format";
import type { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useWalletStore } from "@/store/wallet";

function buildRows(tx: Transaction) {
  const rows: { label: string; value: string; copy?: boolean; mono?: boolean }[] = [];
  if (tx.service === "funding") {
    rows.push({ label: "Channel", value: tx.meta });
  } else {
    rows.push({ label: "Service", value: tx.title });
    rows.push({ label: "Recipient", value: tx.recipient, mono: true });
  }
  if (tx.verifiedName) rows.push({ label: "Name", value: tx.verifiedName, mono: true });
  if (tx.units) rows.push({ label: "Units", value: tx.units });
  if (tx.token) rows.push({ label: "Token", value: tx.token, mono: true, copy: true });
  rows.push({ label: "Fee", value: naira(tx.fee), mono: true });
  rows.push({
    label: "Paid with",
    value: tx.service === "funding" ? "Paystack" : "PayLink wallet",
  });
  rows.push({
    label: "Date",
    value: new Date(tx.createdAt).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
  rows.push({ label: "PayLink ref", value: tx.reference, mono: true, copy: true });
  if (tx.providerReference) {
    rows.push({
      label: "Provider ref",
      value: tx.providerReference,
      mono: true,
      copy: true,
    });
  }
  if (tx.failureReason) rows.push({ label: "Reason", value: tx.failureReason });
  return rows;
}

export default function ReceiptPage() {
  const params = useParams<{ id: string }>();
  const transactions = useWalletStore((s) => s.transactions);
  const tx = transactions.find((t) => t.id === params.id);
  const [copiedLabel, setCopiedLabel] = React.useState<string | null>(null);

  if (!tx) {
    return (
      <>
        <FlowHeader title="Transaction" showBalance={false} />
        <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <p className="text-[15px] text-muted-foreground">
            That transaction is no longer in this session.
          </p>
          <Button render={<Link href="/history" />} variant="outline">
            Back to history
          </Button>
        </div>
      </>
    );
  }

  const rows = buildRows(tx);

  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(null), 1600);
  };

  return (
    <>
      <FlowHeader title="Transaction" showBalance={false} />

      <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col gap-4 px-5 py-5">
        <div className="flex flex-col gap-5 rounded-[18px] border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-3 border-b border-dashed border-border pb-5">
            <BrandLockup tileClassName="size-7 rounded-lg" />
            <StatusBadge status={tx.status} label={statusLabel(tx.status)} />
          </div>

          <div className="flex flex-col items-center gap-1.5 py-1">
            <span
              className={cn(
                "font-mono tabular text-[32px] leading-none font-medium tracking-[-0.02em]",
                tx.amount > 0 && "text-success-fg"
              )}
            >
              {naira(tx.amount, { sign: true })}
            </span>
            <span className="text-[13px] text-muted-foreground">{tx.title}</span>
          </div>

          <div className="flex flex-col gap-3 border-t border-dashed border-border pt-5">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4"
              >
                <span className="shrink-0 text-[13px] text-muted-foreground">
                  {row.label}
                </span>
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "truncate text-right text-[13px] font-medium",
                      row.mono && "font-mono tabular"
                    )}
                  >
                    {row.value}
                  </span>
                  {row.copy ? (
                    <button
                      type="button"
                      onClick={() => copy(row.label, row.value)}
                      aria-label={`Copy ${row.label}`}
                      className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {copiedLabel === row.label ? (
                        <Check strokeWidth={2} className="size-3.5 text-success-fg" />
                      ) : (
                        <Copy strokeWidth={1.75} className="size-3.5" />
                      )}
                    </button>
                  ) : null}
                </span>
              </div>
            ))}
          </div>
        </div>

        {tx.service !== "funding" ? (
          <Button
            render={<Link href={`/buy/${tx.service}`} />}
            size="xl"
            className="w-full"
          >
            <Repeat2 strokeWidth={1.75} className="size-4" />
            Buy this again
          </Button>
        ) : null}

        <div className="flex gap-2.5">
          <Button variant="outline" size="lg" className="flex-1">
            <TriangleAlert strokeWidth={1.75} className="size-4" />
            Report issue
          </Button>
          <Button variant="outline" size="lg" className="flex-1">
            <Share2 strokeWidth={1.75} className="size-4" />
            Share receipt
          </Button>
        </div>
      </div>
    </>
  );
}
