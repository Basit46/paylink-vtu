import { MobileTabBar } from "@/components/paylink/app-shell";

export default function TabsLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <MobileTabBar />
    </>
  );
}
