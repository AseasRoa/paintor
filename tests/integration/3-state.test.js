/* eslint-disable vitest/expect-expect */

import { beforeEach, describe, expect, test } from 'vitest'
import { expectTextContentsToBeLike } from './functions.js'
import { component, setState, state, template } from '#paintor'

describe('State', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('Simple Counter', () => {
    test('DOM', () => {
      const container = document.body

      const globalState = state({ clicks: 0 })

      component((x) => {
        x.button({
          textContent: 'Click me',
          onClick: () => {
            globalState.clicks += 1
          },
        })
        x.p({ textContent: () => (globalState.clicks) })
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

      component((x) => {
        x.$html`
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

  describe('Same bind function in many templates', () => {
    test('DOM', () => {
      const container = document.body

      const globalState = state({ tick: 0 })

      const tick = () => globalState.tick

      const buttonTpl = template((x) => {
        x.button({ textContent: tick })
      })

      const paragraphTpl = template((x) => {
        x.p(tick)
      })

      component(buttonTpl, paragraphTpl).paint(container)

      globalState.tick += 1
      globalState.tick += 1
      globalState.tick += 1

      const button = container.getElementsByTagName('button')[0]
      const p = container.getElementsByTagName('p')[0]

      expect(button?.textContent).toBe('3')
      expect(p?.textContent).toBe('3')
    })
  })

  describe('Reactive .if()', () => {
    describe('Basic test', () => {
      test('DOM', () => {
        const container = document.body

        /** @type {[boolean]} */
        const globalState = state([false])
        let count = 0

        component((x) => {
          x.$if(() => globalState[0], () => {
            count += 1
            x.div(count)
          })
        }).paint(container)

        let elements = container.querySelectorAll('div')

        expect(elements[0]).toBeUndefined()

        globalState[0] = !globalState[0] // set to true
        globalState[0] = !globalState[0] // set to false
        globalState[0] = !globalState[0] // set to true

        elements = container.querySelectorAll('div')

        expect(elements[0] instanceof HTMLDivElement).toBe(true)
        expectTextContentsToBeLike(elements, ['2'])
      })
    })
  })

  describe('Reactive .$for()', () => {
    describe('Basic test', () => {
      test('DOM', () => {
        const container = document.body

        /** @type {[number, number]} */
        const globalState = state([0, 0])
        let count = 0

        component((x) => {
          x.$repeat(
            () => globalState[0],
            () => globalState[1],
            (key) => {
              count += 1
              x.div(key)
            }
          )
        }).paint(container)

        let elements = container.querySelectorAll('div')

        expectTextContentsToBeLike(elements, ['0'])
        expect(count).toBe(1)

        globalState[1] = 2

        elements = container.querySelectorAll('div')
        expectTextContentsToBeLike(elements, ['0', '1', '2'])
        expect(count).toBe(4)

        globalState[0] = 1

        elements = container.querySelectorAll('div')
        expectTextContentsToBeLike(elements, ['1', '2'])
        expect(count).toBe(6)
      })
    })
  })

  describe('.$each()', () => {
    describe('New element is reactive?', () => {
      test('DOM', () => {
        const container = document.body

        /** @type {Record<string, {color: string}>} */
        const globalState = state({})

        component((x) => {
          x.$each(globalState, (item, key) => {
            if (!item) return

            x.div(
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

        /** @type {Record<string, {color: string}>} */
        const globalState = state({})

        component((x) => {
          x.$each(globalState, (item, key) => {
            if (!item) return

            x.$html`
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

    describe('Updated element is still reactive?', () => {
      test('DOM', () => {
        const container = document.body

        /** @type {{ a: number }[]} */
        const theState = state([{ a: 0 }])

        component((x) => {
          x.div(
            x.$each(theState, (value) => {
              x.div(() => {
                return value.a
              })
            })
          )
        }).paint(container)

        let div = container.getElementsByTagName('div')[0]
        expectTextContentsToBeLike(div?.childNodes, [
          'reactive-begin',
          '0',
          'reactive-end',
        ])

        // Update the whole element
        theState[0] = { a: 1 }

        div = container.getElementsByTagName('div')[0]
        expectTextContentsToBeLike(div?.childNodes, [
          'reactive-begin',
          '1',
          'reactive-end',
        ])

        // Update key in the element
        theState[0].a = 2

        div = container.getElementsByTagName('div')[0]
        expectTextContentsToBeLike(div?.childNodes, [
          'reactive-begin',
          '2',
          'reactive-end',
        ])
      })
    })

    describe('With fallback handler', () => {
      test('DOM', () => {
        const container = document.body

        /** @type {string[]} */
        const globalState = state([])

        component((x) => {
          x.ul(
            x.$each(
              globalState,
              (item) => x.li(item),
              () => x.li('initial'),
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

        component((x) => {
          x.$each(theState.items, (value) => {
            x.div(value)
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

        component((x) => {
          x.$each(theState, (value) => {
            if (typeof value === 'object') {
              for (const k in value) {
                x.div(value[k])
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

    describe('Nested', () => {
      test('DOM', () => {
        const container = document.body

        /** @type {{a: {b: Object<string, string>}}} */
        const theState = state({ a: { b: { c: 'C' } } })

        component((x) => {
          x.div(
            x.$each(theState, (a) => {
              // @ts-expect-error
              x.$each(a.b, (value, key) => {
                x.button(`${key}-${value}`)
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

        component((x) => {
          x.div(
            x.$each(theState, (a) => {
              // @ts-expect-error
              x.$each(a.b, (value, key) => {
                x.button(`${key}-${value}`)
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

    describe('State, containing the same object multiple times', () => {
      describe('array state', () => {
        test('DOM', () => {
          const container = document.body

          const zero = { label: 'zero' }
          const globalState = state([
            zero,
            { label: 'one' },
            { label: 'two' }
          ])

          component((x) => {
            x.$each(globalState, (item) => {
              x.div(() => item.label)
            })
          }).paint(container)

          let divs = container.querySelectorAll('div')

          expect(divs.length).toBe(3)

          // @ts-expect-error
          globalState.push(globalState[0])

          divs = container.querySelectorAll('div')
          expectTextContentsToBeLike(divs, ['zero', 'one', 'two', 'zero'])

          // @ts-expect-error
          globalState[1] = globalState[2]
          divs = container.querySelectorAll('div')
          expectTextContentsToBeLike(divs, ['zero', 'two', 'two', 'zero'])

          // @ts-expect-error
          globalState[0].label = 'ZERO'
          // @ts-expect-error
          globalState[1].label = 'TWO'
          divs = container.querySelectorAll('div')
          expectTextContentsToBeLike(divs, ['ZERO', 'TWO', 'TWO', 'ZERO'])
        })
      })

      describe('object state', () => {
        test('DOM', () => {
          const container = document.body

          const zero = { label: 'zero' }
          const globalState = state({
            zero: zero,
            one: { label: 'one' },
            two: { label: 'two' }
          })

          component((x) => {
            x.$each(globalState, (item) => {
              // @ts-expect-error
              x.div(() => item.label)
            })
          }).paint(container)

          let divs = container.querySelectorAll('div')

          expect(divs.length).toBe(3)

          // @ts-expect-error
          globalState.three = globalState.zero

          divs = container.querySelectorAll('div')
          expectTextContentsToBeLike(divs, ['zero', 'one', 'two', 'zero'])

          globalState.one = globalState.two
          divs = container.querySelectorAll('div')
          expectTextContentsToBeLike(divs, ['zero', 'two', 'two', 'zero'])

          globalState.zero.label = 'ZERO'
          globalState.one.label = 'TWO'
          divs = container.querySelectorAll('div')
          expectTextContentsToBeLike(divs, ['ZERO', 'TWO', 'TWO', 'ZERO'])
        })
      })
    })

    /**
     * Checking the correct amount of callback passes
     */
    describe('Performance', () => {
      test('DOM', () => {
        const container = document.body

        /** @type {{ a: number }[]} */
        const theState = state([])
        let passes1 = 0
        let passes2 = 0

        component((x) => {
          x.div(
            x.$each(theState, (value) => {
              passes1 += 1

              x.div(() => {
                passes2 += 1

                return value.a
              })
            })
          )
        }).paint(container)

        for (let i = 0; i < 10; i++) {
          theState[i] = { a: i }
        }

        expect(passes1).toBe(10)
        expect(passes2).toBe(10)
      })
    })
  })

  describe('.$state', () => {
    describe('Update the state', () => {
      test('DOM', () => {
        const container = document.body

        /** @type {{items: Object<string, string>}} */
        const theState = state({ items: { a: 'a', b: 'b', c: 'c' } })

        component((x) => {
          x.$state(theState.items, (items) => {
            for (const item in items) {
              // @ts-expect-error
              for (const k in item) {
                x.div(item[k])
              }
            }
          })
        }).paint(container)

        let elements = container.querySelectorAll('*')

        expectTextContentsToBeLike(elements, { a: 'a', b: 'b', c: 'c' })

        // Update directly
        theState.items = { d: 'd', e: 'e' }

        elements = container.querySelectorAll('*')

        expectTextContentsToBeLike(elements, { d: 'd', e: 'e' })

        // Update with setState()
        setState(theState.items, { f: 'f', g: 'g' })

        elements = container.querySelectorAll('*')

        expectTextContentsToBeLike(elements, { f: 'f', g: 'g' })
      })
    })

    describe('Update top level state with setState()', () => {
      test('DOM', () => {
        const container = document.body

        /** @type {Object<string, string>} */
        const theState = state({ a: 'a', b: 'b', c: 'c' })

        component((x) => {
          x.$state(theState, (state) => {
            for (const k in state) {
              x.div(state[k])
            }
          })
        }).paint(container)

        let elements = container.querySelectorAll('*')

        expectTextContentsToBeLike(elements, { a: 'a', b: 'b', c: 'c' })

        // Update with setState()
        setState(theState, { f: 'f', g: 'g' })

        elements = container.querySelectorAll('*')

        expectTextContentsToBeLike(elements, { f: 'f', g: 'g' })
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

        component((x) => {
          let counter = 0

          x.$state(theState.mainState.innerArrayState, () => {
            counter += 1
            x.div(counter)
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
  })
})
