"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, Clock3, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { useSession } from "@/lib/auth-client";
import { apiFetch, publicApiFetch, type SalonService } from "@/lib/api";
import { formatMoney } from "@/lib/formatters";
import { APPOINTMENT_TIME_SLOTS } from "@/lib/service-constants";

function getToday() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${today.getFullYear()}-${month}-${day}`;
}

export default function ServiceDetails({ serviceId }: { serviceId: string }) {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const [service, setService] = useState<SalonService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState<string>(APPOINTMENT_TIME_SLOTS[0]);
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadService() {
      setLoading(true);
      setError(null);

      try {
        const result = await publicApiFetch<SalonService>(
          `/api/services/${encodeURIComponent(serviceId)}`,
        );
        if (!ignore) setService(result);
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load this service.",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void loadService();

    return () => {
      ignore = true;
    };
  }, [serviceId]);

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!service || !appointmentDate || !timeSlot || booking) return;

    setBooking(true);

    try {
      await apiFetch("/api/appointments", {
        method: "POST",
        body: JSON.stringify({
          serviceId: service._id,
          appointmentDate,
          timeSlot,
          ...(message.trim() ? { message: message.trim() } : {}),
        }),
      });
      toast.success("Appointment request sent.");
      router.push("/dashboard/user/my-appointments");
    } catch (bookingError) {
      toast.error(
        bookingError instanceof Error
          ? bookingError.message
          : "Unable to request this appointment.",
      );
    } finally {
      setBooking(false);
    }
  }

  if (loading) {
    return (
      <div
        className="mx-auto my-12 h-[32rem] w-[calc(100%-2.5rem)] max-w-6xl animate-pulse rounded-2xl bg-sand/70"
        aria-label="Loading service"
      />
    );
  }

  if (error || !service) {
    return (
      <div
        role="alert"
        className="mx-auto my-12 max-w-3xl rounded-2xl border border-destructive/20 bg-cream p-6 text-center"
      >
        <h1 className="font-display text-3xl font-semibold">
          Service unavailable
        </h1>
        <p className="mt-2 text-sm text-mocha">
          {error ?? "This service could not be found."}
        </p>
        <Link
          href="/services"
          className="mt-5 inline-flex rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-ivory"
        >
          Back to services
        </Link>
      </div>
    );
  }

  const isCustomer =
    session?.user?.role === "user" && session.user.blocked !== true;

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)] lg:gap-12 lg:px-12 lg:py-16">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-sand">
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            unoptimized
            className="object-cover"
          />
        </div>
        <p className="eyebrow mt-7">{service.category}</p>
        <h1 className="mt-2 font-display text-5xl font-medium tracking-tight sm:text-6xl">
          {service.name}
        </h1>
        <div className="mt-4 flex flex-wrap gap-5 text-sm text-mocha">
          <span className="inline-flex items-center gap-2">
            <span className="font-semibold text-espresso">
              {formatMoney(service.price)}
            </span>
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock3 className="size-4 text-gold" aria-hidden="true" />
            {service.durationMinutes} minutes
          </span>
        </div>
        <p className="mt-6 max-w-2xl whitespace-pre-line text-sm leading-7 text-mocha">
          {service.description}
        </p>
      </div>

      <aside className="h-fit rounded-3xl border border-line bg-cream p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-3">
          <CalendarDays className="size-5 text-gold" aria-hidden="true" />
          <h2 className="font-display text-3xl font-semibold">Request a visit</h2>
        </div>

        {sessionPending ? (
          <div className="mt-6 h-40 animate-pulse rounded-xl bg-sand/70" />
        ) : isCustomer && service.isActive ? (
          <form onSubmit={submitBooking} className="mt-6 space-y-5">
            <div>
              <label htmlFor="appointment-date" className="field-label">
                Appointment date
              </label>
              <input
                id="appointment-date"
                type="date"
                value={appointmentDate}
                min={getToday()}
                onChange={(event) => setAppointmentDate(event.target.value)}
                className="field"
                required
              />
            </div>

            <div>
              <label htmlFor="appointment-time" className="field-label">
                Available time
              </label>
              <select
                id="appointment-time"
                value={timeSlot}
                onChange={(event) => setTimeSlot(event.target.value)}
                className="field"
                required
              >
                {APPOINTMENT_TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="appointment-message" className="field-label">
                Message <span className="font-normal normal-case">(optional)</span>
              </label>
              <textarea
                id="appointment-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={4}
                className="field resize-y"
                placeholder="Anything you would like us to know?"
              />
            </div>

            <button
              type="submit"
              disabled={booking || !service.isActive}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-espresso px-5 text-sm font-semibold text-ivory hover:bg-mocha disabled:opacity-60"
            >
              {booking && (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              )}
              {booking ? "Sending request..." : "Request appointment"}
            </button>
            <p className="text-center text-xs leading-5 text-mocha">
              Your request starts as pending. The salon will confirm it.
            </p>
          </form>
        ) : !session?.user ? (
          <div className="mt-6 rounded-xl bg-sand/70 p-4">
            <p className="text-sm text-mocha">
              Sign in with a customer account to request an appointment.
            </p>
            <Link
              href={`/signin?callbackURL=${encodeURIComponent(`/services/${service._id}`)}`}
              className="mt-4 inline-flex rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-ivory"
            >
              Sign in to book
            </Link>
          </div>
        ) : session.user.blocked ? (
          <p role="alert" className="mt-6 text-sm text-destructive">
            This account cannot book appointments. Please contact the salon.
          </p>
        ) : session.user.role !== "user" ? (
          <p className="mt-6 text-sm text-mocha">
            Appointment bookings are available to customer accounts only.
          </p>
        ) : (
          <p role="alert" className="mt-6 text-sm text-mocha">
            This service is currently unavailable for booking.
          </p>
        )}
      </aside>
    </section>
  );
}
