export type Project = {
  title: string;
  tag: string;
  description: string;
  achievements: string[];
  tech: string[];
  demoUrl?: string;
  repoUrl?: string;
  /** Name for the cover index, where the full title does not fit. */
  shortName?: string;
  /** One word for the cover index. Uppercase, no punctuation. */
  discipline?: string;
  /** Path under /public for the card image. */
  cover?: string;
};

export const projects: Project[] = [
  {
    title: "Pulse — Real-Time Social Network",
    tag: "Open source",
    description:
      "Social network where likes, new posts and deletions reach every open session over WebSocket, built as two Spring Boot microservices behind an Angular single-page app.",
    achievements: [
      "Broadcast likes, posts and deletions over WebSocket/STOMP so every open feed updates on its own, with no polling and no reload.",
      "Split the backend into two independent Spring Boot services with separate schemas and Flyway migrations, decoupled by self-contained JWTs instead of service-to-service calls.",
      "Made likes idempotent inside PL/pgSQL stored procedures and paginated the feed by keyset, so the tenth page costs the same as the first.",
      "Covered the stack with 95 tests, integration tests included against a real PostgreSQL through Testcontainers, run on every push by GitHub Actions.",
    ],
    tech: ["Java 21", "Spring Boot", "Angular 19", "PostgreSQL", "WebSocket", "Docker", "Testcontainers"],
    demoUrl: "https://youtu.be/POKikhqDtYo",
    repoUrl: "https://github.com/drodriguezj12/pulse-social-network",
    shortName: "Pulse",
    discipline: "REAL-TIME",
  },
  {
    title: "Smart Parking Management Platform",
    tag: "Real-time",
    description:
      "Real-time parking system for space availability, vehicle plate tracking, reservations, automated billing, and sensor-driven operations.",
    achievements: [
      "Built event-driven microservices with Quarkus, Apache Kafka, PostgreSQL, and Panache ORM.",
      "Designed RESTful APIs for spaces, reservations, billing records, revenue summaries, and sensor simulation.",
      "Created a responsive React 18 + Vite dashboard with occupancy map, reservation modal, event feed, and billing panel.",
      "Implemented Docker Compose, Kubernetes Minikube, Swagger docs, health checks, Prometheus metrics, and integration tests.",
    ],
    tech: ["Quarkus", "Kafka", "PostgreSQL", "React", "Docker", "Kubernetes", "JUnit 5"],
    demoUrl: "https://youtu.be/gIswiIaDojU",
    shortName: "SmartPark",
    discipline: "EVENT-DRIVEN",
    cover: "/projects/smartpark.jpg",
  },
  {
    title: "E-commerce Platform with AI Chatbot Integration",
    tag: "Commerce",
    description:
      "Full-stack commerce platform for product management, dynamic customer interaction, payment flows, and real-time notifications.",
    achievements: [
      "Developed product catalog and CRUD workflows with Spring Boot and Angular.",
      "Integrated a conversational chatbot to automate customer request handling and improve response efficiency.",
      "Implemented payment gateway integration for secure online transactions.",
      "Built a notification system and applied scalable architecture and performance optimization practices.",
    ],
    tech: ["Java", "Spring Boot", "Angular", "REST APIs", "Payments", "Notifications"],
    demoUrl: "https://youtu.be/-6_inzLlELU",
    shortName: "Commerce",
    discipline: "AI CHATBOT",
    cover: "/projects/commerce.jpg",
  },
  {
    title: "Contract Data Processing System",
    tag: "Production",
    description:
      "Production web application work at Proyectos y Servicios RACO S.A.S focused on contract search, backend reliability, and database performance.",
    achievements: [
      "Improved contract search query response times by approximately 30%.",
      "Designed and maintained RESTful APIs supporting business logic and large-scale data handling.",
      "Reduced errors through debugging, backend optimization, and database query improvements.",
      "Coordinated development tasks and code review within a small delivery team.",
    ],
    tech: ["Spring Boot", "Angular", "PostgreSQL", "Oracle", "MongoDB", "Git"],
    shortName: "Contracts",
    discipline: "PRODUCTION",
    cover: "/projects/contracts.jpg",
  },
];
