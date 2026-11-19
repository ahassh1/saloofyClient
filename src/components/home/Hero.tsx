
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Pause,
  Play,
  Star,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=80",
    alt: "Warm mirrors and styling chairs inside the SalonBook atelier",
    eyebrow: "The SalonBook film · 20 seconds",
    title: (
      <>
        A slower kind
        <br />
        of <em className="italic text-gold-soft">beautiful.</em>
      </>
    ),
    text: "Hair, skin and hands, cared for in a quiet corner of Bloomsbury. Browse the rituals, meet the artists, and reserve your seat in under a minute.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=80",
    alt: "An artist hand-painting colour at the SalonBook studio",
    eyebrow: "Hand-painted colour",
    title: (
      <>
        Light that moves
        <br />
        <em className="italic text-gold-soft">with you.</em>
      </>
    ),
    text: "Balayage built in soft layers, toned to your skin, and finished with a bond treatment — so regrowth stays kind and the shine lasts.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=2000&q=80",
    alt: "A calm treatment room at SalonBook with warm towels",
    eyebrow: "Skin & stillness",
    title: (
      <>
        An hour that is
        <br />
        <em className="italic text-gold-soft">only yours.</em>
      </>
    ),
    text: "No overlapping chairs, no rushing you out of the basin. Just a warm room, an expert pair of hands, and a plan for your skin.",
  },
];

const SLIDE_MS = 6600;

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;

    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      SLIDE_MS
    );

    return () => window.clearInterval(timer);
  }, [playing]);

  const slide = slides[index];

  return (
    <section className="relative isolate min-h-[calc(100svh-6.65rem)] overflow-hidden bg-espresso">
      {slides.map((item, i) => (
        <div
          key={item.image}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={item.image}
            alt={item.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-transform duration-[7000ms] ease-out ${
              i === index ? "scale-100" : "scale-105"
            }`}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-espresso/90 via-espresso/55 to-espresso/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/20 to-espresso/35" />

      <div className="relative mx-auto flex min-h-[calc(100svh-6.65rem)] max-w-[1400px] flex-col justify-between px-5 pb-8 pt-8 sm:px-8 sm:pb-10 lg:px-12 lg:pb-12">
        <div className="flex items-start justify-between gap-6">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-ivory/20 bg-espresso/25 px-4 py-2 backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold-soft/50" />
              <span className="relative inline-flex size-2 rounded-full bg-gold-soft" />
            </span>

            <span className="text-[0.55rem] font-semibold uppercase tracking-[0.24em] text-ivory/80">
              {slide.eyebrow}
            </span>
          </div>

          <div className="hidden items-center gap-3 rounded-full border border-ivory/15 bg-espresso/20 px-4 py-2 backdrop-blur-md sm:flex">
            <div className="flex gap-0.5 text-gold-soft">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3 fill-current" />
              ))}
            </div>

            <span className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-ivory/70">
              4.9 · 2,400 visits
            </span>
          </div>
        </div>

        <div className="max-w-3xl pb-10 pt-24 sm:pb-14">
          <h1 className="font-display text-[clamp(3rem,7vw,6rem)] font-light leading-[0.92] tracking-[-0.035em] text-ivory">
            {slide.title}
          </h1>

          <p className="mt-7 max-w-lg text-sm leading-relaxed text-ivory/65 sm:text-[0.95rem]">
            {slide.text}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/booking"
              className={`${buttonVariants({ variant: "gold", size: "lg" })} min-h-12 w-full justify-center px-5 sm:w-auto`}
            >
              Book an appointment
              <ArrowUpRight className="size-4" strokeWidth={1.8} />
            </Link>

            <Link
              href="/services"
              className={`${buttonVariants({ variant: "light", size: "lg" })} min-h-12 w-full justify-center px-5 backdrop-blur-sm sm:w-auto`}
            >
              Explore the menu
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-ivory/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-5">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPlaying((value) => !value)}
                aria-label={playing ? "Pause film" : "Play film"}
                className="grid size-9 place-items-center rounded-full border border-ivory/25 text-ivory/70 transition-colors hover:border-gold-soft hover:text-gold-soft"
              >
                {playing ? (
                  <Pause className="size-3.5" strokeWidth={1.7} />
                ) : (
                  <Play className="size-3.5 fill-current" strokeWidth={1.7} />
                )}
              </button>

              <span className="font-display text-sm italic text-ivory/60">
                {String(index + 1).padStart(2, "0")}
                <span className="mx-1 not-italic text-ivory/25">/</span>
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-1 items-center gap-2">
              {slides.map((item, i) => (
                <button
                  key={item.image}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to film scene ${i + 1}`}
                  className="group relative h-[2px] flex-1 overflow-hidden rounded-full bg-ivory/20"
                >
                  <span
                    key={`${i}-${index}-${playing}`}
                    className={`absolute inset-y-0 left-0 bg-gold-soft ${
                      i < index
                        ? "w-full"
                        : i === index
                          ? "w-0 animate-[progress_6.6s_linear_forwards]"
                          : "w-0"
                    }`}
                    style={{
                      animationPlayState: playing ? "running" : "paused",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-6 sm:justify-end">
            <span className="hidden text-[0.55rem] font-semibold uppercase tracking-[0.24em] text-ivory/40 lg:inline">
              Est. 2016 · Bloomsbury, London
            </span>

            <a
              href="#atelier"
              className="inline-flex items-center gap-2 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-ivory/60 transition-colors hover:text-ivory"
            >
              Scroll to explore
              <ArrowDown className="size-3.5" strokeWidth={1.6} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}