import { setGetValueByIndex } from '../functions/set.js'
import { EnumTypes, getSubsBy, subscribe, unsubscribe } from './observers.js'
import { state } from './state.js'

describe('observers', () => {
  // This state is used just before subscribing and
  // unsubscribing to test whether these functions
  // deal properly with states, called just before them
  const parasiteState = state({ key: 'parasiteState' })

  describe('subscribe', () => {
    test('different listeners', () => {
      const items = {}
      items[EnumTypes.CREATE]
        = { state: state({ label: 'create' }), listener: () => {} }
      items[EnumTypes.CHANGE]
        = { state: state({ label: 'change' }), listener: () => {} }
      items[EnumTypes.DELETE]
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
          // @ts-ignore
          subscribe(state, type, undefined, listener)
        }

        // @ts-ignore
        const subs = getSubsBy(type, state, undefined)
        expect(subs?.size).toBe(1)
        expect(setGetValueByIndex(subs ?? new Set(), 0)).toBe(listener)
      }
    })

    test('same listener', () => {
      const listener = () => {}
      const items = {}
      items[EnumTypes.CREATE]
        = { state: state({ label: 'create' }), listener: listener }
      items[EnumTypes.CHANGE]
        = { state: state({ label: 'change' }), listener: listener }
      items[EnumTypes.DELETE]
        = { state: state({ label: 'delete' }), listener: listener }

      for (const type in items) {
        const { state } = items[type]

        parasiteState.key
        // @ts-ignore
        subscribe(state, type, undefined, listener)

        // @ts-ignore
        const subs = getSubsBy(type, state, undefined)
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
      subscribe(stateOne, EnumTypes.CREATE, undefined, listenerOne)
      subscribe(stateOne, EnumTypes.CREATE, undefined, listenerTwo)
      subscribe(stateOne, EnumTypes.CREATE, undefined, listenerThree)

      const createSubs = getSubsBy(EnumTypes.CREATE, stateOne, undefined)

      expect(createSubs?.size).toBe(3)

      parasiteState.key
      unsubscribe(stateOne, EnumTypes.CREATE, listenerOne)

      expect(createSubs?.size).toBe(2)

      parasiteState.key
      unsubscribe(stateOne, EnumTypes.CREATE)

      expect(createSubs?.size).toBe(0)
    })

    test('unsubscribe by type', () => {
      const stateOne = state({ label: 'stateOne' })
      const listenerOne = () => {}
      const listenerTwo = () => {}
      const listenerThree = () => {}

      parasiteState.key
      subscribe(stateOne, EnumTypes.CREATE, undefined, listenerOne)
      subscribe(stateOne, EnumTypes.CREATE, undefined, listenerTwo)
      subscribe(stateOne, EnumTypes.CREATE, undefined, listenerThree)
      parasiteState.key
      subscribe(stateOne, EnumTypes.CREATE, 'label', listenerOne)

      const createSubs = getSubsBy(EnumTypes.CREATE, stateOne, undefined)
      const createSubsForLabel = getSubsBy(EnumTypes.CREATE, stateOne, 'label')

      expect(createSubs?.size).toBe(3)
      expect(createSubsForLabel?.size).toBe(1)

      parasiteState.key
      unsubscribe(stateOne, EnumTypes.CREATE)

      expect(createSubs?.size).toBe(0)
      expect(createSubsForLabel?.size).toBe(1)

      parasiteState.key
      unsubscribe(stateOne.label, EnumTypes.CREATE)
      expect(createSubsForLabel?.size).toBe(0)
    })

    test('unsubscribe by state', () => {
      const stateOne = state({ label: 'stateOne' })
      const listenerOne = () => {}
      const listenerTwo = () => {}
      const listenerThree = () => {}

      subscribe(stateOne, EnumTypes.CREATE, undefined, listenerOne)
      subscribe(stateOne, EnumTypes.CREATE, undefined, listenerTwo)
      subscribe(stateOne, EnumTypes.CREATE, undefined, listenerThree)
      subscribe(stateOne, EnumTypes.DELETE, undefined, listenerOne)
      subscribe(stateOne, EnumTypes.DELETE, undefined, listenerTwo)
      subscribe(stateOne, EnumTypes.DELETE, undefined, listenerThree)

      const createSubs = getSubsBy(EnumTypes.CREATE, stateOne, undefined)
      const deleteSubs = getSubsBy(EnumTypes.DELETE, stateOne, undefined)

      expect(createSubs?.size).toBe(3)
      expect(deleteSubs?.size).toBe(3)

      parasiteState.key
      unsubscribe(stateOne)

      expect(createSubs?.size).toBe(0)
      expect(deleteSubs?.size).toBe(0)
    })
  })
})
