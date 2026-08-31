"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  ChevronRight,
  CircleCheck,
  Key,
  Landmark,
  Lock,
  LogOut,
  Monitor,
  RotateCcw,
  Smartphone,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Eyebrow } from "@/components/paylink/form-parts";
import { naira } from "@/lib/format";
import { DEVICES, USER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/store/session";
import { spentThisMonth, useWalletStore } from "@/store/wallet";

const DESKTOP_TABS = [
  "Profile",
  "Security",
  "Assistant",
  "Notifications",
  "Devices",
  "Statements",
] as const;

export default function SettingsPage() {
  const { fullName, phone, initials } = useSessionStore();
  const {
    settings,
    setSetting,
    recipients,
    transactions,
    resetToFirstRun,
    restoreDemo,
  } = useWalletStore();
  const [tab, setTab] =
    React.useState<(typeof DESKTOP_TABS)[number]>("Security");

  const dailyUsed = spentThisMonth(transactions);
  const dailyLimit = 200000;
  const firstRun = transactions.length === 0;

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-1 flex-col lg:hidden">
        <header className="px-5 py-4">
          <h1 className="text-[20px] font-semibold tracking-[-0.02em]">
            Settings
          </h1>
        </header>

        <div className="flex flex-col gap-5 px-5 pb-6">
          <div className="flex items-center gap-3.5 rounded-[16px] border border-border bg-card p-4">
            <span className="flex size-12 items-center justify-center rounded-full bg-brand-deep text-[15px] font-medium text-white">
              {initials}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-[15px] font-semibold">
                {fullName}
              </span>
              <span className="font-mono text-[12.5px] text-muted-foreground">
                {phone}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-success-bg px-2.5 py-1 text-[11.5px] font-medium text-success-fg">
              <CircleCheck strokeWidth={2} className="size-3" />
              Verified
            </span>
          </div>

          <SettingsGroup label="Security">
            <RowLink icon={Key} label="Change transaction PIN" href="/pin" />
            <RowSwitch
              icon={Lock}
              label="Use fingerprint instead of PIN"
              hint={`Under ${naira(5000).replace(".00", "")} only`}
              checked={settings.fingerprint}
              onChange={(v) => setSetting("fingerprint", v)}
            />
            <RowLink
              icon={Smartphone}
              label="Active devices"
              value={String(DEVICES.length)}
            />
          </SettingsGroup>

          <SettingsGroup label="Assistant">
            <RowSwitch
              icon={Lock}
              label="Always ask before paying"
              hint="Cannot be turned off"
              checked
              locked
            />
            <RowSwitch
              icon={UserRound}
              label="Let assistant read my history"
              checked={settings.assistantReadsHistory}
              onChange={(v) => setSetting("assistantReadsHistory", v)}
            />
          </SettingsGroup>

          <SettingsGroup label="Account">
            <RowLink icon={Bell} label="Notifications" />
            <RowLink
              icon={UserRound}
              label="Saved recipients"
              value={String(recipients.length)}
              href="/recipients"
            />
            <RowLink icon={LogOut} label="Sign out" href="/" destructive />
          </SettingsGroup>

          <SettingsGroup label="Demo">
            <button
              type="button"
              onClick={firstRun ? restoreDemo : resetToFirstRun}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted"
            >
              <RotateCcw
                strokeWidth={1.75}
                className="size-[18px] shrink-0 text-muted-foreground"
              />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[14px] font-medium">
                  {firstRun
                    ? "Restore sample data"
                    : "Reset to first-run state"}
                </span>
                <span className="text-[12px] text-muted-foreground">
                  Empties the wallet and history so you can see the onboarding
                  dashboard.
                </span>
              </span>
            </button>
          </SettingsGroup>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden flex-1 flex-col overflow-y-auto px-7 py-7 lg:flex">
        <h1 className="text-[25px] font-semibold tracking-[-0.025em]">
          Settings
        </h1>

        <div className="mt-6 flex gap-7">
          <nav className="flex w-[180px] shrink-0 flex-col gap-0.5">
            {DESKTOP_TABS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={cn(
                  "rounded-[10px] px-3 py-2 text-left text-[14px] font-medium transition-colors",
                  tab === item
                    ? "bg-primary-subtle text-[var(--primary-hover)]"
                    : "text-secondary-foreground hover:bg-muted",
                )}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex min-w-0 max-w-[720px] flex-1 flex-col gap-6">
            {tab === "Security" || tab === "Devices" ? (
              <>
                <div className="flex flex-col gap-2">
                  <h2 className="text-[20px] font-semibold tracking-[-0.02em]">
                    Security
                  </h2>
                  <p className="text-[14px] leading-relaxed text-muted-foreground">
                    Your PIN authorises money leaving the wallet — including
                    anything the assistant sets up. It is never used to sign in.
                  </p>
                </div>

                <div className="flex flex-col divide-y divide-border overflow-hidden rounded-[16px] border border-border bg-card">
                  <div className="flex items-center gap-4 px-5 py-4">
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-[14.5px] font-medium">
                        Transaction PIN
                      </span>
                      <span className="text-[12.5px] text-muted-foreground">
                        Last changed {USER.pinChanged}
                      </span>
                    </span>
                    <Button
                      render={<Link href="/pin" />}
                      variant="outline"
                      size="sm"
                    >
                      Change
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 px-5 py-4">
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-[14.5px] font-medium">
                        Fingerprint for small payments
                      </span>
                      <span className="text-[12.5px] text-muted-foreground">
                        Under {naira(5000).replace(".00", "")} · PIN still
                        required above
                      </span>
                    </span>
                    <Switch
                      checked={settings.fingerprint}
                      onCheckedChange={(v) => setSetting("fingerprint", v)}
                    />
                  </div>
                  <div className="flex items-center gap-4 px-5 py-4">
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-[14.5px] font-medium">
                        Confirm every assistant payment
                      </span>
                      <span className="text-[12.5px] text-muted-foreground">
                        Cannot be turned off
                      </span>
                    </span>
                    <Switch checked disabled />
                  </div>
                </div>

                <div className="overflow-hidden rounded-[16px] border border-border bg-card">
                  <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5">
                    <Eyebrow>Active devices</Eyebrow>
                    <button
                      type="button"
                      className="text-[12.5px] font-medium text-failed-fg"
                    >
                      Sign out all
                    </button>
                  </div>
                  <div className="divide-y divide-border">
                    {DEVICES.map((device) => (
                      <div
                        key={device.id}
                        className="flex items-center gap-3.5 px-5 py-4"
                      >
                        <Monitor
                          strokeWidth={1.75}
                          className="size-[18px] shrink-0 text-muted-foreground"
                        />
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="text-[14px] font-medium">
                            {device.name}
                          </span>
                          <span className="text-[12.5px] text-muted-foreground">
                            {device.meta}
                          </span>
                        </span>
                        {device.current ? (
                          <span className="rounded-full bg-primary-subtle px-2.5 py-1 text-[11.5px] font-medium text-[var(--primary-hover)]">
                            Current
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="text-[12.5px] font-medium text-muted-foreground hover:text-foreground"
                          >
                            Sign out
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4 rounded-[16px] border border-border bg-card p-5">
                  <Eyebrow>Spending limits</Eyebrow>
                  <LimitBar
                    label="Per transaction"
                    value={naira(50000).replace(".00", "")}
                  />
                  <LimitBar
                    label={`Daily · ${naira(dailyUsed).replace(".00", "")} used`}
                    value={naira(dailyLimit).replace(".00", "")}
                    progress={Math.min(dailyUsed / dailyLimit, 1)}
                  />
                  <Button variant="outline" size="sm" className="w-fit">
                    Request higher limit
                  </Button>
                </div>

                <div className="flex items-start gap-3 rounded-[16px] bg-muted p-5">
                  <Landmark
                    strokeWidth={1.75}
                    className="mt-0.5 size-[18px] shrink-0 text-muted-foreground"
                  />
                  <span className="flex flex-col gap-1">
                    <span className="text-[14px] font-medium">
                      Wallet funds sit with Paystack
                    </span>
                    <span className="text-[13px] leading-relaxed text-muted-foreground">
                      PayLink is not a bank. Deposits are collected through
                      Paystack and held in the PayLink business account.
                    </span>
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <h2 className="text-[20px] font-semibold tracking-[-0.02em]">
                  {tab}
                </h2>
                <p className="text-[14px] leading-relaxed text-muted-foreground"></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function SettingsGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Eyebrow className="px-0.5">{label}</Eyebrow>
      <div className="flex flex-col divide-y divide-border overflow-hidden rounded-[16px] border border-border bg-card">
        {children}
      </div>
    </div>
  );
}

function RowLink({
  icon: Icon,
  label,
  value,
  href,
  destructive,
}: {
  icon: React.ComponentType<{ strokeWidth?: number; className?: string }>;
  label: string;
  value?: string;
  href?: string;
  destructive?: boolean;
}) {
  const content = (
    <>
      <Icon
        strokeWidth={1.75}
        className={cn(
          "size-[18px] shrink-0",
          destructive ? "text-failed-fg" : "text-muted-foreground",
        )}
      />
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-[14px] font-medium",
          destructive && "text-failed-fg",
        )}
      >
        {label}
      </span>
      {value ? (
        <span className="shrink-0 font-mono text-[13px] text-muted-foreground">
          {value}
        </span>
      ) : null}
      <ChevronRight
        strokeWidth={1.75}
        className="size-4 shrink-0 text-muted-foreground"
      />
    </>
  );

  const className =
    "flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted";

  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <button type="button" className={cn(className, "text-left")}>
      {content}
    </button>
  );
}

function RowSwitch({
  icon: Icon,
  label,
  hint,
  checked,
  onChange,
  locked,
}: {
  icon: React.ComponentType<{ strokeWidth?: number; className?: string }>;
  label: string;
  hint?: string;
  checked: boolean;
  onChange?: (value: boolean) => void;
  locked?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <Icon
        strokeWidth={1.75}
        className="size-[18px] shrink-0 text-muted-foreground"
      />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[14px] font-medium">{label}</span>
        {hint ? (
          <span className="text-[12px] text-muted-foreground">{hint}</span>
        ) : null}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} disabled={locked} />
    </div>
  );
}

function LimitBar({
  label,
  value,
  progress,
}: {
  label: string;
  value: string;
  progress?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[13px] text-muted-foreground">{label}</span>
        <span className="font-mono tabular text-[13.5px] font-medium">
          {value}
        </span>
      </div>
      {progress !== undefined ? (
        <span className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <span
            className="block h-full rounded-full bg-primary"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </span>
      ) : null}
    </div>
  );
}
