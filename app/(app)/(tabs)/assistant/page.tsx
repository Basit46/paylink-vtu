"use client";

import * as React from "react";
import { ArrowUp, LoaderCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApprovalCard } from "@/components/paylink/approval-card";
import { Eyebrow } from "@/components/paylink/form-parts";
import { DATA_PLANS } from "@/lib/catalog";
import { naira } from "@/lib/format";
import { ASSISTANT_SUGGESTIONS, RECENT_CHATS } from "@/lib/mock-data";
import { respond } from "@/lib/assistant-engine";
import type { AssistantMessage, ServiceId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAssistantStore, nextMessageId } from "@/store/assistant";
import { usePurchaseStore } from "@/store/purchase";
import { useWalletStore } from "@/store/wallet";

export default function AssistantPage() {
  const {
    messages,
    thinking,
    filledForm,
    send,
    push,
    setThinking,
    setFilledForm,
    dismissApproval,
  } = useAssistantStore();
  const balance = useWalletStore((s) => s.balance);
  const transactions = useWalletStore((s) => s.transactions);
  const begin = usePurchaseStore((s) => s.begin);

  const [draft, setDraft] = React.useState("");
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const ask = (text: string) => {
    const value = text.trim();
    if (!value) return;
    send(value);
    setDraft("");
    setThinking(true);
    window.setTimeout(() => {
      const reply = respond(value, { balance, transactions });
      setThinking(false);
      push({ id: nextMessageId(), ...reply.message });
      if (reply.filledForm !== undefined) setFilledForm(reply.filledForm);
    }, 1100);
  };

  const confirm = (message: AssistantMessage) => {
    const approval = message.approval;
    if (!approval) return;
    const service: ServiceId = approval.title.toLowerCase().includes("data")
      ? "data"
      : "airtime";
    const recipient =
      approval.lines.find((l) => l.label === "Recipient")?.value ?? "";
    begin({
      service,
      title: approval.title,
      recipient,
      amount: approval.amount,
      fee: 0,
      providerName: approval.title,
      lines: approval.lines
        .filter((l) => l.label !== "Balance after")
        .map((l) => ({ ...l, mono: l.label === "Recipient" })),
      successHeadline: service === "data" ? "Data delivered" : "Airtime delivered",
      successDetail: `${naira(approval.amount)} ${approval.title} sent to ${recipient}`,
    });
    dismissApproval(message.id);
  };

  const empty = messages.length === 0;

  return (
    <div className="flex min-h-0 flex-1">
      {/* Desktop: recent chats rail */}
      <div className="hidden w-[210px] shrink-0 flex-col gap-1 border-r border-border bg-card px-3 py-5 xl:flex">
        <Eyebrow className="px-2.5 pb-2">Recent chats</Eyebrow>
        {RECENT_CHATS.map((chat) => (
          <button
            key={chat}
            type="button"
            className="truncate rounded-[10px] px-2.5 py-2 text-left text-[13px] text-secondary-foreground transition-colors hover:bg-muted"
          >
            {chat}
          </button>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-primary-subtle text-[var(--primary-hover)]">
              <Sparkles strokeWidth={1.75} className="size-4" />
            </span>
            <span className="text-[16px] font-semibold tracking-[-0.02em]">
              Assistant
            </span>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[12px] text-muted-foreground">
            <ShieldCheck strokeWidth={1.75} className="size-3.5" />
            <span className="hidden sm:inline">Cannot pay without your PIN</span>
            <span className="font-mono sm:hidden">{naira(balance)}</span>
          </span>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[680px] flex-1 flex-col gap-4 px-5 py-6">
            {empty ? (
              <div className="flex flex-1 flex-col justify-center gap-6">
                <div className="flex flex-col gap-3">
                  <h1 className="text-[26px] leading-[1.15] font-semibold tracking-[-0.03em]">
                    Tell me what you need.
                  </h1>
                  <p className="text-[15px] leading-relaxed text-muted-foreground">
                    I can buy airtime and data, pay electricity and cable, and
                    answer questions about your spending. I will always show you
                    the exact amount before anything is paid.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Eyebrow>Try</Eyebrow>
                  {ASSISTANT_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => ask(suggestion)}
                      className="rounded-[14px] border border-border bg-card px-4 py-3.5 text-left text-[14px] transition-colors hover:border-primary/40 hover:bg-primary-subtle/40"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                <p className="flex items-start gap-2 rounded-[14px] bg-muted px-4 py-3 text-[12.5px] leading-relaxed text-muted-foreground">
                  <ShieldCheck
                    strokeWidth={1.75}
                    className="mt-px size-4 shrink-0"
                  />
                  I cannot move money on my own. Every payment needs your PIN.
                </p>
              </div>
            ) : (
              messages.map((message) =>
                message.role === "user" ? (
                  <div key={message.id} className="flex justify-end">
                    <span className="max-w-[80%] rounded-[16px] rounded-br-[6px] bg-primary px-4 py-2.5 text-[14.5px] text-white">
                      {message.text}
                    </span>
                  </div>
                ) : (
                  <div key={message.id} className="flex flex-col gap-3">
                    <span className="max-w-[88%] rounded-[16px] rounded-bl-[6px] bg-card px-4 py-3 text-[14.5px] leading-relaxed">
                      {message.text}
                    </span>
                    {message.toolCalls ? (
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {message.toolCalls.join(" · ")}
                      </span>
                    ) : null}
                    {message.chips ? (
                      <div className="flex flex-wrap gap-2">
                        {message.chips.map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => ask(`Use the ${chip} plan`)}
                            className="h-9 rounded-full border border-border bg-card px-3.5 text-[13px] transition-colors hover:border-primary/40"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    {message.approval ? (
                      <ApprovalCard
                        approval={message.approval}
                        onConfirm={() => confirm(message)}
                        onCancel={() => dismissApproval(message.id)}
                      />
                    ) : null}
                  </div>
                )
              )
            )}

            {thinking ? (
              <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <LoaderCircle strokeWidth={1.75} className="size-4 animate-spin" />
                Checking provider availability
              </span>
            ) : null}
            <div ref={endRef} />
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(draft);
          }}
          className="border-t border-border bg-card px-5 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))]"
        >
          <div className="mx-auto flex max-w-[680px] items-center gap-2.5 rounded-full border border-border bg-background py-1.5 pr-1.5 pl-4">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask or buy anything…"
              className="w-full bg-transparent text-[14.5px] outline-none placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              size="icon-sm"
              disabled={!draft.trim()}
              aria-label="Send"
              className="shrink-0 rounded-full"
            >
              <ArrowUp strokeWidth={2.25} className="size-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Desktop: the form the assistant fills */}
      <aside
        className={cn(
          "hidden w-[340px] shrink-0 flex-col gap-4 border-l border-border bg-card px-5 py-5 xl:flex",
          !filledForm && "justify-center"
        )}
      >
        {filledForm ? (
          <FilledForm
            key={`${filledForm.recipient}-${filledForm.planId}`}
            form={filledForm}
            balance={balance}
          />
        ) : (
          <p className="text-center text-[13px] leading-relaxed text-muted-foreground">
            When the assistant proposes a purchase, the real form appears here so
            you can check and edit it before paying.
          </p>
        )}
      </aside>
    </div>
  );
}

function FilledForm({
  form,
  balance,
}: {
  form: { network: string; recipient: string; planId: string };
  balance: number;
}) {
  const [planId, setPlanId] = React.useState(form.planId);
  const begin = usePurchaseStore((s) => s.begin);
  const plan = DATA_PLANS.find((p) => p.id === planId);
  const options = DATA_PLANS.filter(
    (p) => p.network === form.network && p.size === plan?.size
  );

  if (!plan) return null;
  const networkName = form.network.toUpperCase();

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[15px] font-semibold">Buy data</span>
        <span className="rounded-full bg-primary-subtle px-2 py-1 font-mono text-[10.5px] tracking-[0.07em] text-[var(--primary-hover)] uppercase">
          Filled by assistant
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-medium">Recipient</span>
        <div className="flex items-center gap-2.5 rounded-xl border border-border px-3.5 py-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-medium">
            {networkName.slice(0, 3)}
          </span>
          <span className="font-mono text-[13.5px]">{form.recipient}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-medium">Plan</span>
        {options.map((option) => {
          const active = option.id === planId;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setPlanId(option.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors",
                active
                  ? "border-primary bg-[oklch(0.97_0.015_168)]"
                  : "border-border hover:border-input"
              )}
            >
              <span className="flex flex-1 flex-col">
                <span className="text-[14px] font-medium">{option.size}</span>
                <span className="text-[12px] text-muted-foreground">
                  {option.validity}
                </span>
              </span>
              <span className="font-mono tabular text-[13.5px] font-medium">
                {naira(option.price).replace(".00", "")}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-[13px] text-muted-foreground">Amount</span>
          <span className="font-mono tabular text-[14px] font-medium">
            {naira(plan.price)}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-[13px] text-muted-foreground">Balance after</span>
          <span className="font-mono tabular text-[13px]">
            {naira(balance - plan.price)}
          </span>
        </div>
        <Button
          size="lg"
          className="w-full"
          onClick={() =>
            begin({
              service: "data",
              title: `${networkName} ${plan.size} · ${plan.validity}`,
              recipient: form.recipient,
              amount: plan.price,
              fee: 0,
              providerName: `${networkName} Data`,
              lines: [
                {
                  label: "Plan",
                  value: `${networkName} ${plan.size} · ${plan.validity}`,
                },
                { label: "Recipient", value: form.recipient, mono: true },
                { label: "Fee", value: naira(0), mono: true },
              ],
              successHeadline: "Data delivered",
              successDetail: `${plan.size} ${networkName} data sent to ${form.recipient}`,
            })
          }
        >
          Confirm · enter PIN
        </Button>
      </div>
    </>
  );
}
