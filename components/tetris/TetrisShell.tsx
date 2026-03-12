"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { useTetrisMode } from "@/components/tetris/mode"
import { TetrisBackground } from "@/components/tetris/TetrisBackground"

export function TetrisShell({ children }: { children: React.ReactNode }) {
  const { mode } = useTetrisMode()
  const playOn = mode === "play"

  return (
    <div className="relative min-h-screen">
      <TetrisBackground />

      <div
        className={cn(
          "relative z-10 transition-[opacity,filter] duration-300",
          playOn ? "opacity-20 blur-[1px] saturate-50 pointer-events-none" : "opacity-100",
        )}
      >
        {children}
      </div>

      {/* Darken the foreground content when playing */}
      <div
        className={cn(
          "fixed inset-0 transition-opacity duration-300",
          playOn ? "opacity-100" : "opacity-0 pointer-events-none",
          "bg-black/55 z-20",
        )}
        aria-hidden
      />
    </div>
  )
}

