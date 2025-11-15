import { Sprite, Input, Timer } from '../../src'

export default class extends Sprite {
  speed = 200
  timer: Timer | undefined

  _ready() {
    this.timer = this.$<Timer>('Timer1')
    this.timer?.timeout.connect(this._on_Timer_timeout)
  }

  _process(delta: number) {
    const dir = Input.getVector('move_left', 'move_right', 'move_up', 'move_down')

    this.position.x += dir.x * this.speed * delta
    this.position.y += dir.y * this.speed * delta
  }

  private _on_Timer_timeout() {
    console.log('Tic')
  }
}
