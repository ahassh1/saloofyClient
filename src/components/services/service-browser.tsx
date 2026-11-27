"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { publicApiFetch, type SalonService } from "@/lib/api";
import { formatMoney } from "@/lib/formatters";
import { SERVICE_CATEGORIES } from "@/lib/service-constants";

export default function ServiceBrowser() {
  const [services, setServices] = useState<SalonService[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadServices() {
      setLoading(true);
      setError(null);
      const query = new URLSearchParams();
      if (search.trim()) query.set("search", search.trim());
      if (category) query.set("category", category);
      if (sort) query.set("sort", sort);

      try {
        const result = await publicApiFetch<SalonService[]>(
          `/api/services${query.size ? `?${query.toString()}` : ""}`,
        );

        if (!Array.isArray(result)) {
          throw new Error("The service list response was not valid.");
        }

        if (!ignore) setServices(result);
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load salon services.",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void loadServices();

    return () => {
      ignore = true;
    };
  }, [search, category, sort]);

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <header className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Salon rituals</p>
        <h1 className="mt-3 font-display text-5xl font-medium tracking-tight sm:text-6xl">
          Find your next <em className="text-gold">favourite.</em>
        </h1>
        <p className="mt-4 text-sm leading-6 text-mocha">
          Browse our active services and choose a time that works for you.
        </p>
      </header>

      <div className="mx-auto mt-8 grid max-w-5xl gap-3 rounded-2xl border border-line bg-cream p-4 sm:grid-cols-[minmax(0,1fr)_190px_190px]">
        <label className="sr-only" htmlFor="service-search">
          Search services
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-mocha"
            aria-hidden="true"
          />
          <input
            id="service-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by service name"
            className="field pl-11"
          />
        </div>
        <div>
          <label className="sr-only" htmlFor="service-category">
            Filter by category
          </label>
          <select
            id="service-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="field"
          >
            <option value="">All categories</option>
            {SERVICE_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="sr-only" htmlFor="service-sort">
            Sort by price
          </label>
          <select
            id="service-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="field"
          >
            <option value="">Recommended</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="mx-auto mt-8 max-w-3xl rounded-2xl border border-destructive/20 bg-cream p-5 text-center"
        >
          <p className="font-medium">Services are unavailable</p>
          <p className="mt-1 text-sm text-mocha">{error}</p>
        </div>
      ) : loading ? (
        <div
          aria-label="Loading services"
          className="mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-96 animate-pulse rounded-2xl bg-sand/70"
            />
          ))}
        </div>
      ) : services.length === 0 ? (
        <p className="mx-auto mt-12 max-w-xl rounded-2xl border border-dashed border-line bg-cream p-8 text-center text-sm text-mocha">
          No active services match your search. Try another category or search.
        </p>
      ) : (
        <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service._id}
              className="overflow-hidden rounded-2xl border border-line bg-cream shadow-sm"
            >
              <Link
                href={`/services/${encodeURIComponent(service._id)}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] bg-sand">
                  <Image
                    src={service.imageUrl}
                    alt={service.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mocha">
                    {service.category}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold">
                    {service.name}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-mocha">
                    {service.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-sm font-semibold text-espresso">
                      {formatMoney(service.price)}
                    </span>
                    <span className="text-xs text-mocha">
                      {service.durationMinutes} min
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
