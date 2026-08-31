"use client";

import * as React from "react";
import Link from "next/link";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceIcon } from "@/components/paylink/service-icon";
import { StatusBadge } from "@/components/paylink/status-badge";
import { TransactionRow } from "@/components/paylink/transaction-row";
import { Eyebrow } from "@/components/paylink/form-parts";
import { naira } from "@/lib/format";
import type { ServiceId, Transaction, TxStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  fundedTotal,
  refundedTotal,
  spentThisMonth,
  useWalletStore,
} from "@/store/wallet";

const SERVICE_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All services" },
  { value: "airtime", label: "Airtime" },
  { value: "data", label: "Data" },
  { value: "electricity", label: "Electricity" },
  { value: "cable", label: "Cable TV" },
  { value: "funding", label: "Funding" },
];

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "Any status" },
  { value: "success", label: "Success only" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "reversed", label: "Reversed" },
];

const RANGE_FILTERS = [
  { value: "30", label: "Last 30 days" },
  { value: "7", label: "Last 7 days" },
  { value: "all", label: "All time" },
];

function groupByDay(transactions: Transaction[]) {
  const groups: { group: string; rows: Transaction[] }[] = [];
  for (const tx of transactions) {
    const last = groups[groups.length - 1];
    if (last && last.group === tx.group) last.rows.push(tx);
    else groups.push({ group: tx.group, rows: [tx] });
  }
  return groups;
}

