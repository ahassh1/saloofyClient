
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Brand from "@/components/shared/Brand";

const nav = [
  { href: "/", label: "Home", index: "01" },
  { href: "/services", label: "Browse Services", index: "02" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled || open
            ? "border-line/60 bg-ivory/95 shadow-[0_8px_25px_-18px_rgba(47,42,38,0.3)] backdrop-blur-xl"
            : "border-line/40 bg-ivory/90 backdrop-blur-lg"
        }`}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-350 items-center justify-between gap-6 px-5 sm:px-8 lg:h-[4.85rem] lg:px-12">
          <Brand />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative py-2 text-[0.64rem] font-semibold uppercase tracking-[0.2em] transition-colors ${
                  isActive(item.href)
                    ? "text-espresso"
                    : "text-espresso/55 hover:text-espresso"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300 ${
                    isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="flex items-center gap-2.5">
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/signin"
                className="px-3 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-espresso/60 transition-colors hover:text-espresso"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className={buttonVariants({ variant: "gold", size: "sm" })}
              >
                Sign Up
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid size-10 place-items-center rounded-full border border-espresso/15 text-espresso transition-colors hover:border-gold hover:text-gold lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {open && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-ivory lg:hidden">
          <div className="flex h-[4.25rem] items-center justify-between px-5 sm:px-8">
            <Brand />

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid size-10 place-items-center rounded-full border border-espresso/15 text-espresso transition-colors hover:border-gold hover:text-gold"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center px-6 sm:px-10">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between border-b border-line/80 py-4"
              >
                <span className="font-display text-[2.3rem] font-light leading-none tracking-tight text-espresso sm:text-5xl">
                  {item.label}
                </span>

                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-gold">
                  {item.index}
                </span>
              </Link>
            ))}
          </nav>

          {/* Mobile Auth Actions */}
          <div className="px-6 pb-9 sm:px-10">
            <div className="flex gap-3">
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className={`${buttonVariants({ variant: "outline", size: "lg" })} flex-1`}
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className={`${buttonVariants({ variant: "gold", size: "lg" })} flex-1`}
              >
                Sign Up
              </Link>
            </div>

            <p className="mt-5 text-center text-[0.65rem] leading-relaxed text-mocha">
              18 Wren Street, Bloomsbury, London
              <br />
              Tue – Sat, 9am – 7pm · +44 20 7123 4567
            </p>
          </div>
        </div>
      )}
    </>
  );
}