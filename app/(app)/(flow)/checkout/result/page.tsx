"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CircleCheck,
  CircleX,
  Copy,
  Receipt,
  Share2,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SummaryRow } from "@/components/paylink/form-parts";
import { Eyebrow } from "@/components/paylink/form-parts";
import { clockTime, naira } from "@/lib/format";
import { usePurchaseStore } from "@/store/purchase";
import { useWalletStore } from "@/store/wallet";

export default function ResultPage() {
  const router = useRouter();
  const { draft, transaction, stage, clear } = usePurchaseStore();
  const balance = useWalletStore((s) => s.balance);
  const [copied, setCopied] = React.useState(false);
  const [refundedAt] = React.useState(() => clockTime());

  React.useEffect(() => {
    if (stage !== "success" && stage !== "failed") router.replace("/dashboard");
  }, [stage, router]);

  if (!draft || !transaction || (stage !== "success" && stage !== "failed")) {
    return null;
  }

  const amount = Math.abs(transaction.amount);
  const failed = stage === "failed";

  const copy = (value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-6 py-10">
      <div className="flex flex-col gap-4">
        <span
          className={
            failed
              ? "flex size-12 items-center justify-center rounded-full bg-failed-bg text-failed-fg"
              : "flex size-12 items-center justify-center rounded-full bg-success-bg text-success-fg"
          }
        >
          {failed ? (
            <CircleX strokeWidth={1.75} className="size-6" />
          ) : (
            <CircleCheck strokeWidth={1.75} className="size-6" />
          )}
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="text-[24px] font-semibold tracking-[-0.025em]">
            {failed ? "Purchase failed" : draft.successHeadline}
          </h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            {failed
              ? `${draft.providerName} rejected the request for ${draft.recipient}. Nothing was delivered.`
              : draft.successDetail}
          </p>
        </div>
      </div>

      {failed ? (
        <div className="mt-7 flex items-start gap-3 rounded-[16px] border border-[oklch(0.85_0.06_150)] bg-[oklch(0.96_0.03_150)] p-4">
          <Undo2
            strokeWidth={1.75}
            className="mt-0.5 size-[18px] shrink-0 text-success-fg"
          />
          <span className="flex flex-col gap-1">
            <span className="text-[15px] font-medium text-success-fg">
              {naira(amount)} refunded to your wallet
            </span>
            <span className="text-[12.5px] text-secondary-foreground">
              Completed automatically at {refundedAt}
            </span>
          </span>
        </div>
      ) : transaction.token ? (
        <div className="mt-7 flex flex-col gap-3 rounded-[16px] border border-border bg-card p-5">
          <Eyebrow className="tracking-[0.06em] text-[var(--primary-hover)]">
            Meter token
          </Eyebrow>
          <span className="font-mono tabular text-[26px] leading-tight font-medium tracking-[0.02em]">
            {transaction.token}
          </span>
          <Button
            type="button"
            variant="subtle"
            size="sm"
            className="w-fit"
            onClick={() => copy(transaction.token!)}
          >
            <Copy strokeWidth={1.75} className="size-3.5" />
            {copied ? "Copied" : "Copy token"}
          </Button>
        </div>
      ) : (
        <div className="mt-7 flex flex-col gap-2 rounded-[16px] border border-border bg-card p-5">
          <Eyebrow className="tracking-[0.06em] text-[var(--primary-hover)]">
            Delivered
          </Eyebrow>
          <span className="font-mono tabular text-[24px] font-medium tracking-[-0.01em]">
            {naira(amount)}
          </span>
          <span className="text-[13px] text-muted-foreground">
            {draft.title} · {draft.recipient}
          </span>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 rounded-[16px] bg-muted p-4">
        {failed ? (
          <>
            <SummaryRow
              label="Reason"
              value={transaction.failureReason ?? "Provider declined"}
              mono={false}
            />
            <SummaryRow label="Reference" value={transaction.reference} />
            <SummaryRow label="Balance" value={naira(balance)} />
          </>
        ) : (
          <>
            {transaction.units ? (
              <SummaryRow label="Units" value={transaction.units} />
            ) : null}
            <SummaryRow label="Reference" value={transaction.reference} />
            <SummaryRow label="New balance" value={naira(balance)} />
          </>
        )}
      </div>

      {failed ? (
        <p className="mt-4 text-[12.5px] leading-relaxed text-muted-foreground">
          Failures on {draft.providerName} are usually a wrong prefix. Check the
          number, or try a different network.
        </p>
      ) : null}

      <div className="mt-auto flex flex-col gap-2.5 pt-9">
        {failed ? (
          <>
            <Button
              size="xl"
              className="w-full"
              onClick={() => {
                clear();
                router.push(`/buy/${draft.service}`);
              }}
            >
              Try again
            </Button>
            <Button
              render={<Link href="/settings" />}
              variant="ghost"
              size="lg"
              className="w-full"
            >
              Contact support
            </Button>
          </>
        ) : (
          <>
            <Button
              size="xl"
              className="w-full"
              onClick={() => {
                clear();
                router.push("/dashboard");
              }}
            >
              Done
            </Button>
            <div className="flex gap-2.5">
              <Button
                render={<Link href={`/history/${transaction.id}`} />}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                <Receipt strokeWidth={1.75} className="size-4" />
                Receipt
              </Button>
              <Button variant="outline" size="lg" className="flex-1">
                <Share2 strokeWidth={1.75} className="size-4" />
                Share
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
