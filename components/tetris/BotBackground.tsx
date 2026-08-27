"use client"

import React, { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useTetrisMode } from "@/components/tetris/mode"
import { createTetrisBot, type Snapshot, type TetrisBot } from "@/lib/tetris-bot"
import { getPieceCells } from "@/lib/tetris-bot/layout"

const VISIBLE_ROWS = 20
const BOARD_COLS = 10
const PPS_KEY = "tetris:pps"
const PPS_MIN = 0.1
const PPS_MAX = 5
const PPS_DEFAULT = 3

const PIECE_COLORS = [
  "#60a5fa",
  "#38bdf8",
  "#fb923c",
  "#fbbf24",
  "#34d399",
  "#a78bfa",
  "#fb7185",
] as const

function clampPps(v: number) {
  if (!Number.isFinite(v)) return PPS_DEFAULT
  return Math.min(PPS_MAX, Math.max(PPS_MIN, Math.round(v * 10) / 10))
}

function loadPps() {
  if (typeof window === "undefined") return PPS_DEFAULT
  try {
    const raw = window.localStorage.getItem(PPS_KEY)
    if (!raw) return PPS_DEFAULT
    return clampPps(Number(raw))
  } catch {
    return PPS_DEFAULT
  }
}

function randomSeed() {
  return (Math.random() * 0x7fffffff) | 0
}

type Stats = {
  hold: number
  queue: number[]
  lines: number
  pieces: number
  attack: number
  b2b: number
  combo: number
}

function readStats(snap: Snapshot): Stats {
  return {
    hold: snap.holdPiece,
    queue: Array.from(snap.queue),
    lines: snap.linesCleared,
    pieces: snap.piecesPlaced,
    attack: snap.attackSent,
    b2b: snap.b2bCount,
    combo: snap.comboCount,
  }
}

export function BotBackground() {
  const { mode } = useTetrisMode()
  const playOn = mode === "play"

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const botRef = useRef<TetrisBot | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const virtualMsRef = useRef(0)
  const ppsRef = useRef(PPS_DEFAULT)
  const modeRef = useRef(mode)
  const lastPiecesRef = useRef(-1)

  const [pps, setPps] = useState(PPS_DEFAULT)
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    const stored = loadPps()
    ppsRef.current = stored
    setPps(stored)
    botRef.current?.setPPS(Math.max(1, stored))
  }, [])

  useEffect(() => {
    if (!playOn) return
    const bot = botRef.current
    if (!bot) return
    const snap = bot.snapshot()
    lastPiecesRef.current = snap.piecesPlaced
    setStats(readStats(snap))
  }, [playOn])

  const applyPps = (value: number) => {
    const v = clampPps(value)
    ppsRef.current = v
    setPps(v)
    botRef.current?.setPPS(Math.max(1, v))
    try {
      window.localStorage.setItem(PPS_KEY, String(v))
    } catch {}
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let disposed = false

    const render = (snap: Snapshot) => {
      const playing = modeRef.current === "play"
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      const w = window.innerWidth
      const h = window.innerHeight

      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const isDark = document.documentElement.classList.contains("dark")
      const margin = 40
      const cell = Math.max(
        10,
        Math.min(
          39,
          Math.floor(Math.min((w - margin) / BOARD_COLS, (h - margin) / VISIBLE_ROWS)),
        ),
      )
      const pxW = cell * BOARD_COLS
      const pxH = cell * VISIBLE_ROWS
      const offsetX = Math.floor((w - pxW) / 2)
      const offsetY = Math.floor((h - pxH) / 2)

      const alphaBase = playing ? 0.42 : 0.22
      const gridAlpha = playing ? 0.22 : 0.12
      const ghostAlpha = playing ? 0.18 : 0.1

      ctx.fillStyle = `rgba(0, 0, 0, ${isDark ? 0.18 : 0.06})`
      roundRect(ctx, offsetX - 10, offsetY - 10, pxW + 20, pxH + 20, 18)
      ctx.fill()

      ctx.strokeStyle = `rgba(127, 127, 127, ${gridAlpha})`
      ctx.lineWidth = 1
      for (let x = 0; x <= BOARD_COLS; x++) {
        const gx = offsetX + x * cell + 0.5
        ctx.beginPath()
        ctx.moveTo(gx, offsetY)
        ctx.lineTo(gx, offsetY + pxH)
        ctx.stroke()
      }
      for (let y = 0; y <= VISIBLE_ROWS; y++) {
        const gy = offsetY + y * cell + 0.5
        ctx.beginPath()
        ctx.moveTo(offsetX, gy)
        ctx.lineTo(offsetX + pxW, gy)
        ctx.stroke()
      }

      const drawCell = (bx: number, sy: number, color: string, alpha: number) => {
        const x = offsetX + bx * cell
        const y = offsetY + sy * cell
        ctx.fillStyle = hexToRgba(color, alpha)
        ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2)
      }

      for (let y = 0; y < VISIBLE_ROWS; y++) {
        const bits = snap.rows[y] ?? 0
        if (bits === 0) continue
        const sy = VISIBLE_ROWS - 1 - y
        for (let x = 0; x < BOARD_COLS; x++) {
          if (((bits >> x) & 1) === 0) continue
          const piece = snap.cellPiece[y * BOARD_COLS + x] ?? -1
          drawCell(x, sy, PIECE_COLORS[piece] ?? "#9ca3af", alphaBase)
        }
      }

      if (snap.activePiece >= 0) {
        const cells = getPieceCells(snap.activePiece, snap.activeRot)
        const color = PIECE_COLORS[snap.activePiece] ?? "#9ca3af"
        for (let i = 0; i < cells.length; i += 2) {
          const x = snap.activeX + (cells[i] ?? 0)
          const y = snap.ghostY + (cells[i + 1] ?? 0)
          if (x < 0 || x >= BOARD_COLS || y < 0 || y >= VISIBLE_ROWS) continue
          drawCell(x, VISIBLE_ROWS - 1 - y, color, ghostAlpha)
        }
        const activeAlpha = Math.min(0.75, alphaBase + 0.18)
        for (let i = 0; i < cells.length; i += 2) {
          const x = snap.activeX + (cells[i] ?? 0)
          const y = snap.activeY + (cells[i + 1] ?? 0)
          if (x < 0 || x >= BOARD_COLS || y < 0 || y >= VISIBLE_ROWS) continue
          drawCell(x, VISIBLE_ROWS - 1 - y, color, activeAlpha)
        }
      }
    }

    const tick = (ts: number) => {
      const bot = botRef.current
      if (!bot || disposed) return
      const last = lastTsRef.current ?? ts
      lastTsRef.current = ts
      const dt = Math.min(50, Math.max(0, ts - last))
      virtualMsRef.current += dt * Math.min(1, ppsRef.current)
      bot.tick(virtualMsRef.current)
      const snap = bot.snapshot()
      if (snap.state === 2) bot.reset(randomSeed())
      render(snap)
      if (modeRef.current === "play" && snap.piecesPlaced !== lastPiecesRef.current) {
        lastPiecesRef.current = snap.piecesPlaced
        setStats(readStats(snap))
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    createTetrisBot({ pps: Math.max(1, loadPps()), seed: randomSeed(), ignoreReducedMotion: true })
      .then((bot) => {
        if (disposed) {
          bot.destroy()
          return
        }
        botRef.current = bot
        bot.setPPS(Math.max(1, ppsRef.current))
        rafRef.current = requestAnimationFrame(tick)
      })
      .catch(() => {})

    return () => {
      disposed = true
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      botRef.current?.destroy()
      botRef.current = null
    }
  }, [])

  return (
    <>
      <div
        className={cn(
          "tetris-intro-pulse fixed inset-0 pointer-events-none",
          "transition-opacity duration-300",
          playOn ? "opacity-100 z-40" : "opacity-90 z-0",
        )}
        aria-hidden
      >
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
      {playOn ? (
        <>
          <Hud stats={stats} pps={pps} onPpsChange={applyPps} />
          <a
            href="https://github.com/4ppleSA0CE/tetris-bot"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto fixed bottom-8 right-8 z-50 rounded-xl border border-border/40 bg-background/45 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
          >
            Source code ↗
          </a>
        </>
      ) : null}
    </>
  )
}

