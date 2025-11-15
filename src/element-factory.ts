import { Node, type NodeProps } from './nodes/node'
import { signal, type Signal } from './signal'

export interface GGElement extends HTMLElement {
  gameObject?: Node
  initialized: Signal
}

export function createNodeHTMLElement(tagName: string, defaultGameClass: typeof Node) {
  return class extends HTMLElement implements GGElement {
    gameObject?: Node
    tagName = tagName
    initialized = signal<void>()

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

      // Attach to parent
      const parentElement = this.parentElement as GGElement | null
      if (parentElement?.gameObject) {
        parentElement.gameObject.addChild(this.gameObject)
      }

      // Lifecycle
      await this.gameObject._init?.()
      await this.waitForChildren()
      await this.gameObject._ready?.()

      this.initialized.emit()
      this.gameObject.ready.emit()
    }

    disconnectedCallback() {
      this.gameObject?.tree_exited.emit()
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

    /**
     * Wait until all the children are ready.
     */
    async waitForChildren() {
      const children = Array.from(this.children).filter(
        (child): child is GGElement => child instanceof HTMLElement && 'gameObject' in child,
      )

      await Promise.all(children.map((child) => child.initialized))
    }
  }
}
