"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function AuthHeader({ onBack }: { onBack?: () => void }) {
  const router = useRouter();
  return (
    <div className="flex h-14 items-center">
      <button
        type="button"
        onClick={() => (onBack ? onBack() : router.back())}
        aria-label="Go back"
        className="flex size-10 items-center justify-center rounded-full text-secondary-foreground transition-colors hover:bg-muted"
      >
        <ArrowLeft strokeWidth={1.75} className="size-5" />
      </button>
    </div>
  );
}
