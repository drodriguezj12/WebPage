import { RevealOnScroll } from "./RevealOnScroll";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section id="contact" className="border-t border-border py-24">
      <div className="mx-auto w-full max-w-6xl px-4">
        <RevealOnScroll className="mb-10 max-w-2xl">
          <p className="mb-3 flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-accent">
            <span className="text-muted">05</span>
            <span className="h-px w-6 bg-border" aria-hidden="true" />
            Contact
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Ready to discuss a role, project, or collaboration.
          </h2>
          <p className="mt-3 text-lg text-muted">
            Use the form or contact me directly by email or phone. The form validates your
            message and opens your email client with the content prepared.
          </p>
        </RevealOnScroll>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <RevealOnScroll className="rounded-2xl border border-border bg-surface p-7">
            <h3 className="text-lg font-semibold">Direct contact</h3>
            <p className="mt-3 text-muted">
              Based in Bogotá, Colombia. Available for full-stack development roles, web
              platforms, API work, database optimization, and production support.
            </p>
            <ul className="mt-6 grid gap-3">
              <li>
                <a
                  href="mailto:drodriguezj1267@gmail.com"
                  className="flex items-center gap-3 font-bold text-text"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-accent-soft text-accent">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M4 4h16v16H4z" />
                      <path d="m22 6-10 7L2 6" />
                    </svg>
                  </span>
                  drodriguezj1267@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+573184793984"
                  className="flex items-center gap-3 font-bold text-text"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-accent-soft text-accent">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.11 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.8a2 2 0 0 1-.45 2.11L8.05 9.9a16 16 0 0 0 6.05 6.05l1.27-1.27a2 2 0 0 1 2.11-.45c.9.31 1.84.53 2.8.66A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  +57 318 479 3984
                </a>
              </li>
              <li className="flex items-center gap-3 font-bold text-text">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-accent-soft text-accent">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                Bogotá, Colombia
              </li>
            </ul>
          </RevealOnScroll>

          <RevealOnScroll>
            <ContactForm />
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
