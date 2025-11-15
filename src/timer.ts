import { signal } from './signal'
import { Node, type NodeProps } from './node'

export class Timer extends Node {
  timeout = signal()
  oneShot = false
  waitTime = 1.0
  autostart = false

  #paused = false
  #timeLeft = 0
  #running = false

  constructor(props: NodeProps) {
    super(props)
    this.oneShot = Boolean(props['one-shot'] ?? false)
    this.autostart = Boolean(props['autostart'] ?? false)
    this.waitTime = Number.parseFloat(props['wait-time'] ?? '1')
  }

  get paused() {
    return this.#paused
  }

  set paused(value: boolean) {
    this.#paused = value
  }

  get timeLeft() {
    return this.#timeLeft
  }

  get stopped() {
    return !this.#running
  }

  _ready() {
    if (this.autostart) {
      this.start()
    }
  }

  _process(delta: number) {
    if (!this.#running || this.#paused) return

    this.#timeLeft -= delta

    if (this.#timeLeft <= 0) {
      this.timeout.emit()

      if (this.oneShot) {
        this.#running = false
      } else {
        this.#timeLeft = this.waitTime
      }
    }
  }

  start(timeSec?: number): void {
    this.#timeLeft = timeSec ?? this.waitTime
    this.#running = true
    this.#paused = false
  }

  stop(): void {
    this.#running = false
    this.#timeLeft = 0
  }
}
