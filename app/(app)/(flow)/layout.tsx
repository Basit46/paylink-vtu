export default function FlowLayout({ children }: LayoutProps<"/">) {
  return <div className="flex min-h-0 flex-1 flex-col">{children}</div>;
}
