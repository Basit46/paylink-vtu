import Link from "next/link";
import { SERVICES, ServiceIcon } from "./service-icon";
import { cn } from "@/lib/utils";

export function ServiceTiles({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <div className="grid shrink-0 grid-cols-4 gap-2.5">
      {SERVICES.map((service) => (
        <Link
          key={service.id}
          href={service.href}
          className={cn(
            "flex flex-col items-center gap-2 rounded-[14px] border border-border bg-card px-1 py-3.5 transition-colors hover:border-primary/40 hover:bg-primary-subtle/40",
            dimmed && "opacity-55"
          )}
        >
          <ServiceIcon
            service={service.id}
            className="size-[21px] text-[oklch(0.45_0.11_168)]"
          />
          <span className="text-[12.5px] font-medium">{service.label}</span>
        </Link>
      ))}
    </div>
  );
}
