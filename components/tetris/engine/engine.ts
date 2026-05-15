import type {
  ActivePiece,
  Board,
  ClearInfo,
  EngineConfig,
  EngineSnapshot,
  Input,
  PieceType,
  Rotation,
  Vec2,
} from "./types"
import { SevenBagRng } from "./rng"
import { rotateDir, SHAPES } from "./pieces"
import { getKickOffsets, getKickOffsets180 } from "./srs"

const DEFAULT_CONFIG: EngineConfig = {
  width: 10,
  height: 20,
  hiddenRows: 2,
  gravityMs: 800,
  softDropMultiplier: 20,
  lockDelayMs: 500,
  lockResetLimit: 15,
  nextCount: 5,
}

export class TetrisEngine {
  readonly config: EngineConfig

  private rng = new SevenBagRng()
  private board: Board
  private active!: ActivePiece
  private hold: PieceType | null = null
  private canHold = true
  private nextQueue: PieceType[] = []
  private isGameOver = false

  private lines = 0
  private combo = -1
  private lastClear: ClearInfo = { lines: 0, kind: "none" }

  private gravityAccMs = 0
  private lockAccMs = 0
  private lockResets = 0

  /** Last input was a successful rotation; cleared on horizontal move, hold, spawn, hard drop. */
  private lastActionWasRotate = false
  /** Kick offset applied on the last successful rotation (piece space, +y down). */
  private lastRotationKick: Vec2 | null = null

