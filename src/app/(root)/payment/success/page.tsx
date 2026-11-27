import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20 text-center">
      <p className="eyebrow">Payment confirmation</p>
      <h1 className="mt-3 font-display text-4xl font-medium sm:text-5xl">
        Your payment is being confirmed
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-mocha">
        Your appointment will show as paid after our verified Stripe
        notification is processed.
      </p>
      <Link
        href="/dashboard/user/my-appointments"
        className="mt-8 inline-flex rounded-full bg-espresso px-6 py-3 text-sm font-semibold text-ivory hover:bg-mocha"
      >
        View my appointments
      </Link>
    </section>
  );
}
