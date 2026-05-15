"use client"

import React from "react"
import { TetrisBackground } from "@/components/tetris/TetrisBackground"

export function TetrisShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <TetrisBackground />

      <div className="relative z-10">{children}</div>
    </div>
  )
}

