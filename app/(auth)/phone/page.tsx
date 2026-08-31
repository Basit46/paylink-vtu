"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "@/components/paylink/auth-header";
import { Field } from "@/components/paylink/form-parts";
import { detectNetwork } from "@/lib/catalog";
import { formatPhone } from "@/lib/format";
import { useSessionStore } from "@/store/session";

const schema = z.object({
  phone: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 10 || v.length === 11, {
      message: "Enter a valid Nigerian phone number.",
    }),
});

export default function PhonePage() {
  const router = useRouter();
  const setPhone = useSessionStore((s) => s.setPhone);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<{ phone: string }>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { phone: "" },
  });

  const raw = useWatch({ control, name: "phone" }) ?? "";
  const digits = raw.replace(/\D/g, "");
  const network = detectNetwork(digits.length === 10 ? `0${digits}` : digits);

  return (
    <>
      <AuthHeader />
      <form
        onSubmit={handleSubmit(({ phone }) => {
          setPhone(formatPhone(phone.length === 10 ? `0${phone}` : phone));
          router.push("/otp");
        })}
        className="flex flex-1 flex-col"
      >
        <div className="flex flex-col gap-2.5 pt-4">
          <h1 className="text-[28px] font-semibold tracking-[-0.025em]">
            What&apos;s your number?
          </h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            We send a 6-digit code to confirm it. This number becomes your
            account.
          </p>
        </div>

        <div className="pt-8">
          <Field
            label="Phone number"
            error={errors.phone?.message}
            hint={network ? undefined : "We detect the network automatically."}
          >
            <div className="flex h-13 items-center rounded-xl border border-border bg-card pr-3 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/15">
              <span className="flex h-full items-center border-r border-border px-3.5 font-mono text-[15px] text-secondary-foreground">
                +234
              </span>
              <input
                {...register("phone")}
                inputMode="tel"
                autoFocus
                placeholder="801 234 5678"
                className="w-full min-w-0 bg-transparent px-3.5 font-mono text-[16px] tracking-[0.01em] outline-none placeholder:text-[oklch(0.78_0.01_264)]"
              />
              {network ? (
                <span className="shrink-0 rounded-full bg-primary-subtle px-2.5 py-1 text-[11.5px] font-medium text-[var(--primary-hover)]">
                  {network.name} detected
                </span>
              ) : null}
            </div>
          </Field>
        </div>

        <div className="mt-auto flex flex-col gap-4 pt-10">
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            By continuing you accept the <Link href="#">terms</Link> and{" "}
            <Link href="#">privacy policy</Link>.
          </p>
          <Button type="submit" size="xl" disabled={!isValid} className="w-full">
            Send code
          </Button>
        </div>
      </form>
    </>
  );
}
