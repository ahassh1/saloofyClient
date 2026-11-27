"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import SignOutButton from "@/components/auth/SignOutButton";
import { authClient, useSession } from "@/lib/auth-client";

export default function AccountProfile() {
  const { data: session, isPending, refetch } = useSession();
  const user = session?.user;
  const userId = user?.id;
  const userName = user?.name;
  const userImage = user?.image;
  const userPhone = user?.phone;
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setName(userName ?? "");
    setImage(userImage ?? "");
    setPhone(userPhone ?? "");
  }, [userId, userName, userImage, userPhone]);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedName = name.trim();

    if (!updatedName) {
      toast.error("Enter your name before saving.");
      return;
    }

    setSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: updatedName,
        image: image.trim() || null,
        phone: phone.trim() || undefined,
      });

      if (error) {
        toast.error(error.message || "Unable to update your profile.");
        return;
      }

      await refetch();
      toast.success("Profile updated.");
    } catch (saveError) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update your profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (isPending) {
    return (
      <div
        className="mx-auto h-80 w-full max-w-3xl animate-pulse rounded-2xl bg-sand/70"
        aria-label="Loading profile"
      />
    );
  }

  if (!user) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Your profile could not be loaded. Please sign in again.
      </p>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl">
      <div>
        <p className="eyebrow">Your account</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          My profile
        </h1>
        <p className="mt-2 text-sm leading-6 text-mocha">
          Update the profile information shown on your account.
        </p>
      </div>

      <form
        onSubmit={saveProfile}
        className="mt-8 rounded-2xl border border-line bg-cream p-5 shadow-sm sm:p-7"
      >
        <div className="mb-6 flex items-center gap-4">
          {user.image ? (
            <Image
              src={user.image}
              alt={`${user.name}'s profile`}
              width={64}
              height={64}
              unoptimized
              className="size-16 rounded-full object-cover"
            />
          ) : (
            <span className="grid size-16 place-items-center rounded-full bg-sand font-display text-2xl font-semibold text-espresso">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
          )}
          <div>
            <p className="font-semibold text-espresso">{user.name}</p>
            <p className="text-sm capitalize text-mocha">{user.role}</p>
          </div>
        </div>

        <div className="grid gap-5">
          <div>
            <label htmlFor="profile-name" className="field-label">
              Name
            </label>
            <input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              className="field"
              required
            />
          </div>

          <div>
            <label htmlFor="profile-email" className="field-label">
              Email address
            </label>
            <input
              id="profile-email"
              value={user.email}
              readOnly
              className="field cursor-not-allowed opacity-70"
            />
          </div>

          <div>
            <label htmlFor="profile-phone" className="field-label">
              Phone number
            </label>
            <input
              id="profile-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="profile-image" className="field-label">
              Profile image URL
            </label>
            <input
              id="profile-image"
              type="url"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              placeholder="https://example.com/your-photo.jpg"
              className="field"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-espresso px-6 text-sm font-semibold text-ivory hover:bg-mocha disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          <SignOutButton />
        </div>
      </form>
    </section>
  );
}
