"use client"

import { useRef, useState } from "react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { ExternalLink } from "lucide-react"

const experiences = [
  {
    period: "2024 — Present",
    title: "Senior Full Stack Developer",
    company: "TechCorp",
    companyUrl: "#",
    description:
      "Build and maintain critical components used to construct the platform's frontend. Work closely with cross-functional teams to implement and advocate for best practices in web development.",
    technologies: ["React", "TypeScript", "Next.js", "GraphQL", "AWS"],
  },
  {
    period: "2022 — 2024",
    title: "Full Stack Developer",
    company: "StartupXYZ",
    companyUrl: "#",
    description:
      "Developed and shipped highly interactive web applications for various clients. Led the development of a new product feature that increased user engagement by 40%.",
    technologies: ["React", "Node.js", "PostgreSQL", "Docker", "Redis"],
  },
  {
    period: "2020 — 2022",
    title: "Frontend Developer",
    company: "Digital Agency",
    companyUrl: "#",
    description:
      "Collaborated with designers to implement responsive and accessible user interfaces. Improved performance metrics and implemented A/B testing frameworks.",
    technologies: ["JavaScript", "Vue.js", "SCSS", "Webpack", "Jest"],
  },
  {
    period: "2018 — 2020",
    title: "Junior Developer",
    company: "WebStudio",
    companyUrl: "#",
    description:
      "Assisted in developing client websites and web applications. Gained experience in full-stack development and agile methodologies.",
    technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
  },
]

export function Experience() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { threshold: 0.1 })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section ref={ref} id="experience" className="min-h-screen px-6 py-24 lg:px-24">
      <div className="mx-auto max-w-4xl">
        <h2
          className={cn(
            "mb-12 text-sm font-medium uppercase tracking-widest text-primary transition-all duration-500",
            isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          Experience
        </h2>

        <div className="space-y-2">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={cn(
                "group relative rounded-lg p-6 transition-all duration-500",
                isInView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
                hoveredIndex !== null && hoveredIndex !== index ? "opacity-50" : "opacity-100",
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="absolute inset-0 rounded-lg bg-secondary/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative grid gap-4 lg:grid-cols-[200px_1fr]">
                <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{exp.period}</span>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">
                    {exp.title} ·{" "}
                    <a
                      href={exp.companyUrl}
                      className="inline-flex items-center gap-1 text-primary transition-colors hover:underline"
                    >
                      {exp.company}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </h3>

                  <p className="text-muted-foreground">{exp.description}</p>

                  <ul className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <li key={tech} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <a
          href="/resume.pdf"
          className="mt-12 inline-flex items-center gap-2 text-lg font-medium text-foreground transition-colors hover:text-primary"
        >
          View Full Résumé
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </section>
  )
}
