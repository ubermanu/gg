import { deferred, type DeferredPromise } from './deferred'
import { Node, type NodeProps } from './node'

export interface GGElement extends HTMLElement {
  gameObject?: Node
  initialized: DeferredPromise
}

export function createNodeHTMLElement(tagName: string, defaultGameClass: typeof Node) {
  return class extends HTMLElement implements GGElement {
    gameObject?: Node
    tagName = tagName
    initialized = deferred()

    private parseAttributes() {
      const props: NodeProps = {}

      for (let i = 0, l = this.attributes.length; i < l; i++) {
        const item = this.attributes.item(i)
        props[item.name] = item.value
      }

      return props
    }

    async connectedCallback() {
      const props = this.parseAttributes()

      // Use script class if provided, otherwise default
      const GameClass = (await this.loadScript()) ?? defaultGameClass
      this.gameObject = new GameClass(props)

      await this.gameObject._init?.()

      const childElements = Array.from(this.children).filter(
        (child): child is GGElement => child instanceof HTMLElement && 'gameObject' in child,
      )

      await Promise.all(childElements.map((child) => child.initialized))
      childElements.forEach((child) => this.gameObject.addChild(child.gameObject))

      await this.gameObject._ready?.()

      this.gameObject.ready.emit()
      this.initialized.resolve()
    }

    disconnectedCallback() {
      this.gameObject?.free()
      this.gameObject = undefined
    }

    /**
     * Load the `script` attribute from this node.
     */
    async loadScript(): Promise<typeof Node | undefined> {
      const src = this.getAttribute('script')
      if (!src) return

      const module: { default?: typeof Node } = await import(/* @vite-ignore */ src)
      return module.default
    }
  }
}
