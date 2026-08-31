"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { FlowFooter, FlowHeader } from "@/components/paylink/flow-header";
import { Field, FormCard } from "@/components/paylink/form-parts";
import {
  VerifiedResult,
  VerifyingRow,
} from "@/components/paylink/verified-result";
import { CABLE_PACKAGES, CABLE_PROVIDERS } from "@/lib/catalog";
import { naira } from "@/lib/format";
import { SMARTCARD_LOOKUP } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { usePurchaseStore } from "@/store/purchase";

type Verification =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "ok"; name: string; current: string; expires: string }
  | { state: "unknown" };

function formatSmartcard(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 10)
    .replace(/(.{4})(.{4})(.*)/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join(" ")
    )
    .trim();
}

export default function BuyCablePage() {
  const begin = usePurchaseStore((s) => s.begin);

  const [providerId, setProviderId] = React.useState("dstv");
  const [card, setCard] = React.useState("");
  const [packageId, setPackageId] = React.useState<string | null>(null);
  const [lookup, setLookup] = React.useState<{
    key: string;
    hit: { name: string; current: string; expires: string } | null;
  } | null>(null);

  const digits = card.replace(/\D/g, "");
  const provider = CABLE_PROVIDERS.find((p) => p.id === providerId)!;
  const packages = CABLE_PACKAGES.filter((p) => p.provider === providerId);

  React.useEffect(() => {
    if (digits.length < 10) return;
    const timer = window.setTimeout(() => {
      setLookup({ key: digits, hit: SMARTCARD_LOOKUP[digits] ?? null });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [digits]);

  const verification: Verification =
    digits.length < 10
      ? { state: "idle" }
      : lookup?.key !== digits
        ? { state: "checking" }
        : lookup.hit
          ? { state: "ok", ...lookup.hit }
          : { state: "unknown" };

  const verified = verification.state === "ok" ? verification : null;

  // The customer's existing package is preselected until they pick another.
  const currentPackage = verified
    ? (packages.find((p) => p.name === verified.current) ?? null)
    : null;
  const effectivePackageId = packageId ?? currentPackage?.id ?? null;

  const pkg = CABLE_PACKAGES.find((p) => p.id === effectivePackageId) ?? null;
  const valid = verified !== null && pkg !== null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || !pkg || !verified) return;
    begin({
      service: "cable",
      title: `${provider.name} ${pkg.name}`,
      recipient: formatSmartcard(digits),
      amount: pkg.price,
      fee: 0,
      providerName: `${provider.name} ${pkg.name}`,
      verifiedName: verified.name,
      lines: [
        { label: "Package", value: `${provider.name} ${pkg.name}` },
        { label: "Smartcard", value: formatSmartcard(digits), mono: true },
        { label: "Name", value: verified.name, mono: true },
      ],
      successHeadline: "Subscription active",
      successDetail: `${provider.name} ${pkg.name} · ${pkg.cadence}`,
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col">
      <FlowHeader title="Cable TV" />

      <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col gap-4 px-5 py-5">
        <FormCard>
          <Field label="Provider">
            <div className="grid grid-cols-3 gap-2">
              {CABLE_PROVIDERS.map((p) => {
                const active = p.id === providerId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setProviderId(p.id);
                      setPackageId(null);
                    }}
                    aria-pressed={active}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border py-3 transition-colors",
                      active
                        ? "border-primary bg-[oklch(0.97_0.015_168)]"
                        : "border-border bg-card hover:border-input"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full font-mono text-[11px] font-medium",
                        active
                          ? "bg-primary text-white"
                          : "bg-muted text-secondary-foreground"
                      )}
                    >
                      {p.short}
                    </span>
                    <span className="text-[12px] font-medium">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </Field>

          <Field
            label="Smartcard number"
            error={
              verification.state === "unknown"
                ? `We could not find that smartcard on ${provider.name}.`
                : undefined
            }
          >
            <input
              value={card}
              onChange={(e) => setCard(formatSmartcard(e.target.value))}
              inputMode="numeric"
              autoFocus
              placeholder="7012 3456 78"
              className="h-13 w-full rounded-xl border border-border bg-card px-4 font-mono text-[16px] outline-none placeholder:text-[oklch(0.78_0.01_264)] focus:border-primary focus:ring-3 focus:ring-primary/15"
            />
          </Field>

          {verification.state === "checking" ? (
            <VerifyingRow label="Looking up the smartcard…" />
          ) : null}
          {verified ? (
            <VerifiedResult
              label="Smartcard verified"
              name={verified.name}
              detail={`Current: ${verified.current} · expires ${verified.expires}`}
            />
          ) : null}
        </FormCard>

        <FormCard>
          <Field label="Package">
            <div className="flex flex-col gap-2">
              {packages.map((p) => {
                const active = p.id === effectivePackageId;
                const isCurrent = verified?.current === p.name;
                const currentPrice = packages.find(
                  (x) => x.name === verified?.current
                )?.price;
                const note = isCurrent
                  ? `${p.cadence} · renews plan`
                  : currentPrice !== undefined && p.price > currentPrice
                    ? `${p.cadence} · upgrade`
                    : p.cadence;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPackageId(p.id)}
                    aria-pressed={active}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                      active
                        ? "border-primary bg-[oklch(0.97_0.015_168)]"
                        : "border-border bg-card hover:border-input"
                    )}
                  >
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="flex items-center gap-2">
                        <span className="text-[15px] font-medium">{p.name}</span>
                        {isCurrent ? (
                          <span className="rounded-full bg-primary px-[7px] py-0.5 text-[10.5px] font-medium tracking-[0.04em] text-white uppercase">
                            Current
                          </span>
                        ) : null}
                      </span>
                      <span className="text-[12.5px] text-muted-foreground">
                        {note}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono tabular text-[14px] font-medium">
                      {naira(p.price).replace(".00", "")}
                    </span>
                  </button>
                );
              })}
            </div>
          </Field>
        </FormCard>
      </div>

      <FlowFooter>
        <div className="mx-auto max-w-[560px]">
          <Button type="submit" size="xl" disabled={!valid} className="w-full">
            Continue · {naira(pkg?.price ?? 0)}
          </Button>
        </div>
      </FlowFooter>
    </form>
  );
}
