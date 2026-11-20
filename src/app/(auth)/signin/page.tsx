"use client";
import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  Info,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import PasswordField from "@/components/auth/PasswordField";
import GoogleMark from "@/components/auth/GoogleMark";
import { authClient, signIn } from "@/lib/auth-client";
import { toast } from "sonner";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Handle Google login
  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  // Handle form submission
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setNotice(null);

    try {
      // Sign in user
      const { data, error } = await signIn.email({
        email,
        password,
        rememberMe: remember,
        callbackURL: "/",
      });

      if (error) {
        console.error("Sign in error:", error);
        toast(error.message || "Invalid email or password.");
        return;
      }

      console.log("Sign in successful:", data);
      toast("Signed in successfully!");
    } catch (error) {
      console.error("Sign in error:", error);
      toast("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-up">
      <span className="eyebrow inline-flex items-center gap-3">
        <span className="h-px w-8 bg-gold/60" />
        Welcome back
      </span>

      <h1 className="mt-2 font-display text-4xl font-light leading-none tracking-tight text-espresso sm:text-[2.7rem]">
        Sign in to <em className="italic text-gold">Saloofy.</em>
      </h1>

      <p className="mt-2 text-[0.78rem] leading-relaxed text-mocha">
        Rebook your favourites, keep your artist notes, and see every
        appointment in one quiet place.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
        {/* Email */}
        <div>
          <label htmlFor="email" className="field-label">
            Email address
          </label>

          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-mocha/50" />
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="field pl-11"
              required
            />
          </div>
        </div>

        {/* Password */}
        <PasswordField
          name="password"
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        {/* Remember Me */}
        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-[0.72rem] text-mocha">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="size-4 rounded border-line accent-gold"
            />
            Keep me signed in
          </label>

          <button
            type="button"
            onClick={() =>
              setNotice("Password recovery will be available once accounts are live.")
            }
            className="text-[0.62rem] font-semibold uppercase tracking-wider text-espresso/70 hover:text-gold"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`${buttonVariants({ size: "lg" })} w-full`}
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in
            </>
          ) : (
            <>
              <LockKeyhole className="size-4" />
              Sign in
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-mocha/60">
          or continue with
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      {/* Google Sign In */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="flex h-11 w-full items-center cursor-pointer justify-center gap-3 rounded-full border border-line bg-cream text-[0.7rem] font-semibold uppercase tracking-wider text-espresso transition-colors hover:border-taupe/60 hover:bg-sand"
      >
        <GoogleMark className="size-4.5" />
        Continue with Google
      </button>

      {/* Status Message */}
      {notice && (
        <div
          role="status"
          className="mt-3 flex gap-2 rounded-xl border border-gold/25 bg-gold/[0.07] px-3 py-2.5 text-[0.7rem] leading-relaxed text-espresso/75"
        >
          <Info className="mt-0.5 size-3.5 shrink-0 text-gold" />
          {notice}
        </div>
      )}

      <p className="mt-4 text-center text-[0.75rem] text-mocha">
        New to the atelier?{" "}
        <Link
          href="/signup"
          className="font-semibold text-espresso underline decoration-gold/50 underline-offset-4 hover:text-gold"
        >
          Create an account
        </Link>
      </p>

      <p className="mt-3 text-center text-[0.58rem] text-mocha/55">
        By signing in you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
};
export default SignIn;