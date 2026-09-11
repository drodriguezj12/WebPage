import { ContactForm } from "@/components/ContactForm";
import { SectionHeader } from "@/components/SectionHeader";
import { GITHUB_URL, LINKEDIN_URL } from "@/lib/site";

const DIRECT = [
  { label: "Email", value: "drodriguezj1267@gmail.com", href: "mailto:drodriguezj1267@gmail.com" },
  { label: "Phone", value: "+57 318 479 3984", href: "tel:+573184793984" },
  { label: "GitHub", value: "github.com/drodriguezj12", href: GITHUB_URL },
  { label: "LinkedIn", value: "LinkedIn profile", href: LINKEDIN_URL },
];

export function ContactSection() {
  return (
    <section id="contact" className="border-t border-border py-24">
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <SectionHeader index="05" label="Contact" lines={["Let's", "talk"]} />

        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="max-w-[40ch] text-base leading-relaxed text-muted">
              Based in Bogotá, Colombia. Open to full-stack and backend roles, API work and
              database optimisation. The form reaches my inbox directly.
            </p>
            <dl className="mt-10 grid gap-5">
              {DIRECT.map((item) => (
                <div key={item.label} className="border-t border-border pt-4">
                  <dt className="label">{item.label}</dt>
                  <dd className="mt-2">
                    <a
                      className="text-text hover:text-steel focus-visible:text-steel focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-steel"
                      href={item.href}
                      {...(item.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {item.value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
