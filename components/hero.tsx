"use client"

import { useEffect, useState } from "react"
import { Github, Linkedin, Twitter, Mail, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Mail, href: "mailto:hello@example.com", label: "Email" },
]

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="relative flex min-h-screen flex-col justify-center px-6 lg:flex-row lg:px-24">
      {/* Left Column - Name & Info */}
      <div className="flex flex-col justify-center lg:w-1/2 lg:sticky lg:top-0 lg:h-screen lg:py-24">
        <div
          className="transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
          }}
        >
          <h1 className="text-5xl font-bold tracking-tight text-foreground md:text-7xl">Alex Rivera</h1>
          <h2 className="mt-4 text-2xl font-medium text-primary md:text-3xl">Full Stack Developer</h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            I build accessible, pixel-perfect digital experiences for the web.
          </p>
        </div>

        {/* Social Links */}
        <div className="mt-12 flex gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 text-muted-foreground transition-colors duration-300 hover:text-primary"
              aria-label={social.label}
            >
              <social.icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {social.label}
              </span>
            </a>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 lg:mt-24">
          <a
            href="#about"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowDown className="h-4 w-4 animate-bounce" />
            Scroll to explore
          </a>
        </div>
      </div>

      {/* Right Column - Introduction */}
      <div className="mt-16 flex flex-col justify-center lg:mt-0 lg:w-1/2 lg:pl-16">
        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            I'm a developer passionate about crafting accessible, pixel-perfect user interfaces that blend thoughtful
            design with robust engineering.
          </p>
          <p>
            My favorite work lies at the intersection of design and development, creating experiences that not only look
            great but are meticulously built for <span className="font-medium text-foreground">performance</span> and{" "}
            <span className="font-medium text-foreground">usability</span>.
          </p>
          <p>
            Currently, I'm a Senior Developer at{" "}
            <a href="#" className="font-medium text-primary hover:underline">
              TechCorp
            </a>
            , specializing in building scalable web applications. I contribute to the creation and maintenance of UI
            components that power our platform.
          </p>
          <p>
            In my spare time, I'm usually exploring new technologies, contributing to open source, or enjoying a good
            cup of coffee while reading about the latest in web development.
          </p>
        </div>

        <div className="mt-12">
          <Button asChild className="group bg-primary text-primary-foreground hover:bg-primary/90">
            <a href="#contact">
              Get in touch
              <ArrowDown className="ml-2 h-4 w-4 rotate-[-90deg] transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
