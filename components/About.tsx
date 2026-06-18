"use client";

import { motion } from "framer-motion";
import { RevealOnScroll, revealItemVariants } from "./RevealOnScroll";

const VALUES = [
  {
    title: "Performance-minded backend",
    description:
      "Optimizes APIs, queries, debugging flows, and data processing paths for faster and more consistent systems.",
  },
  {
    title: "Scalable product thinking",
    description:
      "Applies modular design, maintainable architecture, Git workflows, and production-style deployment practices.",
  },
  {
    title: "Client-facing collaboration",
    description:
      "Works directly with clients and small teams to translate needs into focused, business-oriented technical solutions.",
  },
];

export function About() {
  return (
    <section id="about" className="border-t border-border py-24">
      <div className="mx-auto w-full max-w-6xl px-4">
        <RevealOnScroll className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent">
            About me
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Developer profile built around practical delivery.
          </h2>
          <p className="mt-3 text-lg text-muted">
            Turning business requirements into reliable software through backend optimization,
            clean API design, and user-facing applications that work in real production
            environments.
          </p>
        </RevealOnScroll>

        <div className="grid gap-7 lg:grid-cols-2">
          <RevealOnScroll className="rounded-2xl border border-border bg-surface p-7">
            <h3 className="text-xl font-semibold">Professional profile</h3>
            <p className="mt-3 text-muted">
              I&apos;m a Full-Stack Developer with 3+ years of experience building and
              optimizing web applications using Java, Spring Boot, Angular, PostgreSQL, Oracle,
              MongoDB, Docker, virtual machines, JavaScript, and Python.
            </p>
            <p className="mt-3 text-muted">
              Improved query response times by up to 30% through backend optimization,
              efficient data handling, and large-scale contract data processing. Working with
              RESTful APIs, scalable system design, database performance, and collaborative
              client-facing development.
            </p>
          </RevealOnScroll>

          <RevealOnScroll stagger className="grid gap-3.5">
            {VALUES.map((value) => (
              <motion.div
                key={value.title}
                variants={revealItemVariants}
                className="rounded-md border border-border bg-surface p-5"
              >
                <h3 className="text-lg font-semibold">{value.title}</h3>
                <p className="mt-1 text-muted">{value.description}</p>
              </motion.div>
            ))}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
