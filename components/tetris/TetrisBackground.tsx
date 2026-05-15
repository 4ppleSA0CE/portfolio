"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useTetrisMode } from "@/components/tetris/mode"
import { TetrisEngine } from "@/components/tetris/engine/engine"
import type { EngineSnapshot, Input, PieceType } from "@/components/tetris/engine/types"
import { PIECE_COLORS, SHAPES } from "@/components/tetris/engine/pieces"
import type { Rotation } from "@/components/tetris/engine/types"

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  )
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduced(mql.matches)
    onChange()
    mql.addEventListener?.("change", onChange)
    return () => mql.removeEventListener?.("change", onChange)
  }, [])
  return reduced
}

export function TetrisBackground() {
  const { mode, setMode } = useTetrisMode()
  const reducedMotion = usePrefersReducedMotion()

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const pressedRef = useRef<Set<string>>(new Set())
  const lastHorizRef = useRef<-1 | 1 | null>(null)
  const dasMsRef = useRef(0)
  const arrMsRef = useRef(0)
  const [snapshot, setSnapshot] = useState<EngineSnapshot | null>(null)

  const engine = useMemo(() => {
    // Create once per mount.
    const e = new TetrisEngine()
    return e
  }, [])

  // Toggle: when entering play, blur focused inputs.
  useEffect(() => {
    if (mode === "play") {
      const el = document.activeElement
      if (el instanceof HTMLElement) el.blur()
    }
  }, [mode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = (s: EngineSnapshot) => {
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      const w = window.innerWidth
      const h = window.innerHeight

      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      ctx.clearRect(0, 0, w, h)

      const boardW = s.width
      const boardH = s.height

      // Board sizing: keep centered and playable even behind content.
      const maxBoardPxW = Math.min(w * 0.52, 520)
      const maxBoardPxH = Math.min(h * 0.78, 780)
      const cell = Math.max(10, Math.floor(Math.min(maxBoardPxW / boardW, maxBoardPxH / boardH)))

      const pxW = cell * boardW
      const pxH = cell * boardH
      const offsetX = Math.floor((w - pxW) / 2)
      const offsetY = Math.floor((h - pxH) / 2)

      const alphaBase = mode === "play" ? 0.42 : 0.22
      const gridAlpha = mode === "play" ? 0.22 : 0.12
      const ghostAlpha = mode === "play" ? 0.18 : 0.1

      // Subtle background plate behind the board.
      ctx.fillStyle = `rgba(0, 0, 0, ${document.documentElement.classList.contains("dark") ? 0.18 : 0.06})`
      roundRect(ctx, offsetX - 10, offsetY - 10, pxW + 20, pxH + 20, 18)
      ctx.fill()

      // Grid
      ctx.strokeStyle = `rgba(127, 127, 127, ${gridAlpha})`
      ctx.lineWidth = 1
      for (let x = 0; x <= boardW; x++) {
        const gx = offsetX + x * cell + 0.5
        ctx.beginPath()
        ctx.moveTo(gx, offsetY)
        ctx.lineTo(gx, offsetY + pxH)
        ctx.stroke()
      }
      for (let y = 0; y <= boardH; y++) {
        const gy = offsetY + y * cell + 0.5
        ctx.beginPath()
        ctx.moveTo(offsetX, gy)
        ctx.lineTo(offsetX + pxW, gy)
        ctx.stroke()
      }

      const drawCell = (bx: number, by: number, color: string, alpha: number) => {
        const x = offsetX + bx * cell
        const y = offsetY + by * cell
        ctx.fillStyle = hexToRgba(color, alpha)
        ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2)
      }

      // Locked cells (visible rows only).
      const startY = s.hiddenRows
      for (let y = startY; y < s.board.length; y++) {
        for (let x = 0; x < boardW; x++) {
          const v = s.board[y][x]
          if (v) drawCell(x, y - startY, PIECE_COLORS[v], alphaBase)
        }
      }

      // Ghost
      drawPiece(drawCell, s.ghost, startY, ghostAlpha)
      // Active
      drawPiece(drawCell, s.active, startY, Math.min(0.75, alphaBase + 0.18))

      if (s.isGameOver) {
        ctx.fillStyle = `rgba(0,0,0,${document.documentElement.classList.contains("dark") ? 0.35 : 0.18})`
        ctx.fillRect(offsetX, offsetY, pxW, pxH)
        ctx.fillStyle = document.documentElement.classList.contains("dark")
          ? "rgba(255,255,255,0.85)"
          : "rgba(0,0,0,0.75)"
        ctx.font = `600 ${Math.max(16, Math.floor(cell * 0.9))}px system-ui, -apple-system, Segoe UI, sans-serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("Game Over", offsetX + pxW / 2, offsetY + pxH / 2 - cell * 0.6)
        ctx.font = `500 ${Math.max(12, Math.floor(cell * 0.45))}px system-ui, -apple-system, Segoe UI, sans-serif`
        ctx.fillText("Press R to restart", offsetX + pxW / 2, offsetY + pxH / 2 + cell * 0.2)
      }
    }

    const tick = (ts: number) => {
      const last = lastTsRef.current ?? ts
      const rawDt = ts - last
      lastTsRef.current = ts

      // Clamp to avoid huge dt on tab switch.
      const dt = Math.min(50, Math.max(0, rawDt))

      const pressed = pressedRef.current
      const leftHeld = pressed.has("ArrowLeft")
      const rightHeld = pressed.has("ArrowRight")

      const wantDir: -1 | 1 | null = (() => {
        if (leftHeld && rightHeld) return lastHorizRef.current
        if (leftHeld) return -1
        if (rightHeld) return 1
        return null
      })()

      if (wantDir === null) {
        lastHorizRef.current = null
        dasMsRef.current = 0
        arrMsRef.current = 0
      } else {
        dasMsRef.current += dt

        // Immediate step handled on keydown. After DAS, repeat every ARR.
        const DAS = 130
        const ARR = 35
        if (dasMsRef.current >= DAS) {
          arrMsRef.current += dt
          while (arrMsRef.current >= ARR) {
            arrMsRef.current -= ARR
            engine.step(0, { moveX: wantDir })
          }
        }
      }

      const input: Input = {
        softDrop: pressed.has("ArrowDown"),
      }

      engine.step(dt, input)

      const s = engine.getSnapshot()
      setSnapshot(s)
      draw(s)

      if (reducedMotion) {
        // Render at ~30fps max.
        timeoutRef.current = window.setTimeout(() => {
          rafRef.current = requestAnimationFrame(tick)
        }, 1000 / 30)
      } else {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine, mode, reducedMotion])

  useEffect(() => {
    if (mode !== "play") {
      pressedRef.current.clear()
      lastHorizRef.current = null
      dasMsRef.current = 0
      arrMsRef.current = 0
      return
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return

      const key = e.code
      const pressed = pressedRef.current
      if (e.repeat) {
        // We implement our own repeat (DAS/ARR) so rotations remain responsive.
        // Ignore OS key repeat events to avoid double-stepping.
        return
      }

      // Capture keys only in play mode.
      if (
        key === "ArrowLeft" ||
        key === "ArrowRight" ||
        key === "ArrowDown" ||
        key === "ArrowUp" ||
        key === "Space" ||
        key === "KeyZ" ||
        key === "KeyX" ||
        key === "KeyA" ||
        key === "KeyC" ||
        key === "ShiftLeft" ||
        key === "ShiftRight" ||
        key === "KeyR"
      ) {
        e.preventDefault()
      }

      if (key === "ArrowDown") pressed.add("ArrowDown")

      if (key === "ArrowLeft") {
        pressed.add("ArrowLeft")
        lastHorizRef.current = -1
        dasMsRef.current = 0
        arrMsRef.current = 0
        engine.step(0, { moveX: -1 })
      }
      if (key === "ArrowRight") {
        pressed.add("ArrowRight")
        lastHorizRef.current = 1
        dasMsRef.current = 0
        arrMsRef.current = 0
        engine.step(0, { moveX: 1 })
      }

      if (key === "ArrowUp" || key === "KeyX") engine.step(0, { rotate: "cw" })
      if (key === "KeyZ") engine.step(0, { rotate: "ccw" })
      if (key === "KeyA") engine.step(0, { rotate180: true })

      if (key === "Space") engine.step(0, { hardDrop: true })

      if (key === "KeyC" || key === "ShiftLeft" || key === "ShiftRight") engine.step(0, { hold: true })

      if (key === "KeyR") engine.step(0, { restart: true })
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown") pressedRef.current.delete("ArrowDown")
      if (e.code === "ArrowLeft") pressedRef.current.delete("ArrowLeft")
      if (e.code === "ArrowRight") pressedRef.current.delete("ArrowRight")
    }

    window.addEventListener("keydown", onKeyDown, { passive: false })
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [engine, mode])

  const playOn = mode === "play"

  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none",
        "transition-opacity duration-300",
        playOn ? "opacity-100 z-40" : "opacity-90 z-0",
      )}
      aria-hidden
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className={cn("pointer-events-none fixed bottom-8 left-8 hidden gap-3 md:flex", playOn ? "z-50" : "z-0")}>
        <Hud snapshot={snapshot} />
      </div>
    </div>
  )
}

function Hud({ snapshot }: { snapshot: EngineSnapshot | null }) {
  if (!snapshot) return null

  const clearLabel =
    snapshot.lastClear.kind === "none"
      ? null
      : snapshot.lastClear.kind.replaceAll("-", " ").toUpperCase()

  return (
    <div
      className={cn(
        "rounded-xl border border-border/40 bg-background/45 backdrop-blur-sm",
        "px-4 py-3 text-xs text-muted-foreground",
      )}
    >
      <div className="flex items-start gap-4">
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-foreground/80">
            Hold
          </div>
          <MiniPiece type={snapshot.hold} />
        </div>

        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-foreground/80">
            Next
          </div>
          <div className="space-y-2">
            {snapshot.next.slice(0, 5).map((t, idx) => (
              <MiniPiece key={`${t}-${idx}`} type={t} />
            ))}
          </div>
        </div>

        <div className="min-w-28 space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground/80">
              Lines
            </span>
            <span className="text-sm font-semibold text-foreground">{snapshot.lines}</span>
          </div>

          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground/80">
              Combo
            </span>
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {snapshot.combo > 0 ? snapshot.combo : ""}
            </span>
          </div>

          {clearLabel ? (
            <div className="pt-1 text-[10px] font-semibold uppercase tracking-widest text-foreground/70">
              {clearLabel}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
        <span className="text-foreground/70">←/→</span>
        <span>Move</span>
        <span className="text-foreground/70">↓</span>
        <span>Soft</span>
        <span className="text-foreground/70">Space</span>
        <span>Drop</span>
        <span className="text-foreground/70">Z/X/↑</span>
        <span>Rotate</span>
        <span className="text-foreground/70">A</span>
        <span>180</span>
        <span className="text-foreground/70">C/Shift</span>
        <span>Hold</span>
        <span className="text-foreground/70">R</span>
        <span>Restart</span>
      </div>
    </div>
  )
}

function MiniPiece({ type }: { type: PieceType | null }) {
  const size = 4
  const rawCells = type ? SHAPES[type][0] : []

  // Normalize shape to top-left of the 4x4 preview grid so tetrominos
  // appear left-aligned instead of floating in the middle.
  let occupied: Set<string>
  if (rawCells.length === 0) {
    occupied = new Set()
  } else {
    let minX = Infinity
    let minY = Infinity
    for (const c of rawCells) {
      if (c.x < minX) minX = c.x
      if (c.y < minY) minY = c.y
    }
    const norm = rawCells.map((c) => ({ x: c.x - minX, y: c.y - minY }))
    occupied = new Set(norm.map((c) => `${c.x},${c.y}`))
  }

  const color = type ? PIECE_COLORS[type] : "#000000"

  return (
    <div className="grid grid-cols-4 gap-[2px] rounded-md p-[6px]">
      {Array.from({ length: size * size }, (_, i) => {
        const x = i % size
        const y = Math.floor(i / size)
        const on = occupied.has(`${x},${y}`)
        return (
          <div
            key={i}
            className="h-2.5 w-2.5 rounded-[2px]"
            style={{
              backgroundColor: on ? hexToRgba(color, 0.7) : "transparent",
            }}
          />
        )
      })}
    </div>
  )
}

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "").trim()
  const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function drawPiece(
  drawCell: (x: number, y: number, color: string, alpha: number) => void,
  piece: { type: PieceType; rotation: Rotation; pos: { x: number; y: number } },
  hiddenRows: number,
  alpha: number,
) {
  const cells = SHAPES[piece.type][piece.rotation]
  for (const c of cells) {
    const x = piece.pos.x + c.x
    const y = piece.pos.y + c.y - hiddenRows
    if (y >= 0) drawCell(x, y, PIECE_COLORS[piece.type], alpha)
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

