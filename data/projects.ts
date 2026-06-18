export type Project = {
  title: string;
  tag: string;
  description: string;
  achievements: string[];
  tech: string[];
  demoUrl?: string;
};

export const projects: Project[] = [
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
  },
];
