"use client";

import { create } from "zustand";
import { USER } from "@/lib/mock-data";

type SessionState = {
  phone: string;
  pin: string;
  otpVerified: boolean;
  fullName: string;
  initials: string;
  setPhone: (phone: string) => void;
  verifyOtp: () => void;
  setPin: (pin: string) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  phone: USER.phone,
  pin: "1234",
  otpVerified: true,
  fullName: USER.fullName,
  initials: USER.initials,
  setPhone: (phone) => set({ phone }),
  verifyOtp: () => set({ otpVerified: true }),
  setPin: (pin) => set({ pin }),
}));
