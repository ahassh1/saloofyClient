
import { Clock, Globe, Mail, MapPin, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
} from "@/components/shared/SocialIcons";

const socials = [
  {
    href: "https://instagram.com/ahasan_habib_ahassh",
    label: "Instagram",
    Icon: InstagramIcon,
  },
  {
    href: "https://facebook.com/pagepotpound",
    label: "Facebook",
    Icon: FacebookIcon,
  },
];

export default function Header() {
  return (
    <div className="border-b border-ivory/10 bg-espresso text-ivory/65">
      <div className="mx-auto flex h-9 max-w-350 items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-5 lg:gap-6">
          <span className="inline-flex items-center gap-1.5 text-[0.58rem] font-medium uppercase tracking-[0.15em]">
            <MapPin className="size-3 shrink-0 text-gold" strokeWidth={1.6} />
            <span className="hidden sm:inline">
              18 Wren Street, Bloomsbury
            </span>
            <span className="sm:hidden">Bloomsbury, London</span>
          </span>

          <span className="hidden items-center gap-1.5 text-[0.58rem] font-medium uppercase tracking-[0.15em] md:inline-flex">
            <Clock className="size-3 text-gold" strokeWidth={1.6} />
            Tue – Sat · 9am – 7pm
          </span>
        </div>

        <div className="flex items-center gap-3.5 sm:gap-4">
          <a
            href="tel:+442071234567"
            className="inline-flex items-center gap-1.5 text-[0.58rem] font-medium uppercase tracking-[0.15em] transition-colors hover:text-gold-soft"
          >
            <Phone className="size-3 shrink-0 text-gold" strokeWidth={1.6} />
            <span className="sr-only sm:not-sr-only">
              +44 20 7123 4567
            </span>
          </a>

          <a
            href="mailto:hello@salonbook.co"
            className="hidden items-center gap-1.5 text-[0.58rem] font-medium uppercase tracking-[0.15em] transition-colors hover:text-gold-soft lg:inline-flex"
          >
            <Mail className="size-3 text-gold" strokeWidth={1.6} />
            hello@salonbook.co
          </a>

          <span className="hidden h-3 w-px bg-ivory/15 lg:block" />

          <div className="flex items-center gap-2.5">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-ivory/50 transition-colors hover:text-gold-soft"
              >
                <Icon className="size-3.5" />
              </a>
            ))}
          </div>

          <button
            type="button"
            aria-label="Language: English"
            className="inline-flex items-center gap-1 text-[0.58rem] font-semibold uppercase tracking-[0.15em] transition-colors hover:text-gold-soft"
          >
            <Globe className="size-3 text-gold" strokeWidth={1.6} />
            EN
          </button>
        </div>
      </div>
    </div>
  );
}