"use client"

import { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

export function Contact() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { threshold: 0.2 })

  const socialLinks = [
    { platform: "GitHub", username: "@4ppleSA0CE", url: "https://github.com/4ppleSA0CE" },
    { platform: "Instagram", username: "@derekwank", url: "https://www.instagram.com/derekwank/" },
    { platform: "X", username: "@4derekwang", url: "https://x.com/4derekwang" },
    { platform: "LinkedIn", username: "4derekwang", url: "https://www.linkedin.com/in/4derekwang/" },
  ]

  return (
    <section ref={ref} id="contact" className="px-6 py-24 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div
          className={cn(
            "grid gap-12 transition-all duration-700 lg:grid-cols-2",
            isInView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
          )}
        >
          {/* Left Section: Let's Connect */}
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-foreground md:text-6xl lg:text-7xl">Let's Connect</h2>
            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              Always available to talk.
            </p>
            <a
              href="mailto:dj4wang@uwaterloo.ca"
              className="inline-flex items-center gap-2 text-lg font-medium text-foreground transition-colors hover:text-primary"
            >
              dj4wang@uwaterloo.ca
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>

          {/* Right Section: ELSEWHERE */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">ELSEWHERE</h3>
            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:border-primary hover:bg-accent",
                    isInView
                      ? "translate-y-0 opacity-100"
                      : "translate-y-12 opacity-0",
                  )}
                  style={{
                    transitionDelay: `${300 + index * 100}ms`,
                  }}
                >
                  <div className="space-y-1">
                    <div className="text-base font-medium text-foreground">{link.platform}</div>
                    <div className="text-sm text-muted-foreground">{link.username}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer
          className={cn(
            "mt-24 text-center transition-all duration-700 delay-400",
            isInView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
          )}
        >
          <div className="border-t border-border pt-12 pb-8 border-b">
            <p className="text-sm text-muted-foreground">Designed & Built by Derek Wang</p>
            <div className="mt-6">
              <p className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground opacity-70">MADE WITH</p>
              <div className="flex flex-wrap justify-center items-center gap-4">
                <a
                  href="https://react.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1 transition-transform hover:-translate-y-1"
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                    alt="React"
                    className="h-6 w-6 opacity-50 transition-opacity group-hover:opacity-70"
                  />
                  <span className="text-[10px] text-muted-foreground opacity-60 group-hover:opacity-80">React</span>
                </a>
                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1 transition-transform hover:-translate-y-1"
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                    alt="Next.js"
                    className="h-6 w-6 opacity-50 transition-opacity group-hover:opacity-70 invert"
                  />
                  <span className="text-[10px] text-muted-foreground opacity-60 group-hover:opacity-80">Next.js</span>
                </a>
                <a
                  href="https://www.typescriptlang.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1 transition-transform hover:-translate-y-1"
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
                    alt="TypeScript"
                    className="h-6 w-6 opacity-50 transition-opacity group-hover:opacity-70"
                  />
                  <span className="text-[10px] text-muted-foreground opacity-60 group-hover:opacity-80">TypeScript</span>
                </a>
                <a
                  href="https://tailwindcss.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1 transition-transform hover:-translate-y-1"
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"
                    alt="Tailwind CSS"
                    className="h-6 w-6 opacity-50 transition-opacity group-hover:opacity-70"
                  />
                  <span className="text-[10px] text-muted-foreground opacity-60 group-hover:opacity-80">Tailwind</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  )
}
