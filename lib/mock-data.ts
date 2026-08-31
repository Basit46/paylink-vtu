import type { Recipient, Transaction } from "./types";

export const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1", reference: "PL-8F42C1D9", providerReference: "VTP-88120334",
    service: "airtime", title: "MTN Airtime", recipient: "0801 234 5678",
    meta: "0801 234 5678", amount: -500, fee: 0, status: "success",
    createdAt: "2026-08-14T09:41:00", group: "Today", time: "9:41",
  },
  {
    id: "tx-2", reference: "PL-4410BE21", providerReference: "VTP-77341902",
    service: "electricity", title: "IKEDC prepaid", recipient: "04197 2210 88",
    meta: "04197 2210 88", amount: -4000, fee: 0, status: "pending",
    createdAt: "2026-08-14T08:12:00", group: "Today", time: "8:12",
    verifiedName: "ADAEZE N. OKAFOR",
  },
  {
    id: "tx-3", reference: "PSK-2210FA", providerReference: "PSK-2210FA",
    service: "funding", title: "Wallet funding", recipient: "Paystack",
    meta: "Paystack \u00b7 card", amount: 5000, fee: 75, status: "success",
    createdAt: "2026-08-13T18:20:00", group: "Yesterday", time: "18:20",
  },
  {
    id: "tx-4", reference: "PL-6621DD10", providerReference: "VTP-66120945",
    service: "data", title: "MTN 3GB \u00b7 30 days", recipient: "0801 234 5678",
    meta: "0801 234 5678", amount: -1500, fee: 0, status: "success",
    createdAt: "2026-08-13T11:05:00", group: "Yesterday", time: "11:05",
  },
  {
    id: "tx-5", reference: "PL-9920CD73", providerReference: "VTP-99201188",
    service: "cable", title: "DStv Compact", recipient: "7012 3456 78",
    meta: "7012345678", amount: -19000, fee: 0, status: "reversed",
    createdAt: "2026-08-13T09:30:00", group: "Yesterday", time: "9:30",
  },
  {
    id: "tx-6", reference: "PL-2201FF43", providerReference: "VTP-22014477",
    service: "airtime", title: "Airtel Airtime", recipient: "0802 999 1122",
    meta: "0802 999 1122 \u00b7 Mum", amount: -1000, fee: 0, status: "success",
    createdAt: "2026-08-12T16:44:00", group: "12 Aug", time: "16:44",
  },
  {
    id: "tx-7", reference: "PL-7712AA05", providerReference: "VTP-77120051",
    service: "data", title: "Glo 1GB \u00b7 7 days", recipient: "0805 441 2200",
    meta: "0805 441 2200", amount: -500, fee: 0, status: "failed",
    createdAt: "2026-08-12T10:02:00", group: "12 Aug", time: "10:02",
    failureReason: "Provider declined",
  },
];

export const SEED_RECIPIENTS: Recipient[] = [
  {
    id: "rcp-1", name: "Chidi Nwosu", initials: "CN", number: "0803 221 4590",
    kind: "phone", service: "MTN \u00b7 Airtime, data", serviceIcon: "airtime",
    network: "mtn", lastUsed: "2 days ago", addedOn: "4 Jul 2026",
    purchases: 11, totalSent: 8300,
  },
  {
    id: "rcp-2", name: "Mum", initials: "MU", number: "0802 999 1122",
    kind: "phone", service: "Airtel \u00b7 Airtime", serviceIcon: "airtime",
    network: "airtel", lastUsed: "12 Aug", addedOn: "2 Feb 2026",
    purchases: 24, totalSent: 31200,
  },
  {
    id: "rcp-3", name: "Home meter", initials: "HM", number: "04197 2210 88",
    kind: "meter", service: "IKEDC prepaid", serviceIcon: "electricity",
    lastUsed: "Today", addedOn: "11 Jan 2026", purchases: 9, totalSent: 42000,
  },
  {
    id: "rcp-4", name: "Living room DStv", initials: "LD", number: "7012 3456 78",
    kind: "smartcard", service: "DStv Compact", serviceIcon: "cable",
    lastUsed: "2 Aug", addedOn: "3 Mar 2026", purchases: 6, totalSent: 114000,
  },
  {
    id: "rcp-5", name: "Tolu (work)", initials: "TO", number: "0805 441 2200",
    kind: "phone", service: "Glo \u00b7 Data", serviceIcon: "data",
    network: "glo", lastUsed: "12 Aug", addedOn: "20 May 2026",
    purchases: 4, totalSent: 3400,
  },
  {
    id: "rcp-6", name: "Me", initials: "AO", number: "0801 234 5678",
    kind: "phone", service: "MTN \u00b7 Airtime, data", serviceIcon: "airtime",
    network: "mtn", lastUsed: "Today", addedOn: "4 Jul 2026",
    purchases: 31, totalSent: 26500,
  },
  {
    id: "rcp-7", name: "Shop meter", initials: "SM", number: "04188 7710 22",
    kind: "meter", service: "EKEDC prepaid", serviceIcon: "electricity",
    lastUsed: "28 Jul", addedOn: "9 Apr 2026", purchases: 5, totalSent: 27500,
  },
];

export const RECIPIENT_HISTORY: Record<string, { title: string; when: string; amount: number }[]> = {
  "rcp-1": [
    { title: "MTN 1GB \u00b7 30 days", when: "2 days ago", amount: 800 },
    { title: "MTN Airtime", when: "28 Jul", amount: 500 },
    { title: "MTN 2GB \u00b7 30 days", when: "2 Jul", amount: 1200 },
  ],
};

export const METER_LOOKUP: Record<string, { name: string; address: string }> = {
  "04197221088": { name: "ADAEZE N. OKAFOR", address: "12 Bode Thomas St, Surulere" },
  "04188771022": { name: "ADAEZE N. OKAFOR", address: "44 Adeniran Ogunsanya, Surulere" },
};

export const SMARTCARD_LOOKUP: Record<string, { name: string; current: string; expires: string }> = {
  "7012345678": { name: "CHIDI E. NWOSU", current: "Compact", expires: "2 Sep" },
  "7099887766": { name: "ADAEZE N. OKAFOR", current: "Jolli", expires: "18 Sep" },
};

export const USER = {
  firstName: "Adaeze",
  fullName: "Adaeze Okafor",
  initials: "AO",
  phone: "0801 234 5678",
  pinChanged: "4 Jul 2026",
};

export const ASSISTANT_SUGGESTIONS = [
  "Send \u20A6500 airtime to Mum",
  "Cheapest 10GB plan for my line",
  "How much did I spend on data this month?",
];

export const RECENT_CHATS = [
  "1GB MTN for 0801\u2026",
  "Data spend in July",
  "Why did IKEDC fail?",
];

export const DEVICES = [
  { id: "dev-1", name: "iPhone 13 \u00b7 Lagos", meta: "This device \u00b7 active now", current: true },
  { id: "dev-2", name: "Chrome \u00b7 Windows", meta: "Last used 12 Aug, 18:04", current: false },
];
