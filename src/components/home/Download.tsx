import { Apple, ArrowUpRight, Check, Play, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const QR_SIZE = 17;

function isFinder(row: number, col: number, startRow: number, startCol: number) {
  const rowDiff = row - startRow;
  const colDiff = col - startCol;

  if (rowDiff < 0 || rowDiff > 6 || colDiff < 0 || colDiff > 6) {
    return false;
  }

  const ring = Math.max(Math.abs(rowDiff - 3), Math.abs(colDiff - 3));

  return ring === 3 || ring <= 1;
}

function qrDark(row: number, col: number) {
  if (
    isFinder(row, col, 0, 0) ||
    isFinder(row, col, 0, 10) ||
    isFinder(row, col, 10, 0)
  ) {
    return true;
  }

  const inFinder =
    (row < 7 && col < 7) ||
    (row < 7 && col > 9) ||
    (row > 9 && col < 7);

  if (inFinder) return false;

  return (row * 3 + col * 5 + row * col) % 7 < 3;
}

function QrCode() {
  return (
    <div className="w-[78px] shrink-0 rounded-xl bg-ivory p-2.5">
      <div
        className="grid gap-[1.5px]"
        style={{ gridTemplateColumns: `repeat(${QR_SIZE}, minmax(0, 1fr))` }}
        aria-label="QR code to download the SalonBook app"
        role="img"
      >
        {Array.from({ length: QR_SIZE * QR_SIZE }).map((_, index) => {
          const row = Math.floor(index / QR_SIZE);
          const col = index % QR_SIZE;

          return (
            <span
              key={index}
              className={`aspect-square ${
                qrDark(row, col) ? "rounded-[0.5px] bg-espresso" : ""
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function Download() {
  const features = [
    "One-tap rebooking",
    "Artist notes & formulas",
    "Free changes up to 24h",
    "Members-only slots",
  ];

  const services = [
    ["Balayage & Gloss", "3 hr · $240"],
    ["Hydrafacial Ritual", "60 min · $180"],
    ["Gel Manicure", "60 min · $70"],
  ];

  const tabs = ["Home", "Bookings", "Saved", "Me"];

  return (
    <section className="relative overflow-hidden bg-espresso text-ivory">
      {/* Background Decorations */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 size-[30rem] rounded-full border border-ivory/[0.06]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-24 size-[22rem] rounded-full border border-gold/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 size-[26rem] rounded-full bg-gold/[0.06] blur-3xl"
      />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-12 lg:py-28">
        {/* Download Information */}
        <div>
          <span className="eyebrow inline-flex items-center gap-3 text-gold-soft/80!">
            <span className="h-px w-8 bg-gold/60" aria-hidden />
            The SalonBook app
          </span>

          <h2 className="mt-5 max-w-xl font-display text-[2.7rem] font-light leading-[0.98] tracking-[-0.025em] text-ivory sm:text-5xl lg:text-[3.7rem]">
            Take the atelier
            <br />
            <em className="italic text-gold-soft">with you.</em>
          </h2>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/55">
            Book, rebook and keep your artist’s notes in one quiet place.
            Appointments sync instantly, and your card is only charged in the
            chair.
          </p>

          {/* Features */}
          <ul className="mt-8 grid max-w-md gap-3 sm:grid-cols-2">
            {features.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-[0.78rem] text-ivory/65"
              >
                <span className="grid size-5 place-items-center rounded-full border border-gold/30 bg-gold/10">
                  <Check className="size-3 text-gold-soft" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          {/* Download Buttons and QR Code */}
          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-ivory/20 bg-ivory/[0.04] px-4 py-2.5 transition-colors hover:border-gold-soft/60 hover:bg-ivory/[0.08]"
              >
                <Apple className="size-6 text-ivory" />
                <span className="flex flex-col text-left leading-tight">
                  <span className="text-[0.5rem] uppercase tracking-[0.14em] text-ivory/50">
                    Download on the
                  </span>
                  <span className="text-[0.85rem] font-semibold text-ivory">
                    App Store
                  </span>
                </span>
              </a>

              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-ivory/20 bg-ivory/[0.04] px-4 py-2.5 transition-colors hover:border-gold-soft/60 hover:bg-ivory/[0.08]"
              >
                <Play className="size-5 fill-ivory text-ivory" />
                <span className="flex flex-col text-left leading-tight">
                  <span className="text-[0.5rem] uppercase tracking-[0.14em] text-ivory/50">
                    Get it on
                  </span>
                  <span className="text-[0.85rem] font-semibold text-ivory">
                    Google Play
                  </span>
                </span>
              </a>
            </div>

            <div className="flex items-center gap-3.5">
              <QrCode />

              <div className="text-[0.6rem] leading-relaxed text-ivory/45">
                <p className="font-semibold uppercase tracking-[0.16em] text-ivory/70">
                  Scan to download
                </p>
                <p className="mt-1.5">
                  Point your camera
                  <br />
                  at the code.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile App Preview */}
        <div className="relative mx-auto w-[280px] sm:w-[310px]">
          <div
            aria-hidden
            className="absolute -inset-10 rounded-full bg-gold/10 blur-3xl"
          />

          <div className="relative animate-float rounded-[2.9rem] border border-ivory/15 bg-[#191613] p-2.5 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.85)]">
            <div className="relative h-[570px] overflow-hidden rounded-[2.3rem] bg-ivory text-espresso">
              <div className="flex h-8 items-center justify-center">
                <span className="h-1.5 w-20 rounded-full bg-espresso/15" />
              </div>

              <div className="px-5">
                {/* Greeting */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[0.5rem] font-semibold uppercase tracking-[0.22em] text-mocha">
                      Tuesday, 18 Nov
                    </p>
                    <p className="mt-1.5 font-display text-[1.55rem] leading-none text-espresso">
                      Good morning,
                      <br />
                      <em className="italic text-gold">Eleanor.</em>
                    </p>
                  </div>

                  <span className="grid size-9 place-items-center rounded-full bg-sand text-[0.55rem] font-bold tracking-wider text-espresso/70">
                    EW
                  </span>
                </div>

                {/* Next Appointment */}
                <div className="mt-5 rounded-[1.35rem] bg-espresso p-4 text-ivory">
                  <div className="flex items-center justify-between">
                    <p className="text-[0.5rem] font-semibold uppercase tracking-[0.2em] text-ivory/45">
                      Next appointment
                    </p>

                    <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[0.45rem] font-semibold uppercase tracking-[0.12em] text-gold-soft">
                      <Check className="size-2.5" />
                      Confirmed
                    </span>
                  </div>

                  <p className="mt-3 font-display text-[1.45rem] leading-none">
                    Thursday · 10:30
                  </p>

                  <p className="mt-1.5 text-[0.58rem] text-ivory/50">
                    Signature Cut &amp; Style · 60 min
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-ivory/10 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="grid size-6 place-items-center rounded-full bg-ivory/10 text-[0.42rem] font-bold text-gold-soft">
                        AC
                      </span>
                      <span className="text-[0.55rem] text-ivory/65">
                        Amara Cole
                      </span>
                    </div>

                    <span className="text-[0.55rem] font-semibold text-gold-soft">
                      $95
                    </span>
                  </div>
                </div>

                {/* Book Again */}
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-mocha">
                    Book again
                  </p>
                  <span className="text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-gold">
                    See all
                  </span>
                </div>

                <div className="mt-3 space-y-2.5">
                  {services.map(([name, meta]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-xl border border-line/80 bg-cream px-3.5 py-3"
                    >
                      <div>
                        <p className="text-[0.65rem] font-semibold text-espresso">
                          {name}
                        </p>
                        <p className="mt-0.5 text-[0.5rem] text-mocha">
                          {meta}
                        </p>
                      </div>

                      <span className="grid size-6 place-items-center rounded-full border border-espresso/15 text-espresso/60">
                        <ArrowUpRight className="size-3" />
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl bg-gold px-4 py-3 text-center text-[0.58rem] font-bold uppercase tracking-[0.16em] text-espresso">
                  Book a new ritual
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-line/70 bg-ivory/95 px-6 pb-3 pt-2.5 backdrop-blur">
                {tabs.map((item, index) => (
                  <div key={item} className="flex flex-col items-center gap-1">
                    <span
                      className={`size-1.5 rounded-full ${
                        index === 0 ? "bg-gold" : "bg-espresso/15"
                      }`}
                    />
                    <span
                      className={`text-[0.42rem] uppercase tracking-[0.08em] ${
                        index === 0
                          ? "font-semibold text-espresso"
                          : "font-medium text-mocha/60"
                      }`}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Notification */}
          <div className="absolute -left-5 top-24 hidden rounded-2xl border border-line/80 bg-ivory px-4 py-3 text-espresso shadow-[0_24px_60px_-25px_rgba(0,0,0,0.6)] sm:block">
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-emerald-700/10">
                <Check className="size-3 text-emerald-800" />
              </span>

              <div>
                <p className="text-[0.55rem] font-semibold">
                  Booking confirmed
                </p>
                <p className="text-[0.5rem] text-mocha">
                  Thu, 10:30 · Amara
                </p>
              </div>
            </div>
          </div>

          {/* Rating Notification */}
          <div className="absolute -right-4 bottom-28 hidden items-center gap-2 rounded-full border border-line/80 bg-ivory px-3.5 py-2 text-espresso shadow-[0_20px_50px_-25px_rgba(0,0,0,0.6)] sm:flex">
            <Star className="size-3 fill-gold text-gold" />
            <span className="text-[0.6rem] font-semibold">4.9</span>
            <span className="text-[0.5rem] text-mocha">2,412 visits</span>
          </div>
        </div>

        {/* Mobile Platform Labels */}
        <div className="mt-2 flex items-center justify-center gap-4 text-[0.55rem] uppercase tracking-[0.2em] text-ivory/30 sm:hidden">
          <span>iOS</span>
          <span className="size-1 rotate-45 bg-gold/50" />
          <span>Android</span>
          <span className="size-1 rotate-45 bg-gold/50" />
          <span>4.9 rated</span>
        </div>

        {/* Web Booking Link */}
        <div className="hidden justify-end lg:col-span-2 lg:flex">
          <Link
            href="/booking"
            className={buttonVariants({ variant: "light", size: "sm" })}
          >
            Prefer the web? Book here
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}