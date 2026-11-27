"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { apiFetch, type SalonService } from "@/lib/api";
import { formatMoney } from "@/lib/formatters";

export default function ManageServices() {
  const [services, setServices] = useState<SalonService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadServices() {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFetch<SalonService[]>("/api/admin/services");
        if (!Array.isArray(result)) {
          throw new Error("The service list response was not valid.");
        }
        if (!ignore) setServices(result);
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load services.",
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
  }, [reloadCount]);

  async function changeStatus(service: SalonService) {
    setActiveAction(service._id);

    try {
      await apiFetch(
        `/api/admin/services/${encodeURIComponent(service._id)}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ isActive: !service.isActive }),
        },
      );
      toast.success(
        service.isActive ? "Service deactivated." : "Service activated.",
      );
      setReloadCount((count) => count + 1);
    } catch (actionError) {
      toast.error(
        actionError instanceof Error
          ? actionError.message
          : "Unable to update service status.",
      );
    } finally {
      setActiveAction(null);
    }
  }

  async function deleteService(service: SalonService) {
    if (
      !window.confirm(
        `Delete "${service.name}"? Services with appointment history cannot be deleted.`,
      )
    ) {
      return;
    }

    setActiveAction(service._id);

    try {
      await apiFetch(
        `/api/admin/services/${encodeURIComponent(service._id)}`,
        { method: "DELETE" },
      );
      toast.success("Service deleted.");
      setReloadCount((count) => count + 1);
    } catch (actionError) {
      toast.error(
        actionError instanceof Error
          ? actionError.message
          : "Unable to delete service.",
      );
    } finally {
      setActiveAction(null);
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Salon catalogue</p>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
            Manage services
          </h1>
          <p className="mt-2 text-sm text-mocha">
            Active services are visible to customers and available for booking.
          </p>
        </div>
        <Link
          href="/dashboard/admin/manage-services/add"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-espresso px-5 text-sm font-semibold text-ivory hover:bg-mocha"
        >
          Add service
        </Link>
      </header>

      {loading ? (
        <div
          aria-label="Loading services"
          className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-96 animate-pulse rounded-2xl bg-sand/70"
            />
          ))}
        </div>
      ) : error ? (
        <div
          role="alert"
          className="mt-8 rounded-2xl border border-destructive/20 bg-cream p-5"
        >
          <p className="font-medium">Services are unavailable</p>
          <p className="mt-1 text-sm text-mocha">{error}</p>
          <button
            type="button"
            onClick={() => setReloadCount((count) => count + 1)}
            className="mt-4 text-sm font-semibold underline decoration-gold underline-offset-4"
          >
            Try again
          </button>
        </div>
      ) : services.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-cream p-8 text-center">
          <h2 className="font-display text-2xl font-semibold">
            No services added yet
          </h2>
          <p className="mt-1 text-sm text-mocha">
            Add the first salon service to make it available for customers.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const busy = activeAction === service._id;

            return (
              <article
                key={service._id}
                className="overflow-hidden rounded-2xl border border-line bg-cream shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-sand">
                  <Image
                    src={service.imageUrl}
                    alt={service.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mocha">
                        {service.category}
                      </p>
                      <h2 className="mt-1 font-display text-2xl font-semibold">
                        {service.name}
                      </h2>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        service.isActive
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-sand text-mocha"
                      }`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 min-h-10 text-sm text-mocha">
                    {service.description}
                  </p>
                  <div className="mt-4 flex justify-between border-t border-line pt-4 text-sm">
                    <span className="font-semibold">{formatMoney(service.price)}</span>
                    <span className="text-mocha">
                      {service.durationMinutes} min
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Link
                      href={`/dashboard/admin/manage-services/${encodeURIComponent(service._id)}/edit`}
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-line px-3 text-sm font-semibold hover:bg-sand"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => void changeStatus(service)}
                      disabled={busy}
                      className="min-h-10 rounded-full border border-line px-3 text-sm font-semibold hover:bg-sand disabled:opacity-60"
                    >
                      {service.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteService(service)}
                      disabled={busy}
                      className="col-span-2 min-h-10 rounded-full border border-destructive/30 px-3 text-sm font-semibold text-destructive hover:bg-destructive/5 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
