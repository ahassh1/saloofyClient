import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Brand({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="SalonBook home"
      className={cn(
        "group flex items-center gap-3",
        tone === "light" ? "text-ivory" : "text-espresso",
        className
      )}
    >
      <span
        className={cn(
          "grid size-10 place-items-center rounded-full border transition-colors duration-300",
          tone === "light"
            ? "border-ivory/25 group-hover:border-gold-soft/70"
            : "border-espresso/20 group-hover:border-gold"
        )}
      >
        <span className="size-2 rotate-45 bg-gold transition-transform duration-500 group-hover:rotate-[135deg]" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.6rem] tracking-tight">
          Saloofy
        </span>
        <span
          className={cn(
            "mt-1.5 text-[0.5rem] font-semibold uppercase tracking-[0.36em]",
            tone === "light" ? "text-ivory/50" : "text-mocha/80"
          )}
        >
          Atelier — Est. 2016
        </span>
      </span>
    </Link>
  );
}