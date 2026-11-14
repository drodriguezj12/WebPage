export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  description: string;
};

export const experienceItems: ExperienceItem[] = [
  {
    role: "Service Desk Analyst",
    company: "SLB (Schlumberger)",
    period: "Aug 2026 — Present",
    description:
      "Enterprise IT support in English for users across several countries. Incidents and requests in ServiceNow; repetitive support tasks and reporting automated with Power Apps, Power Automate and Python.",
  },
  {
    role: "Full-Stack Developer",
    company: "Proyectos y Servicios RACO S.A.S",
    period: "Nov 2022 — Feb 2026",
    description:
      "Built the SECOP II contract search platform and its LLM assistant with Java, Spring Boot and Angular, working directly with the client and coordinating a three-person team.",
  },
];
