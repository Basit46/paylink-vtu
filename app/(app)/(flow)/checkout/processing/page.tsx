"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleCheck, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clockTime, naira } from "@/lib/format";
import {
  makeProviderReference,
  makeToken,
  usePurchaseStore,
  willFail,
} from "@/store/purchase";
import { useWalletStore } from "@/store/wallet";

const RESOLVE_AFTER_MS = 6000;

export default function ProcessingPage() {
  const router = useRouter();
  const { draft, transaction, stage, resolve } = usePurchaseStore();
  const settle = useWalletStore((s) => s.settle);
  const refund = useWalletStore((s) => s.refund);

  const [elapsed, setElapsed] = React.useState(0);
  const [stamps] = React.useState(() => {
    const now = new Date();
    return {
      debited: clockTime(now),
      sent: clockTime(new Date(now.getTime() + 1000)),
    };
  });

  React.useEffect(() => {
    if (!draft || !transaction) {
      router.replace("/dashboard");
    }
  }, [draft, transaction, router]);

  React.useEffect(() => {
    const tick = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(tick);
  }, []);

  React.useEffect(() => {
    if (!draft || !transaction || stage !== "processing") return;
    const timer = window.setTimeout(() => {
      if (willFail(draft.recipient)) {
        refund(transaction.id, Math.abs(transaction.amount));
        resolve("failed", {
          status: "reversed",
          failureReason: "Provider declined",
          providerReference: makeProviderReference(),
        });
      } else {
        const patch = {
          status: "success" as const,
          providerReference: makeProviderReference(),
          token: draft.service === "electricity" ? makeToken() : undefined,
          units: draft.service === "electricity" ? "148.6 kWh" : undefined,
        };
        settle(transaction.id, "success", patch);
        resolve("success", patch);
      }
      router.replace("/checkout/result");
    }, RESOLVE_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [draft, transaction, stage, resolve, router, settle, refund]);

  if (!draft || !transaction) return null;

  const steps = [
    { label: "Wallet debited", meta: stamps.debited, done: true },
    { label: "Request sent to provider", meta: stamps.sent, done: true },
    {
      label:
        draft.service === "electricity" ? "Awaiting token" : "Awaiting delivery",
      meta: `${elapsed}s`,
      done: false,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-6 py-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-[24px] font-semibold tracking-[-0.025em]">
          Sending to {draft.providerName}
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Your wallet has been debited{" "}
          <span className="font-mono text-foreground">
            {naira(Math.abs(transaction.amount))}
          </span>
          . We are waiting for the provider to return your{" "}
          {draft.service === "electricity" ? "token" : "confirmation"}.
        </p>
      </div>

      <ol className="flex flex-col gap-0 pt-9">
        {steps.map((step, i) => (
          <li key={step.label} className="flex gap-3.5">
            <span className="flex flex-col items-center">
              {step.done ? (
                <CircleCheck
                  strokeWidth={1.75}
                  className="size-[22px] shrink-0 text-success"
                />
              ) : (
                <LoaderCircle
                  strokeWidth={1.75}
                  className="size-[22px] shrink-0 animate-spin text-primary"
                />
              )}
              {i < steps.length - 1 ? (
                <span className="my-1 w-px flex-1 bg-border" />
              ) : null}
            </span>
            <span className="flex flex-1 items-baseline justify-between gap-4 pb-6">
              <span className="text-[14.5px] font-medium">{step.label}</span>
              <span className="font-mono tabular text-[12.5px] text-muted-foreground">
                {step.meta}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <p className="rounded-[14px] bg-muted px-4 py-3.5 text-[12.5px] leading-relaxed text-muted-foreground">
        You can close this screen. If the provider does not respond, your wallet
        is refunded automatically and you will be notified.
      </p>

      <div className="mt-auto pt-8">
        <Button
          render={<Link href="/dashboard" />}
          variant="outline"
          size="xl"
          className="w-full"
        >
          Back to home
        </Button>
      </div>
    </div>
  );
}
