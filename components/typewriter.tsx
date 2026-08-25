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

    let raf = 0
    let index = 0
    let len = (phrases[0] ?? "").length
    let mode: "hold" | "back" | "type" = "hold"
    let due = performance.now() + HOLD_MS

    const step = () => {
      const full = phrases[index] ?? ""
      if (mode === "hold") {
        mode = "back"
        due += BACK_MS
      } else if (mode === "back") {
        if (len > 0) {
          len -= 1
          due += BACK_MS
        } else {
          index = (index + 1) % phrases.length
          mode = "type"
          due += TYPE_MS
        }
      } else if (len < full.length) {
        len += 1
        due += TYPE_MS
      } else {
        mode = "hold"
        due += HOLD_MS
      }
    }

    const tick = (now: number) => {
      if (now - due > 1000) due = now
      while (now >= due) step()
      setText((phrases[index] ?? "").slice(0, len))
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
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
