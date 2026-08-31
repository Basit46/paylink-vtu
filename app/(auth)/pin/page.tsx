"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AuthHeader } from "@/components/paylink/auth-header";
import { PinDots, PinPad } from "@/components/paylink/pin-pad";
import { useSessionStore } from "@/store/session";

export default function SetPinPage() {
  const router = useRouter();
  const setPin = useSessionStore((s) => s.setPin);
  const [stage, setStage] = React.useState<"create" | "confirm">("create");
  const [first, setFirst] = React.useState("");
  const [entry, setEntry] = React.useState("");
  const [error, setError] = React.useState(false);

  const commit = (value: string) => {
    if (stage === "create") {
      setFirst(value);
      setEntry("");
      setStage("confirm");
      return;
    }
    if (value !== first) {
      setError(true);
      window.setTimeout(() => {
        setError(false);
        setEntry("");
        setFirst("");
        setStage("create");
      }, 700);
      return;
    }
    setPin(value);
    router.push("/dashboard");
  };

  const onKey = (digit: string) => {
    if (entry.length >= 4 || error) return;
    const next = entry + digit;
    setEntry(next);
    if (next.length === 4) window.setTimeout(() => commit(next), 140);
  };

  return (
    <>
      <AuthHeader onBack={() => (stage === "confirm" ? setStage("create") : router.back())} />
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-2.5 pt-4">
          <h1 className="text-[26px] font-semibold tracking-[-0.025em]">
            {stage === "create" ? "Create a 4-digit PIN" : "Confirm your PIN"}
          </h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            You&apos;ll enter this to approve any payment — including ones the
            assistant sets up for you.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 pt-12">
          <PinDots length={4} filled={entry.length} error={error} />
          {error ? (
            <span className="text-[13px] text-failed-fg">
              PINs did not match. Start again.
            </span>
          ) : null}
        </div>

        <div className="mx-auto mt-auto w-full max-w-[300px] pt-10">
          <PinPad onKey={onKey} onBackspace={() => setEntry((p) => p.slice(0, -1))} />
        </div>
      </div>
    </>
  );
}