function Hud({
  stats,
  pps,
  onPpsChange,
}: {
  stats: Stats | null
  pps: number
  onPpsChange: (value: number) => void
}) {
  if (!stats) return null
  return (
    <div
      className={cn(
        "pointer-events-auto fixed bottom-8 left-8 z-50 hidden md:block",
        "rounded-xl border border-border/40 bg-background/45 backdrop-blur-sm",
        "px-4 py-3 text-xs text-muted-foreground",
      )}
    >
      <div className="flex items-start gap-4">
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-foreground/80">
            Hold
          </div>
          <MiniPiece piece={stats.hold} />
        </div>

        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-foreground/80">
            Next
          </div>
          <div className="space-y-2">
            {stats.queue.map((p, idx) => (
              <MiniPiece key={`${p}-${idx}`} piece={p} />
            ))}
          </div>
        </div>

        <div className="min-w-28 space-y-2">
          <StatRow label="PPS" value={pps.toFixed(1)} />
          <StatRow label="Lines" value={stats.lines} />
          <StatRow label="Pieces" value={stats.pieces} />
          {stats.b2b > 0 ? <StatRow label="B2B" value={stats.b2b} /> : null}
          {stats.combo > 0 ? <StatRow label="Combo" value={stats.combo} /> : null}
        </div>
      </div>

      <div className="mt-3 border-t border-border/40 pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground/80">
            Bot Speed
          </span>
          <span className="text-sm font-semibold text-foreground tabular-nums">
            {pps.toFixed(1)} PPS
          </span>
        </div>
        <input
          type="range"
          min={PPS_MIN}
          max={PPS_MAX}
          step={0.1}
          value={pps}
          onChange={(e) => onPpsChange(Number(e.target.value))}
          aria-label="Bot speed in pieces per second"
          className="mt-2 w-full accent-foreground"
        />
      </div>
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground/80">
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground tabular-nums">{value}</span>
    </div>
  )
}

function MiniPiece({ piece }: { piece: number }) {
  const on = new Set<string>()
  let color = "#000000"
  if (piece >= 0) {
    const cells = getPieceCells(piece, 0)
    let minX = Infinity
    let maxY = -Infinity
    for (let i = 0; i < cells.length; i += 2) {
      minX = Math.min(minX, cells[i] ?? 0)
      maxY = Math.max(maxY, cells[i + 1] ?? 0)
    }
    for (let i = 0; i < cells.length; i += 2) {
      on.add(`${(cells[i] ?? 0) - minX},${maxY - (cells[i + 1] ?? 0)}`)
    }
    color = PIECE_COLORS[piece] ?? "#9ca3af"
  }
  return (
    <div className="grid grid-cols-4 gap-[2px] rounded-md p-[2px]">
      {Array.from({ length: 8 }, (_, i) => {
        const key = `${i % 4},${Math.floor(i / 4)}`
        return (
          <div
            key={i}
            className="h-2.5 w-2.5 rounded-[2px]"
            style={{ backgroundColor: on.has(key) ? hexToRgba(color, 0.7) : "transparent" }}
          />
        )
      })}
    </div>
  )
}

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "").trim()
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h
  const bigint = parseInt(full, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
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
