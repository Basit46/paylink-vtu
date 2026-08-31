"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FlowFooter, FlowHeader } from "@/components/paylink/flow-header";
import {
  AmountInput,
  Field,
  FormCard,
  PresetChips,
} from "@/components/paylink/form-parts";
import {
  VerifiedResult,
  VerifyingRow,
} from "@/components/paylink/verified-result";
import { DISCOS, POWER_PRESETS } from "@/lib/catalog";
import { formatMeter, naira } from "@/lib/format";
import { METER_LOOKUP } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { usePurchaseStore } from "@/store/purchase";

type MeterType = "prepaid" | "postpaid";
type Verification =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "ok"; name: string; address: string }
  | { state: "unknown" };

export default function BuyElectricityPage() {
  const begin = usePurchaseStore((s) => s.begin);

  const [discoId, setDiscoId] = React.useState("ikedc");
  const [meterType, setMeterType] = React.useState<MeterType>("prepaid");
  const [meter, setMeter] = React.useState("");
  const [rawAmount, setRawAmount] = React.useState("");
  const [lookup, setLookup] = React.useState<{
    key: string;
    hit: { name: string; address: string } | null;
  } | null>(null);

  const digits = meter.replace(/\D/g, "");
  const disco = DISCOS.find((d) => d.id === discoId)!;
  const amount = Number(rawAmount.replace(/\D/g, "")) || 0;

  React.useEffect(() => {
    if (digits.length < 11) return;
    const timer = window.setTimeout(() => {
      setLookup({ key: digits, hit: METER_LOOKUP[digits] ?? null });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [digits]);

  const verification: Verification =
    digits.length < 11
      ? { state: "idle" }
      : lookup?.key !== digits
        ? { state: "checking" }
        : lookup.hit
          ? { state: "ok", ...lookup.hit }
          : { state: "unknown" };

  const verified = verification.state === "ok" ? verification : null;
  const valid = verified !== null && amount >= 500;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || !verified) return;
    begin({
      service: "electricity",
      title: `${disco.short} ${meterType}`,
      recipient: formatMeter(digits),
      amount,
      fee: 0,
      providerName: `${disco.name} · ${meterType}`,
      verifiedName: verified.name,
      lines: [
        { label: "Service", value: `${disco.short} ${meterType}` },
        { label: "Meter", value: formatMeter(digits), mono: true },
        { label: "Name", value: verified.name, mono: true },
      ],
      successHeadline: "Token delivered",
      successDetail: `${naira(amount)} · ${disco.name} ${meterType}`,
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col">
      <FlowHeader title="Electricity" />

      <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col gap-4 px-5 py-5">
        <FormCard>
          <Field label="Distribution company">
            <Select value={discoId} onValueChange={(v) => v && setDiscoId(v)}>
              <SelectTrigger className="h-13 w-full rounded-xl text-[15px]">
                <SelectValue placeholder="Select a distribution company" />
              </SelectTrigger>
              <SelectContent>
                {DISCOS.map((d) => (
                  <SelectItem key={d.id} value={d.id} disabled={!d.available}>
                    {d.name} ({d.short}){!d.available ? " — unavailable" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Meter type">
            <div className="grid grid-cols-2 gap-2">
              {(["prepaid", "postpaid"] as MeterType[]).map((type) => {
                const active = meterType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMeterType(type)}
                    aria-pressed={active}
                    className={cn(
                      "flex h-12 items-center gap-2.5 rounded-xl border px-4 text-[14px] font-medium capitalize transition-colors",
                      active
                        ? "border-primary bg-[oklch(0.97_0.015_168)]"
                        : "border-border bg-card hover:border-input"
                    )}
                  >
                    <span
                      className={cn(
                        "size-[18px] shrink-0 rounded-full border",
                        active
                          ? "border-[5px] border-primary"
                          : "border-input bg-card"
                      )}
                    />
                    {type}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field
            label="Meter number"
            error={
              verification.state === "unknown"
                ? "We could not find that meter on " + disco.short + "."
                : undefined
            }
          >
            <input
              value={meter}
              onChange={(e) => setMeter(formatMeter(e.target.value))}
              inputMode="numeric"
              autoFocus
              placeholder="04197 2210 88"
              className="h-13 w-full rounded-xl border border-border bg-card px-4 font-mono text-[16px] outline-none placeholder:text-[oklch(0.78_0.01_264)] focus:border-primary focus:ring-3 focus:ring-primary/15"
            />
          </Field>

          {verification.state === "checking" ? (
            <VerifyingRow label="Checking meter with the disco…" />
          ) : null}
          {verified ? (
            <VerifiedResult
              label="Meter verified"
              name={verified.name}
              detail={verified.address}
            />
          ) : null}
        </FormCard>

        <FormCard>
          <Field label="Amount">
            <AmountInput
              value={rawAmount}
              onChange={(e) =>
                setRawAmount(e.target.value.replace(/\D/g, "").slice(0, 7))
              }
              placeholder="0"
            />
          </Field>
          <PresetChips
            presets={POWER_PRESETS}
            value={POWER_PRESETS.includes(amount) ? amount : null}
            onSelect={(v) => setRawAmount(String(v))}
          />
        </FormCard>
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
