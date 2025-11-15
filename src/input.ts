import { Point } from 'pixi.js'

const defaultActions = {
  move_left: ['ArrowLeft', 'KeyA'],
  move_right: ['ArrowRight', 'KeyD'],
  move_up: ['ArrowUp', 'KeyW'],
  move_down: ['ArrowDown', 'KeyS'],
  accept: ['Space'],
} as const

class InputManager<T extends Record<string, readonly string[]>> {
  private actions = new Map<keyof T, string[]>()
  private pressed = new Set<string>()

  constructor(actions: T) {
    window.addEventListener('keydown', (e) => this.pressed.add(e.code))
    window.addEventListener('keyup', (e) => this.pressed.delete(e.code))

    this.actions = new Map(Object.entries(actions) as [keyof T, string[]][])
  }

  isActionPressed(action: keyof T): boolean {
    const keys = this.actions.get(action) ?? []
    return keys.some((key) => this.pressed.has(key))
  }

  getAxis(negative: keyof T, positive: keyof T): number {
    const neg = this.isActionPressed(negative) ? -1 : 0
    const pos = this.isActionPressed(positive) ? 1 : 0
    return neg + pos
  }

  getVector(left: keyof T, right: keyof T, up: keyof T, down: keyof T): Point {
    return new Point(this.getAxis(left, right), this.getAxis(up, down))
  }
}

export const Input = new InputManager(defaultActions)
