import type { PieceType } from "./types"
import { TETRIO_BAG_ORDER } from "./pieces"

const M = 2147483647
const A = 16807

/** MINSTD Lehmer PRNG matching TETR.IO / tetrio-bot-docs Piece_RNG.md. */
export class MinstdRng {
  private t: number

  constructor(seed: number) {
    let s = seed % M
    if (s <= 0) s += M - 1
    this.t = s
  }

  next(): number {
    this.t = (A * this.t) % M
    return this.t
  }

  nextFloat(): number {
    return (this.next() - 1) / (M - 1)
  }

  shuffleArray<T>(array: T[]): T[] {
    if (array.length === 0) return array
    for (let i = array.length - 1; i !== 0; i--) {
      const r = Math.floor(this.nextFloat() * (i + 1))
      ;[array[i], array[r]] = [array[r]!, array[i]!]
    }
    return array
  }
}

function randomSeed(): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1)
    crypto.getRandomValues(buf)
    return (buf[0]! % (M - 2)) + 1
  }
  return Math.floor(Math.random() * (M - 2)) + 1
}

export class SevenBagRng {
  private bag: PieceType[] = []
  private minstd: MinstdRng

  constructor(seed?: number) {
    this.minstd = new MinstdRng(seed ?? randomSeed())
  }

  /** New bag stream (e.g. on game restart). */
  reseed(seed?: number) {
    this.bag = []
    this.minstd = new MinstdRng(seed ?? randomSeed())
  }

  next(): PieceType {
    if (this.bag.length === 0) {
      this.bag = this.minstd.shuffleArray([...TETRIO_BAG_ORDER])
    }
    const v = this.bag.shift()
    if (!v) throw new Error("SevenBagRng: empty bag invariant broken")
    return v
  }
}
