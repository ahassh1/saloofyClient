import { Suspense } from "react";

import DashboardSidebar from "@/components/dashboard/shared/DashboardSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { requireAuthenticatedUser } from "@/lib/auth-guard";

// Reading the session blocks this segment, so it cannot be "instant".
export const instant = false;

// Loading shell shown while the session is verified on the server.
function DashboardShellFallback() {
  return (
    <div className="flex min-h-dvh w-full">
      <div className="hidden w-16 animate-pulse bg-sidebar sm:block" />

      <div className="flex-1 space-y-4 p-5 sm:p-7 lg:p-10">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-sand" />
        <div className="h-24 w-full animate-pulse rounded-xl bg-sand/60" />
      </div>
    </div>
  );
}

// The guard runs BEFORE `children` is rendered, so protected pages never
// render for a guest or a blocked account.
async function DashboardShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAuthenticatedUser();

  return (
    <SidebarProvider>
      <DashboardSidebar role={user.role} />

      <SidebarInset>
        {/* Mobile dashboard header */}
        <header className="flex h-16 items-center gap-3 border-b border-line px-4 sm:px-6 md:hidden">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />

          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-mocha">
            Dashboard
          </p>
        </header>

        {/* Dashboard page content */}
        <main className="flex-1 p-5 sm:p-7 lg:p-10">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<DashboardShellFallback />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
