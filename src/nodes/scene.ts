import { Application } from 'pixi.js'
import { Node, type NodeProps } from './node'

export class Scene extends Node {
  app

  constructor(props: NodeProps) {
    super(props)
    this.app = new Application()

    ;(async () => {
      await this.app.init({ resizeTo: window })

      this.app.stage.addChild(this.pixiContainer)

      this.app.ticker.add((ticker) => {
        const delta = ticker.deltaTime / 60
        this.processNode(this, delta)
      })

      document.body.appendChild(this.app.canvas)
    })()
  }

  private processNode(node: Node, delta: number) {
    node._process?.(delta)
    node.children.forEach((child) => this.processNode(child, delta))
  }
}
