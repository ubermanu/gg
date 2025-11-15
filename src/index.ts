import { createNodeHTMLElement } from './element-factory'
import { Node } from './node'
import { Sprite } from './sprite'
import { Timer } from './timer'
import { World, GGWorld } from './world'

customElements.define('gg-world', GGWorld)

const nodeElementsMap: Record<string, typeof Node> = {
  'gg-node': Node,
  'gg-sprite': Sprite,
  'gg-timer': Timer,
}

for (const tagName in nodeElementsMap) {
  customElements.define(tagName, createNodeHTMLElement(tagName, nodeElementsMap[tagName]))
}

export { Node, Sprite, Timer, World }

export { Input } from './input'
