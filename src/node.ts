import { Container, Point } from 'pixi.js'
import { signal } from './signal'
import type { MaybePromise } from 'bun'
import { World } from './world'

export interface NodeProps {
  [key: string]: string | undefined
}

export class Node {
  name
  pixiContainer = new Container()
  children: Node[] = []
  parent: Node | null = null

  ready = signal()
  treeEntered = signal()
  treeExited = signal()

  constructor(props: NodeProps) {
    this.name = props.name ?? ''

    if (props['position']) {
      const [x, y] = props['position']?.split(',')
      this.pixiContainer.position.set(+x, +y)
    }
  }

  _init?(): MaybePromise<void>
  _ready?(): MaybePromise<void>
  _process?(delta: number): void

  addChild(child: Node): void {
    this.children.push(child)
    child.parent = this
    this.pixiContainer.addChild(child.pixiContainer)
  }

  removeChild(child: Node): void {
    const idx = this.children.indexOf(child)
    if (idx > -1) {
      this.children.splice(idx, 1)
      child.parent = null
      this.pixiContainer.removeChild(child.pixiContainer)
    }
  }

  /**
   * Remove the node from the world.
   */
  free(): void {
    this.treeExited.emit()
    this.children.forEach((child) => child.free())
    this.pixiContainer.destroy({ children: true })
  }

  /**
   * Mark the node for deletion.
   */
  queueFree(): void {
    this.world?.freeQueue.add(this)
  }

  /**
   * Get the current world of the node.
   */
  get world(): World | null {
    let current = this.parent
    while (current) {
      if (current instanceof World) {
        return current
      }
      current = current.parent
    }
    return null
  }

  // TODO: Split by "/" and query subchildren
  $<T extends Node>(name: string): T | undefined {
    return this.children.find((c): c is T => c.name === name)
  }

  get position() {
    return this.pixiContainer.position
  }

  set position(value: Point) {
    this.pixiContainer.position = value
  }

  get rotation() {
    return this.pixiContainer.rotation
  }

  set rotation(value: number) {
    this.pixiContainer.rotation = value
  }

  get scale() {
    return this.pixiContainer.scale
  }

  set scale(value: Point) {
    this.pixiContainer.scale = value
  }
}
