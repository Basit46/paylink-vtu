import { ConfirmSheet } from "@/components/paylink/confirm-sheet";
import { DesktopSidebar } from "@/components/paylink/app-shell";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-1 bg-background">
      <DesktopSidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      <ConfirmSheet />
    </div>
  );
}
