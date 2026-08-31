"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/SearchInput";
import { ServiceIcon } from "@/components/paylink/service-icon";
import { Eyebrow } from "@/components/paylink/form-parts";
import { naira, nairaShort } from "@/lib/format";
import { RECIPIENT_HISTORY } from "@/lib/mock-data";
import type { Recipient } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useWalletStore } from "@/store/wallet";

const KIND_FILTERS = [
  { id: "all", label: "All" },
  { id: "phone", label: "Phones" },
  { id: "meter", label: "Meters" },
  { id: "smartcard", label: "Smartcards" },
] as const;

export default function RecipientsPage() {
  const recipients = useWalletStore((s) => s.recipients);
  const [query, setQuery] = React.useState("");
  const [kind, setKind] =
    React.useState<(typeof KIND_FILTERS)[number]["id"]>("all");
  const [selectedId, setSelectedId] = React.useState<string | null>(
    recipients[0]?.id ?? null,
  );

  const filtered = recipients.filter((r) => {
    if (kind !== "all" && r.kind !== kind) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${r.name} ${r.number}`.toLowerCase().includes(q);
  });

  const selected =
    recipients.find((r) => r.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5 lg:px-7 lg:py-7">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h1 className="text-[20px] font-semibold tracking-[-0.02em] lg:text-[25px] lg:tracking-[-0.025em]">
            Recipients
          </h1>
          <span className="text-[13px] text-muted-foreground">
            {recipients.length} saved
          </span>
        </div>
        <Button>
          <Plus strokeWidth={2.25} className="size-4" />
          Add recipient
        </Button>
      </div>

      <div className="shrink-0 h-fit flex flex-col gap-3 pt-5 sm:flex-row sm:items-center">
        <SearchInput
          className="max-w-[380px]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or number"
        />
        <div className="flex gap-2 overflow-x-auto">
          {KIND_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setKind(filter.id)}
              className={cn(
                "h-9 shrink-0 rounded-full border px-3.5 text-[12.5px] transition-colors",
                kind === filter.id
                  ? "border-primary bg-primary-subtle text-[var(--primary-hover)]"
                  : "border-border bg-card text-secondary-foreground hover:border-input",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5 pt-5 xl:flex-row">
        <div className="min-w-0 flex-1 overflow-hidden rounded-[16px] border border-border bg-card">
          <div className="hidden grid-cols-[1.6fr_1.2fr_1.4fr_0.9fr] gap-4 border-b border-border bg-background px-[18px] py-2.5 font-mono text-[10.5px] tracking-[0.07em] text-muted-foreground uppercase sm:grid">
            <span>Name</span>
            <span>Number</span>
            <span>Service</span>
            <span className="text-right">Last used</span>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((recipient) => (
              <button
                key={recipient.id}
                type="button"
                onClick={() => setSelectedId(recipient.id)}
                className={cn(
                  "grid w-full grid-cols-[1fr_auto] gap-4 px-[18px] py-3.5 text-left text-[13.5px] transition-colors sm:grid-cols-[1.6fr_1.2fr_1.4fr_0.9fr] sm:items-center",
                  selected?.id === recipient.id
                    ? "bg-primary-subtle/40"
                    : "hover:bg-muted",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11.5px] font-medium">
                    {recipient.initials}
                  </span>
                  <span className="truncate font-medium">{recipient.name}</span>
                </span>
                <span className="truncate text-right font-mono text-[12.5px] text-muted-foreground sm:text-left">
                  {recipient.number}
                </span>
                <span className="col-span-2 flex items-center gap-2 text-muted-foreground sm:col-span-1">
                  <ServiceIcon
                    service={recipient.serviceIcon}
                    className="size-4 shrink-0"
                  />
                  <span className="truncate text-[12.5px]">
                    {recipient.service}
                  </span>
                </span>
                <span className="hidden text-right text-[12.5px] text-muted-foreground sm:block">
                  {recipient.lastUsed}
                </span>
              </button>
            ))}
            {filtered.length === 0 ? (
              <p className="px-5 py-10 text-center text-[13px] text-muted-foreground">
                No recipients match that search.
              </p>
            ) : null}
          </div>
        </div>

        {selected ? <RecipientDetail recipient={selected} /> : null}
      </div>
    </div>
  );
}

function RecipientDetail({ recipient }: { recipient: Recipient }) {
  const recent = RECIPIENT_HISTORY[recipient.id] ?? [];
  const buyHref =
    recipient.kind === "meter"
      ? "/buy/electricity"
      : recipient.kind === "smartcard"
        ? "/buy/cable"
        : "/buy/airtime";

  return (
    <aside className="flex w-full shrink-0 flex-col gap-5 rounded-[16px] border border-border bg-card p-5 xl:w-[320px]">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-brand-deep text-[16px] font-medium text-white">
          {recipient.initials}
        </span>
        <span className="flex flex-col gap-1">
          <span className="text-[16px] font-semibold">{recipient.name}</span>
          <span className="font-mono text-[13px] text-muted-foreground">
            {recipient.number}
          </span>
          <span className="text-[12px] text-muted-foreground">
            {recipient.service} · added {recipient.addedOn}
          </span>
        </span>
      </div>

      <div className="flex gap-2.5">
        <Button render={<Link href={buyHref} />} size="sm" className="flex-1">
          {recipient.kind === "phone" ? "Buy airtime" : "Pay again"}
        </Button>
        {recipient.kind === "phone" ? (
          <Button
            render={<Link href="/buy/data" />}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Buy data
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 rounded-[14px] bg-muted px-3.5 py-3">
          <span className="text-[11px] tracking-[0.05em] text-muted-foreground uppercase">
            Purchases
          </span>
          <span className="font-mono tabular text-[17px] font-medium">
            {recipient.purchases}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-[14px] bg-muted px-3.5 py-3">
          <span className="text-[11px] tracking-[0.05em] text-muted-foreground uppercase">
            Total sent
          </span>
          <span className="font-mono tabular text-[17px] font-medium">
            {nairaShort(recipient.totalSent)}
          </span>
        </div>
      </div>

      {recent.length > 0 ? (
        <div className="flex flex-col gap-2">
          <Eyebrow>Recent to {recipient.name.split(" ")[0]}</Eyebrow>
          <div className="flex flex-col divide-y divide-border overflow-hidden rounded-[14px] border border-border">
            {recent.map((row) => (
              <div
                key={row.title + row.when}
                className="flex items-center gap-3 px-3.5 py-2.5"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-[13px] font-medium">
                    {row.title}
                  </span>
                  <span className="text-[11.5px] text-muted-foreground">
                    {row.when}
                  </span>
                </span>
                <span className="shrink-0 font-mono tabular text-[13px]">
                  {naira(row.amount).replace(".00", "")}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <p className="flex items-start gap-2 rounded-[14px] bg-primary-subtle/60 px-3.5 py-3 text-[12.5px] leading-relaxed text-[var(--primary-hover)]">
        <Sparkles strokeWidth={1.75} className="mt-px size-4 shrink-0" />
        Say &ldquo;send {recipient.name.split(" ")[0]} 1GB&rdquo; to the
        assistant and this recipient is used.
      </p>
    </aside>
  );
}
