import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20 text-center">
      <p className="eyebrow">Checkout cancelled</p>
      <h1 className="mt-3 font-display text-4xl font-medium sm:text-5xl">
        Your appointment is still unpaid
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-mocha">
        No payment was confirmed. You can return to your appointments and try
        checkout again.
      </p>
      <Link
        href="/dashboard/user/my-appointments"
        className="mt-8 inline-flex rounded-full bg-espresso px-6 py-3 text-sm font-semibold text-ivory hover:bg-mocha"
      >
        Return to my appointments
      </Link>
    </section>
  );
}
