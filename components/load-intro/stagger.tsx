"use client"

import { introMotionStyle, useLoadIntro } from "@/components/load-intro/load-intro"
import { cn } from "@/lib/utils"
import type React from "react"

const STAGGER_BASE_MS = 0
const STAGGER_STEP_MS = 200

export function Stagger({
  step,
  children,
  className,
}: {
  step: number
  children: React.ReactNode
  className?: string
}) {
  const { phase } = useLoadIntro()
  const delayMs = STAGGER_BASE_MS + step * STAGGER_STEP_MS

  return (
    <div className={cn(className)} style={introMotionStyle(phase, delayMs)}>
      {children}
    </div>
  )
}
