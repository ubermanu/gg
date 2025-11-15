import { Node, type NodeProps } from './node'
import { Assets, Sprite as PIXISprite } from 'pixi.js'

export class Sprite extends Node {
  protected pixiSprite = new PIXISprite()
  texture: string

  constructor(props: NodeProps) {
    super(props)
    this.texture = props['texture']
  }

  async _init() {
    this.pixiSprite.texture = await Assets.load(this.texture)
    this.pixiContainer.addChild(this.pixiSprite)
  }
}