  constructor(config?: Partial<EngineConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...(config ?? {}) }
    this.board = makeBoard(this.config.width, this.config.height + this.config.hiddenRows)
    this.fillNextQueue()
    this.spawnNext()
  }

  restart() {
    this.rng.reseed()
    this.board = makeBoard(this.config.width, this.config.height + this.config.hiddenRows)
    this.hold = null
    this.canHold = true
    this.nextQueue = []
    this.isGameOver = false
    this.lines = 0
    this.combo = -1
    this.lastClear = { lines: 0, kind: "none" }
    this.gravityAccMs = 0
    this.lockAccMs = 0
    this.lockResets = 0
    this.clearSpinTracking()
    this.fillNextQueue()
    this.spawnNext()
  }

  step(dtMs: number, input: Input) {
    if (input.restart) {
      this.restart()
      return
    }

    if (this.isGameOver) return

    if (input.hold) this.tryHold()
    if (input.moveX) this.tryMove({ x: input.moveX, y: 0 })
    if (input.rotate180) this.tryRotate180()
    else if (input.rotate) this.tryRotate(input.rotate)

    if (input.hardDrop) {
      this.hardDrop()
      return
    }

    const gravityMs = input.softDrop
      ? this.config.gravityMs / this.config.softDropMultiplier
      : this.config.gravityMs

    this.gravityAccMs += dtMs
    while (this.gravityAccMs >= gravityMs) {
      this.gravityAccMs -= gravityMs
      if (!this.tryMove({ x: 0, y: 1 }, { isGravity: true })) {
        break
      }
    }

    if (this.isTouchingGround()) {
      this.lockAccMs += dtMs
      if (this.lockAccMs >= this.config.lockDelayMs) {
        this.lockPiece()
      }
    } else {
      this.lockAccMs = 0
      this.lockResets = 0
    }
  }

  getSnapshot(): EngineSnapshot {
    return {
      board: this.board,
      width: this.config.width,
      height: this.config.height,
      hiddenRows: this.config.hiddenRows,
      active: clonePiece(this.active),
      ghost: this.computeGhost(),
      hold: this.hold,
      canHold: this.canHold,
      next: this.nextQueue.slice(0, this.config.nextCount),
      lines: this.lines,
      combo: Math.max(0, this.combo),
      lastClear: this.lastClear,
      isGameOver: this.isGameOver,
    }
  }

  private clearSpinTracking() {
    this.lastActionWasRotate = false
    this.lastRotationKick = null
  }

  private fillNextQueue() {
    while (this.nextQueue.length < this.config.nextCount + 7) {
      this.nextQueue.push(this.rng.next())
    }
  }

  private spawnNext() {
    this.clearSpinTracking()
    this.fillNextQueue()
    const type = this.nextQueue.shift()
    if (!type) throw new Error("spawnNext: empty queue")

    const spawnX = Math.floor(this.config.width / 2) - 2
    const spawnY = 0
    this.active = { type, rotation: 0, pos: { x: spawnX, y: spawnY } }
    this.canHold = true
    this.lockAccMs = 0
    this.lockResets = 0

    if (!this.isValid(this.active)) {
      this.isGameOver = true
    }
  }

  private tryHold() {
    if (!this.canHold) return
    this.canHold = false
    this.clearSpinTracking()

    const current = this.active.type
    if (this.hold === null) {
      this.hold = current
      this.spawnNext()
      return
    }

    const swap = this.hold
    this.hold = current
    const spawnX = Math.floor(this.config.width / 2) - 2
    this.active = { type: swap, rotation: 0, pos: { x: spawnX, y: 0 } }
    if (!this.isValid(this.active)) {
      this.isGameOver = true
    }
  }

  private tryMove(delta: Vec2, opts?: { isGravity?: boolean }) {
    const moved: ActivePiece = {
      ...this.active,
      pos: { x: this.active.pos.x + delta.x, y: this.active.pos.y + delta.y },
    }
    if (!this.isValid(moved)) return false

    if (delta.x !== 0 && !opts?.isGravity) {
      this.clearSpinTracking()
    }

    const wasGrounded = this.isTouchingGround()
    this.active = moved

    if (!opts?.isGravity && wasGrounded) this.resetLockDelay()
    return true
  }

  private tryRotate(dir: "cw" | "ccw") {
    const from = this.active.rotation
    const to = rotateDir(from, dir)
    const kicks = getKickOffsets(this.active.type, from, to)

    for (const k of kicks) {
      const rotated: ActivePiece = {
        type: this.active.type,
        rotation: to,
        pos: { x: this.active.pos.x + k.x, y: this.active.pos.y + k.y },
      }
      if (this.isValid(rotated)) {
        const wasGrounded = this.isTouchingGround()
        this.active = rotated
        this.lastActionWasRotate = true
        this.lastRotationKick = { x: k.x, y: k.y }
        if (wasGrounded) this.resetLockDelay()
        return true
      }
    }

    return false
  }

  private tryRotate180() {
    if (this.active.type === "O") return false
    const from = this.active.rotation
    const to = (((from + 2) % 4) as Rotation)
    const kicks = getKickOffsets180(this.active.type, from)

    for (const k of kicks) {
      const rotated: ActivePiece = {
        type: this.active.type,
        rotation: to,
        pos: { x: this.active.pos.x + k.x, y: this.active.pos.y + k.y },
      }
      if (this.isValid(rotated)) {
        const wasGrounded = this.isTouchingGround()
        this.active = rotated
        this.lastActionWasRotate = true
        this.lastRotationKick = { x: k.x, y: k.y }
        if (wasGrounded) this.resetLockDelay()
        return true
      }
    }

    return false
  }

  private hardDrop() {
    let moved = false
    while (this.tryMove({ x: 0, y: 1 }, { isGravity: true })) {
      moved = true
    }
    if (moved || this.isTouchingGround()) {
      this.lockPiece()
    }
  }

  private resetLockDelay() {
    if (this.lockResets >= this.config.lockResetLimit) return
    this.lockAccMs = 0
    this.lockResets += 1
  }

  private lockPiece() {
    placeOnBoard(this.board, this.active)

    const clear = this.clearLinesAndClassify()
    this.lastClear = clear

    if (clear.lines > 0) {
      this.lines += clear.lines
      this.combo = this.combo < 0 ? 0 : this.combo + 1
    } else {
      this.combo = -1
    }

    this.spawnNext()
  }

  private clearLinesAndClassify(): ClearInfo {
    const fullRows: number[] = []
    for (let y = 0; y < this.board.length; y++) {
      if (this.board[y].every((c) => c !== null)) fullRows.push(y)
    }

    const lines = fullRows.length
    if (lines === 0) return { lines: 0, kind: "none" }

    const lockedPiece = clonePiece(this.active)
    const kindBase: ClearInfo["kind"] =
      lines === 4 ? "tetris" : lines === 3 ? "triple" : lines === 2 ? "double" : "single"

    const spinKind =
      lines > 0 && this.lastActionWasRotate ? this.classifySpin(lockedPiece, lines as 1 | 2 | 3 | 4) : null

    for (const y of fullRows) {
      this.board.splice(y, 1)
      this.board.unshift(new Array(this.config.width).fill(null))
    }

    return spinKind ? { lines, kind: spinKind } : { lines, kind: kindBase }
  }

  private classifySpin(locked: ActivePiece, lines: 1 | 2 | 3 | 4): ClearInfo["kind"] | null {
    const t = locked.type

    if (t === "T") {
      return this.classifyTSpin(locked, lines)
    }

    if (t === "J" || t === "L" || t === "S" || t === "Z") {
      if (lines === 4) return null
      if (!this.isImmobileOnBoard(locked, this.board)) return null
      return this.allSpinKind(t, lines as 1 | 2 | 3)
    }

    return null
  }

  private classifyTSpin(locked: ActivePiece, lines: number): ClearInfo["kind"] | null {
    const pivot = { x: locked.pos.x + 1, y: locked.pos.y + 2 }
    const corners = [
      { x: pivot.x - 1, y: pivot.y - 1 },
      { x: pivot.x + 1, y: pivot.y - 1 },
      { x: pivot.x - 1, y: pivot.y + 1 },
      { x: pivot.x + 1, y: pivot.y + 1 },
    ]

    let blocked = 0
    for (const c of corners) {
      if (this.isBlockedForSpin(c)) blocked++
    }

    if (blocked < 3) return null

    const front = tFrontCornerWorld(pivot, locked.rotation)
    const frontCount = front.filter((c) => this.isBlockedForSpin(c)).length
    const kick = this.lastRotationKick
    const isFinOffset =
      kick !== null && Math.abs(kick.x) === 1 && Math.abs(kick.y) === 2

    const isMini = !(frontCount >= 2 || isFinOffset)

    if (lines === 4) return "tetris"
    if (lines === 3) {
      return isMini ? "tspin-mini" : "tspin-triple"
    }
    if (lines === 2) {
      return isMini ? "tspin-mini" : "tspin-double"
    }
    return isMini ? "tspin-mini" : "tspin-single"
  }

  private allSpinKind(t: "J" | "L" | "S" | "Z", lines: 1 | 2 | 3): ClearInfo["kind"] {
    const letter = t.toLowerCase() as "j" | "l" | "s" | "z"
    if (lines === 1) return `${letter}spin-single` as ClearInfo["kind"]
    if (lines === 2) return `${letter}spin-double` as ClearInfo["kind"]
    return `${letter}spin-triple` as ClearInfo["kind"]
  }

  private isBlockedForSpin(c: Vec2): boolean {
    if (c.x < 0 || c.x >= this.config.width || c.y < 0 || c.y >= this.board.length) return true
    return this.board[c.y][c.x] !== null
  }

  /** Piece cannot move L, R, or D on this board (All-Mini+ immobile). */
  private isImmobileOnBoard(piece: ActivePiece, board: Board): boolean {
    for (const d of [
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ]) {
      const test: ActivePiece = {
        ...piece,
        pos: { x: piece.pos.x + d.x, y: piece.pos.y + d.y },
      }
      if (this.isValidOnBoard(test, board)) return false
    }
    return true
  }

  private isTouchingGround() {
    const below: ActivePiece = {
      ...this.active,
      pos: { x: this.active.pos.x, y: this.active.pos.y + 1 },
    }
    return !this.isValid(below)
  }

  private isValid(piece: ActivePiece) {
    return this.isValidOnBoard(piece, this.board)
  }

  private isValidOnBoard(piece: ActivePiece, board: Board) {
    const cells = SHAPES[piece.type][piece.rotation]
    for (const c of cells) {
      const x = piece.pos.x + c.x
      const y = piece.pos.y + c.y
      if (x < 0 || x >= this.config.width) return false
      if (y < 0 || y >= board.length) return false
      if (board[y][x] !== null) return false
    }
    return true
  }

  private computeGhost(): ActivePiece {
    const ghost = clonePiece(this.active)
    while (true) {
      const moved: ActivePiece = { ...ghost, pos: { x: ghost.pos.x, y: ghost.pos.y + 1 } }
      if (!this.isValid(moved)) return ghost
      ghost.pos = moved.pos
    }
  }
}

