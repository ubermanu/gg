export interface DeferredPromise<T = void> extends PromiseLike<T> {
  resolve: (value: T) => void
  reject: (reason?: any) => void
}

export function deferred<T = void>(): DeferredPromise<T> {
  let resolve!: (value: T) => void
  let reject!: (reason?: any) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return Object.assign(promise, { resolve, reject })
}
