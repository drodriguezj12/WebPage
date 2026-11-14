/**
 * Every claim here is taken from the project's own repository, its README, or
 * (for SECOP II) the written results of the user validation. Nothing is
 * rounded up.
 */

export type Figure = { figure: string; label: string };

export type ClipSource = {
  src: string;
  poster: string;
  width: number;
  height: number;
};

/**
 * A clip comes in two cuts of the same moment. `wide` shows both sessions side
 * by side; `tall` stacks them, because two browser windows across a phone
 * screen are too small to read.
 */
export type Clip = {
  /** Description for assistive technology. */
  label: string;
  wide: ClipSource;
  tall: ClipSource;
};

export type Point = { title: string; body: string };

function pulseClip(name: string, label: string): Clip {
  const base = `/projects/pulse/${name}`;
  return {
    label,
    wide: { src: `${base}.mp4`, poster: `${base}.jpg`, width: 1600, height: 754 },
    tall: { src: `${base}-mobile.mp4`, poster: `${base}-mobile.jpg`, width: 720, height: 916 },
  };
}

export const pulse = {
  id: "pulse",
  index: "01",
  kind: "Open source",
  name: "Pulse",
  tagline: "Real time, end to end.",
  summary:
    "A social network where a like, a new post or a deletion reaches every open session the moment it happens. Two Spring Boot services, an Angular app and PostgreSQL, started with one command.",
  hero: pulseClip(
    "likes",
    "Two Pulse sessions side by side. A like given in one appears in the other without reloading.",
  ),
  moments: [
    {
      title: "One session posts. Every session sees it.",
      body: "Posts, likes and deletions are broadcast over WebSocket/STOMP, so an open feed updates on its own. No polling, no reload.",
      clip: pulseClip(
        "post",
        "A post with an image is published in one session and appears at the top of the feed in the other.",
      ),
    },
    {
      title: "Deleting is real time too.",
      body: "The author removes a post and it leaves every feed that was showing it, in the same instant.",
      clip: pulseClip(
        "delete",
        "A post is deleted in one session and disappears from the other.",
      ),
    },
  ],
  decisions: [
    {
      title: "Two services, no calls between them",
      body: "Auth and posts have separate schemas and their own Flyway migrations. Self-contained JWTs carry what each service needs, so neither waits on the other.",
    },
    {
      title: "Likes that cannot double-count",
      body: "Liking is idempotent inside PL/pgSQL stored procedures. The feed is paginated by keyset, so the tenth page costs the same as the first.",
    },
    {
      title: "Tested against the real database",
      body: "95 tests, with integration tests running against a real PostgreSQL through Testcontainers on every push. H2 cannot execute PL/pgSQL, so a suite built on it would skip the part that matters.",
    },
  ] satisfies Point[],
  tech: ["Java 21", "Spring Boot 3.5", "Angular 19", "PostgreSQL 16", "WebSocket/STOMP", "Docker Compose", "Testcontainers", "GitHub Actions"],
  repoUrl: "https://github.com/drodriguezj12/pulse-social-network",
  demoUrl: "https://youtu.be/POKikhqDtYo",
} as const;

export const secop = {
  id: "secop",
  index: "02",
  kind: "Client work",
  name: "SECOP II Search",
  tagline: "Ask in plain language. Get the contract.",
  summary:
    "Colombia publishes its public procurement on SECOP II, and finding the right contract there meant filtering by hand, one criterion at a time. I built Proyectos y Servicios RACO a platform that searches, filters, notifies and reports on those contracts, with an assistant that takes the question as you would say it.",
  /**
   * The assistant's flow, shown as an illustration. The question is one of the
   * scenarios from the timed user tests; the query is representative of what
   * the assistant builds, not a transcript.
   */
  flow: {
    question: "Supply contracts in Cundinamarca worth more than 500 million",
    model: "GPT-4o-mini through Spring AI",
    query: [
      "SELECT entidad, objeto, valor",
      "WHERE departamento = 'Cundinamarca'",
      "  AND valor > 500000000",
      "  AND objeto LIKE '%suministro%'",
      "LIMIT 5",
    ],
    source: "Socrata open-data API",
    result: "Up to five matching contracts, with entity, value and a link to the process.",
  },
  figures: [
    { figure: "90%+", label: "less search time on multi-criteria queries than on the SECOP II portal" },
    { figure: "87.5%", label: "of surveyed users said they would keep using it" },
    { figure: "758 ms", label: "slowest average search response measured; the fastest was 205 ms" },
    { figure: "133", label: "automated tests: 79 backend, 36 frontend, 18 security" },
  ] satisfies Figure[],
  footnote:
    "Search times were taken with three RACO users, one scenario each; eight users answered the survey. On a simple keyword search the portal itself was faster.",
  points: [
    {
      title: "Five modules, one platform",
      body: "Accounts, search and filtering, notifications, PDF reports and the assistant, built with Java 21, Spring Boot 3, Angular and PostgreSQL.",
    },
    {
      title: "Secured from the first endpoint",
      body: "REST APIs behind JWT, Google sign-in and two-step verification. The security tests found two real defects in authentication and input validation, and both were fixed.",
    },
    {
      title: "An assistant with a budget",
      body: "It retrieves only the fields a contract needs and caps the tokens of each interaction, so cost stays predictable.",
    },
  ] satisfies Point[],
  tech: ["Java 21", "Spring Boot 3", "Spring AI", "Angular", "PostgreSQL", "OpenAI API", "JWT + 2FA"],
} as const;

export const smartpark = {
  id: "smartpark",
  index: "03",
  kind: "Event-driven",
  name: "SmartPark",
  tagline: "Every parking space is an event.",
  summary:
    "A real-time parking system: space availability, plate tracking, reservations and automated billing. Three Quarkus services that never call each other directly; they publish what happened to Kafka and react to what the others published.",
  points: [
    {
      title: "Three services, three databases",
      body: "Spaces, reservations and billing each own a PostgreSQL database and talk only through Kafka events, behind an Nginx gateway.",
    },
    {
      title: "A dashboard that stays current",
      body: "React 18 and Vite: live occupancy map, reservation flow, event feed and a billing panel over REST APIs.",
    },
    {
      title: "Built to be operated",
      body: "Docker Compose and Kubernetes on Minikube, Swagger docs, health checks and Prometheus metrics, tested with JUnit 5 and RestAssured.",
    },
  ] satisfies Point[],
  tech: ["Quarkus", "Apache Kafka", "PostgreSQL", "Panache ORM", "React 18", "Docker", "Kubernetes", "Prometheus"],
  demoUrl: "https://youtu.be/gIswiIaDojU",
} as const;
