"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FlowFooter, FlowHeader } from "@/components/paylink/flow-header";
import {
  AmountInput,
  Field,
  FormCard,
  PresetChips,
} from "@/components/paylink/form-parts";
import { NetworkSelector } from "@/components/paylink/network-selector";
import { AIRTIME_PRESETS, NETWORKS, detectNetwork } from "@/lib/catalog";
import { formatPhone, naira } from "@/lib/format";
import type { NetworkId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { usePurchaseStore } from "@/store/purchase";
import { useWalletStore } from "@/store/wallet";

export default function BuyAirtimePage() {
  const begin = usePurchaseStore((s) => s.begin);
  const recipients = useWalletStore((s) => s.recipients);
  const quick = recipients.filter((r) => r.kind === "phone").slice(0, 3);

  const [phone, setPhone] = React.useState("");
  const [manualNetwork, setManualNetwork] = React.useState<NetworkId | null>(null);
  const [rawAmount, setRawAmount] = React.useState("");
  const [save, setSave] = React.useState(false);

  const digits = phone.replace(/\D/g, "");
  const detected = detectNetwork(digits);
  const network = manualNetwork ?? detected?.id ?? null;
  const amount = Number(rawAmount.replace(/\D/g, "")) || 0;
  const valid = digits.length === 11 && network !== null && amount >= 50;

  const networkName = NETWORKS.find((n) => n.id === network)?.name ?? "";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    begin(
      {
        service: "airtime",
        title: `${networkName} Airtime`,
        recipient: formatPhone(digits),
        amount,
        fee: 0,
        providerName: `${networkName} Airtime`,
        lines: [
          { label: "Product", value: `${networkName} Airtime` },
          { label: "Recipient", value: formatPhone(digits), mono: true },
          { label: "Fee", value: naira(0), mono: true },
        ],
        successHeadline: "Airtime delivered",
        successDetail: `${naira(amount)} ${networkName} airtime sent to ${formatPhone(digits)}`,
      },
      save
    );
  };

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col">
      <FlowHeader title="Buy airtime" />

      <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col gap-4 px-5 py-5">
        <FormCard>
          <Field
            label="Send to"
            action={
              <Link href="/recipients" className="text-[12.5px] font-medium">
                Contacts
              </Link>
            }
          >
            <input
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              inputMode="tel"
              autoFocus
              placeholder="0801 234 5678"
              className="h-13 w-full rounded-xl border border-border bg-card px-4 font-mono text-[16px] outline-none placeholder:text-[oklch(0.78_0.01_264)] focus:border-primary focus:ring-3 focus:ring-primary/15"
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            {quick.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setPhone(r.number);
                  setManualNetwork(null);
                }}
                className="h-8 rounded-full border border-border bg-card px-3 text-[12.5px] text-secondary-foreground transition-colors hover:border-input"
              >
                {r.name}
              </button>
            ))}
          </div>
        </FormCard>

        <FormCard>
          <Field
            label="Network"
            hint={
              detected && !manualNetwork
                ? "Detected from number"
                : "Pick the network for this line"
            }
          >
            <NetworkSelector value={network} onChange={setManualNetwork} />
          </Field>
        </FormCard>

        <FormCard>
          <Field label="Amount">
            <AmountInput
              value={rawAmount}
              onChange={(e) =>
                setRawAmount(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="0"
            />
          </Field>
          <PresetChips
            presets={AIRTIME_PRESETS}
            value={AIRTIME_PRESETS.includes(amount) ? amount : null}
            onSelect={(v) => setRawAmount(String(v))}
          />
        </FormCard>

        <Label
          className={cn(
            "flex items-center gap-3 rounded-[14px] border border-border bg-card px-4 py-3.5 text-[13.5px] font-normal",
            digits.length !== 11 && "opacity-50"
          )}
        >
          <Checkbox
            checked={save}
            onCheckedChange={(v) => setSave(v === true)}
            disabled={digits.length !== 11}
          />
          Save {digits.length === 11 ? formatPhone(digits) : "this number"} as a
          recipient
        </Label>
      </div>

      <FlowFooter>
        <div className="mx-auto max-w-[560px]">
          <Button type="submit" size="xl" disabled={!valid} className="w-full">
            Continue · {naira(amount)}
          </Button>
        </div>
      </FlowFooter>
    </form>
  );
}
