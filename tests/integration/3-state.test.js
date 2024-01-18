/* eslint-disable vitest/expect-expect */

import { component, state } from '#paintor'
import { expectTextContentsToBeLike } from './functions.js'

describe('State', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('Simple Counter', () => {
    test('DOM', () => {
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

    test('HTML-DOM', () => {
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
  })

  describe('.forEach()', () => {
    describe('New DOM element, created from the State, is reactive', () => {
      test('DOM', () => {
        const container = document.body

        /** @type {Object<string, {color: string}>} */
        const globalState = state({})

        component(($) => {
          $.forEach(globalState, (item, key) => {
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

      test('HTML-DOM', () => {
        const container = document.body

        /** @type {Object<string, {color: string}>} */
        const globalState = state({})

        component(($) => {
          $.forEach(globalState, (item, key) => {
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
    })

    describe('with fallback handler', () => {
      test('DOM', () => {
        const container = document.body

        /** @type {string[]} */
        const globalState = state([])

        component(($) => {
          $.ul(
            $.forEach(
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
          'reactive-begin',
          'initial',
          'reactive-end',
        ])

        globalState.push('something')

        ul = container.getElementsByTagName('ul')[0]

        expectTextContentsToBeLike(ul?.childNodes, [
          'reactive-begin',
          'something',
          'reactive-end',
        ])

        globalState.pop()

        ul = container.getElementsByTagName('ul')[0]

        expectTextContentsToBeLike(ul?.childNodes, [
          'reactive-begin',
          'initial',
          'reactive-end',
        ])

        // Now try when .length is used to clear the array

        globalState.push('something')

        ul = container.getElementsByTagName('ul')[0]

        expectTextContentsToBeLike(ul?.childNodes, [
          'reactive-begin',
          'something',
          'reactive-end',
        ])

        globalState.length = 0

        ul = container.getElementsByTagName('ul')[0]

        expectTextContentsToBeLike(ul?.childNodes, [
          'reactive-begin',
          'initial',
          'reactive-end',
        ])
      })
    })

    describe('Update inside the state', () => {
      test('DOM', () => {
        const container = document.body

        const theState = state({ items: [ 'a', 'b', 'c'] })

        component(($) => {
          $.forEach(theState.items, (value) => {
            $.div(value)
          })
        }).paint(container)

        let elements = container.querySelectorAll('*')

        expectTextContentsToBeLike(elements, ['a', 'b', 'c'])

        theState.items = [ 'd', 'e' ]

        elements = container.querySelectorAll('*')

        expectTextContentsToBeLike(elements, ['d', 'e'])
      })
    })

    describe('Update the state (with object)', () => {
      test('DOM', () => {
        const container = document.body

        /** @type {{items: Object<string, string>}} */
        const theState = state({ items: { a: 'a', b: 'b', c: 'c' } })

        component(($) => {
          $.forEach(theState, (value) => {
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
    })

    describe('Update the state (with inner array)', () => {
      /**
       * This test ensures that when an inner array state is changed by length
       * (which happens internally), this doesn't interfere with the elements
       * printed for the main state.
       */
      test('DOM', () => {
        const container = document.body

        /** @type {{mainState: {innerArrayState: any[]}}} */
        const theState = state({
          mainState: { innerArrayState: [] },
        })

        component(($) => {
          let counter = 0

          $.forState(theState.mainState.innerArrayState, () => {
            counter += 1
            $.div(counter)
          })
        }).paint(container)

        let elements = container.querySelectorAll('*')

        expectTextContentsToBeLike(elements, { innerArrayState: '1' })

        // Array length set to 2. Only one div should remain, but updated.
        theState.mainState = { innerArrayState: [ 1, 2 ] }

        elements = container.querySelectorAll('*')

        expectTextContentsToBeLike(elements, { innerArrayState: '2' })

        // Array length set back to 0. Only one div should remain, but updated.
        theState.mainState = { innerArrayState: [] }

        elements = container.querySelectorAll('*')

        expectTextContentsToBeLike(elements, { innerArrayState: '3' })
      })
    })

    describe('Nested', () => {
      test('DOM', () => {
        const container = document.body

        /** @type {{a: {b: Object<string, string>}}} */
        const theState = state({ a: { b: { c: 'C' } } })

        component(($) => {
          $.div(
            $.forEach(theState, (a) => {
              // @ts-ignore
              $.forEach(a.b, (value, key) => {
                $.button(`${key}-${value}`)
              })
            })
          )
        }).paint(container)

        let elements = container.getElementsByTagName('div')[0]

        expectTextContentsToBeLike(elements?.childNodes, [
          'reactive-begin',
          'reactive-begin',
          'c-C',
          'reactive-end',
          'reactive-end',
        ])

        theState.a = { b: { d: 'D' } }

        elements = container.getElementsByTagName('div')[0]

        expectTextContentsToBeLike(elements?.childNodes, [
          'reactive-begin',
          'reactive-begin',
          'd-D',
          'reactive-end',
          'reactive-end',
        ])

        theState.a.b = { e: 'E' }

        elements = container.getElementsByTagName('div')[0]

        expectTextContentsToBeLike(elements?.childNodes, [
          'reactive-begin',
          'reactive-begin',
          'e-E',
          'reactive-end',
          'reactive-end',
        ])

        theState.a = { b: { f: 'F' } }

        elements = container.getElementsByTagName('div')[0]

        expectTextContentsToBeLike(elements?.childNodes, [
          'reactive-begin',
          'reactive-begin',
          'f-F',
          'reactive-end',
          'reactive-end',
        ])
      })
    })

    describe('Nested, testing the deletion of inner elements', () => {
      test('DOM', () => {
        const container = document.body

        /** @type {{a: {b: Object<string, string>}}} */
        const theState = state({ a: { b: { c: 'C' } } })

        component(($) => {
          $.div(
            $.forEach(theState, (a) => {
              // @ts-ignore
              $.forEach(a.b, (value, key) => {
                $.button(`${key}-${value}`)
              })
            })
          )
        }).paint(container)

        let elements = container.getElementsByTagName('div')[0]

        expectTextContentsToBeLike(elements?.childNodes, [
          'reactive-begin',
          'reactive-begin',
          'c-C',
          'reactive-end',
          'reactive-end',
        ])

        theState.a.b = { c1: 'C1', c2: 'C2', c3: 'C3' }

        elements = container.getElementsByTagName('div')[0]

        expectTextContentsToBeLike(elements?.childNodes, [
          'reactive-begin',
          'reactive-begin',
          'c1-C1',
          'c2-C2',
          'c3-C3',
          'reactive-end',
          'reactive-end',
        ])

        theState.a = { b: { d: 'D' } }

        elements = container.getElementsByTagName('div')[0]

        expectTextContentsToBeLike(elements?.childNodes, [
          'reactive-begin',
          'reactive-begin',
          'd-D',
          'reactive-end',
          'reactive-end',
        ])
      })
    })
  })
})
