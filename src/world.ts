import { Application } from 'pixi.js'
import { Node } from './node'
import type { GGElement } from './element-factory'

export class World {
  freeQueue = new Set<Node>()
  app = new Application()
  children: Node[] = []

  get width() {
    return this.app.canvas.width
  }

  get height() {
    return this.app.canvas.height
  }

  async _init() {
    await this.app.init({ resizeTo: window })
    document.body.appendChild(this.app.canvas)
  }

  start() {
    this.app.ticker.add((ticker) => {
      const delta = ticker.deltaTime / 60
      this.children.forEach((child) => this.processNode(child, delta))

      if (this.freeQueue.size > 0) {
        this.freeQueue.values().forEach((node) => node.free())
        this.freeQueue.clear()
      }
    })
  }

  protected processNode(node: Node, delta: number): void {
    node._process?.(delta)
    node.children.forEach((child) => this.processNode(child, delta))
  }

  addChild(child: Node): void {
    this.children.push(child)
    this.app.stage.addChild(child.pixiContainer)
  }

  removeChild(child: Node): void {
    const idx = this.children.indexOf(child)
    if (idx > -1) {
      this.children.splice(idx, 1)
      child.parent = null
      this.app.stage.removeChild(child.pixiContainer)
    }
  }

  shutdown(): void {
    this.children.forEach((child) => child.free())
  }

  // TODO: Split by "/" and query subchildren
  $(name: string): Node | undefined {
    return this.children.find((c) => c.name === name)
  }
}

export class GGWorld extends HTMLElement {
  gameObject?: World

  async connectedCallback() {
    this.gameObject = new World()
    await this.gameObject._init()

    const childElements = Array.from(this.children).filter(
      (child): child is GGElement => child instanceof HTMLElement && 'gameObject' in child,
    )

    await Promise.all(childElements.map((child) => child.initialized))
    childElements.forEach((child) => this.gameObject.addChild(child.gameObject))

    this.gameObject.start()
  }

  disconnectedCallback() {
    this.gameObject?.shutdown()
    this.gameObject = undefined
  }
}