function makeBoard(width: number, height: number): Board {
  return Array.from({ length: height }, () => new Array(width).fill(null))
}

function placeOnBoard(board: Board, piece: ActivePiece) {
  const cells = SHAPES[piece.type][piece.rotation]
  for (const c of cells) {
    const x = piece.pos.x + c.x
    const y = piece.pos.y + c.y
    if (y >= 0 && y < board.length && x >= 0 && x < board[0].length) {
      board[y][x] = piece.type
    }
  }
}

function clonePiece(p: ActivePiece): ActivePiece {
  return { type: p.type, rotation: p.rotation, pos: { x: p.pos.x, y: p.pos.y } }
}

/** Two front corners of the 3×3 around T pivot, toward the T stem (TetrisWiki T-Spin). */
function tFrontCornerWorld(pivot: Vec2, rotation: Rotation): Vec2[] {
  switch (rotation) {
    case 0:
      return [
        { x: pivot.x - 1, y: pivot.y - 1 },
        { x: pivot.x + 1, y: pivot.y - 1 },
      ]
    case 1:
      return [
        { x: pivot.x + 1, y: pivot.y - 1 },
        { x: pivot.x + 1, y: pivot.y + 1 },
      ]
    case 2:
      return [
        { x: pivot.x - 1, y: pivot.y + 1 },
        { x: pivot.x + 1, y: pivot.y + 1 },
      ]
    case 3:
      return [
        { x: pivot.x - 1, y: pivot.y - 1 },
        { x: pivot.x - 1, y: pivot.y + 1 },
      ]
    default:
      return []
  }
}
