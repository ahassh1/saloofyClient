import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[65vh] place-items-center px-6 py-20">
      <div className="max-w-xl text-center">
        <p className="eyebrow">404 - page not found</p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Page not found.
        </h1>
        <p className="mt-4 text-sm leading-6 text-mocha">
          The link may be incorrect, or the page may have moved.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex rounded-full bg-espresso px-6 py-3 text-sm font-semibold text-ivory hover:bg-mocha"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
