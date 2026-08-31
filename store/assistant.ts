"use client";

import { create } from "zustand";
import type { AssistantMessage } from "@/lib/types";

type AssistantState = {
  messages: AssistantMessage[];
  thinking: boolean;
  filledForm: {
    network: string;
    recipient: string;
    planId: string;
  } | null;
  send: (text: string) => void;
  setThinking: (thinking: boolean) => void;
  push: (message: AssistantMessage) => void;
  setFilledForm: (form: AssistantState["filledForm"]) => void;
  dismissApproval: (id: string) => void;
  reset: () => void;
};

let counter = 0;
const nextId = () => `msg-${++counter}`;

export const useAssistantStore = create<AssistantState>((set) => ({
  messages: [],
  thinking: false,
  filledForm: null,
  send: (text) =>
    set((s) => ({
      messages: [...s.messages, { id: nextId(), role: "user", text }],
    })),
  setThinking: (thinking) => set({ thinking }),
  push: (message) => set((s) => ({ messages: [...s.messages, message] })),
  setFilledForm: (filledForm) => set({ filledForm }),
  dismissApproval: (id) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, approval: undefined } : m
      ),
    })),
  reset: () => set({ messages: [], thinking: false, filledForm: null }),
}));

export { nextId as nextMessageId };
