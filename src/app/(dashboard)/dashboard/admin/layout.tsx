import { Suspense } from "react";

import { requireDashboardRole } from "@/lib/auth-guard";

export const instant = false;

// Only admins may render the admin dashboard. Customers are redirected to
// their own dashboard by the guard.
async function AdminAreaGuard({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireDashboardRole("admin");

  return <>{children}</>;
}

export default function AdminAreaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={null}>
      <AdminAreaGuard>{children}</AdminAreaGuard>
    </Suspense>
  );
}
