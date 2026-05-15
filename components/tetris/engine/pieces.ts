import type { PieceType, Rotation, Vec2 } from "./types"

// Coordinates are in a 4x4 local grid with origin at top-left.
// SRS uses specific rotation states around a fixed rotation center.
export const PIECE_TYPES: PieceType[] = ["I", "O", "T", "S", "Z", "J", "L"]

/** TETR.IO 7-bag source order before each shuffle (tetrio-bot-docs Piece_RNG.md). */
export const TETRIO_BAG_ORDER: PieceType[] = ["Z", "L", "O", "S", "I", "J", "T"]

type Rotations = Record<Rotation, Vec2[]>

const r0: Rotation = 0
const r1: Rotation = 1
const r2: Rotation = 2
const r3: Rotation = 3

export const SHAPES: Record<PieceType, Rotations> = {
  I: {
    [r0]: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ],
    [r1]: [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ],
    [r2]: [
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
    ],
    [r3]: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ],
  },
  O: {
    [r0]: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    [r1]: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    [r2]: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    [r3]: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
  },
  T: {
    [r0]: [
      { x: 1, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    [r1]: [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 1, y: 3 },
    ],
    [r2]: [
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 1, y: 3 },
    ],
    [r3]: [
      { x: 1, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ],
  },
  S: {
    [r0]: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
    [r1]: [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ],
    [r2]: [
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
    ],
    [r3]: [
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ],
  },
  Z: {
    [r0]: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    [r1]: [
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 1, y: 3 },
    ],
    [r2]: [
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
    ],
    [r3]: [
      { x: 1, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 3 },
    ],
  },
  J: {
    [r0]: [
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    [r1]: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ],
    [r2]: [
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ],
    [r3]: [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
    ],
  },
  L: {
    [r0]: [
      { x: 2, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    [r1]: [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
    ],
    [r2]: [
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 0, y: 3 },
    ],
    [r3]: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ],
  },
}

export const PIECE_COLORS: Record<PieceType, string> = {
  I: "#60a5fa", // blue-ish
  O: "#fbbf24", // amber
  T: "#a78bfa", // purple
  S: "#34d399", // green
  Z: "#fb7185", // rose
  J: "#38bdf8", // sky
  L: "#fb923c", // orange
}

export function rotateDir(rotation: Rotation, dir: "cw" | "ccw"): Rotation {
  if (dir === "cw") return (((rotation + 1) % 4) as Rotation)
  return (((rotation + 3) % 4) as Rotation)
}

