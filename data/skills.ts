export type SkillCategory = {
  name: string;
  items: string[];
};

export const skillCategories: SkillCategory[] = [
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
