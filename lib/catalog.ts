import type {
  CablePackage,
  CableProvider,
  DataPlan,
  Disco,
  Network,
} from "./types";

export const NETWORKS: Network[] = [
  { id: "mtn", name: "MTN", short: "MTN", prefixes: ["0803", "0806", "0703", "0706", "0813", "0816", "0810", "0814", "0903", "0906", "0913", "0916", "0801"] },
  { id: "glo", name: "Glo", short: "Glo", prefixes: ["0805", "0807", "0705", "0815", "0811", "0905", "0915"] },
  { id: "airtel", name: "Airtel", short: "Air", prefixes: ["0802", "0808", "0708", "0812", "0701", "0902", "0901", "0904", "0907", "0912"] },
  { id: "9mobile", name: "9mobile", short: "9mb", prefixes: ["0809", "0818", "0817", "0909", "0908"] },
];

export function detectNetwork(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const local = digits.startsWith("234") ? `0${digits.slice(3)}` : digits;
  if (local.length < 4) return null;
  const prefix = local.slice(0, 4);
  return NETWORKS.find((n) => n.prefixes.includes(prefix)) ?? null;
}

export const AIRTIME_PRESETS = [100, 500, 1000, 2000];
export const FUND_PRESETS = [1000, 5000, 10000];
export const POWER_PRESETS = [1000, 2000, 4000, 10000];

export const DATA_PLANS: DataPlan[] = [
  { id: "mtn-1gb-1d", network: "mtn", size: "1GB", validity: "1 day", price: 350, bucket: "daily" },
  { id: "mtn-2gb-2d", network: "mtn", size: "2GB", validity: "2 days", price: 500, bucket: "daily" },
  { id: "mtn-1gb-7d", network: "mtn", size: "1GB", validity: "7 days", price: 500, bucket: "weekly" },
  { id: "mtn-3-5gb-7d", network: "mtn", size: "3.5GB", validity: "7 days", price: 1500, bucket: "weekly" },
  { id: "mtn-1gb-30d", network: "mtn", size: "1GB", validity: "30 days", price: 800, bucket: "monthly" },
  { id: "mtn-2gb-30d", network: "mtn", size: "2GB", validity: "30 days", price: 1200, bucket: "monthly" },
  { id: "mtn-3gb-30d", network: "mtn", size: "3GB", validity: "30 days", price: 1500, bucket: "monthly" },
  { id: "mtn-5gb-30d", network: "mtn", size: "5GB", validity: "30 days", price: 2500, bucket: "monthly" },
  { id: "mtn-10gb-30d", network: "mtn", size: "10GB", validity: "30 days", price: 4500, bucket: "monthly" },
  { id: "mtn-20gb-30d", network: "mtn", size: "20GB", validity: "30 days", price: 8000, bucket: "monthly" },
  { id: "mtn-40gb-30d", network: "mtn", size: "40GB", validity: "30 days", price: 15000, bucket: "mega" },
  { id: "mtn-75gb-30d", network: "mtn", size: "75GB", validity: "30 days", price: 25000, bucket: "mega" },
];

export const DISCOS: Disco[] = [
  { id: "ikedc", name: "Ikeja Electric", short: "IKEDC", available: true },
  { id: "ekedc", name: "Eko Electric", short: "EKEDC", available: true },
  { id: "aedc", name: "Abuja Electric", short: "AEDC", available: true },
  { id: "phed", name: "Port Harcourt Electric", short: "PHED", available: true },
  { id: "kedco", name: "Kano Electric", short: "KEDCO", available: false },
];

export const CABLE_PROVIDERS: CableProvider[] = [
  { id: "dstv", name: "DStv", short: "DStv" },
  { id: "gotv", name: "GOtv", short: "GOtv" },
  { id: "startimes", name: "Startimes", short: "Star" },
];

export const CABLE_PACKAGES: CablePackage[] = [
  { id: "dstv-yanga", provider: "dstv", name: "Yanga", cadence: "1 month", price: 6000 },
  { id: "dstv-compact", provider: "dstv", name: "Compact", cadence: "1 month", price: 19000 },
  { id: "dstv-compact-plus", provider: "dstv", name: "Compact Plus", cadence: "1 month", price: 30000 },
  { id: "dstv-premium", provider: "dstv", name: "Premium", cadence: "1 month", price: 44500 },
  { id: "gotv-jinja", provider: "gotv", name: "Jinja", cadence: "1 month", price: 3900 },
  { id: "gotv-jolli", provider: "gotv", name: "Jolli", cadence: "1 month", price: 5800 },
  { id: "gotv-max", provider: "gotv", name: "Max", cadence: "1 month", price: 8500 },
  { id: "startimes-nova", provider: "startimes", name: "Nova", cadence: "1 month", price: 1900 },
  { id: "startimes-basic", provider: "startimes", name: "Basic", cadence: "1 month", price: 4000 },
];

export const PAYSTACK_FEE_RATE = 0.015;
