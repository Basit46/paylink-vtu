export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex flex-1 justify-center bg-background">
      <div className="flex w-full max-w-[430px] flex-col px-6 pt-4 pb-8">
        {children}
      </div>
    </main>
  );
}
