
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/shared/DashboardSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type UserRole = "user" | "admin";

// Fetch session and render the role-based sidebar.
async function DashboardSidebarWithSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect unauthenticated users.
  if (!session) redirect("/login");

  const role = (session.user.role ?? "user") as UserRole;

  return <DashboardSidebar role={role} />;
}

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      {/* Load the authenticated sidebar separately. */}
      <Suspense
        fallback={
          <div className="w-16 animate-pulse bg-sidebar" />
        }
      >
        <DashboardSidebarWithSession />
      </Suspense>

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
        <main className="flex-1 p-5 sm:p-7 lg:p-10">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}