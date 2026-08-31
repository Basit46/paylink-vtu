"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlowFooter, FlowHeader } from "@/components/paylink/flow-header";
import { Field, FormCard } from "@/components/paylink/form-parts";
import { NetworkSelector } from "@/components/paylink/network-selector";
import { DATA_PLANS, NETWORKS, detectNetwork } from "@/lib/catalog";
import { formatPhone, naira } from "@/lib/format";
import type { DataPlan, NetworkId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAssistantStore } from "@/store/assistant";
import { usePurchaseStore } from "@/store/purchase";

const BUCKETS: { id: DataPlan["bucket"]; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "mega", label: "Mega" },
];

export default function BuyDataPage() {
  const begin = usePurchaseStore((s) => s.begin);
  const filledForm = useAssistantStore((s) => s.filledForm);

  const [phone, setPhone] = React.useState(filledForm?.recipient ?? "");
  const [manualNetwork, setManualNetwork] = React.useState<NetworkId | null>(
    (filledForm?.network as NetworkId) ?? null
  );
  const [bucket, setBucket] = React.useState<DataPlan["bucket"]>("monthly");
  const [planId, setPlanId] = React.useState<string | null>(
    filledForm?.planId ?? null
  );

  const digits = phone.replace(/\D/g, "");
  const detected = detectNetwork(digits);
  const network = manualNetwork ?? detected?.id ?? null;
  const networkName = NETWORKS.find((n) => n.id === network)?.name ?? "";

  const plans = DATA_PLANS.filter(
    (p) => p.bucket === bucket && (!network || p.network === network)
  );
  const plan = DATA_PLANS.find((p) => p.id === planId) ?? null;
  const valid = digits.length === 11 && network !== null && plan !== null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || !plan) return;
    begin({
      service: "data",
      title: `${networkName} ${plan.size} · ${plan.validity}`,
      recipient: formatPhone(digits),
      amount: plan.price,
      fee: 0,
      providerName: `${networkName} Data`,
      lines: [
        { label: "Plan", value: `${networkName} ${plan.size} · ${plan.validity}` },
        { label: "Recipient", value: formatPhone(digits), mono: true },
        { label: "Fee", value: naira(0), mono: true },
      ],
      successHeadline: "Data delivered",
      successDetail: `${plan.size} ${networkName} data sent to ${formatPhone(digits)}`,
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col">
      <FlowHeader title="Buy data" />

      <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col gap-4 px-5 py-5">
        <FormCard>
          <Field label="Send to">
            <input
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              inputMode="tel"
              autoFocus={!phone}
              placeholder="0801 234 5678"
              className="h-13 w-full rounded-xl border border-border bg-card px-4 font-mono text-[16px] outline-none placeholder:text-[oklch(0.78_0.01_264)] focus:border-primary focus:ring-3 focus:ring-primary/15"
            />
          </Field>
          <Field
            label="Network"
            hint={
              detected && !manualNetwork ? "Detected from number" : undefined
            }
          >
            <NetworkSelector value={network} onChange={setManualNetwork} />
          </Field>
        </FormCard>

        <FormCard className="gap-4">
          <Tabs
            value={bucket}
            onValueChange={(v) => setBucket(v as DataPlan["bucket"])}
          >
            <TabsList className="w-full">
              {BUCKETS.map((b) => (
                <TabsTrigger key={b.id} value={b.id} className="flex-1">
                  {b.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex flex-col gap-2">
            {plans.length === 0 ? (
              <p className="py-6 text-center text-[13px] text-muted-foreground">
                No {bucket} plans for this network.
              </p>
            ) : (
              plans.map((p) => {
                const active = p.id === planId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlanId(p.id)}
                    aria-pressed={active}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                      active
                        ? "border-primary bg-[oklch(0.97_0.015_168)]"
                        : "border-border bg-card hover:border-input"
                    )}
                  >
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-[15px] font-medium">
                        {p.size} — {p.validity}
                      </span>
                      <span className="font-mono text-[11.5px] text-muted-foreground">
                        {p.id}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono tabular text-[14px] font-medium">
                      {naira(p.price).replace(".00", "")}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </FormCard>
      </div>

      <FlowFooter>
        <div className="mx-auto flex max-w-[560px] flex-col gap-3">
          {plan ? (
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[13px] text-muted-foreground">
                {networkName} {plan.size} · {plan.validity}
              </span>
              <span className="font-mono tabular text-[15px] font-medium">
                {naira(plan.price)}
              </span>
            </div>
          ) : null}
          <Button type="submit" size="xl" disabled={!valid} className="w-full">
            Continue · {naira(plan?.price ?? 0)}
          </Button>
        </div>
      </FlowFooter>
    </form>
  );
}
