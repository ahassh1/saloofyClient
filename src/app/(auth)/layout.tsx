
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import Brand from "@/components/shared/Brand";

export const metadata: Metadata = {
  title: "Your account",
  description:
    "Sign in or create a SalonBook account to rebook your favourite rituals and keep your artist notes in one place.",
};

const AccountLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const stats = [
    ["10", "Years open"],
    ["2.4k", "Guest visits"],
    ["4.9", "Average rating"],
  ];

  return (
    <div className="flex min-h-dvh bg-ivory">
      {/* Left Side */}
      <aside className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-espresso p-10 lg:flex xl:p-12">
        <Image
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=80"
          alt="The SalonBook atelier in warm afternoon light"
          fill
          sizes="45vw"
          className="object-cover opacity-55"
        />

        <div className="absolute inset-0 bg-linear-to-t from-espresso via-espresso/70 to-espresso/35" />

        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/3 size-104 rounded-full border border-ivory/[0.07]"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 size-88 rounded-full border border-gold/15"
        />

        <div className="relative z-10">
          <Brand tone="light" />
        </div>

        <div className="relative z-10 max-w-md">
          <div className="flex gap-1 text-gold-soft">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="size-3.5 fill-current" />
            ))}
          </div>

          <blockquote className="mt-5 font-display text-[2rem] font-light italic leading-tight tracking-tight text-ivory/95 xl:text-[2.3rem]">
            “The calmest part of my month. I book at midnight and wake up to a
            confirmation — and a seat that is actually mine.”
          </blockquote>

          <div className="mt-5 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full border border-gold/35 text-[0.55rem] font-bold text-gold-soft">
              ML
            </span>

            <div>
              <p className="text-[0.7rem] font-semibold text-ivory">
                Margot Lindqvist
              </p>
              <p className="mt-0.5 text-[0.58rem] text-ivory/45">
                Guest since 2023
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-ivory/15 pt-5">
          {stats.map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-2xl font-light text-ivory">
                {value}
              </p>
              <p className="mt-1 text-[0.52rem] font-semibold uppercase tracking-wider text-ivory/40">
                {label}
              </p>
            </div>
          ))}
        </div>
      </aside>

      {/* Right Side */}
      <div className="flex min-h-dvh flex-1 flex-col">
        <header className="flex items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-espresso/60 transition-colors hover:text-espresso"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to the atelier
          </Link>

          <div className="lg:hidden">
            <Brand />
          </div>

          <span className="hidden text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-mocha/60 lg:block">
            Client account
          </span>
        </header>

        <main className="flex flex-1 items-center justify-center px-5 py-4 sm:px-8">
          <div className="w-full max-w-105">{children}</div>
        </main>

        <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-5 py-3 text-[0.55rem] text-mocha/60">
          <span>© 2026 SalonBook Atelier</span>
          <span className="hidden sm:inline">·</span>
          <span>Privacy</span>
          <span>Terms</span>
          <span className="hidden sm:inline">·</span>
          <span>hello@salonbook.co</span>
        </footer>
      </div>
    </div>
  );
};

export default AccountLayout;