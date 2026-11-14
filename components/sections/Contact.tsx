import { ContactForm } from "@/components/ContactForm";
import { ArrowUpRightIcon } from "@/components/icons";
import { profile } from "@/data/profile";
import { GITHUB_URL, LINKEDIN_URL } from "@/lib/site";

const CHANNELS = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "Phone", value: profile.phone.display, href: profile.phone.href },
  { label: "LinkedIn", value: "in/danielrodriguezj", href: LINKEDIN_URL },
  { label: "GitHub", value: "drodriguezj12", href: GITHUB_URL },
];

export function Contact() {
  return (
    <section
      id="contact"
      data-theme="dark"
      aria-labelledby="contact-title"
      className="mx-2 rounded-[2rem] px-5 py-24 md:mx-4 md:rounded-[3rem] md:px-10 md:py-40"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <h2 id="contact-title" data-reveal className="display-xl">
          Let&apos;s talk.
        </h2>
        <p data-reveal className="lede mt-8 max-w-[44ch]">
          Open to backend and full-stack roles, remote or in Bogotá. The form reaches my inbox
          directly.
        </p>

        <div className="mt-16 grid gap-14 md:mt-24 lg:grid-cols-12 lg:gap-16">
          <ul data-reveal className="lg:col-span-5">
            {CHANNELS.map((channel) => {
              const external = channel.href.startsWith("http");
              return (
                <li key={channel.label} className="border-t border-line last:border-b">
                  <a
                    href={channel.href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="focus-ring group flex items-center justify-between gap-6 py-5"
                  >
                    <span>
                      <span className="mono-label block">{channel.label}</span>
                      <span className="mt-1.5 block break-all text-lg font-medium tracking-[-0.02em] md:text-xl">
                        {channel.value}
                      </span>
                    </span>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/8 transition-[transform,background-color] duration-500 ease-fluid group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-white group-hover:text-[#0a0a0c]">
                      <ArrowUpRightIcon className="h-4 w-4" />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div data-reveal className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
