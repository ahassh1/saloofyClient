import DashboardSidebar from "@/components/dashboard/shared/DashboardSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <DashboardSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center gap-3 border-b border-line px-4 sm:px-6 md:hidden">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-mocha">
            Dashboard
          </p>
        </header>

        <main className="flex-1 p-5 sm:p-7 lg:p-10">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}