"use client"

import React, { createContext, useContext, useMemo, useState } from "react"

export type TetrisMode = "browse" | "play"

type TetrisModeContextValue = {
  mode: TetrisMode
  setMode: (mode: TetrisMode) => void
  toggle: () => void
}

const TetrisModeContext = createContext<TetrisModeContextValue | null>(null)

export function TetrisModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<TetrisMode>("browse")

  const value = useMemo<TetrisModeContextValue>(() => {
    return {
      mode,
      setMode,
      toggle: () => setMode((m) => (m === "browse" ? "play" : "browse")),
    }
  }, [mode])

  return <TetrisModeContext.Provider value={value}>{children}</TetrisModeContext.Provider>
}

export function useTetrisMode() {
  const ctx = useContext(TetrisModeContext)
  if (!ctx) throw new Error("useTetrisMode must be used within TetrisModeProvider")
  return ctx
}

