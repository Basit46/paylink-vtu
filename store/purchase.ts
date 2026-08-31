"use client";

import { create } from "zustand";
import type { PurchaseDraft, Transaction } from "@/lib/types";

export type PurchaseStage =
  | "idle"
  | "confirming"
  | "processing"
  | "success"
  | "failed";

type PurchaseState = {
  draft: PurchaseDraft | null;
  stage: PurchaseStage;
  transaction: Transaction | null;
  saveRecipient: boolean;
  begin: (draft: PurchaseDraft, saveRecipient?: boolean) => void;
  cancel: () => void;
  authorize: (transaction: Transaction) => void;
  resolve: (stage: "success" | "failed", patch?: Partial<Transaction>) => void;
  clear: () => void;
};

export const usePurchaseStore = create<PurchaseState>((set) => ({
  draft: null,
  stage: "idle",
  transaction: null,
  saveRecipient: false,
  begin: (draft, saveRecipient = false) =>
    set({ draft, stage: "confirming", saveRecipient, transaction: null }),
  cancel: () => set({ stage: "idle" }),
  authorize: (transaction) => set({ stage: "processing", transaction }),
  resolve: (stage, patch) =>
    set((s) => ({
      stage,
      transaction: s.transaction ? { ...s.transaction, ...patch } : null,
    })),
  clear: () => set({ draft: null, stage: "idle", transaction: null }),
}));

/** Demo hook: the design's failure screen is a Glo purchase to 0805 441 2200. */
export function willFail(recipient: string) {
  return recipient.replace(/\D/g, "").endsWith("4412200");
}

export function makeReference() {
  const hex = Math.random().toString(16).slice(2, 10).toUpperCase();
  return `PL-${hex}`;
}

export function makeProviderReference() {
  return `VTP-${Math.floor(10000000 + Math.random() * 89999999)}`;
}

export function makeToken() {
  return Array.from({ length: 4 }, () =>
    String(Math.floor(1000 + Math.random() * 8999))
  ).join(" ");
}
