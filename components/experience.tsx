"use client"

import { useRef, useState } from "react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { ExternalLink } from "lucide-react"

const experiences = [
  {
    period: "Sep 2025 — Present",
    title: "Autonomous Self Driving Software Engineer",
    company: "WATonomous",
    companyUrl: "https://www.watonomous.ca/",
    description:
      "Autonomous Rovers in collab with UWaterloo Robotics Team(UWRT). Developing perception and navigation systems for autonomous vehicles.",
    technologies: ["C++", "ROS2", "Docker", "CMake", "Foxglove"],
  },
  {
    period: "Aug 2025 — Present",
    title: "Autonomy Developer",
    company: "Waterloo Aerial Robotics Group",
    companyUrl: "https://www.uwarg.com/",
    description:
      "Hardware in the Loop(HITL) Simulation. Working on autonomous systems development and testing in simulated environments.",
    technologies: ["Python", "MAVLink"],
  },
  {
    period: "Mar 2024 — Aug 2025",
    title: "Youth Badminton Instructor",
    company: "City of Richmond Hill",
    companyUrl: "https://www.richmondhill.ca/",
    description:
      "Taught Badminton @ Rouge Woods & Richvale Community Centers. Instructed youth in badminton fundamentals and techniques.",
    technologies: [],
  },
  {
    period: "Sep 2024 — Jun 2025",
    title: "Robotics Software Programmer - VEX Robotics Competition",
    company: "Checkmate Robotics Club",
    companyUrl: "#",
    description:
      "Coded routes for 16868C Rushdown Robotics, 5/80 in Ontario Provs Skills, Invited to 2025 V5RC Worlds. Developed autonomous navigation and control systems for competition robots.",
    technologies: ["C++", "PID Controllers", "Odometry"],
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
          href="/resume_derek_wang.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-flex items-center gap-2 text-lg font-medium text-foreground transition-colors hover:text-primary"
        >
          View Full Résumé
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </section>
  )
}
