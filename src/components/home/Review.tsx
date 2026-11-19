import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";

const reviewList = [
  {
    initials: "EW",
    name: "Eleanor Whitfield",
    service: "Signature Cut & Style",
    quote:
      "I have never left a salon feeling more like myself. Amara listened once, and somehow understood the last ten years of bad haircuts.",
  },
  {
    initials: "PR",
    name: "Priya Raman",
    service: "Balayage & Gloss",
    quote:
      "The room is quiet, the coffee is good, and nobody rushes you. My colour still looks fresh three months on.",
  },
  {
    initials: "ML",
    name: "Margot Lindqvist",
    service: "Hydrafacial Ritual",
    quote:
      "I booked online at midnight and had a confirmation before breakfast. It is the calmest part of my month.",
  },
  {
    initials: "HS",
    name: "Hana Sato",
    service: "Gel Manicure",
    quote:
      "A proper manicure, not a conveyor belt. Sofia takes her time and the shape is still perfect three weeks later.",
  },
  {
    initials: "TF",
    name: "Tomas Ferreira",
    service: "Silk Blowout",
    quote:
      "Walked in on a Thursday, walked out feeling like I had slept eight hours. The finish held all week without a touch-up.",
  },
  {
    initials: "RA",
    name: "Ruth Adeyemi",
    service: "Bridal Hair & Makeup",
    quote:
      "They built the whole morning around me, then disappeared quietly before the first look. I did not worry once.",
  },
];

function ReviewCard({
  review,
}: {
  review: (typeof reviewList)[number];
}) {
  return (
    <article className="flex w-[300px] shrink-0 flex-col rounded-[1.4rem] border border-line/80 bg-ivory p-6 sm:w-[370px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5 text-gold">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-3 fill-current" />
          ))}
        </div>
        <span className="text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-mocha/60">
          Verified visit
        </span>
      </div>

      <blockquote className="mt-5 flex-1 font-display text-[1.22rem] font-light italic leading-[1.45] text-espresso/85">
        “{review.quote}”
      </blockquote>

      <div className="mt-6 flex items-center gap-3 border-t border-line pt-4">
        <span className="grid size-9 place-items-center rounded-full bg-sand text-[0.55rem] font-bold tracking-[0.08em] text-espresso/70">
          {review.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[0.72rem] font-semibold text-espresso">
            {review.name}
          </p>
          <p className="mt-0.5 truncate text-[0.6rem] uppercase tracking-[0.1em] text-mocha">
            {review.service}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function Review() {
  return (
    <section
      id="reviews"
      className="relative overflow-hidden border-y border-line/70 bg-sand py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow inline-flex items-center gap-3">
              <span className="h-px w-8 bg-gold/60" aria-hidden />
              Guest notes
            </span>
            <h2 className="mt-5 max-w-xl font-display text-[2.6rem] font-light leading-[1.02] tracking-[-0.02em] text-espresso sm:text-5xl lg:text-[3.5rem]">
              Reviews, <em className="italic text-gold">unedited.</em>
            </h2>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right">
              <div className="flex justify-end gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-1.5 text-[0.62rem] uppercase tracking-[0.16em] text-mocha">
                4.9 · 2,412 visits
              </p>
            </div>
            <Link
              href="/services"
              className="group grid size-10 place-items-center rounded-full border border-espresso/15 text-espresso transition-colors hover:border-gold hover:bg-gold"
            >
              <ArrowUpRight
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.6}
              />
              <span className="sr-only">Browse services</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="group relative mt-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-sand to-transparent sm:w-28"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-sand to-transparent sm:w-28"
        />
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {[0, 1].map((group) => (
            <div
              key={group}
              aria-hidden={group === 1}
              className="flex gap-5 pr-5"
            >
              {reviewList.map((review) => (
                <ReviewCard key={`${group}-${review.name}`} review={review} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-5 text-[0.62rem] text-mocha sm:px-8 lg:px-12">
        <p>Hover to pause · 2,412 verified guest visits since 2016</p>
        <p className="uppercase tracking-[0.16em]">
          Google · Booksy · Treatwell
        </p>
      </div>
    </section>
  );
}
