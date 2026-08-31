export type ServiceId = "airtime" | "data" | "electricity" | "cable";

export type TxStatus = "success" | "pending" | "failed" | "reversed";

export type NetworkId = "mtn" | "glo" | "airtel" | "9mobile";

export type Network = {
  id: NetworkId;
  name: string;
  short: string;
  prefixes: string[];
};

export type DataPlan = {
  id: string;
  network: NetworkId;
  size: string;
  validity: string;
  price: number;
  bucket: "daily" | "weekly" | "monthly" | "mega";
};

export type Disco = {
  id: string;
  name: string;
  short: string;
  available: boolean;
};

export type CableProvider = {
  id: string;
  name: string;
  short: string;
};

export type CablePackage = {
  id: string;
  provider: string;
  name: string;
  cadence: string;
  price: number;
};

export type Transaction = {
  id: string;
  reference: string;
  providerReference?: string;
  service: ServiceId | "funding";
  title: string;
  recipient: string;
  meta: string;
  amount: number;
  fee: number;
  status: TxStatus;
  createdAt: string;
  group: string;
  time: string;
  token?: string;
  units?: string;
  verifiedName?: string;
  failureReason?: string;
};

export type Recipient = {
  id: string;
  name: string;
  initials: string;
  number: string;
  kind: "phone" | "meter" | "smartcard";
  service: string;
  serviceIcon: ServiceId;
  network?: NetworkId;
  lastUsed: string;
  addedOn: string;
  purchases: number;
  totalSent: number;
};

export type PurchaseDraft = {
  service: ServiceId;
  title: string;
  recipient: string;
  amount: number;
  fee: number;
  lines: { label: string; value: string; mono?: boolean }[];
  verifiedName?: string;
  successHeadline: string;
  successDetail: string;
  token?: string;
  units?: string;
  providerName: string;
};

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  text?: string;
  chips?: string[];
  toolCalls?: string[];
  approval?: {
    title: string;
    amount: number;
    lines: { label: string; value: string }[];
  };
  pending?: boolean;
};
