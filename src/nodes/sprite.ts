import { Node, type NodeProps } from './node'
import { Assets, Sprite as PIXISprite } from 'pixi.js'

export class Sprite extends Node {
  protected pixiSprite

  constructor(props: NodeProps) {
    super(props)
    this.pixiSprite = new PIXISprite()

    ;(async () => {
      const texture = await Assets.load(props['texture'])
      this.pixiSprite.texture = texture
      this.pixiContainer.addChild(this.pixiSprite)
    })()
  }
}
