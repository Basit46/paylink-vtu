"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { naira } from "@/lib/format";
import type { PurchaseDraft, Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/store/session";
import {
  makeReference,
  usePurchaseStore,
} from "@/store/purchase";
import { useWalletStore } from "@/store/wallet";
import { PinDots, PinPad } from "./pin-pad";
import { Eyebrow } from "./form-parts";

export function ConfirmSheet() {
  const draft = usePurchaseStore((s) => s.draft);
  const stage = usePurchaseStore((s) => s.stage);

  if (stage !== "confirming" || !draft) return null;
  // Remounting per draft is what resets the PIN entry — no effect needed.
  return <ConfirmSheetBody key={`${draft.service}-${draft.recipient}-${draft.amount}`} draft={draft} />;
}

function ConfirmSheetBody({ draft }: { draft: PurchaseDraft }) {
  const router = useRouter();
  const { cancel, authorize, saveRecipient } = usePurchaseStore();
  const { balance, debit, addRecipient } = useWalletStore();
  const expectedPin = useSessionStore((s) => s.pin);

  const [pin, setPin] = React.useState("");
  const [error, setError] = React.useState(false);

  const submit = React.useCallback(
    (entered: string) => {
      if (!draft) return;
      if (entered !== expectedPin) {
        setError(true);
        window.setTimeout(() => {
          setPin("");
          setError(false);
        }, 600);
        return;
      }

      const total = draft.amount + draft.fee;
      const tx: Transaction = {
        id: `tx-${Date.now()}`,
        reference: makeReference(),
        service: draft.service,
        title: draft.title,
        recipient: draft.recipient,
        meta: draft.recipient,
        amount: -total,
        fee: draft.fee,
        status: "pending",
        createdAt: new Date().toISOString(),
        group: "Today",
        time: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        verifiedName: draft.verifiedName,
      };

      debit(total, tx);
      if (saveRecipient) {
        addRecipient({
          id: `rcp-${Date.now()}`,
          name: draft.recipient,
          initials: draft.recipient.replace(/\D/g, "").slice(-2),
          number: draft.recipient,
          kind: draft.service === "electricity" ? "meter" : draft.service === "cable" ? "smartcard" : "phone",
          service: draft.providerName,
          serviceIcon: draft.service,
          lastUsed: "Today",
          addedOn: "Today",
          purchases: 1,
          totalSent: total,
        });
      }
      authorize(tx);
      router.push("/checkout/processing");
    },
    [draft, expectedPin, debit, saveRecipient, addRecipient, authorize, router]
  );

  const onKey = (digit: string) => {
    if (pin.length >= 4 || error) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === 4) window.setTimeout(() => submit(next), 140);
  };

  const total = draft.amount + draft.fee;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center">
      <button
        type="button"
        aria-label="Cancel"
        onClick={cancel}
        className="absolute inset-0 bg-[oklch(0.21_0.015_264/0.45)]"
      />
      <div className="relative flex w-full max-w-[430px] flex-col gap-5 rounded-t-[24px] bg-card p-6 pb-8 shadow-lg lg:rounded-[24px] lg:pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <Eyebrow className="tracking-[0.06em]">Confirm purchase</Eyebrow>
            <span className="font-mono tabular text-[30px] leading-none font-medium tracking-[-0.02em]">
              {naira(total)}
            </span>
          </div>
          <button
            type="button"
            onClick={cancel}
            aria-label="Cancel"
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X strokeWidth={1.75} className="size-[18px]" />
          </button>
        </div>

        <div className="flex flex-col gap-3 rounded-[14px] bg-muted p-4">
          {draft.lines.map((line) => (
            <div key={line.label} className="flex items-baseline justify-between gap-4">
              <span className="text-[13px] text-muted-foreground">{line.label}</span>
              <span
                className={cn(
                  "text-right text-[13px] font-medium",
                  line.mono && "font-mono tabular"
                )}
              >
                {line.value}
              </span>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-4 border-t border-border pt-3">
            <span className="text-[13px] text-muted-foreground">Balance after</span>
            <span className="font-mono tabular text-[13px] font-medium">
              {naira(balance - total)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          <span
            className={cn(
              "text-center text-[13px]",
              error ? "text-failed-fg" : "text-muted-foreground"
            )}
          >
            {error ? "Wrong PIN. Try again." : "Enter your 4-digit PIN to pay"}
          </span>
          <PinDots length={4} filled={pin.length} error={error} />
          <PinPad
            variant="sheet"
            onKey={onKey}
            onBackspace={() => setPin((p) => p.slice(0, -1))}
          />
        </div>
      </div>
    </div>
  );
}
