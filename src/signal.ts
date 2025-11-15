export interface Signal<T = void> extends PromiseLike<T> {
  emit(value: T): void
  connect(callback: (value: T) => void): () => void
}

export function signal<T = void>(): Signal<T> {
  const listeners: ((value: T) => void)[] = []
  let resolvers: ((value: T) => void)[] = []

  return {
    emit(value: T): void {
      resolvers.forEach((resolve) => resolve(value))
      resolvers = []
      listeners.forEach((listener) => listener(value))
    },

    connect(callback: (value: T) => void): () => void {
      listeners.push(callback)
      return () => {
        const idx = listeners.indexOf(callback)
        if (idx > -1) listeners.splice(idx, 1)
      }
    },

    then(onFulfilled) {
      return new Promise<T>((resolve) => {
        resolvers.push(resolve)
      }).then(onFulfilled)
    },
  }
}
