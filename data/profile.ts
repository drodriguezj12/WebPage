export const profile = {
  name: "Daniel Rodriguez",
  role: "Backend / Full-Stack Developer",
  location: "Bogotá, Colombia",
  email: "drodriguezj1267@gmail.com",
  phone: { display: "+57 318 479 3984", href: "tel:+573184793984" },
  headline: ["Built with", "the people who", "use it."],
  intro:
    "I'm Daniel, a backend-leaning full-stack developer in Bogotá. For over three years I have built web platforms in Java, Spring Boot and Angular, and tested them against real databases and real users before calling them done.",
  figures: [
    { figure: "3+", label: "years building web applications" },
    { figure: "90%+", label: "less search time, measured with users" },
    { figure: "95", label: "tests behind one side project" },
  ],
  statement:
    "I work close to the problem. At RACO I sat with the client, turned what they needed into requirements and built it with a three-person team. I don't consider something finished until it has been measured: tests against a real database, timings taken with the people who will use it.",
} as const;

export type ExperienceItem = {
  period: string;
  company: string;
  role: string;
  place: string;
  points: string[];
};

export const experience: ExperienceItem[] = [
  {
    period: "Aug 2026 — Present",
    company: "SLB",
    role: "Service Desk Analyst, Business Service Desk (IT)",
    place: "Bogotá, Colombia",
    points: [
      "Diagnose and resolve enterprise IT incidents for users in several countries, working in English with global support teams.",
      "Triage, document and escalate incidents and requests in ServiceNow within service-level targets.",
      "Automate repetitive support tasks and reporting with Power Apps, Power Automate and Python.",
    ],
  },
  {
    period: "Nov 2022 — Feb 2026",
    company: "Proyectos y Servicios RACO",
    role: "Full-Stack Developer",
    place: "Bogotá, Colombia",
    points: [
      "Built the SECOP II contract search platform and its LLM assistant with Java, Spring Boot, Angular and PostgreSQL.",
      "Worked directly with the client to turn business needs into requirements and technical solutions.",
      "Coordinated development in a three-person team: split the work, reviewed code and kept the architecture modular.",
    ],
  },
];

export const education = [
  {
    institution: "Universidad El Bosque",
    detail: "B.Sc. Systems Engineering, 9th semester. Bogotá.",
  },
  {
    institution: "Instituto Colombo Americano",
    detail: "English B2. Native Spanish speaker.",
  },
];

export const stack: { name: string; items: string[] }[] = [
  {
    name: "Languages",
    items: ["Java", "TypeScript", "JavaScript", "SQL", "Python", "HTML", "CSS"],
  },
  {
    name: "Backend",
    items: [
      "Spring Boot",
      "Spring AI",
      "Quarkus",
      "REST APIs",
      "Swagger/OpenAPI",
      "Hibernate/JPA",
      "WebSocket/STOMP",
      "JWT",
      "Apache Kafka",
      "LLM APIs",
    ],
  },
  { name: "Frontend", items: ["Angular", "React"] },
  {
    name: "Data",
    items: ["PostgreSQL", "PL/pgSQL", "Oracle", "MongoDB", "SQL tuning", "Flyway"],
  },
  {
    name: "DevOps & Testing",
    items: [
      "Docker",
      "Docker Compose",
      "Kubernetes",
      "Maven",
      "GitHub Actions",
      "JUnit 5",
      "Testcontainers",
      "RestAssured",
    ],
  },
  {
    name: "Automation & Methods",
    items: ["Power Apps", "Power Automate", "ServiceNow", "Git", "Jira", "Scrum", "Agile"],
  },
];
