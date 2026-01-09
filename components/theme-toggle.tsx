"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = () => {
    setIsFading(true)
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark")
      setTimeout(() => {
        setIsFading(false)
      }, 300)
    }, 150)
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed right-8 top-8 z-50 h-10 w-10 rounded-full",
          "bg-background/80 backdrop-blur-sm border border-border/50",
          "hover:bg-muted transition-all duration-300"
        )}
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn(
        "fixed right-8 top-8 z-50 h-10 w-10 rounded-full",
        "bg-background/80 backdrop-blur-sm border border-border/50",
        "hover:bg-muted transition-all duration-300",
        "opacity-70 hover:opacity-100"
      )}
      aria-label="Toggle theme"
    >
      <div className={cn(
        "transition-opacity duration-150 ease-in-out",
        isFading ? "opacity-0 scale-90" : "opacity-100 scale-100"
      )}>
        {theme === "dark" ? (
          <Sun className="h-4 w-4 transition-transform duration-300 hover:rotate-180" />
        ) : (
          <Moon className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
        )}
      </div>
    </Button>
  )
}

