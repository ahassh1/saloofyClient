"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner"
import type { FormEvent, ChangeEvent } from "react"
import {
  ArrowRight,
  Check,
  ImagePlus,
  Info,
  Link2,
  Mail,
  UserRound,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import PasswordField from "@/components/auth/PasswordField";
import GoogleMark from "@/components/auth/GoogleMark";
import { authClient, signUp } from "@/lib/auth-client";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [preview, setPreview] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);

  const rules = [
    { label: "6+ characters", ok: password.length >= 6 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Lowercase", ok: /[a-z]/.test(password) },
  ];

  // Handle image selection
  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) setPreview(URL.createObjectURL(file));
  }

  // Handle Google signup
const handleGoogleSignUp = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
  });
};

  // Handle form submission
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    const formData = new FormData(event.currentTarget);

    const image =
      mode === "upload"
        ? undefined
        : (formData.get("imageUrl") as string) || undefined;

    try {
      // Create user account
      const { data, error } = await signUp.email({
        name: fullName,
        email,
        password,
        ...(image && { image }),
        callbackURL: "/",
      });

      if (error) {
        toast(error.message || "Something went wrong.");
        console.error(error);
        return;
      }

      console.log(data);
      toast("Account created successfully!");
    } catch (error) {
      console.error(error);
      toast("Unable to create account. Please try again.");
    }
  }

  return (
    <div className="animate-fade-up">
      <span className="eyebrow inline-flex items-center gap-3">
        <span className="h-px w-8 bg-gold/60" />
        Join the atelier
      </span>

      <h1 className="mt-2 font-display text-4xl font-light leading-none tracking-tight text-espresso sm:text-[2.7rem]">
        Create your <em className="italic text-gold">account.</em>
      </h1>

      <p className="mt-2 text-[0.78rem] leading-relaxed text-mocha">
        Save your rituals, keep your artist’s notes, and book your next visit.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="field-label">
            Full name
          </label>

          <div className="relative">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-mocha/50" />
            <input
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Eleanor Whitfield"
              autoComplete="name"
              className="field pl-11"
              required
            />
          </div>
        </div>

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

        {/* Profile Image */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="field-label mb-0!">Profile image</span>
            <span className="text-[0.55rem] uppercase tracking-wider text-mocha/50">
              Optional
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-dashed border-line bg-cream/60 p-2.5">
            <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-sand">
              {preview ? (
                <div
                  role="img"
                  aria-label="Selected profile preview"
                  className="size-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${preview})` }}
                />
              ) : (
                <ImagePlus className="size-5 text-mocha/50" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setMode("upload")}
                  className={`rounded-full px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-wider ${
                    mode === "upload"
                      ? "bg-espresso text-ivory"
                      : "text-mocha hover:text-espresso"
                  }`}
                >
                  Upload
                </button>

                <button
                  type="button"
                  onClick={() => setMode("url")}
                  className={`rounded-full px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-wider ${
                    mode === "url"
                      ? "bg-espresso text-ivory"
                      : "text-mocha hover:text-espresso"
                  }`}
                >
                  Image URL
                </button>
              </div>

              {mode === "upload" ? (
                <div className="mt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    className="text-[0.65rem] font-semibold text-espresso underline decoration-gold/50 underline-offset-4 hover:text-gold"
                  >
                    Choose image
                  </button>

                  <span className="truncate text-[0.55rem] text-mocha/60">
                    JPG, PNG or WebP · 5MB
                  </span>

                  <input
                    ref={fileInput}
                    type="file"
                    name="photo"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFile}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative mt-1">
                  <Link2 className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-mocha/50" />
                  <input
                    type="url"
                    name="imageUrl"
                    onChange={(event) =>
                      setPreview(event.target.value || null)
                    }
                    placeholder="https://..."
                    className="h-8 w-full rounded-full border border-line bg-ivory pl-8 pr-3 text-[0.7rem] text-espresso outline-none focus:border-gold/70"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Password */}
        <div>
          <PasswordField
            name="password"
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="Create a password"
            autoComplete="new-password"
          />

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {rules.map((rule) => (
              <span
                key={rule.label}
                className={`inline-flex items-center gap-1 text-[0.58rem] ${
                  rule.ok ? "text-emerald-800" : "text-mocha/60"
                }`}
              >
                <span
                  className={`grid size-3.5 place-items-center rounded-full border ${
                    rule.ok
                      ? "border-emerald-700/30 bg-emerald-700/10"
                      : "border-line bg-cream"
                  }`}
                >
                  {rule.ok && <Check className="size-2.5" />}
                </span>
                {rule.label}
              </span>
            ))}
          </div>
        </div>

        {/* Terms */}
        <label className="flex cursor-pointer items-start gap-2 text-[0.68rem] leading-relaxed text-mocha">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="mt-0.5 size-4 rounded border-line accent-gold"
            required
          />
          <span>
            I agree to the{" "}
            <span className="font-semibold text-espresso underline decoration-gold/40">
              Terms
            </span>{" "}
            and{" "}
            <span className="font-semibold text-espresso underline decoration-gold/40">
              Privacy Policy
            </span>
            .
          </span>
        </label>

        <button
          type="submit"
          className={`${buttonVariants({ size: "lg" })} w-full`}
        >
          Create account
          <ArrowRight className="size-4" />
        </button>
      </form>

      <div className="my-3 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-mocha/60">
          or continue with
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <button
        type="button"  onClick={handleGoogleSignUp}
        className="flex h-10 w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-line bg-cream text-[0.68rem] font-semibold uppercase tracking-wider text-espresso transition-colors hover:border-taupe/60 hover:bg-sand"
      >
        <GoogleMark className="size-4.5" />
        Sign up with Google
      </button>

      {notice && (
        <div
          role="status"
          className="mt-3 flex gap-2 rounded-xl border border-gold/25 bg-gold/[0.07] px-3 py-2 text-[0.68rem] leading-relaxed text-espresso/75"
        >
          <Info className="mt-0.5 size-3.5 shrink-0 text-gold" />
          {notice}
        </div>
      )}

      <p className="mt-3 text-center text-[0.75rem] text-mocha">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-semibold text-espresso underline decoration-gold/50 underline-offset-4 hover:text-gold"
        >
          Sign in
        </Link>
      </p>

      <p className="mt-2 text-center text-[0.58rem] text-mocha/55">
        Your details stay private. We never share your information.
      </p>
    </div>
  );
};
export default SignUp;