export type PieceType = "I" | "O" | "T" | "S" | "Z" | "J" | "L"

export type Rotation = 0 | 1 | 2 | 3

export type Vec2 = { x: number; y: number }

export type Cell = PieceType | null

export type Board = Cell[][]

export type ActivePiece = {
  type: PieceType
  rotation: Rotation
  pos: Vec2
}

export type ClearInfo = {
  lines: number
  kind:
    | "none"
    | "single"
    | "double"
    | "triple"
    | "tetris"
    | "tspin-mini"
    | "tspin-single"
    | "tspin-double"
    | "tspin-triple"
    | "jspin-single"
    | "jspin-double"
    | "jspin-triple"
    | "lspin-single"
    | "lspin-double"
    | "lspin-triple"
    | "sspin-single"
    | "sspin-double"
    | "sspin-triple"
    | "zspin-single"
    | "zspin-double"
    | "zspin-triple"
}

export type EngineConfig = {
  width: number
  height: number
  hiddenRows: number
  gravityMs: number
  softDropMultiplier: number
  lockDelayMs: number
  lockResetLimit: number
  nextCount: number
}

export type EngineSnapshot = {
  board: Board
  width: number
  height: number
  hiddenRows: number
  active: ActivePiece
  ghost: ActivePiece
  hold: PieceType | null
  canHold: boolean
  next: PieceType[]
  lines: number
  combo: number
  lastClear: ClearInfo
  isGameOver: boolean
}

export type Input = {
  moveX?: -1 | 1
  rotate?: "cw" | "ccw"
  /** Atomic 180° (TETR.IO-style kick table), not two quarter turns. */
  rotate180?: boolean
  softDrop?: boolean
  hardDrop?: boolean
  hold?: boolean
  restart?: boolean
}

