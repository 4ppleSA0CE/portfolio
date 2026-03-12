import type { PieceType } from "./types"
import { PIECE_TYPES } from "./pieces"

export class SevenBagRng {
  private bag: PieceType[] = []

  next(): PieceType {
    if (this.bag.length === 0) {
      this.bag = shuffle([...PIECE_TYPES])
    }
    const v = this.bag.shift()
    if (!v) throw new Error("SevenBagRng: empty bag invariant broken")
    return v
  }
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

