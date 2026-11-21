"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function UserMenu() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Prepare user details
  const userName = user?.name?.trim() || user?.email?.trim() || "User";
  const avatarLetter = userName.charAt(0).toUpperCase();
  const image = user?.image?.trim();

  // Handle user logout
  async function handleLogout() {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Logged out successfully.");
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  // Check user session
  if (!user) return null;

  return (
    <div className="relative">
      {/* User Menu Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Toggle user menu"
        className="flex items-center gap-2 rounded-full border border-line p-1.5 pr-3 transition hover:bg-sand/60"
      >
        {/* User Avatar */}
        {image && !imageError ? (
          <Image
            src={image}
            alt={userName}
            width={36}
            height={36}
            onError={() => setImageError(true)}
            className="size-9 rounded-full object-cover"
          />
        ) : (
          <div className="grid size-9 place-items-center rounded-full bg-sand text-sm font-semibold text-espresso">
            {avatarLetter}
          </div>
        )}

        {/* User Name */}
        <span className="hidden max-w-28 truncate text-xs font-semibold text-espresso sm:block">
          {userName}
        </span>

        {/* Dropdown Icon */}
        <ChevronDown
          className={`size-4 text-mocha transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Content */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-line bg-ivory p-3 shadow-xl">
          {/* User Information */}
          <div className="border-b border-line px-2 pb-3">
            <p className="truncate text-sm font-semibold text-espresso">
              {userName}
            </p>
            <p className="truncate text-xs text-mocha">
              {user.email}
            </p>
          </div>

         {/* Dashboard Link */}
<Link
  href={`/dashboard/${session?.user?.role ?? "user"}`}
  onClick={() => setOpen(false)}
  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-espresso transition hover:bg-sand"
>
  <LayoutDashboard className="size-4" />
  Dashboard
</Link>

          {/* Logout Action */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}