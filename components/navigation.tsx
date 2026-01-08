"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
]

export function Navigation() {
  const [activeSection, setActiveSection] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const sections = navItems.map((item) => item.href.slice(1))
      const current = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 150 && rect.bottom >= 150
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed left-8 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-4 lg:flex",
        "transition-opacity duration-300",
        isScrolled ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={cn(
            "group flex items-center gap-3 text-sm font-medium uppercase tracking-widest transition-all duration-300",
            activeSection === item.href.slice(1) ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span
            className={cn(
              "h-px transition-all duration-300",
              activeSection === item.href.slice(1)
                ? "w-16 bg-primary"
                : "w-8 bg-muted-foreground group-hover:w-16 group-hover:bg-foreground",
            )}
          />
          {item.label}
        </a>
      ))}
    </nav>
  )
}
