"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Hero } from "@/components/hero"
import { useTetrisMode } from "@/components/tetris/mode"
import { Github, Linkedin, FileText } from "lucide-react"

const projectSnapshots = [
  {
    title: "Silhouette",
    meta: "Cursor for fashion",
    href: "https://github.com/Rababb-P/Silhouette",
  },
  {
    title: "Reparo",
    meta: "AI repair assistant",
    href: "https://github.com/Karan-Gupta07/RepairBOT",
  },
  {
    title: "Hierarchical Reasoning Retrieval",
    meta: "Structured LLM document search",
    href: "https://github.com/4ppleSA0CE/Hierarchical-Reasoning-Retrieval",
  },
  {
    title: "Coffee Chat Scheduler",
    meta: "Book a chat (Calendar sync)",
    href: "https://github.com/4ppleSA0CE/coffee-chat-scheduler",
  },
  {
    title: "Autonomous Vehicle Control System",
    meta: "LiDAR navigation (ROS2)",
    href: "https://github.com/4ppleSA0CE/Autonomous-Vehicle-Control-System",
  },
]

const experienceSnapshots = [
  {
    role: "Autonomous Self Driving Software Engineer",
    place: "WATonomous",
    period: "2025 — Present",
    href: "https://www.watonomous.ca/",
  },
  {
    role: "Autonomy Developer",
    place: "Waterloo Aerial Robotics Group",
    period: "2025 — 2026",
    href: "https://www.uwarg.com/",
  },
  {
    role: "Robotics Programmer",
    place: "Checkmate Robotics / VEX",
    period: "2024 — 2025",
    href: "https://www.robotevents.com/teams/V5RC/16868C",
  },
]

export default function Home() {
  const { mode, toggle } = useTetrisMode()
  const playing = mode === "play"

  return (
    <main className="relative h-screen bg-background/85 text-foreground overflow-hidden">
      <ThemeToggle />
      <div className="relative z-10 mx-auto flex h-full max-w-[880px] flex-col justify-center px-6 py-8 md:py-10 gap-8">
        <header className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground/80">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex items-center text-muted-foreground/70 hover:text-foreground transition-colors"
          >
            <span className="text-xs font-semibold">Derek Wang</span>
          </button>
          <nav className="flex gap-5">
            <a href="#projects" className="hover:text-foreground transition-colors">
              Projects
            </a>
            <a href="#experience" className="hover:text-foreground transition-colors">
              Experience
            </a>
          </nav>
        </header>

        <Hero />

        <section className="flex flex-col gap-10 text-xs text-muted-foreground">
          <section id="projects" className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground/70">
              Projects
            </p>
            <ul className="space-y-2">
              {projectSnapshots.map((project) => (
                <li key={project.title} className="flex gap-3">
                  <span className="mt-[7px] h-px w-6 flex-none bg-muted-foreground/60" />
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <p className="text-sm font-medium text-foreground group-hover:underline underline-offset-4">
                      {project.title}{" "}
                      <span className="font-normal text-muted-foreground/90">— {project.meta}</span>
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section id="experience" className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground/70">
              Experience
            </p>
            <ul className="space-y-2">
              {experienceSnapshots.map((exp) => (
                <li key={`${exp.role}-${exp.place}`} className="flex gap-3">
                  <span className="mt-[7px] h-px w-6 flex-none bg-muted-foreground/60" />
                  <a
                    href={exp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <p className="text-sm font-medium text-foreground group-hover:underline underline-offset-4">
                      {exp.role}{" "}
                      <span className="font-normal text-muted-foreground/90">
                        — {exp.place}, {exp.period}
                      </span>
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </section>

        <footer className="border-t border-border/60 pt-4 text-[10px] text-muted-foreground/70">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} Derek Wang</p>
            <div className="flex gap-2 text-[11px]">
              <a
                href="https://github.com/4ppleSA0CE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-border/60 p-2 text-muted-foreground hover:text-foreground hover:border-foreground/70 transition-colors"
                aria-label="GitHub"
                title="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/4derekwang/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-border/60 p-2 text-muted-foreground hover:text-foreground hover:border-foreground/70 transition-colors"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="/resume_derek_wang.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-border/60 p-2 text-muted-foreground hover:text-foreground hover:border-foreground/70 transition-colors"
                aria-label="Résumé"
                title="Résumé"
              >
                <FileText className="h-4 w-4" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
