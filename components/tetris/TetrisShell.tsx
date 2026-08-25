"use client"

import React from "react"
import { LoadIntroProvider } from "@/components/load-intro/load-intro"
import { BotBackground } from "@/components/tetris/BotBackground"

export function TetrisShell({ children }: { children: React.ReactNode }) {
  return (
    <LoadIntroProvider>
      <div className="relative min-h-screen">
        <BotBackground />

        <div className="relative z-10">{children}</div>
      </div>
    </LoadIntroProvider>
  )
}
