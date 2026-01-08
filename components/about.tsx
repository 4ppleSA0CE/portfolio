"use client"

import { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

export function About() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { threshold: 0.2 })

  return (
    <section ref={ref} id="about" className="px-6 pt-6 pb-12 lg:px-24">
      <div
        className={cn(
          "mx-auto max-w-4xl transition-all duration-700",
          isInView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
        )}
      >
        <h2 className="mb-12 text-sm font-medium uppercase tracking-widest text-primary">About Me</h2>

        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            "Day's just started 😴"
          </p>
          <p>
          I’m Derek Wang, a Computer Engineering student at the University of Waterloo passionate about robotics and software development.
          I enjoy using software as a tool to bridge ideas and reality, especially in systems where code and hardware come together.
          </p>
          <p>
            My journey into software started in 2018 when I first programmed a robotic arm to life. Watching code translate into real, physical movement sparked my interest in building systems that extend beyond the screen. That experience shaped the way I approach engineering today.
          </p>
          <p>
            Fast-forward to today, and I’ve had the privilege of competing internationally in VEX and FIRST Robotics for over six years,
            worked on multiple student-led design teams, and learned from countless mentors.
          </p>
        </div>
      </div>
    </section>
  )
}
