"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock3, LoaderCircle, Scissors } from "lucide-react";
import { toast } from "sonner";

import { useCustomerAppointments } from "@/hooks/use-customer-appointments";
import { apiFetch, type CustomerAppointment } from "@/lib/api";
import {
  formatAppointmentDate,
  formatMoney,
  formatRequestDate,
} from "@/lib/formatters";

const statusStyles = {
  pending: "bg-amber-100 text-amber-900",
  confirmed: "bg-emerald-100 text-emerald-900",
  cancelled: "bg-rose-100 text-rose-900",
};

export default function CustomerAppointments() {
  const { appointments, loading, error, reload } = useCustomerAppointments();
  const [activeAction, setActiveAction] = useState<string | null>(null);

  async function cancelAppointment(appointment: CustomerAppointment) {
    if (appointment.status !== "pending") return;
    if (!window.confirm("Cancel this pending appointment?")) return;

    setActiveAction(appointment._id);

    try {
      await apiFetch<null>(
        `/api/appointments/${encodeURIComponent(appointment._id)}/cancel`,
        { method: "PATCH" },
      );
      toast.success("Appointment cancelled.");
      reload();
    } catch (actionError) {
      toast.error(
        actionError instanceof Error
          ? actionError.message
          : "Unable to cancel this appointment.",
      );
    } finally {
      setActiveAction(null);
    }
  }

  async function payForAppointment(appointment: CustomerAppointment) {
    if (
      appointment.status !== "confirmed" ||
      appointment.paymentStatus !== "unpaid"
    ) {
      return;
    }

    setActiveAction(appointment._id);

    try {
      const checkout = await apiFetch<{ url: string }>(
        "/api/payments/checkout",
        {
          method: "POST",
          body: JSON.stringify({ appointmentId: appointment._id }),
        },
      );
      const checkoutUrl = new URL(checkout.url);

      if (checkoutUrl.protocol !== "https:") {
        throw new Error("The payment service returned an invalid checkout URL.");
      }

      window.location.assign(checkoutUrl.href);
    } catch (actionError) {
      toast.error(
        actionError instanceof Error
          ? actionError.message
          : "Unable to start checkout.",
      );
      setActiveAction(null);
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl">
      <div>
        <p className="eyebrow">Your visits</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          My appointments
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-mocha">
          Review your bookings, appointment status, and payment status.
        </p>
      </div>

      {loading ? (
        <div
          className="mt-8 space-y-4"
          role="status"
          aria-busy="true"
        >
          <p className="text-sm text-mocha">Loading your appointments...</p>
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              aria-hidden="true"
              className="h-52 animate-pulse rounded-2xl border border-line bg-cream"
            />
          ))}
        </div>
      ) : error ? (
        <div
          role="alert"
          className="mt-8 rounded-2xl border border-destructive/20 bg-cream p-5"
        >
          <p className="font-medium text-espresso">Appointments are unavailable</p>
          <p className="mt-1 text-sm text-mocha">{error}</p>
          <button
            type="button"
            onClick={reload}
            className="mt-4 text-sm font-semibold text-espresso underline decoration-gold underline-offset-4"
          >
            Try again
          </button>
        </div>
      ) : appointments.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-cream p-8 text-center">
          <CalendarDays className="mx-auto size-8 text-gold" aria-hidden="true" />
          <h2 className="mt-3 font-display text-2xl font-medium">
            No appointments yet
          </h2>
          <p className="mt-1 text-sm text-mocha">
            Your bookings will appear here.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-ivory hover:bg-mocha"
          >
            Back to home
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {appointments.map((appointment) => {
            const canCancel = appointment.status === "pending";
            const canPay =
              appointment.status === "confirmed" &&
              appointment.paymentStatus === "unpaid";
            const isBusy = activeAction === appointment._id;

            return (
              <article
                key={appointment._id}
                className="overflow-hidden rounded-2xl border border-line bg-cream shadow-sm"
              >
                <div className="grid gap-5 p-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:p-5">
                  <div className="relative min-h-44 overflow-hidden rounded-xl bg-sand sm:min-h-36">
                    {appointment.service.imageUrl ? (
                      <Image
                        src={appointment.service.imageUrl}
                        alt={appointment.service.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 150px"
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full min-h-44 place-items-center">
                        <Scissors className="size-8 text-taupe" aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mocha">
                          {appointment.service.category}
                        </p>
                        <h2 className="mt-1 font-display text-2xl font-semibold">
                          {appointment.service.name}
                        </h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[appointment.status]}`}
                        >
                          {appointment.status}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            appointment.paymentStatus === "paid"
                              ? "bg-emerald-100 text-emerald-900"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {appointment.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-mocha sm:grid-cols-2 lg:grid-cols-3">
                      <p className="flex items-center gap-2">
                        <CalendarDays className="size-4 text-gold" aria-hidden="true" />
                        {formatAppointmentDate(appointment.appointmentDate)}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock3 className="size-4 text-gold" aria-hidden="true" />
                        {appointment.timeSlot}
                        {appointment.service.durationMinutes
                          ? ` · ${appointment.service.durationMinutes} min`
                          : ""}
                      </p>
                      <p className="font-semibold text-espresso">
                        {formatMoney(appointment.service.price)}
                      </p>
                    </div>

                    <p className="mt-3 text-xs text-mocha">
                      Requested {formatRequestDate(appointment.createdAt)}
                    </p>

                    <details className="mt-4 border-t border-line pt-3">
                      <summary className="w-fit cursor-pointer text-sm font-semibold text-espresso underline decoration-gold/70 underline-offset-4">
                        View appointment details
                      </summary>
                      <div className="mt-3 space-y-2 text-sm text-mocha">
                        {appointment.service.description && (
                          <p>{appointment.service.description}</p>
                        )}
                        {appointment.message && (
                          <p>
                            <span className="font-semibold text-espresso">
                              Your message:
                            </span>{" "}
                            {appointment.message}
                          </p>
                        )}
                        <p>Appointment ID: {appointment._id}</p>
                      </div>
                    </details>

                    {(canCancel || canPay) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {canCancel && (
                          <button
                            type="button"
                            onClick={() => void cancelAppointment(appointment)}
                            disabled={isBusy}
                            aria-busy={isBusy}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-line px-4 text-sm font-semibold text-espresso hover:bg-sand disabled:opacity-60"
                          >
                            {isBusy && (
                              <LoaderCircle
                                className="size-4 animate-spin"
                                aria-hidden="true"
                              />
                            )}
                            Cancel appointment
                          </button>
                        )}
                        {canPay && (
                          <button
                            type="button"
                            onClick={() => void payForAppointment(appointment)}
                            disabled={isBusy}
                            aria-busy={isBusy}
                            aria-live="polite"
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-espresso px-4 text-sm font-semibold text-ivory hover:bg-mocha disabled:opacity-60"
                          >
                            {isBusy && (
                              <LoaderCircle
                                className="size-4 animate-spin"
                                aria-hidden="true"
                              />
                            )}
                            {isBusy ? "Opening secure checkout..." : "Pay now"}
                          </button>
                        )}
                      </div>
                    )}
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
