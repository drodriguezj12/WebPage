import { RevealOnScroll } from "./RevealOnScroll";
import { ContactForm } from "./ContactForm";
import { GITHUB_URL, LINKEDIN_URL } from "@/lib/site";

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
            Use the form or reach me directly by email, phone or GitHub. The form sends the
            message straight to my inbox, and replies land back in yours.
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
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-bold text-text"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-accent-soft text-accent">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                      <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.2c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .5z" />
                    </svg>
                  </span>
                  github.com/drodriguezj12
                </a>
              </li>
              <li>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-bold text-text"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-accent-soft text-accent">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
                    </svg>
                  </span>
                  LinkedIn profile
                </a>
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
