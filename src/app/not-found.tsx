import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Brand from "@/components/shared/Brand";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-ivory">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-152 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-104 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sand/60 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-350 items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <Brand />
        <Link
          href="/services"
          className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-espresso/60 transition-colors hover:text-espresso"
        >
          The menu
        </Link>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-5 py-16 text-center">
        <div className="max-w-lg">
          <p className="font-display text-[8rem] font-light leading-none tracking-[-0.06em] text-gold/35 sm:text-[11rem]">
            404
          </p>
          <span className="eyebrow mt-2 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-gold/60" aria-hidden />
            A wrong turn
          </span>
          <h1 className="mt-5 font-display text-[2.6rem] font-light leading-[0.98] tracking-[-0.03em] text-espresso sm:text-5xl">
            This page has{" "}
            <em className="italic text-gold">wandered off.</em>
          </h1>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-mocha">
            The ritual you were looking for may have moved. Let us take you back
            to somewhere warm.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/" className={buttonVariants({ size: "lg" })}>
              <ArrowLeft className="size-4" strokeWidth={1.7} />
              Back to the atelier
            </Link>
            <Link
              href="/services"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Browse services
              <ArrowUpRight className="size-4" strokeWidth={1.7} />
            </Link>
          </div>
        </div>
      </div>

      <p className="relative pb-8 text-center text-[0.58rem] uppercase tracking-[0.2em] text-mocha/50">
        18 Wren Street, Bloomsbury · Tue – Sat, 9am – 7pm
      </p>
    </main>
  );
}