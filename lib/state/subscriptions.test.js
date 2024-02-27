/* eslint-disable init-declarations */

import {
  getElementIndexes,
  getSubsBy,
  migrateStates,
  migrateSubscriptions,
  subscribe,
  unsubscribe
} from './subscriptions.js'

describe('subscriptions', () => {
  /** @type {State} */
  let state
  /** @type {StateProp} */
  let stateProp
  /** @type {BindFn} */
  let bindFn
  /** @type {Element | Comment} */
  let element
  /** @type {string} */
  let elementProp
  /** @type {string} */
  let elementInnerProp
  /** @type {RepaintFn} */
  let repaintFn

  /** @type {StateProp} */
  let statePropTwo
  /** @type {BindFn} */
  let bindFnTwo


  beforeEach(() => {
    state = { label: 'state' }
    stateProp = 'stateProp'
    bindFn = () => {}
    element = document.createElement('div')
    elementProp = 'elementProp'
    elementInnerProp = 'elementInnerProp'
    repaintFn = () => {}

    statePropTwo = 'statePropTwo'
    bindFnTwo = () => {}

    /**
     * Multiple attempts to create a subscription
     * with the same input data should result in
     * only 1 subscription
     */

    // Create first sub
    for (let i = 0; i < 5; i++) {
      subscribe(
        state,
        stateProp,
        bindFn,
        element,
        elementProp,
        elementInnerProp,
        repaintFn
      )
    }

    // Create second sub
    for (let i = 0; i < 5; i++) {
      subscribe(
        state,
        statePropTwo,
        bindFn,
        element,
        elementProp,
        elementInnerProp,
        repaintFn
      )
    }

    // Create third sub under the state prop of the second sub
    for (let i = 0; i < 5; i++) {
      subscribe(
        state,
        statePropTwo,
        bindFnTwo,
        element,
        elementProp,
        elementInnerProp,
        repaintFn
      )
    }
  })

  test('subscribe', () => {
    // Check subscriptions
    // Note: toMatchObject doesn't work property with elements

    let subs = getSubsBy(state, stateProp)

    expect(subs?.size).toBe(1)
    expect(subs?.get(bindFn)?.element).toBe(element)
    expect(subs?.get(bindFn)?.elementProp).toBe(elementProp)
    expect(subs?.get(bindFn)?.elementInnerProp).toBe(elementInnerProp)
    expect(subs?.get(bindFn)?.repaintFn).toBe(repaintFn)

    subs = getSubsBy(state, statePropTwo)

    expect(subs?.size).toBe(2)
    expect(subs?.get(bindFn)?.element).toBe(element)
    expect(subs?.get(bindFn)?.elementProp).toBe(elementProp)
    expect(subs?.get(bindFn)?.elementInnerProp).toBe(elementInnerProp)
    expect(subs?.get(bindFn)?.repaintFn).toBe(repaintFn)

    expect(subs?.get(bindFnTwo)?.element).toBe(element)
    expect(subs?.get(bindFnTwo)?.elementProp).toBe(elementProp)
    expect(subs?.get(bindFnTwo)?.elementInnerProp).toBe(elementInnerProp)
    expect(subs?.get(bindFnTwo)?.repaintFn).toBe(repaintFn)

    // Check indexes
    const elementIndexes = getElementIndexes(element)

    expect(elementIndexes?.length).toBe(3)
    expect(elementIndexes).toMatchObject(
      [
        [state, stateProp, bindFn],
        [state, statePropTwo, bindFn],
        [state, statePropTwo, bindFnTwo]
      ]
    )
  })

  test('unsubscribe all', () => {
    unsubscribe(element)
    expect(getElementIndexes(element)).toBeFalsy()
  })

  test('unsubscribe by stateProp', () => {
    expect(getElementIndexes(element)?.length).toBe(3)

    expect(getSubsBy(state, stateProp)?.size).toBe(1)
    unsubscribe(element, stateProp)
    expect(getSubsBy(state, stateProp)).toBeFalsy()

    expect(getElementIndexes(element)?.length).toBe(2)

    expect(getSubsBy(state, statePropTwo)?.size).toBe(2)
    unsubscribe(element, statePropTwo)
    expect(getSubsBy(state, statePropTwo)).toBeFalsy()

    expect(getElementIndexes(element)).toBeFalsy()
  })

  test('unsubscribe by bindFn', () => {
    expect(getElementIndexes(element)?.length).toBe(3)

    expect(getSubsBy(state, stateProp)?.size).toBe(1)
    unsubscribe(element, undefined, bindFn)
    expect(getSubsBy(state, stateProp)).toBeFalsy()


    expect(getElementIndexes(element)?.length).toBe(1)

    expect(getSubsBy(state, statePropTwo)?.size).toBe(1)
    unsubscribe(element, undefined, bindFnTwo)
    expect(getSubsBy(state, statePropTwo)).toBeFalsy()

    expect(getElementIndexes(element)).toBeFalsy()
  })

  test('migrateStates', () => {
    const newState = { label: 'newState' }

    expect(getSubsBy(state, stateProp)?.size).toBe(1)
    expect(getSubsBy(state, statePropTwo)?.size).toBe(2)

    migrateStates(state, newState)

    expect(getSubsBy(state, stateProp)).toBeFalsy()
    expect(getSubsBy(state, statePropTwo)).toBeFalsy()

    expect(getSubsBy(newState, stateProp)?.size).toBe(1)
    expect(getSubsBy(newState, statePropTwo)?.size).toBe(2)
  })

  test('migrateSubscriptions', () => {
    const fromElement = element
    const toElement = document.createElement('span')

    expect(getElementIndexes(fromElement)?.length).toBe(3)
    expect(getElementIndexes(toElement)).toBeFalsy()

    migrateSubscriptions(fromElement, toElement)

    expect(getElementIndexes(fromElement)).toBeFalsy()
    expect(getElementIndexes(toElement)?.length).toBe(3)

    expect(getElementIndexes(toElement)).toMatchObject(
      [
        [state, stateProp, bindFn],
        [state, statePropTwo, bindFn],
        [state, statePropTwo, bindFnTwo]
      ]
    )

    let subs = getSubsBy(state, stateProp)

    expect(subs?.size).toBe(1)
    expect(subs?.get(bindFn)?.element).toBe(toElement)

    subs = getSubsBy(state, statePropTwo)
    expect(subs?.size).toBe(2)
    expect(subs?.get(bindFn)?.element).toBe(toElement)
    expect(subs?.get(bindFnTwo)?.element).toBe(toElement)
  })

  test('migrateSubscriptions bindFn', () => {
    const fromElement = element
    const toElement = document.createElement('span')

    expect(getElementIndexes(fromElement)?.length).toBe(3)
    expect(getElementIndexes(toElement)).toBeFalsy()

    migrateSubscriptions(
      fromElement,
      toElement,
      statePropTwo,
      bindFn,
      { elementProp: 'textContent' }
    )

    expect(getElementIndexes(fromElement)?.length).toBe(2)
    expect(getElementIndexes(toElement)?.length).toBe(1)

    expect(getElementIndexes(fromElement)).toMatchObject(
      [
        [state, stateProp, bindFn],
        [state, statePropTwo, bindFnTwo]
      ]
    )
    expect(getElementIndexes(toElement)).toMatchObject(
      [
        [state, statePropTwo, bindFn]
      ]
    )

    let subs = getSubsBy(state, stateProp)

    expect(subs?.size).toBe(1)
    expect(subs?.get(bindFn)?.element).toBe(fromElement)
    expect(subs?.get(bindFn)?.elementProp).toBe('elementProp')

    subs = getSubsBy(state, statePropTwo)
    expect(subs?.size).toBe(2)
    expect(subs?.get(bindFn)?.element).toBe(toElement)
    expect(subs?.get(bindFn)?.elementProp).toBe('textContent')
    expect(subs?.get(bindFnTwo)?.element).toBe(fromElement)
    expect(subs?.get(bindFnTwo)?.elementProp).toBe('elementProp')
  })
})
