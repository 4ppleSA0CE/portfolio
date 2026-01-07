"use client"

import type React from "react"

import { useRef, useState } from "react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Send, Github, Linkedin, Twitter } from "lucide-react"

export function Contact() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { threshold: 0.2 })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
  }

  return (
    <section ref={ref} id="contact" className="min-h-screen px-6 py-24 lg:px-24">
      <div className="mx-auto max-w-4xl">
        <div
          className={cn(
            "text-center transition-all duration-700",
            isInView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
          )}
        >
          <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">What's Next?</h2>
          <h3 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">Get In Touch</h3>
          <p className="mx-auto mb-12 max-w-lg text-lg text-muted-foreground">
            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my
            best to get back to you!
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={cn(
            "mx-auto max-w-lg space-y-6 transition-all duration-700 delay-200",
            isInView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
          )}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Name
              </label>
              <Input
                id="name"
                placeholder="Your name"
                required
                className="bg-card border-border focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                className="bg-card border-border focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium text-foreground">
              Subject
            </label>
            <Input
              id="subject"
              placeholder="What's this about?"
              required
              className="bg-card border-border focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-foreground">
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Your message..."
              rows={6}
              required
              className="bg-card border-border focus:border-primary resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                Send Message
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div
          className={cn(
            "mt-12 text-center transition-all duration-700 delay-300",
            isInView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
          )}
        >
          <p className="mb-4 text-muted-foreground">Or reach out directly</p>
          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center gap-2 text-lg font-medium text-foreground transition-colors hover:text-primary"
          >
            <Mail className="h-5 w-5" />
            hello@example.com
          </a>
        </div>

        {/* Footer */}
        <footer
          className={cn(
            "mt-24 border-t border-border pt-12 text-center transition-all duration-700 delay-400",
            isInView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
          )}
        >
          <div className="mb-6 flex justify-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="GitHub"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Twitter"
            >
              <Twitter className="h-6 w-6" />
            </a>
          </div>

          <p className="text-sm text-muted-foreground">Designed & Built by Alex Rivera</p>
          <p className="mt-1 text-sm text-muted-foreground">© {new Date().getFullYear()} All rights reserved.</p>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">Made with</p>
            <div className="flex flex-wrap justify-center items-center gap-6">
              <a
                href="https://react.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-1"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                  alt="React"
                  className="h-10 w-10 opacity-60 transition-opacity group-hover:opacity-100"
                />
                <span className="text-xs text-muted-foreground group-hover:text-primary">React</span>
              </a>
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-1"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                  alt="Next.js"
                  className="h-10 w-10 opacity-60 transition-opacity group-hover:opacity-100 invert"
                />
                <span className="text-xs text-muted-foreground group-hover:text-primary">Next.js</span>
              </a>
              <a
                href="https://www.typescriptlang.org"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-1"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
                  alt="TypeScript"
                  className="h-10 w-10 opacity-60 transition-opacity group-hover:opacity-100"
                />
                <span className="text-xs text-muted-foreground group-hover:text-primary">TypeScript</span>
              </a>
              <a
                href="https://tailwindcss.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-1"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"
                  alt="Tailwind CSS"
                  className="h-10 w-10 opacity-60 transition-opacity group-hover:opacity-100"
                />
                <span className="text-xs text-muted-foreground group-hover:text-primary">Tailwind</span>
              </a>
              <a
                href="https://ui.shadcn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-1"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card opacity-60 transition-opacity group-hover:opacity-100">
                  <span className="text-lg font-bold text-foreground">ui</span>
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-primary">shadcn/ui</span>
              </a>
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-1"
              >
                <svg
                  className="h-10 w-10 opacity-60 transition-opacity group-hover:opacity-100"
                  viewBox="0 0 76 65"
                  fill="currentColor"
                >
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                </svg>
                <span className="text-xs text-muted-foreground group-hover:text-primary">Vercel</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </section>
  )
}
