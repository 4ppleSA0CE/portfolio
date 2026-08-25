"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Hero } from "@/components/hero"
import { IntroBlocks } from "@/components/load-intro/intro-blocks"
import { IntroGate } from "@/components/load-intro/load-intro"
import { Stagger } from "@/components/load-intro/stagger"
import { useTetrisMode } from "@/components/tetris/mode"
import { Typewriter } from "@/components/typewriter"
import { cn } from "@/lib/utils"
import { Github, Linkedin, FileText } from "lucide-react"

const namePhrases = [
  "robotics",
  "competitive programming",
  "tetris",
  "mcdonald's",
  "sleeping"
] as const

const projectSnapshots = [
  {
    title: "7-DOF Arm",
    meta: "Screw-theory kinematics library, real-time MuJoCo sim, browser dashboard",
    href: "https://github.com/4ppleSA0CE/7-DOF-Arm",
  },
  {
    title: "Silhouette",
    meta: "Cursor for fashion",
    href: "https://github.com/Rababb-P/Silhouette",
  },
  {
    title: "Floaty",
    meta: "MCP copilot with 68 tools for Float Financial",
    href: "https://github.com/Parsa1ll/floaty",
  },
  {
    title: "Reparo",
    meta: "AI repair assistant",
    href: "https://github.com/Karan-Gupta07/RepairBOT",
  },
  {
    title: "GitHub Repo Analyzer",
    meta: "Understand any repo in minutes",
    href: "https://github.com/4ppleSA0CE/Github-Repo-Analyzer",
  },
  
  {
    title: "Autonomous Vehicle Control System",
    meta: "LiDAR navigation (ROS2)",
    href: "https://github.com/4ppleSA0CE/Autonomous-Vehicle-Control-System",
  },
]

const experienceSnapshots = [
  {
    role: "Software Engineer Intern",
    place: "Prandtl Dynamics Inc.",
    period: "May 2026 – Present",
    href: "https://prandtldynamics.com/",
  },
  {
    role: "Software Engineer Intern",
    place: "Kenoxis Technologies INC",
    period: "Mar 2026 – Present",
  },
  {
    role: "Autonomous Self Driving Software Engineer",
    place: "WATonomous",
    period: "Sept 2025 – Present",
    href: "https://www.watonomous.ca/",
  },
  {
    role: "Autonomy Developer",
    place: "Waterloo Aerial Robotics Group",
    period: "Sept 2025 – Feb 2026",
    href: "https://www.uwarg.com/",
  },
  {
    role: "Robotics Programmer",
    place: "Checkmate Robotics / VEX",
    period: "Jan 2024 – Dec 2025",
  },
]

export default function Home() {
  const { mode, toggle } = useTetrisMode()
  const playing = mode === "play"

  return (
    <IntroGate>
      <main className="relative h-screen bg-background/85 text-foreground overflow-hidden">
        <ThemeToggle />
        <div className="relative z-10 mx-auto flex h-full max-w-[720px] flex-col justify-center px-6 py-6 md:py-8 gap-7">
          <Stagger step={6}>
            <header className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground/80">
              <button
                type="button"
                onClick={toggle}
                title={playing ? "Click to exit Tetris" : undefined}
                className={cn(
                  "group inline-flex items-center gap-2 transition-colors",
                  playing
                    ? "text-foreground hover:text-foreground"
                    : "text-muted-foreground/70 hover:text-foreground",
                )}
              >
                <IntroBlocks className="mr-1" />
                <span className="text-[13px] font-semibold">Derek Wang</span>
                <span className="text-[11px] font-bold text-muted-foreground/70">loves</span>
                <Typewriter
                  className="text-[11px] font-bold text-muted-foreground/70"
                  phrases={namePhrases}
                />
                {playing ? (
                  <span className="text-[9px] font-medium normal-case tracking-normal text-muted-foreground">
                    Exit
                  </span>
                ) : null}
              </button>
            </header>
          </Stagger>

          <div
            className={cn(
              "flex flex-col gap-7 transition-[opacity,filter] duration-300",
              playing && "opacity-20 blur-[1px] saturate-50",
            )}
          >
            <Stagger step={5}>
              <Hero />
            </Stagger>

            <section className="flex flex-col gap-8 text-[13px] text-muted-foreground leading-relaxed">
              <section id="projects" className="space-y-4">
                <Stagger step={4}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
                    Projects
                  </p>
                </Stagger>
                <Stagger step={3}>
                  <ul className="space-y-2">
                    {projectSnapshots.map((project) => (
                      <li key={project.title} className="flex gap-2.5">
                        <span className="mt-[6px] h-px w-6 flex-none bg-muted-foreground/60" />
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group"
                        >
                          <p className="text-sm font-medium text-foreground group-hover:underline underline-offset-4">
                            {project.title}{" "}
                            <span className="font-normal text-muted-foreground/90">
                              — {project.meta}
                            </span>
                          </p>
                        </a>
                      </li>
                    ))}
                  </ul>
                </Stagger>
              </section>

              <section id="experience" className="space-y-4">
                <Stagger step={2}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
                    Experience
                  </p>
                </Stagger>
                <Stagger step={1}>
                  <ul className="space-y-2">
                    {experienceSnapshots.map((exp) => {
                      const line = (
                        <p
                          className={cn(
                            "text-sm font-medium text-foreground underline-offset-4",
                            exp.href && "group-hover:underline",
                          )}
                        >
                          {exp.role}{" "}
                          <span className="font-normal text-muted-foreground/90">
                            — {exp.place}, {exp.period}
                          </span>
                        </p>
                      )
                      return (
                        <li key={`${exp.role}-${exp.place}`} className="flex gap-2.5">
                          <span className="mt-[6px] h-px w-6 flex-none bg-muted-foreground/60" />
                          {exp.href ? (
                            <a
                              href={exp.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group"
                            >
                              {line}
                            </a>
                          ) : (
                            <div className="group">{line}</div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </Stagger>
              </section>
            </section>

            <Stagger step={0}>
              <footer className="border-t border-border/60 pt-4 text-[10px] text-muted-foreground/70">
                <div className="flex flex-wrap items-center justify-between gap-2">
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
            </Stagger>
          </div>
        </div>
      </main>
    </IntroGate>
  )
}
