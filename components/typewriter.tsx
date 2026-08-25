"use client"

import { useEffect, useMemo, useState } from "react"

const TYPE_MS = 80
const BACK_MS = 30
const HOLD_MS = 2200

export function Typewriter({ phrases: rawPhrases, className }: { phrases: readonly string[]; className?: string }) {
  const phrases = useMemo(() => rawPhrases.filter((p) => p.trim().length > 0), [rawPhrases])
  const [text, setText] = useState(phrases[0] ?? "")

  useEffect(() => {
    if (phrases.length < 2) return

    let index = 0
    let timer = 0

    const schedule = (fn: () => void, ms: number) => {
      timer = window.setTimeout(fn, ms)
    }

    const type = (current: string) => {
      const full = phrases[index] ?? ""
      if (current.length >= full.length) {
        schedule(() => backspace(full), HOLD_MS)
        return
      }
      const next = full.slice(0, current.length + 1)
      setText(next)
      schedule(() => type(next), TYPE_MS)
    }

    const backspace = (current: string) => {
      if (current.length === 0) {
        index = (index + 1) % phrases.length
        schedule(() => type(""), TYPE_MS)
        return
      }
      const next = current.slice(0, -1)
      setText(next)
      schedule(() => backspace(next), BACK_MS)
    }

    schedule(() => backspace(phrases[0] ?? ""), HOLD_MS)
    return () => window.clearTimeout(timer)
  }, [phrases])

  return (
    <span className={className}>
      {text}
      <span aria-hidden className="typing-cursor">
        █
      </span>
    </span>
  )
}
