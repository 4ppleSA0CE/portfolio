"use client"

import { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

const skills = ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "PostgreSQL", "Tailwind CSS"]

export function About() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { threshold: 0.2 })

  return (
    <section ref={ref} id="about" className="min-h-screen px-6 py-24 lg:px-24">
      <div
        className={cn(
          "mx-auto max-w-4xl transition-all duration-700",
          isInView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
        )}
      >
        <h2 className="mb-12 text-sm font-medium uppercase tracking-widest text-primary">About Me</h2>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              Hello! I'm Alex, a full-stack developer based in San Francisco. I enjoy creating things that live on the
              internet, whether that be websites, applications, or anything in between.
            </p>
            <p>
              My journey into web development started back in 2015 when I decided to try editing custom Tumblr themes —
              turns out hacking together a custom reblog button taught me a lot about HTML & CSS!
            </p>
            <p>
              Fast-forward to today, and I've had the privilege of working at a start-up, a huge corporation, and a
              student-led design studio. My main focus these days is building accessible, inclusive products.
            </p>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-medium text-foreground">Technologies I work with</h3>
            <ul className="grid grid-cols-2 gap-3">
              {skills.map((skill, index) => (
                <li
                  key={skill}
                  className={cn(
                    "flex items-center gap-2 text-muted-foreground transition-all duration-500",
                    isInView ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