export default function HistoryPage() {
  const transactions = useWalletStore((s) => s.transactions);
  const [query, setQuery] = React.useState("");
  const [service, setService] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [range, setRange] = React.useState("30");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter((tx) => {
      if (service !== "all" && tx.service !== (service as ServiceId | "funding"))
        return false;
      if (status !== "all" && tx.status !== (status as TxStatus)) return false;
      if (!q) return true;
      return [tx.title, tx.recipient, tx.reference, String(Math.abs(tx.amount))]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [transactions, query, service, status]);

  const groups = groupByDay(filtered);
  const spent = spentThisMonth(filtered);
  const funded = fundedTotal(filtered);
  const refunded = refundedTotal(filtered);

  const totals = [
    { label: "Spent", value: spent },
    { label: "Funded", value: funded },
    { label: "Refunded", value: refunded },
  ];

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-1 flex-col lg:hidden">
        <header className="flex items-center justify-between gap-3 px-5 py-4">
          <h1 className="text-[20px] font-semibold tracking-[-0.02em]">
            History
          </h1>
        </header>

        <div className="flex flex-col gap-4 px-5 pb-6">
          <label className="flex h-11 items-center gap-2.5 rounded-xl border border-border bg-card px-3.5">
            <Search strokeWidth={1.75} className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Reference, number or amount"
              className="w-full bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
            />
          </label>

          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
            <FilterChip
              options={RANGE_FILTERS}
              value={range}
              onChange={setRange}
            />
            <FilterChip
              options={SERVICE_FILTERS}
              value={service}
              onChange={setService}
            />
            <FilterChip
              options={STATUS_FILTERS}
              value={status}
              onChange={setStatus}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {totals.map((total) => (
              <div
                key={total.label}
                className="flex flex-col gap-1 rounded-[14px] border border-border bg-card px-3 py-3"
              >
                <span className="text-[11px] tracking-[0.04em] text-muted-foreground uppercase">
                  {total.label}
                </span>
                <span className="font-mono tabular text-[14px] font-medium">
                  {naira(total.value).replace(".00", "")}
                </span>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-[16px] border border-border bg-card">
            {groups.length === 0 ? (
              <p className="px-5 py-10 text-center text-[13px] text-muted-foreground">
                Nothing matches those filters.
              </p>
            ) : (
              groups.map((group) => (
                <div key={group.group}>
                  <div className="px-5 pt-[11px] pb-[7px] font-mono text-[11px] tracking-[0.07em] text-muted-foreground uppercase">
                    {group.group}
                  </div>
                  <div className="divide-y divide-border border-t border-border">
                    {group.rows.map((tx) => (
                      <TransactionRow key={tx.id} tx={tx} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden flex-1 flex-col overflow-y-auto px-7 py-7 lg:flex">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-[25px] font-semibold tracking-[-0.025em]">
            History
          </h1>
          <Button variant="outline">
            <Download strokeWidth={1.75} className="size-4" />
            Export CSV
          </Button>
        </div>

        <div className="flex items-center gap-3 pt-6">
          <label className="flex h-10 max-w-[380px] flex-1 items-center gap-2.5 rounded-[10px] border border-border bg-card px-3.5">
            <Search strokeWidth={1.75} className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Reference, recipient or amount"
              className="w-full bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
            />
          </label>
          <DesktopSelect options={RANGE_FILTERS} value={range} onChange={setRange} />
          <DesktopSelect
            options={SERVICE_FILTERS}
            value={service}
            onChange={setService}
          />
          <DesktopSelect
            options={STATUS_FILTERS}
            value={status}
            onChange={setStatus}
          />
        </div>

        <div className="grid grid-cols-4 gap-4 pt-6">
          <StatTile label="Transactions" value={String(filtered.length)} />
          <StatTile label="Spent" value={naira(spent)} />
          <StatTile label="Funded" value={naira(funded)} />
          <StatTile label="Refunded" value={naira(refunded)} />
        </div>

        <div className="mt-6 overflow-hidden rounded-[16px] border border-border bg-card">
          <div className="grid grid-cols-[0.8fr_1.6fr_1.3fr_1fr_1fr_0.9fr] gap-4 border-b border-border bg-background px-[18px] py-2.5 font-mono text-[10.5px] tracking-[0.07em] text-muted-foreground uppercase">
            <span>Date</span>
            <span>Transaction</span>
            <span>Recipient</span>
            <span>Reference</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Status</span>
          </div>
          {groups.map((group) => (
            <div key={group.group}>
              <div className="bg-background/60 px-[18px] py-2 font-mono text-[10.5px] tracking-[0.07em] text-muted-foreground uppercase">
                {group.group}
              </div>
              <div className="divide-y divide-border">
                {group.rows.map((tx) => (
                  <Link
                    key={tx.id}
                    href={`/history/${tx.id}`}
                    className="grid grid-cols-[0.8fr_1.6fr_1.3fr_1fr_1fr_0.9fr] items-center gap-4 px-[18px] py-3.5 text-[13.5px] transition-colors hover:bg-muted"
                  >
                    <span className="font-mono text-[12.5px] text-muted-foreground">
                      {tx.time}
                    </span>
                    <span className="flex items-center gap-2.5">
                      <ServiceIcon
                        service={tx.service}
                        className="size-4 shrink-0 text-muted-foreground"
                      />
                      <span className="truncate font-medium">{tx.title}</span>
                    </span>
                    <span className="truncate font-mono text-[12.5px] text-muted-foreground">
                      {tx.recipient}
                    </span>
                    <span className="truncate font-mono text-[12.5px] text-muted-foreground">
                      {tx.reference}
                    </span>
                    <span className="text-right font-mono tabular font-medium">
                      {naira(tx.amount, { sign: true })}
                    </span>
                    <span className="flex justify-end">
                      <StatusBadge status={tx.status} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 border-t border-border px-[18px] py-3">
            <Eyebrow>
              Showing {filtered.length} of {transactions.length}
            </Eyebrow>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg font-mono text-[12.5px] transition-colors",
                    page === 1
                      ? "bg-primary-subtle text-[var(--primary-hover)]"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-[16px] border border-border bg-card p-4">
      <span className="text-[11px] tracking-[0.05em] text-muted-foreground uppercase">
        {label}
      </span>
      <span className="font-mono tabular text-[19px] font-medium">{value}</span>
    </div>
  );
}

function DesktopSelect({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger className="h-10 rounded-[10px] text-[13.5px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function FilterChip({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger className="h-9 shrink-0 rounded-full border-border bg-card px-3.5 text-[12.5px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
