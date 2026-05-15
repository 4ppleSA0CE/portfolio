import type { PieceType, Rotation, Vec2 } from "./types"

/** Only adjacent rotation transitions are used for SRS kicks. */
type KickKey = "0>1" | "1>0" | "1>2" | "2>1" | "2>3" | "3>2" | "3>0" | "0>3"

const KICKS_JLSTZ: Partial<Record<KickKey, Vec2[]>> = {
  "0>1": [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: 0, y: 2 },
    { x: -1, y: 2 },
  ],
  "1>0": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: -2 },
    { x: 1, y: -2 },
  ],
  "1>2": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: -2 },
    { x: 1, y: -2 },
  ],
  "2>1": [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: 0, y: 2 },
    { x: -1, y: 2 },
  ],
  "2>3": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ],
  "3>2": [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: -2 },
    { x: -1, y: -2 },
  ],
  "3>0": [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: -2 },
    { x: -1, y: -2 },
  ],
  "0>3": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ],
}

/**
 * TETR.IO SRS+ (Alpha 5.0.0+): I kicks symmetric about the Y axis.
 * Same values as "Arika SRS" / TGM3-style I table on TetrisWiki (offsets stored
 * with +y = downward, matching JLSTZ kicks in this file).
 */
const KICKS_I_SRS_PLUS: Partial<Record<KickKey, Vec2[]>> = {
  "0>1": [
    { x: 0, y: 0 },
    { x: -2, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: -2 },
    { x: -2, y: 1 },
  ],
  "1>0": [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: -1 },
    { x: -1, y: 2 },
  ],
  "1>2": [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: 0 },
    { x: -1, y: -2 },
    { x: 2, y: 1 },
  ],
  "2>1": [
    { x: 0, y: 0 },
    { x: -2, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: -1 },
    { x: 1, y: 1 },
  ],
  "2>3": [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: -1 },
    { x: -1, y: 1 },
  ],
  "3>2": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: 0 },
    { x: 1, y: -2 },
    { x: -2, y: 1 },
  ],
  "3>0": [
    { x: 0, y: 0 },
    { x: -2, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: -1 },
    { x: 1, y: 2 },
  ],
  "0>3": [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: -2 },
    { x: 2, y: 1 },
  ],
}

/** TETR.IO 180° kicks (Infdev 0.6.0+). +y = downward, same as JLSTZ in this module. */
const KICKS_180: Record<"0>2" | "2>0" | "1>3" | "3>1", Vec2[]> = {
  "0>2": [
    { x: 0, y: 1 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
  ],
  "2>0": [
    { x: 0, y: -1 },
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
  ],
  "1>3": [
    { x: -1, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: -2 },
    { x: 0, y: -1 },
    { x: -1, y: -2 },
    { x: -1, y: -1 },
  ],
  "3>1": [
    { x: 1, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: -2 },
    { x: 0, y: -1 },
    { x: 1, y: -2 },
    { x: 1, y: -1 },
  ],
}

export function getKickOffsets(type: PieceType, from: Rotation, to: Rotation): Vec2[] {
  const key = `${from}>${to}` as KickKey
  if (type === "O") return [{ x: 0, y: 0 }]
  if (type === "I") return KICKS_I_SRS_PLUS[key] ?? [{ x: 0, y: 0 }]
  return KICKS_JLSTZ[key] ?? [{ x: 0, y: 0 }]
}

export function getKickOffsets180(type: PieceType, from: Rotation): Vec2[] {
  if (type === "O") return [{ x: 0, y: 0 }]
  const key180: keyof typeof KICKS_180 =
    from === 0 ? "0>2" : from === 2 ? "2>0" : from === 1 ? "1>3" : "3>1"
  // I uses the same TETR.IO 180 kick family as JLSTZ (no separate published I-180 table here).
  return KICKS_180[key180]
}
