import { PillLink } from "@/components/PillLink";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] items-center px-5 md:px-10">
      <div className="mx-auto w-full max-w-[1280px]">
        <p className="eyebrow">Error 404</p>
        <h1 className="display-xl mt-8">
          This page does
          <br />
          <span className="text-faint">not exist.</span>
        </h1>
        <p className="lede mt-8 max-w-[42ch]">
          The address is wrong, or the page was removed. Everything worth seeing is on the home
          page.
        </p>
        <div className="mt-10">
          <PillLink href="/" variant="solid">
            Back to the start
          </PillLink>
        </div>
      </div>
    </main>
  );
}
