/* eslint-disable vitest/expect-expect */

import { component, state } from '#paintor'
import { expectTextContentsToBeLike } from './functions.js'

describe('State', () => {
  const id = 'container'

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('(DOM) Simple Counter', () => {
    const container = document.body

    const globalState = state({ clicks: 0 })

    component(($) => {
      $.button({
        textContent: 'Click me',
        onClick: () => {
          globalState.clicks += 1
        },
      })
      $.p({ textContent: () => (globalState.clicks) })
    }).paint(container)

    const button = container.getElementsByTagName('button')[0]
    const p = container.getElementsByTagName('p')[0]

    expect(button instanceof HTMLButtonElement).toBe(true)
    expect(p instanceof HTMLParagraphElement).toBe(true)
    expect(p?.textContent).toBe('0')

    for (let i = 0; i < 10; i++) {
      button?.click()
    }

    expect(p?.textContent).toBe('10')
  })

  test('(HTML-DOM) Simple Counter', () => {
    const container = document.body

    const globalState = state({ clicks: 0 })

    component(($) => {
      $.html`
<button onclick="${() => globalState.clicks += 1}">Click me</button>
<p>${() => (globalState.clicks)}</p>
      `
    }).paint(container)

    const button = container.getElementsByTagName('button')[0]
    const p = container.getElementsByTagName('p')[0]

    expect(button instanceof HTMLButtonElement).toBe(true)
    expect(p instanceof HTMLParagraphElement).toBe(true)
    expect(p?.textContent).toBe('0')

    for (let i = 0; i < 10; i++) {
      button?.click()
    }

    expect(p?.textContent).toBe('10')
  })

  test('(DOM) New DOM element, created from the State, is reactive', () => {
    const container = document.body

    /** @type {Object<string, {color: string}>} */
    const globalState = state({})

    component(($) => {
      $.forState(globalState,(item, key) => {
        $.div(
          { style: { color: () => item.color } },
          () => `${key}:${item.color}`,
        )
      })
    }).paint(container)

    // Initially we have no <li> elements
    let div = container.getElementsByTagName('div')[0]

    expect(div).toBeUndefined()

    // Create one <li> element
    globalState['item'] = { color: 'red' }

    div = container.getElementsByTagName('div')[0]

    expect(div instanceof HTMLDivElement).toBe(true)
    expect(div?.textContent).toBe('item:red')
    expect(div?.style.color).toBe('red')

    // Change text content
    globalState['item'].color = 'blue'
    expect(div?.textContent).toBe('item:blue')
    expect(div?.style.color).toBe('blue')
  })

  test('(HTML-DOM) New DOM element, created from the State, is reactive', () => {
    const container = document.body

    /** @type {Object<string, {color: string}>} */
    const globalState = state({})

    component(($) => {
      $.forState(globalState, (item, key) => {
        $.html`
<div style="color: ${() => item.color}">${() => `${key}:${item.color}`}</div>
`
      })
    }).paint(container)

    // Initially we have no <li> elements
    let div = container.getElementsByTagName('div')[0]

    expect(div).toBeUndefined()

    // Create one <li> element
    globalState['item'] = { color: 'red' }

    div = container.getElementsByTagName('div')[0]

    expect(div instanceof HTMLDivElement).toBe(true)
    expect(div?.textContent).toBe('item:red')
    expect(div?.style.color).toBe('red')

    // Change text content
    globalState['item'].color = 'blue'
    expect(div?.textContent).toBe('item:blue')
    expect(div?.style.color).toBe('blue')
  })

  test('(DOM) forState() with fallback handler', () => {
    const container = document.body

    /** @type {string[]} */
    const globalState = state([])

    component(($) => {
      $.ul(
        $.forState(
          globalState,
          (item) => {
            $.li(item)
          },
          () => {
            $.li('initial')
          },
        ),
      )
    }).paint(container)

    // Initially we have no <li> elements
    let ul = container.getElementsByTagName('ul')[0]

    expectTextContentsToBeLike(ul?.childNodes, [
      'forState-begin',
      'initial',
      'forState-end',
    ])

    globalState.push('something')

    ul = container.getElementsByTagName('ul')[0]

    expectTextContentsToBeLike(ul?.childNodes, [
      'forState-begin',
      'something',
      'forState-end',
    ])

    globalState.pop()

    ul = container.getElementsByTagName('ul')[0]

    expectTextContentsToBeLike(ul?.childNodes, [
      'forState-begin',
      'initial',
      'forState-end',
    ])

    // Now try when .length is used to clear the array

    globalState.push('something')

    ul = container.getElementsByTagName('ul')[0]

    expectTextContentsToBeLike(ul?.childNodes, [
      'forState-begin',
      'something',
      'forState-end',
    ])

    globalState.length = 0

    ul = container.getElementsByTagName('ul')[0]

    expectTextContentsToBeLike(ul?.childNodes, [
      'forState-begin',
      'initial',
      'forState-end',
    ])
  })

  test('(DOM) Update inside the state, using forState', () => {
    const container = document.body

    const theState = state({ items: [ 'a', 'b', 'c'] })

    component(($) => {
      $.forState(theState.items, (value) => {
        $.div(value)
      })
    }).paint(container)

    let elements = container.querySelectorAll('*')

    expectTextContentsToBeLike(elements, ['a', 'b', 'c'])

    theState.items = [ 'd', 'e' ]

    elements = container.querySelectorAll('*')

    expectTextContentsToBeLike(elements, ['d', 'e'])
  })

  test('(DOM) Update the state (with object), using forState', () => {
    const container = document.body

    /** @type {{items: Object<string, string>}} */
    const theState = state({ items: { a: 'a', b: 'b', c: 'c' } })

    component(($) => {
      $.forState(theState, (value) => {
        if (value instanceof Object) {
          for (const k in value) {
            $.div(value[k])
          }
        }
      })
    }).paint(container)

    let elements = container.querySelectorAll('*')

    expectTextContentsToBeLike(elements, { a: 'a', b: 'b', c: 'c' })

    theState.items = { d: 'd', e: 'e' }

    elements = container.querySelectorAll('*')

    expectTextContentsToBeLike(elements, { d: 'd', e: 'e' })
  })

  /**
   * This test ensures that when an inner array state is changed by length
   * (which happens internally), this doesn't interfere with the elements
   * printed for the main state.
   */
  test('(DOM) Update the state (with inner array), using forState', () => {
    const container = document.body

    /** @type {{mainState: {innerArrayState: any[]}}} */
    const theState = state({
      mainState: { innerArrayState: [] },
    })

    component(($) => {
      let counter = 0

      $.forState(theState.mainState, (value, key) => {
        // @ts-ignore
        if (key === 'innerArrayState') { // not necessary
          counter += 1
          $.div(`${key}-${counter}`)
        }
      })
    }).paint(container)

    let elements = container.querySelectorAll('*')

    expectTextContentsToBeLike(elements, { innerArrayState: 'innerArrayState-1' })

    // Array length set to 2. Only one div should remain, but updated.
    theState.mainState = { innerArrayState: [ 1, 2 ] }

    elements = container.querySelectorAll('*')

    expectTextContentsToBeLike(elements, { innerArrayState: 'innerArrayState-2' })

    // Array length set back to 0. Only one div should remain, but updated.
    theState.mainState = { innerArrayState: [] }

    elements = container.querySelectorAll('*')

    expectTextContentsToBeLike(elements, { innerArrayState: 'innerArrayState-3' })
  })

  test('(DOM) forState in forState', () => {
    const container = document.body

    /** @type {{a: {b: Object<string, string>}}} */
    const theState = state({ a: { b: { c: 'C' } } })

    component(($) => {
      $.div(
        $.forState(theState, (a) => {
          // @ts-ignore
          $.forState(a.b, (value, key) => {
            $.button(key + '-' + value)
          })
        }),
      )
    }).paint(container)

    let elements = container.getElementsByTagName('div')[0]

    expectTextContentsToBeLike(elements?.childNodes, [
      'forState-begin',
      'forState-begin',
      'c-C',
      'forState-end',
      'forState-end',
    ])

    theState.a = { b: { d: 'D' } }

    elements = container.getElementsByTagName('div')[0]

    expectTextContentsToBeLike(elements?.childNodes, [
      'forState-begin',
      'forState-begin',
      'd-D',
      'forState-end',
      'forState-end',
    ])

    theState.a.b = { e: 'E' }

    elements = container.getElementsByTagName('div')[0]

    expectTextContentsToBeLike(elements?.childNodes, [
      'forState-begin',
      'forState-begin',
      'e-E',
      'forState-end',
      'forState-end',
    ])

    theState.a = { b: { f: 'F' } }

    elements = container.getElementsByTagName('div')[0]

    expectTextContentsToBeLike(elements?.childNodes, [
      'forState-begin',
      'forState-begin',
      'f-F',
      'forState-end',
      'forState-end',
    ])
  })

  test('(DOM) forState in forState, testing the deletion of inner elements', () => {
    const container = document.body

    /** @type {{a: {b: Object<string, string>}}} */
    const theState = state({ a: { b: { c: 'C' } } })

    component(($) => {
      $.div(
        $.forState(theState, (a) => {
          // @ts-ignore
          $.forState(a.b, (value, key) => {
            $.button(key + '-' + value)
          })
        }),
      )
    }).paint(container)

    let elements = container.getElementsByTagName('div')[0]

    expectTextContentsToBeLike(elements?.childNodes, [
      'forState-begin',
      'forState-begin',
      'c-C',
      'forState-end',
      'forState-end',
    ])

    theState.a.b = { c1: 'C1', c2: 'C2', c3: 'C3' }

    elements = container.getElementsByTagName('div')[0]

    expectTextContentsToBeLike(elements?.childNodes, [
      'forState-begin',
      'forState-begin',
      'c1-C1',
      'c2-C2',
      'c3-C3',
      'forState-end',
      'forState-end',
    ])

    theState.a = { b: { d: 'D' } }

    elements = container.getElementsByTagName('div')[0]

    expectTextContentsToBeLike(elements?.childNodes, [
      'forState-begin',
      'forState-begin',
      'd-D',
      'forState-end',
      'forState-end',
    ])
  })
})
