import { test, expect } from 'bun:test'
import { signal } from './signal'

test('Signal should connect a listener and emit a value', () => {
  const s = signal<number>()
  let receivedValue: number | undefined

  const listener = (value: number) => {
    receivedValue = value
  }

  s.connect(listener)
  s.emit(42)

  expect(receivedValue).toBe(42)
})

test('Signal should connect multiple listeners and emit to all', () => {
  const s = signal<number>()
  let countA = 0
  let countB = 0

  s.connect(() => {
    countA++
  })
  s.connect(() => {
    countB++
  })

  s.emit(1)
  s.emit(2)

  expect(countA).toBe(2)
  expect(countB).toBe(2)
})

test('Signal should allow a listener to be disconnected', () => {
  const s = signal<number>()
  let countA = 0
  let countB = 0

  const listenerA = () => {
    countA++
  }
  const disconnectB = s.connect(() => {
    countB++
  })

  s.connect(listenerA)
  s.emit(10)

  expect(countA).toBe(1)
  expect(countB).toBe(1)

  disconnectB()
  s.emit(20)

  expect(countA).toBe(2)
  expect(countB).toBe(1)
})

test('Signal promise should resolve on the next emit', async () => {
  const s = signal<number>()
  setTimeout(() => s.emit(99))

  const resolvedValue = await s
  expect(resolvedValue).toBe(99)
})
