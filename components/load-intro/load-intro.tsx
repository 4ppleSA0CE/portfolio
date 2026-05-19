"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

const INTRO_MS = 2100
export const INTRO_EASE = "cubic-bezier(0.22, 1, 0.36, 1)"
export const INTRO_DROP_OFFSET = "translateY(-24px)"
export const INTRO_DROP_DURATION_MS = 450

export type IntroPhase = "preparing" | "running" | "complete"

type LoadIntroContextValue = {
  phase: IntroPhase
}

const LoadIntroContext = createContext<LoadIntroContextValue | null>(null)

export function introMotionStyle(
  phase: IntroPhase,
  delayMs: number,
  hiddenTransform = INTRO_DROP_OFFSET,
  durationMs = INTRO_DROP_DURATION_MS,
): React.CSSProperties {
  if (phase === "complete") {
    return { opacity: 1, transform: "translateY(0)" }
  }

  if (phase === "preparing") {
    return { opacity: 0, transform: hiddenTransform }
  }

  return {
    opacity: 1,
    transform: "translateY(0)",
    transition: `opacity ${durationMs}ms ${INTRO_EASE} ${delayMs}ms, transform ${durationMs}ms ${INTRO_EASE} ${delayMs}ms`,
  }
}

export function LoadIntroProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("preparing")

  useEffect(() => {
    const root = document.documentElement
    if (phase === "preparing") root.dataset.intro = "pending"
    else if (phase === "running") root.dataset.intro = "running"
    else root.dataset.intro = "done"
  }, [phase])

  useEffect(() => {
    setPhase("preparing")

    let doneTimer: ReturnType<typeof setTimeout> | undefined
    let raf2 = 0

    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setPhase("running")
        doneTimer = setTimeout(() => setPhase("complete"), INTRO_MS)
      })
    })

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      if (doneTimer) clearTimeout(doneTimer)
    }
  }, [])

  return (
    <LoadIntroContext.Provider value={{ phase }}>{children}</LoadIntroContext.Provider>
  )
}

export function useLoadIntro() {
  const ctx = useContext(LoadIntroContext)
  if (!ctx) {
    throw new Error("useLoadIntro must be used within LoadIntroProvider")
  }
  return ctx
}

export function IntroGate({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { phase } = useLoadIntro()
  const locked = phase !== "complete"
  return (
    <div
      className={className}
      inert={locked ? true : undefined}
      aria-busy={locked}
      style={locked ? { pointerEvents: "none" } : undefined}
    >
      {children}
    </div>
  )
}
