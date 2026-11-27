import { Suspense } from "react";

import { requireDashboardRole } from "@/lib/auth-guard";

export const instant = false;

// Only customers may render the customer dashboard. Admins are redirected to
// the admin dashboard by the guard.
async function CustomerAreaGuard({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireDashboardRole("user");

  return <>{children}</>;
}

export default function CustomerAreaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={null}>
      <CustomerAreaGuard>{children}</CustomerAreaGuard>
    </Suspense>
  );
}
