"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlowFooter, FlowHeader } from "@/components/paylink/flow-header";
import {
  AmountInput,
  Field,
  FormCard,
  PresetChips,
  SummaryRow,
} from "@/components/paylink/form-parts";
import { FUND_PRESETS, PAYSTACK_FEE_RATE } from "@/lib/catalog";
import { naira } from "@/lib/format";
import { makeReference } from "@/store/purchase";
import { useWalletStore } from "@/store/wallet";

export default function FundPage() {
  const router = useRouter();
  const balance = useWalletStore((s) => s.balance);
  const fund = useWalletStore((s) => s.fund);
  const [raw, setRaw] = React.useState("5000");

  const amount = Number(raw.replace(/\D/g, "")) || 0;
  const fee = Math.round(amount * PAYSTACK_FEE_RATE * 100) / 100;
  const total = amount + fee;
  const valid = amount >= 100;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    fund(amount, {
      id: `tx-${Date.now()}`,
      reference: makeReference().replace("PL-", "PSK-"),
      service: "funding",
      title: "Wallet funding",
      recipient: "Paystack",
      meta: "Paystack · card",
      amount,
      fee,
      status: "success",
      createdAt: new Date().toISOString(),
      group: "Today",
      time: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    router.push("/dashboard");
  };

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col">
      <FlowHeader title="Fund wallet" showBalance={false} />

      <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col gap-4 px-5 py-5">
        <FormCard>
          <Field label="How much?">
            <AmountInput
              value={Number(raw.replace(/\D/g, "")).toLocaleString("en-NG")}
              onChange={(e) => setRaw(e.target.value)}
              autoFocus
            />
          </Field>
          <PresetChips
            presets={FUND_PRESETS}
            value={FUND_PRESETS.includes(amount) ? amount : null}
            onSelect={(v) => setRaw(String(v))}
          />
        </FormCard>

        <FormCard>
          <span className="text-[13px] font-medium">How you&apos;ll pay</span>
          <div className="flex items-center gap-3 rounded-xl border border-primary bg-[oklch(0.97_0.015_168)] p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-[15px] font-semibold text-white">
              P
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-[14px] font-medium">Paystack checkout</span>
              <span className="truncate text-[12.5px] text-muted-foreground">
                Card, transfer, USSD or bank
              </span>
            </span>
            <span className="ml-auto size-[18px] shrink-0 rounded-full border-[5px] border-primary" />
          </div>
          <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-muted-foreground">
            <Info strokeWidth={1.75} className="mt-px size-4 shrink-0" />
            You pay on Paystack&apos;s page. PayLink never sees your card.
          </p>
        </FormCard>

        <FormCard className="gap-3">
          <SummaryRow label="Amount to your wallet" value={naira(amount)} />
          <SummaryRow
            label={`Paystack fee · ${PAYSTACK_FEE_RATE * 100}%`}
            value={naira(fee)}
          />
          <div className="border-t border-border pt-3">
            <SummaryRow label="You pay" value={naira(total)} strong />
          </div>
        </FormCard>

        <p className="px-1 text-[12.5px] leading-relaxed text-muted-foreground">
          Balance goes from {naira(balance)} to {naira(balance + amount)} once
          Paystack confirms.
        </p>
      </div>

      <FlowFooter>
        <div className="mx-auto max-w-[560px]">
          <Button type="submit" size="xl" disabled={!valid} className="w-full">
            Continue to Paystack · {naira(total)}
          </Button>
        </div>
      </FlowFooter>
    </form>
  );
}
