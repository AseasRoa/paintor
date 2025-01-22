import { describe, expect, test } from 'vitest'
import { on, state } from '#paintor'

describe('observers', () => {
  test('throw if not a state', () => {
    // @ts-expect-error
    expect(() => on({}).create()).toThrow(Error)
    // @ts-expect-error
    expect(() => on([]).create()).toThrow(Error)
    // @ts-expect-error
    expect(() => on(1).create()).toThrow(Error)
  })

  describe('create', () => {
    test('objects', () => {
      const myObject = {}
      const myState = state((myObject))

      let event = {}

      on(myState).create((e) => {
        event = e
      })

      myState.a = 'a'

      expect(event).toMatchObject({
        key: 'a',
        value: 'a',
        oldValue: undefined,
        state: { a: 'a' },
        target: { a: 'a' }
      })
    })

    test('arrays', () => {
      const myObject = []
      const myState = state((myObject))

      let event = {}

      on(myState).create((e) => {
        event = e
      })

      myState.push('a')

      expect(event).toMatchObject({
        key: '0',
        value: 'a',
        oldValue: undefined,
        state: ['a'],
        target: ['a']
      })
    })
  })

  describe('change', () => {
    test('objects', () => {
      const myObject = { a: 'a' }
      const myState = state((myObject))

      let event = {}

      on(myState).change((e) => {
        event = e
      })

      myState.a = 'A'

      expect(event).toMatchObject({
        key: 'a',
        value: 'A',
        oldValue: 'a',
        state: { a: 'A' },
        target: { a: 'A' }
      })
    })

    test('arrays', () => {
      const myObject = ['a']
      const myState = state((myObject))

      let event = {}

      on(myState).change((e) => {
        event = e
      })

      myState[0] = 'A'

      expect(event).toMatchObject({
        key: '0',
        value: 'A',
        oldValue: 'a',
        state: ['A'],
        target: ['A']
      })
    })
  })

  describe('delete', () => {
    test('objects', () => {
      const myObject = { a: 'a' }
      const myState = state((myObject))

      let event = {}

      on(myState).delete((e) => {
        event = e
      })

      // @ts-ignore
      delete myState.a

      expect(event).toMatchObject({
        key: 'a',
        value: undefined,
        oldValue: 'a',
        state: {},
        target: {}
      })
    })

    test('arrays', () => {
      const myObject = ['a']
      const myState = state((myObject))

      let event = {}

      on(myState).delete((e) => {
        event = e
      })

      delete myState[0]

      expect(event).toMatchObject({
        key: '0',
        value: undefined,
        oldValue: 'a',
        state: [undefined],
        target: [undefined]
      })
    })
  })

  describe('set', () => {
    test('objects', () => {
      const myObject = {}
      const myState = state((myObject))

      let event = {}

      on(myState).set((e) => {
        event = e
      })

      myState.a = 'a'

      expect(event).toMatchObject({
        key: 'a',
        value: 'a',
        oldValue: undefined,
        state: { a: 'a' },
        target: { a: 'a' }
      })

      myState.a = 'A'

      expect(event).toMatchObject({
        key: 'a',
        value: 'A',
        oldValue: 'a',
        state: { a: 'A' },
        target: { a: 'A' }
      })
    })

    test('arrays', () => {
      const myObject = []
      const myState = state((myObject))

      let event = {}

      on(myState).set((e) => {
        event = e
      })

      myState.push('a')

      expect(event).toMatchObject({
        key: '0',
        value: 'a',
        oldValue: undefined,
        state: ['a'],
        target: ['a']
      })

      myState[0] = 'A'

      expect(event).toMatchObject({
        key: '0',
        value: 'A',
        oldValue: 'a',
        state: ['A'],
        target: ['A']
      })
    })
  })
})
