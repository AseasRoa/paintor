import { describe, expect, test } from 'vitest'
import { setGetValueByIndex } from '../common/functions/set.js'
import {
  EnumObserverType,
  getSubsBy,
  subscribe,
  unsubscribe
} from './observerSubs.js'
import { state } from './state.js'

describe('observers', () => {
  // This state is used just before subscribing and
  // unsubscribing to test whether these functions
  // deal properly with states, called just before them
  const parasiteState = state({ key: 'parasiteState' })

  describe('subscribe', () => {
    test('different listeners', () => {
      const items = {}
      items[EnumObserverType.CREATE]
        = { state: state({ label: 'create' }), listener: () => {} }
      items[EnumObserverType.CHANGE]
        = { state: state({ label: 'change' }), listener: () => {} }
      items[EnumObserverType.DELETE]
        = { state: state({ label: 'delete' }), listener: () => {} }

      for (const type in items) {
        const { state, listener } = items[type]

        /**
         * Multiple attempts to create a subscription
         * with the same input data should result in
         * only 1 subscription
         */

        for (let i = 0; i < 5; i++) {
          parasiteState.key
          subscribe(state, parseInt(type), undefined, listener)
        }

        const subs = getSubsBy(parseInt(type), state, undefined)
        expect(subs?.size).toBe(1)
        expect(setGetValueByIndex(subs ?? new Set(), 0)).toBe(listener)
      }
    })

    test('same listener', () => {
      const listener = () => {}
      const items = {}
      items[EnumObserverType.CREATE]
        = { state: state({ label: 'create' }), listener: listener }
      items[EnumObserverType.CHANGE]
        = { state: state({ label: 'change' }), listener: listener }
      items[EnumObserverType.DELETE]
        = { state: state({ label: 'delete' }), listener: listener }

      for (const type in items) {
        const { state } = items[type]

        parasiteState.key
        subscribe(state, parseInt(type), undefined, listener)

        const subs = getSubsBy(parseInt(type), state, undefined)
        expect(subs?.size).toBe(1)
        expect(setGetValueByIndex(subs ?? new Set(), 0)).toBe(listener)
      }
    })
  })

  describe('unsubscribe', () => {
    test('unsubscribe by type and listener', () => {
      const stateOne = state({})
      const listenerOne = () => {}
      const listenerTwo = () => {}
      const listenerThree = () => {}

      parasiteState.key
      subscribe(stateOne, EnumObserverType.CREATE, undefined, listenerOne)
      subscribe(stateOne, EnumObserverType.CREATE, undefined, listenerTwo)
      subscribe(stateOne, EnumObserverType.CREATE, undefined, listenerThree)

      const createSubs = getSubsBy(EnumObserverType.CREATE, stateOne, undefined)

      expect(createSubs?.size).toBe(3)

      parasiteState.key
      unsubscribe(stateOne, EnumObserverType.CREATE, listenerOne)

      expect(createSubs?.size).toBe(2)

      parasiteState.key
      unsubscribe(stateOne, EnumObserverType.CREATE)

      expect(createSubs?.size).toBe(0)
    })

    test('unsubscribe by type', () => {
      const stateOne = state({ label: 'stateOne' })
      const listenerOne = () => {}
      const listenerTwo = () => {}
      const listenerThree = () => {}

      parasiteState.key
      subscribe(stateOne, EnumObserverType.CREATE, undefined, listenerOne)
      subscribe(stateOne, EnumObserverType.CREATE, undefined, listenerTwo)
      subscribe(stateOne, EnumObserverType.CREATE, undefined, listenerThree)
      parasiteState.key
      subscribe(stateOne, EnumObserverType.CREATE, 'label', listenerOne)

      const createSubs = getSubsBy(EnumObserverType.CREATE, stateOne, undefined)
      const createSubsForLabel = getSubsBy(EnumObserverType.CREATE, stateOne, 'label')

      expect(createSubs?.size).toBe(3)
      expect(createSubsForLabel?.size).toBe(1)

      parasiteState.key
      unsubscribe(stateOne, EnumObserverType.CREATE)

      expect(createSubs?.size).toBe(0)
      expect(createSubsForLabel?.size).toBe(1)

      parasiteState.key
      unsubscribe(stateOne.label, EnumObserverType.CREATE)
      expect(createSubsForLabel?.size).toBe(0)
    })

    test('unsubscribe by state', () => {
      const stateOne = state({ label: 'stateOne' })
      const listenerOne = () => {}
      const listenerTwo = () => {}
      const listenerThree = () => {}

      subscribe(stateOne, EnumObserverType.CREATE, undefined, listenerOne)
      subscribe(stateOne, EnumObserverType.CREATE, undefined, listenerTwo)
      subscribe(stateOne, EnumObserverType.CREATE, undefined, listenerThree)
      subscribe(stateOne, EnumObserverType.DELETE, undefined, listenerOne)
      subscribe(stateOne, EnumObserverType.DELETE, undefined, listenerTwo)
      subscribe(stateOne, EnumObserverType.DELETE, undefined, listenerThree)

      const createSubs = getSubsBy(EnumObserverType.CREATE, stateOne, undefined)
      const deleteSubs = getSubsBy(EnumObserverType.DELETE, stateOne, undefined)

      expect(createSubs?.size).toBe(3)
      expect(deleteSubs?.size).toBe(3)

      parasiteState.key
      unsubscribe(stateOne)

      expect(createSubs?.size).toBe(0)
      expect(deleteSubs?.size).toBe(0)
    })
  })
})
