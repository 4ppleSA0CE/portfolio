"use client"

import { PIECE_COLORS } from "@/components/tetris/engine/pieces"
import { introMotionStyle, INTRO_EASE, useLoadIntro } from "@/components/load-intro/load-intro"
import { cn } from "@/lib/utils"

const CELL = 8
const T_COLOR = PIECE_COLORS.T

/** T tetromino (rotation 0): center top + full bottom row */
const T_PIECE_CELLS = [
  { x: CELL, y: 0 },
  { x: 0, y: CELL },
  { x: CELL, y: CELL },
  { x: CELL * 2, y: CELL },
] as const

export function IntroBlocks({ className }: { className?: string }) {
  const { phase } = useLoadIntro()
  const blockStyle = introMotionStyle(phase, 0, "translateY(-16px)", 400)

  return (
    <span
      aria-hidden
      className={cn("relative inline-block h-4 w-6 shrink-0", className)}
      style={{
        ...blockStyle,
        opacity: phase === "complete" ? 0.4 : blockStyle.opacity,
        transition:
          phase === "running"
            ? `${blockStyle.transition}, opacity 300ms ${INTRO_EASE} 500ms`
            : blockStyle.transition,
      }}
    >
      {T_PIECE_CELLS.map((cell, i) => (
        <span
          key={i}
          className="absolute rounded-[1px]"
          style={{
            left: cell.x,
            top: cell.y,
            width: CELL - 1,
            height: CELL - 1,
            backgroundColor: T_COLOR,
          }}
        />
      ))}
    </span>
  )
}
