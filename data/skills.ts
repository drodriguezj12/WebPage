export type SkillCategory = {
  name: string;
  items: string[];
};

export const skillCategories: SkillCategory[] = [
  { name: "Languages", items: ["Java", "JavaScript", "Python", "HTML", "CSS"] },
  {
    name: "Backend",
    items: ["Spring Boot", "REST APIs", "Quarkus", "System design", "Clean architecture"],
  },
  {
    name: "Frontend",
    items: ["Angular", "React", "Responsive UI", "Vite", "Forms", "Dashboards"],
  },
  {
    name: "Databases",
    items: ["PostgreSQL", "Oracle", "MongoDB", "Query optimization", "Data consistency"],
  },
  {
    name: "Cloud & DevOps",
    items: ["Docker", "AWS", "Virtual machines", "Kubernetes", "Minikube", "Prometheus"],
  },
  {
    name: "Tools & Methods",
    items: [
      "Git",
      "GitHub",
      "Jira",
      "ClickUp",
      "Scrum",
      "Agile",
      "Cisco Packet Tracer",
      "Vensim",
    ],
  },
];
