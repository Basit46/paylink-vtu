"use client";

import { create } from "zustand";
import { SEED_RECIPIENTS, SEED_TRANSACTIONS } from "@/lib/mock-data";
import type { Recipient, Transaction, TxStatus } from "@/lib/types";

type WalletState = {
  balance: number;
  transactions: Transaction[];
  recipients: Recipient[];
  hideBalance: boolean;
  settings: {
    fingerprint: boolean;
    assistantReadsHistory: boolean;
    transactionEmails: boolean;
    showBalanceOnDashboard: boolean;
  };
  fund: (amount: number, tx: Transaction) => void;
  debit: (amount: number, tx: Transaction) => void;
  settle: (id: string, status: TxStatus, patch?: Partial<Transaction>) => void;
  refund: (id: string, amount: number) => void;
  addRecipient: (recipient: Recipient) => void;
  toggleHideBalance: () => void;
  setSetting: (key: keyof WalletState["settings"], value: boolean) => void;
  resetToFirstRun: () => void;
  restoreDemo: () => void;
};

const SEED_BALANCE = 24850;

export const useWalletStore = create<WalletState>((set) => ({
  balance: SEED_BALANCE,
  transactions: SEED_TRANSACTIONS,
  recipients: SEED_RECIPIENTS,
  hideBalance: false,
  settings: {
    fingerprint: true,
    assistantReadsHistory: true,
    transactionEmails: true,
    showBalanceOnDashboard: true,
  },
  fund: (amount, tx) =>
    set((s) => ({ balance: s.balance + amount, transactions: [tx, ...s.transactions] })),
  debit: (amount, tx) =>
    set((s) => ({ balance: s.balance - amount, transactions: [tx, ...s.transactions] })),
  settle: (id, status, patch) =>
    set((s) => ({
      transactions: s.transactions.map((t) =>
        t.id === id ? { ...t, ...patch, status } : t
      ),
    })),
  refund: (id, amount) =>
    set((s) => ({
      balance: s.balance + amount,
      transactions: s.transactions.map((t) =>
        t.id === id ? { ...t, status: "reversed" as TxStatus } : t
      ),
    })),
  addRecipient: (recipient) =>
    set((s) =>
      s.recipients.some((r) => r.number === recipient.number)
        ? s
        : { recipients: [recipient, ...s.recipients] }
    ),
  toggleHideBalance: () => set((s) => ({ hideBalance: !s.hideBalance })),
  setSetting: (key, value) =>
    set((s) => ({ settings: { ...s.settings, [key]: value } })),
  resetToFirstRun: () => set({ balance: 0, transactions: [] }),
  restoreDemo: () =>
    set({ balance: SEED_BALANCE, transactions: SEED_TRANSACTIONS }),
}));

export const spentThisMonth = (transactions: Transaction[]) =>
  transactions
    .filter((t) => t.amount < 0 && t.status !== "reversed" && t.status !== "failed")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

export const fundedTotal = (transactions: Transaction[]) =>
  transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);

export const refundedTotal = (transactions: Transaction[]) =>
  transactions
    .filter((t) => t.status === "reversed")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
