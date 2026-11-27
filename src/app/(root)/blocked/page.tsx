import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";

import SignOutButton from "@/components/auth/SignOutButton";
import { getSessionUser } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "Account blocked",
  description:
    "This SalonBook account has been blocked. Contact the salon to restore access.",
};

export const instant = false;

// Server-side check: only a blocked, signed-in user should see this notice.
async function BlockedNotice() {
  const user = await getSessionUser();

  if (!user) redirect("/signin");
  if (!user.blocked) redirect(`/dashboard/${user.role}`);

  return (
    <div className="mx-auto w-full max-w-xl px-5 py-16 sm:py-24">
      <div className="rounded-2xl border border-line bg-cream p-8 text-center shadow-sm sm:p-12">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-7" strokeWidth={1.7} />
        </span>

        <h1 className="mt-6 font-display text-3xl font-light tracking-tight text-espresso sm:text-4xl">
          This account is blocked
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-mocha">
          Booking, appointments, and your dashboard are unavailable while the
          account is blocked. If you believe this is a mistake, contact the
          salon and we will help you restore access.
        </p>

        <p className="mt-4 text-xs text-mocha/70">
          Signed in as <span className="font-semibold">{user.email}</span>
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <SignOutButton />

          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-line px-4 text-sm font-medium text-espresso transition-colors hover:bg-sand"
          >
            Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BlockedPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-xl px-5 py-16 sm:py-24">
          <div className="h-64 animate-pulse rounded-2xl bg-sand/60" />
        </div>
      }
    >
      <BlockedNotice />
    </Suspense>
  );
}
