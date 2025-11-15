import { Sprite, Input } from '../../src'

export default class extends Sprite {
  speed = 200

  _process(delta: number) {
    const dir = Input.getVector('move_left', 'move_right', 'move_up', 'move_down')

    this.position.x += dir.x * this.speed * delta
    this.position.y += dir.y * this.speed * delta
  }
}
