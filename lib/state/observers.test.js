import { getSubsBy, subscribe, unsubscribe } from './observers.js'
import { state } from './state.js'

describe('observers', () => {
  // This state is used just before subscribing and
  // unsubscribing to test whether these functions
  // deal properly with states, called just before them
  const parasiteState = state({ key: 'parasiteState' })

  describe('subscribe', () => {
    test('different callbacks', () => {
      const items = {
        create: { state: state({ label: 'create' }), cb: () => {} },
        change: { state: state({ label: 'change' }), cb: () => {} },
        delete: { state: state({ label: 'delete' }), cb: () => {} },
      }

      for (const type in items) {
        const { state, cb } = items[type]

        /**
         * Multiple attempts to create a subscription
         * with the same input data should result in
         * only 1 subscription
         */

        for (let i = 0; i < 5; i++) {
          parasiteState.key
          // @ts-ignore
          subscribe(state, type, undefined, cb)
        }

        // @ts-ignore
        const subs = getSubsBy(type, state, undefined)
        expect(subs?.length).toBe(1)
        expect(subs?.[0]).toBe(cb)
      }
    })

    test('same callback', () => {
      const cb = () => {}
      const items = {
        create: { state: state({ label: 'create' }), cb: cb },
        change: { state: state({ label: 'change' }), cb: cb },
        delete: { state: state({ label: 'delete' }), cb: cb },
      }

      for (const type in items) {
        const { state } = items[type]

        parasiteState.key
        // @ts-ignore
        subscribe(state, type, undefined, cb)

        // @ts-ignore
        const subs = getSubsBy(type, state, undefined)
        expect(subs?.length).toBe(1)
        expect(subs?.[0]).toBe(cb)
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
      subscribe(stateOne, 'create', undefined, listenerOne)
      subscribe(stateOne, 'create', undefined, listenerTwo)
      subscribe(stateOne, 'create', undefined, listenerThree)

      const createSubs = getSubsBy('create', stateOne, undefined)

      expect(createSubs?.length).toBe(3)

      parasiteState.key
      unsubscribe(stateOne, 'create', listenerOne)

      expect(createSubs?.length).toBe(2)

      parasiteState.key
      unsubscribe(stateOne, 'create')

      expect(createSubs?.length).toBe(0)
    })

    test('unsubscribe by type', () => {
      const stateOne = state({ label: 'stateOne' })
      const listenerOne = () => {}
      const listenerTwo = () => {}
      const listenerThree = () => {}

      parasiteState.key
      subscribe(stateOne, 'create', undefined, listenerOne)
      subscribe(stateOne, 'create', undefined, listenerTwo)
      subscribe(stateOne, 'create', undefined, listenerThree)
      parasiteState.key
      subscribe(stateOne, 'create', 'label', listenerOne)

      const createSubs = getSubsBy('create', stateOne, undefined)
      const createSubsForLabel = getSubsBy('create', stateOne, 'label')

      expect(createSubs?.length).toBe(3)
      expect(createSubsForLabel?.length).toBe(1)

      parasiteState.key
      unsubscribe(stateOne, 'create')

      expect(createSubs?.length).toBe(0)
      expect(createSubsForLabel?.length).toBe(1)

      parasiteState.key
      unsubscribe(stateOne.label, 'create')
      expect(createSubsForLabel?.length).toBe(0)
    })

    test('unsubscribe by state', () => {
      const stateOne = state({ label: 'stateOne' })
      const listenerOne = () => {}
      const listenerTwo = () => {}
      const listenerThree = () => {}

      subscribe(stateOne, 'create', undefined, listenerOne)
      subscribe(stateOne, 'create', undefined, listenerTwo)
      subscribe(stateOne, 'create', undefined, listenerThree)
      subscribe(stateOne, 'delete', undefined, listenerOne)
      subscribe(stateOne, 'delete', undefined, listenerTwo)
      subscribe(stateOne, 'delete', undefined, listenerThree)

      const createSubs = getSubsBy('create', stateOne, undefined)
      const deleteSubs = getSubsBy('delete', stateOne, undefined)

      expect(createSubs?.length).toBe(3)
      expect(deleteSubs?.length).toBe(3)

      parasiteState.key
      unsubscribe(stateOne)

      expect(createSubs?.length).toBe(0)
      expect(deleteSubs?.length).toBe(0)
    })
  })
})
