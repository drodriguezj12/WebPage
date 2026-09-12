import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh items-center">
      <div
        aria-hidden="true"
        className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-50"
      />
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <p className="label mb-6">Error 404</p>
        <h1 className="display text-[44px] md:text-[68px] lg:text-[96px]">
          This page does
          <br />
          not <span className="text-steel">exist</span>
        </h1>
        <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-muted">
          The address is wrong, or the page was removed. Everything worth seeing is on the
          cover.
        </p>
        <Link
          href="/"
          className="label mt-10 inline-block border border-border px-5 py-4 hover:border-steel hover:text-steel focus-visible:text-steel focus-visible:border-steel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-steel"
        >
          Back to the cover
        </Link>
      </div>
    </main>
  );
}
