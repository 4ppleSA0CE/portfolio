"use client"

import { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { ExternalLink, Github } from "lucide-react"

const featuredProjects = [
  {
    title: "Silhouette",
    description:
      "A full-stack AI fashion advisor enabling real-time body annotation and outfit visualization. Orchestrates multiple AI services using Google Gemini for image generation and style recommendations, and Overshoot SDK for real-time video analysis, with async inference and prompt pipelines to generate personalized recommendations.",
    technologies: ["React", "Next.js", "Express.js", "MongoDB", "Google Gemini", "Overshoot SDK"],
    github: "https://github.com/Rababb-P/Silhouette",
    live: "https://devpost.com/software/tbd-7j39dt",
    image: "/silhouette.png",
  },
  {
    title: "Coffee Chat Scheduler",
    description:
      "An interactive booking platform that links to my Google account, allowing users to view available time slots and schedule coffee chats with me, with automatic calendar synchronization that adds events directly to their Google Calendar.",
    technologies: ["React", "Python", "FastAPI", "PostgreSQL", "Google Calendar API", "Git"],
    github: "https://github.com/4ppleSA0CE/coffee-chat-scheduler",
    live: "https://bookacoffeechat.vercel.app/",
    image: "/coffee-chat-scheduler.png",
  },
  {
    title: "Autonomous Vehicle Control System",
    description:
      "A self-navigating robotics system that uses LiDAR sensors to map its surroundings in real-time, calculates optimal paths around obstacles, and autonomously navigates to target destinations with precision.",
    technologies: ["C++", "ROS2", "Docker", "CMake", "Foxglove"],
    github: "https://github.com/4ppleSA0CE/wato_asd_training",
    live: "https://www.youtube.com/watch?v=X-JIZ522HMU",
    image: "/autonomous-vehicle-control.png",
  },
]

// const otherProjects = [
//   {
//     title: "Fruit Ninja AI",
//     description: "Architected and implemented an automated computer vision pipeline using YOLO11n object detection, achieving 90% precision, 87% recall, and 0.89 F1 score with 0.92 AUC in fruit classification across 8 fruit categories. Built comprehensive dataset of 816 images (514 training, 302 testing), optimizing model performance through data augmentation techniques.",
//     technologies: ["Python", "YOLO11", "OpenCV", "PyTorch"],
//     github: "https://github.com/4ppleSA0CE/fruit-ninja-ai",
//     live: "#",
//   },
//   {
//     title: "Leetcode Daily Challenge",
//     description: "On a mission to solve every leetcode daily challenge. Maintaining consistent practice and documenting solutions.",
//     technologies: ["C++"],
//     github: "https://github.com/4ppleSA0CE/Leetcode-Daily",
//     live: "#",
//   },
//   {
//     title: "TTC Escape",
//     description: "Puzzle style game built for the GMTK 2025 Game Jam. Theme was 'loops'. A collaborative game development project.",
//     technologies: ["C#", "Unity", "Git"],
//     github: "https://github.com/4ppleSA0CE/GMTKgamejam",
//     live: "#",
//   },
//   {
//     title: "Blackjack Game",
//     description: "Blackjack game built with GUI in Java. Built for a take-home assignment job application.",
//     technologies: ["Java"],
//     github: "https://github.com/4ppleSA0CE/Blackjack",
//     live: "#",
//   },
//   {
//     title: "WebTyper",
//     description: "Scrapes the words from a website and displays them in a typing game. Tracks past statistics such as WPM, accuracy, and total times played.",
//     technologies: ["JavaScript", "HTML"],
//     github: "https://github.com/4ppleSA0CE/WebTyper",
//     live: "#",
//   },
//   {
//     title: "Personal Website",
//     description: "Personal website built to capture my projects and showcase my skills and growth.",
//     technologies: ["TypeScript", "HTML", "Tailwind CSS", "JavaScript"],
//     github: "https://github.com/4ppleSA0CE/4ppleSA0CE.github.io",
//     live: "https://4pplesa0ce.github.io",
//   },
// ]

export function Projects() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { threshold: 0.1 })
  // const [hoveredProject, setHoveredProject] = useState<number | null>(null)

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
              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                <div className="absolute inset-0 z-10 bg-primary/20 opacity-60 transition-opacity duration-300 group-hover:opacity-0" />
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-primary"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  {project.live && project.live !== "#" && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-primary"
                      aria-label={`View ${project.title} live site`}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Other Projects */}
        {/* <h3
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
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-primary"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  {project.live && project.live !== "#" && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-primary"
                      aria-label={`View ${project.title} live site`}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
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
        </div> */}
      </div>
    </section>
  )
}
