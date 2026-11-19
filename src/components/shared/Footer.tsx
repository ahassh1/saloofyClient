import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Brand from "@/components/shared/Brand";
import {
  FacebookIcon,
  InstagramIcon,
} from "@/components/shared/SocialIcons";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse services" },
  { href: "/booking", label: "Book an appointment" },
  { href: "/signin", label: "Sign in" },
  { href: "/signup", label: "Create an account" },
];

const socials = [
  { href: "https://instagram.com", label: "Instagram", Icon: InstagramIcon },
  { href: "https://facebook.com", label: "Facebook", Icon: FacebookIcon },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-espresso text-ivory">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-32 size-[28rem] rounded-full border border-ivory/[0.07]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-16 size-[20rem] rounded-full border border-gold/10"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 pt-20 sm:px-8 lg:px-12 lg:pt-24">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Brand tone="light" />
            <p className="mt-7 max-w-xs text-sm leading-relaxed text-ivory/55">
              A neighbourhood atelier for hair, skin and hands. Unhurried
              appointments, honest advice, and a seat that is always yours.
            </p>
            <div className="mt-7 flex items-center gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-ivory/15 text-ivory/70 transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon className="size-4" />
                </a>
              ))}
              <a
                href="mailto:hello@salonbook.co"
                aria-label="Email SalonBook"
                className="grid size-10 place-items-center rounded-full border border-ivory/15 text-ivory/70 transition-colors hover:border-gold hover:text-gold"
              >
                <Mail className="size-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-gold-soft/80">
              Explore
            </p>
            <ul className="mt-5 space-y-3 text-sm text-ivory/60">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-ivory"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-gold-soft/80">
              Rituals
            </p>
            <ul className="mt-5 space-y-3 text-sm text-ivory/60">
              <li>
                <Link
                  href="/services/signature-cut-and-style"
                  className="transition-colors hover:text-ivory"
                >
                  Cut &amp; style
                </Link>
              </li>
              <li>
                <Link
                  href="/services/balayage-and-gloss"
                  className="transition-colors hover:text-ivory"
                >
                  Colour
                </Link>
              </li>
              <li>
                <Link
                  href="/services/hydrafacial-ritual"
                  className="transition-colors hover:text-ivory"
                >
                  Skin
                </Link>
              </li>
              <li>
                <Link
                  href="/services/bridal-hair-and-makeup"
                  className="transition-colors hover:text-ivory"
                >
                  Bridal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-gold-soft/80">
              The studio
            </p>
            <address className="mt-5 space-y-4 text-sm not-italic leading-relaxed text-ivory/60">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex gap-2.5 transition-colors hover:text-ivory"
              >
                <MapPin
                  className="mt-0.5 size-3.5 shrink-0 text-gold"
                  strokeWidth={1.6}
                />
                <span>
                  18 Wren Street
                  <br />
                  Bloomsbury, London WC1N 3LR
                </span>
              </a>
              <a
                href="tel:+442071234567"
                className="flex items-center gap-2.5 transition-colors hover:text-ivory"
              >
                <Phone className="size-3.5 text-gold" strokeWidth={1.6} />
                +44 20 7123 4567
              </a>
              <p className="pl-6 text-[0.78rem] leading-relaxed text-ivory/40">
                Tuesday – Saturday
                <br />
                9:00am – 7:00pm
              </p>
              <a
                href="mailto:hello@salonbook.co"
                className="inline-flex items-center gap-1.5 text-ivory/80 transition-colors hover:text-gold"
              >
                hello@salonbook.co
                <ArrowUpRight className="size-3" strokeWidth={1.6} />
              </a>
            </address>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ivory/10 pt-6 text-[0.68rem] text-ivory/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 SalonBook Atelier. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/signin" className="transition-colors hover:text-ivory">
              Studio login
            </Link>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>

        <p
          aria-hidden
          className="pointer-events-none mt-6 select-none text-center font-display text-[19vw] font-light leading-[0.8] tracking-tight text-ivory/[0.045]"
        >
          Saloofy
        </p>
      </div>
    </footer>
  );
}
