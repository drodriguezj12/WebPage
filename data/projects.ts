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
  /** Real product screenshots shown beside the description in a pinned beat. */
  screenshots?: {
    src: string;
    alt: string;
    label: string;
    width: number;
    height: number;
  }[];
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
    screenshots: [
      {
        src: "/projects/pulse/feed.webp",
        alt: "The Pulse feed showing a post with an image attachment and its like count",
        label: "FEED",
        width: 1600,
        height: 825,
      },
      {
        src: "/projects/pulse/create-post.webp",
        alt: "Composing a new post with an image attached before publishing",
        label: "CREATE",
        width: 1600,
        height: 825,
      },
      {
        src: "/projects/pulse/profile.webp",
        alt: "A user profile page showing the account alias and avatar",
        label: "PROFILE",
        width: 1600,
        height: 825,
      },
    ],
  },
  {
    title: "SECOP II Contract Search Platform",
    tag: "Client work",
    description:
      "Web platform built for Proyectos y Servicios RACO to search, filter and get notified about public procurement contracts published on SECOP II, with an LLM assistant that answers questions in natural language.",
    achievements: [
      "Built search, filtering, notifications and PDF reports with Java 21, Spring Boot 3, Angular and PostgreSQL, behind REST APIs secured with JWT, Google sign-in and 2FA.",
      "Integrated an assistant (OpenAI GPT-4o-mini through Spring AI) that turns a question into a SoQL query against the Socrata open-data API, with a token limit per interaction.",
      "In timed tests with RACO users, multi-criteria searches took over 90% less time than on the SECOP II portal; 87.5% of surveyed users said they would keep using it.",
      "Covered it with 79 backend and 36 frontend unit tests plus 18 security tests, which caught and fixed two authentication and validation defects; search endpoints answer in 205-758 ms.",
    ],
    tech: ["Java 21", "Spring Boot", "Spring AI", "Angular", "PostgreSQL", "OpenAI API", "JWT"],
    shortName: "SECOP II",
    discipline: "LLM SEARCH",
    cover: "/projects/contracts.jpg",
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
];
