"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";

import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

// Sign-out action used by the blocked-account notice page.
export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    if (loading) return;

    setLoading(true);

    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message || "Unable to sign out. Please try again.");
      setLoading(false);
      return;
    }

    toast.success("Signed out successfully.");
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className={`${buttonVariants({ size: "lg" })} w-full sm:w-auto`}
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Signing out
        </>
      ) : (
        <>
          <LogOut className="size-4" />
          Sign out
        </>
      )}
    </button>
  );
}
