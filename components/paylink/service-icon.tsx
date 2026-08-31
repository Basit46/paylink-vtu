import { Banknote, Lightbulb, Smartphone, Tv, Wifi } from "lucide-react";
import type { ServiceId } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS = {
  airtime: Smartphone,
  data: Wifi,
  electricity: Lightbulb,
  cable: Tv,
  funding: Banknote,
} as const;

export function ServiceIcon({
  service,
  className,
}: {
  service: ServiceId | "funding";
  className?: string;
}) {
  const Icon = ICONS[service];
  return <Icon strokeWidth={1.75} className={cn("size-5", className)} />;
}

export const SERVICES: {
  id: ServiceId;
  label: string;
  href: string;
  blurb: string;
}[] = [
  { id: "airtime", label: "Airtime", href: "/buy/airtime", blurb: "All networks" },
  { id: "data", label: "Data", href: "/buy/data", blurb: "Daily to monthly" },
  { id: "electricity", label: "Power", href: "/buy/electricity", blurb: "11 discos" },
  { id: "cable", label: "Cable", href: "/buy/cable", blurb: "DStv, GOtv, more" },
];
