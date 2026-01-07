"use client"

import { useRef, useState } from "react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { ExternalLink, Github, Folder } from "lucide-react"

const featuredProjects = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce solution with real-time inventory management, payment processing, and an admin dashboard. Built with performance and scalability in mind.",
    technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Redis"],
    github: "#",
    live: "#",
    image: "/modern-ecommerce-dashboard-dark-theme.jpg",
  },
  {
    title: "Task Management App",
    description:
      "A collaborative task management application featuring real-time updates, drag-and-drop functionality, and team workspaces. Integrates with popular tools.",
    technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Docker"],
    github: "#",
    live: "#",
    image: "/task-management-kanban-board-dark-theme.jpg",
  },
  {
    title: "AI Content Generator",
    description:
      "An AI-powered content generation tool that helps create blog posts, social media content, and marketing copy using advanced language models.",
    technologies: ["Python", "FastAPI", "OpenAI", "React", "TailwindCSS"],
    github: "#",
    live: "#",
    image: "/ai-content-generator-dark.png",
  },
]

const otherProjects = [
  {
    title: "Weather Dashboard",
    description: "A beautiful weather application with 7-day forecasts and location-based updates.",
    technologies: ["React", "OpenWeather API", "Chart.js"],
    github: "#",
    live: "#",
  },
  {
    title: "Markdown Editor",
    description: "A real-time markdown editor with live preview and export functionality.",
    technologies: ["Vue.js", "Marked.js", "LocalStorage"],
    github: "#",
    live: "#",
  },
  {
    title: "Crypto Tracker",
    description: "Real-time cryptocurrency price tracker with portfolio management.",
    technologies: ["Next.js", "CoinGecko API", "Chart.js"],
    github: "#",
    live: "#",
  },
  {
    title: "Recipe Finder",
    description: "Search and save recipes with nutritional information and meal planning.",
    technologies: ["React", "Spoonacular API", "Firebase"],
    github: "#",
    live: "#",
  },
  {
    title: "URL Shortener",
    description: "A fast URL shortening service with click analytics and custom aliases.",
    technologies: ["Node.js", "Redis", "PostgreSQL"],
    github: "#",
    live: "#",
  },
  {
    title: "Portfolio Template",
    description: "A customizable portfolio template for developers and designers.",
    technologies: ["Next.js", "TailwindCSS", "Framer Motion"],
    github: "#",
    live: "#",
  },
]

export function Projects() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { threshold: 0.1 })
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  return (
    <section ref={ref} id="projects" className="min-h-screen px-6 py-24 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <h2
          className={cn(
            "mb-12 text-sm font-medium uppercase tracking-widest text-primary transition-all duration-500",
            isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          Featured Projects
        </h2>

        {/* Featured Projects */}
        <div className="space-y-24">
          {featuredProjects.map((project, index) => (
            <div
              key={index}
              className={cn(
                "group grid gap-8 transition-all duration-700 lg:grid-cols-2",
                isInView ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0",
                index % 2 === 1 && "lg:direction-rtl",
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Project Image */}
              <div className="relative overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-primary/20 opacity-60 transition-opacity duration-300 group-hover:opacity-0" />
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Project Info */}
              <div
                className={cn(
                  "flex flex-col justify-center",
                  index % 2 === 1 ? "lg:items-start lg:text-left" : "lg:items-end lg:text-right",
                )}
              >
                <p className="mb-2 text-sm font-medium text-primary">Featured Project</p>
                <h3 className="mb-4 text-2xl font-bold text-foreground">{project.title}</h3>
                <div className="mb-4 rounded-lg bg-card p-6 shadow-lg">
                  <p className="text-muted-foreground">{project.description}</p>
                </div>
                <ul className={cn("mb-4 flex flex-wrap gap-3", index % 2 === 1 ? "justify-start" : "justify-end")}>
                  {project.technologies.map((tech) => (
                    <li key={tech} className="text-sm font-mono text-muted-foreground">
                      {tech}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-4">
                  <a
                    href={project.github}
                    className="text-muted-foreground transition-colors hover:text-primary"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href={project.live}
                    className="text-muted-foreground transition-colors hover:text-primary"
                    aria-label={`View ${project.title} live site`}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Other Projects */}
        <h3
          className={cn(
            "mb-8 mt-24 text-center text-2xl font-bold text-foreground transition-all duration-500",
            isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          Other Noteworthy Projects
        </h3>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {otherProjects.map((project, index) => (
            <div
              key={index}
              className={cn(
                "group relative rounded-lg bg-card p-6 transition-all duration-500 hover:-translate-y-2",
                isInView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
                hoveredProject !== null && hoveredProject !== index ? "opacity-50" : "opacity-100",
              )}
              style={{ transitionDelay: `${index * 75}ms` }}
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="mb-4 flex items-center justify-between">
                <Folder className="h-10 w-10 text-primary" />
                <div className="flex gap-3">
                  <a
                    href={project.github}
                    className="text-muted-foreground transition-colors hover:text-primary"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href={project.live}
                    className="text-muted-foreground transition-colors hover:text-primary"
                    aria-label={`View ${project.title} live site`}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <h4 className="mb-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                {project.title}
              </h4>
              <p className="mb-4 text-sm text-muted-foreground">{project.description}</p>

              <ul className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <li key={tech} className="text-xs font-mono text-muted-foreground">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
