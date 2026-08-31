"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  History,
  House,
  MessageCircle,
  Plus,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { naira } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/store/session";
import { useWalletStore } from "@/store/wallet";
import { BrandLockup } from "./brand-mark";

const NAV = [
  { href: "/dashboard", label: "Home", icon: House, mobile: true },
  { href: "/history", label: "History", icon: History, mobile: true },
  { href: "/assistant", label: "Assistant", icon: MessageCircle, mobile: true },
  { href: "/recipients", label: "Recipients", icon: UserRound, mobile: false },
  { href: "/settings", label: "Settings", icon: Settings, mobile: true },
];

function useActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard" || pathname.startsWith("/buy") || pathname === "/fund"
      : pathname.startsWith(href);
}

export function DesktopSidebar() {
  const isActive = useActive();
  const balance = useWalletStore((s) => s.balance);
  const { fullName, phone, initials } = useSessionStore();

  return (
    <aside className="hidden w-[236px] shrink-0 flex-col gap-6 border-r border-border bg-card px-4 py-5 lg:flex">
      <Link href="/dashboard" className="px-2">
        <BrandLockup />
      </Link>

      <nav className="flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex h-10 items-center gap-3 rounded-[10px] px-3 text-[14px] font-medium transition-colors",
              isActive(href)
                ? "bg-primary-subtle text-[var(--primary-hover)]"
                : "text-secondary-foreground hover:bg-muted"
            )}
          >
            <Icon strokeWidth={1.75} className="size-[18px]" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <div className="flex flex-col gap-1 rounded-[14px] border border-border bg-muted px-4 py-3">
          <span className="text-[11px] tracking-[0.05em] text-muted-foreground uppercase">
            Wallet
          </span>
          <span className="font-mono tabular text-[17px] font-medium">
            {naira(balance)}
          </span>
        </div>
        <Link
          href="/settings"
          className="flex items-center gap-2.5 rounded-[14px] px-2 py-2 transition-colors hover:bg-muted"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-deep text-[13px] font-medium text-white">
            {initials}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] font-medium">{fullName}</span>
            <span className="truncate font-mono text-[11px] text-muted-foreground">
              {phone}
            </span>
          </span>
        </Link>
      </div>
    </aside>
  );
}

export function DesktopTopBar({
  searchPlaceholder = "Search transactions or recipients",
}: {
  searchPlaceholder?: string;
}) {
  return (
    <div className="hidden h-16 shrink-0 items-center gap-3 border-b border-border bg-card px-7 lg:flex">
      <label className="flex h-10 max-w-[420px] flex-1 items-center gap-2.5 rounded-[10px] border border-border bg-muted px-3.5">
        <Search strokeWidth={1.75} className="size-4 text-muted-foreground" />
        <input
          placeholder={searchPlaceholder}
          className="w-full bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
        />
      </label>
      <span className="ml-auto flex h-[30px] items-center rounded-full border border-border px-3 font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
        Sandbox
      </span>
      <Button render={<Link href="/fund" />}>
        <Plus strokeWidth={2.5} className="size-4" />
        Fund wallet
      </Button>
    </div>
  );
}

export function MobileTabBar() {
  const isActive = useActive();
  return (
    <nav className="sticky bottom-0 z-30 flex shrink-0 items-stretch border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden">
      {NAV.filter((item) => item.mobile).map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
            isActive(href) ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Icon strokeWidth={1.75} className="size-[21px]" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
