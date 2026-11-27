"use client";

import Link from "next/link";
import {
  CalendarDays,
  CircleCheck,
  Clock3,
  XCircle,
} from "lucide-react";

import { useCustomerAppointments } from "@/hooks/use-customer-appointments";

const statStyles = [
  "bg-sand/70",
  "bg-amber-100/70",
  "bg-emerald-100/70",
  "bg-rose-100/70",
];

export default function CustomerOverview() {
  const { appointments, loading, error, reload } = useCustomerAppointments();

  const stats = [
    {
      label: "Total appointments",
      value: appointments.length,
      icon: CalendarDays,
    },
    {
      label: "Pending",
      value: appointments.filter(({ status }) => status === "pending").length,
      icon: Clock3,
    },
    {
      label: "Confirmed",
      value: appointments.filter(({ status }) => status === "confirmed").length,
      icon: CircleCheck,
    },
    {
      label: "Cancelled",
      value: appointments.filter(({ status }) => status === "cancelled").length,
      icon: XCircle,
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl">
      <div>
        <p className="eyebrow">Your salon visits</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Dashboard overview
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-mocha">
          Keep track of your appointments and what is coming up next.
        </p>
      </div>

      {error ? (
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
      ) : (
        <>
          {loading && (
            <p role="status" className="mt-6 text-sm text-mocha">
              Loading your dashboard data...
            </p>
          )}
          <div
            aria-busy={loading}
            className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {stats.map(({ label, value, icon: Icon }, index) => (
              <div
                key={label}
                className="rounded-2xl border border-line bg-cream p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-mocha">{label}</p>
                    {loading ? (
                      <div className="mt-3 h-9 w-12 animate-pulse rounded-lg bg-sand" />
                    ) : (
                      <p className="mt-2 font-display text-4xl font-semibold">
                        {value}
                      </p>
                    )}
                  </div>
                  <span
                    className={`grid size-11 place-items-center rounded-xl ${statStyles[index]}`}
                  >
                    <Icon className="size-5 text-espresso" aria-hidden="true" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/user/my-appointments"
          className="rounded-2xl border border-line bg-cream p-5 transition hover:border-gold/60 hover:bg-white"
        >
          <span className="eyebrow">Appointments</span>
          <span className="mt-2 block font-display text-2xl font-medium">
            View my appointments
          </span>
          <span className="mt-1 block text-sm text-mocha">
            Review details, payment status, and available actions.
          </span>
        </Link>
        <Link
          href="/dashboard/user/my-profile"
          className="rounded-2xl border border-line bg-cream p-5 transition hover:border-gold/60 hover:bg-white"
        >
          <span className="eyebrow">Your account</span>
          <span className="mt-2 block font-display text-2xl font-medium">
            Manage my profile
          </span>
          <span className="mt-1 block text-sm text-mocha">
            Update your name and profile image.
          </span>
        </Link>
      </div>
    </section>
  );
}
