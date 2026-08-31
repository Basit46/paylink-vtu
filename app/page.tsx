import Link from "next/link";
import { Receipt, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/paylink/brand-mark";

const ASSURANCES = [
  { icon: ShieldCheck, text: "Auto-refund if a network fails" },
  { icon: Receipt, text: "Receipt and token for every purchase" },
];

export default function WelcomePage() {
  return (
    <main className="flex flex-1 justify-center bg-brand-deep text-white">
      <div className="flex w-full max-w-[430px] flex-col justify-between px-7 pt-14 pb-9">
        <div className="flex flex-col gap-7">
          <div className="flex size-13 items-center justify-center rounded-[15px] bg-primary">
            <BrandMark className="size-8" />
          </div>
          <h1 className="text-[40px] leading-[1.08] font-semibold tracking-[-0.035em]">
            Airtime, data
            <br />
            and bills.
            <br />
            <span className="text-[oklch(0.72_0.09_168)]">Or just ask.</span>
          </h1>
          <p className="max-w-[26ch] text-[16px] leading-relaxed text-[oklch(0.82_0.02_168)]">
            Buy in four taps, or tell the assistant what you need and confirm it.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <ul className="mb-2 flex flex-col gap-2.5">
            {ASSURANCES.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-2.5 text-[13px] text-[oklch(0.85_0.02_168)]"
              >
                <Icon strokeWidth={1.75} className="size-4 shrink-0" />
                {text}
              </li>
            ))}
          </ul>
          <Button
            render={<Link href="/phone" />}
            variant="on-deep"
            size="xl"
            className="w-full"
          >
            Continue with phone number
          </Button>
          <Button
            render={<Link href="/dashboard" />}
            size="lg"
            className="w-full bg-transparent text-[oklch(0.85_0.02_168)] hover:bg-white/10 hover:text-white"
          >
            I already have an account
          </Button>
        </div>
      </div>
    </main>
  );
}
