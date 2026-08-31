"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "@/components/paylink/auth-header";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/store/session";

const LENGTH = 6;

export default function OtpPage() {
  const router = useRouter();
  const { phone, verifyOtp } = useSessionStore();
  const [code, setCode] = React.useState<string[]>(Array(LENGTH).fill(""));
  const [seconds, setSeconds] = React.useState(24);
  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (seconds === 0) return;
    const timer = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  const complete = code.every((d) => d !== "");

  const setDigit = (index: number, value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setCode((prev) => prev.map((d, i) => (i === index ? "" : d)));
      return;
    }
    setCode((prev) => {
      const next = [...prev];
      for (let i = 0; i < digits.length && index + i < LENGTH; i++) {
        next[index + i] = digits[i];
      }
      return next;
    });
    const target = Math.min(index + digits.length, LENGTH - 1);
    inputs.current[target]?.focus();
  };

  const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <>
      <AuthHeader />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          verifyOtp();
          router.push("/pin");
        }}
        className="flex flex-1 flex-col"
      >
        <div className="flex flex-col gap-2.5 pt-4">
          <h1 className="text-[28px] font-semibold tracking-[-0.025em]">
            Enter the code
          </h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Sent to <span className="font-mono text-foreground">+234 {phone.replace(/^0/, "")}</span>.{" "}
            <button
              type="button"
              onClick={() => router.push("/phone")}
              className="text-primary underline-offset-4 hover:underline"
            >
              Change
            </button>
          </p>
        </div>

        <div className="flex gap-2.5 pt-8">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              value={digit}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              inputMode="numeric"
              maxLength={LENGTH}
              autoFocus={i === 0}
              aria-label={`Digit ${i + 1}`}
              className={cn(
                "h-14 w-full min-w-0 rounded-xl border bg-card text-center font-mono text-[22px] font-medium outline-none transition-colors",
                digit ? "border-primary" : "border-border",
                "focus:border-primary focus:ring-3 focus:ring-primary/15"
              )}
            />
          ))}
        </div>

        <div className="pt-5">
          {seconds > 0 ? (
            <span className="font-mono text-[13px] text-muted-foreground">
              Resend in 0:{String(seconds).padStart(2, "0")}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setSeconds(24)}
              className="text-[13px] font-medium text-primary underline-offset-4 hover:underline"
            >
              Resend code
            </button>
          )}
        </div>

        <div className="mt-auto pt-10">
          <Button type="submit" size="xl" disabled={!complete} className="w-full">
            Verify
          </Button>
        </div>
      </form>
    </>
  );
}
