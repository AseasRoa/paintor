/* eslint-disable vitest/expect-expect */

import { beforeEach, describe, expect, test } from 'vitest'
import { expectTextContentsToBeLike } from './functions.js'
import { component, state } from '#paintor'

/**
 * 'for' loops in Paintor contain these 'begin' and 'end' Comment elements.
 * They should engulf the visible elements.
 *
 * @param {NodeListOf<Element>} elements
 */
function expectSpecialCommentElementsInStatement(elements) {
  const { length } = elements

  if (length > 0) {
    // @ts-ignore
    expect(elements[0].previousSibling instanceof Comment).toBe(true)

    let i = 0

    for (i = 0; i < length - 1; i++) {
      expect(
        // @ts-ignore
        elements[i].nextSibling
      ).toBe(elements[i + 1])
    }

    expect(
      // @ts-ignore
      elements[i].nextSibling instanceof Comment
    ).toBe(true)
  }
}

describe('State: Array', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('actions', () => {
    test('create', () => {
      const container = document.body

      const arrayState = state([])

      component(({ $each, div, span }) => {
        $each(arrayState, (value) => {
          div(value)
        })
        span(() => arrayState.length)
      }).paint(container)

      arrayState[0] = 'a'

      const divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['a'])
      expectSpecialCommentElementsInStatement(divElements)

      const lengthElement = container.querySelectorAll('span')
      expectTextContentsToBeLike(lengthElement, ['1'])
    })

    test('delete', () => {
      const container = document.body

      const arrayState = state([ 'a', 'b', 'c' ])

      component(({ $each, div, span }) => {
        $each(arrayState, (value) => {
          div(value)
        })
        span(() => arrayState.length)
      }).paint(container)

      delete arrayState[1]

      const divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['a', 'c'])
      expectSpecialCommentElementsInStatement(divElements)

      const lengthElement = container.querySelectorAll('span')
      expectTextContentsToBeLike(lengthElement, ['3'])
    })

    test('update', () => {
      const container = document.body

      const arrayState = state([ 'a', 'b', 'c' ])

      component(({ $each, div, span }) => {
        $each(arrayState, (value) => {
          div(value)
        })
        span(() => arrayState.length)
      }).paint(container)

      arrayState[1] = 'updated'

      const divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['a', 'updated', 'c'])
      expectSpecialCommentElementsInStatement(divElements)

      const lengthElement = container.querySelectorAll('span')
      expectTextContentsToBeLike(lengthElement, ['3'])
    })

    test('update after delete', () => {
      const container = document.body

      const arrayState = state([ 'a', 'b', 'c' ])

      component(({ $each, div, span }) => {
        $each(arrayState, (value) => {
          div(value)
        })
        span(() => arrayState.length)
      }).paint(container)

      delete arrayState[1] // Array is now: ['a', empty 'c']
      arrayState[2] = 'C' // Array is now ['a', empty, 'C']

      const divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['a', 'C'])

      const lengthElement = container.querySelectorAll('span')
      expectTextContentsToBeLike(lengthElement, ['3'])
    })

    test('length', () => {
      const container = document.body

      const arrayState = state([ 'a', 'b', 'c' ])

      component(({ $each, div, span }) => {
        $each(arrayState, (value) => {
          div(value)
        })
        span(() => arrayState.length)
      }).paint(container)

      arrayState.length = 1

      const divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['a'])
      expectSpecialCommentElementsInStatement(divElements)

      const lengthElement = container.querySelectorAll('span')
      expectTextContentsToBeLike(lengthElement, ['1'])
    })

    test('set length, then fill', () => {
      const container = document.body

      const arrayState = state([])

      component(({ $each, div, span }) => {
        $each(arrayState, (value) => {
          div(value)
        })
        span(() => arrayState.length)
      }).paint(container)

      arrayState.length = 3
      arrayState[2] = 'c'
      arrayState[0] = 'a'
      arrayState[1] = 'b'
      arrayState[3] = 'd'

      const divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['a', 'b', 'c', 'd'])
      expectSpecialCommentElementsInStatement(divElements)

      const lengthElement = container.querySelectorAll('span')
      expectTextContentsToBeLike(lengthElement, ['4'])
    })

    test('swap elements', () => {
      const container = document.body

      const arrayState = state([
        { name: 'a' },
        { name: 'b' },
        { name: 'c' },
        { name: 'd' },
        { name: 'e' }
      ])

      component(({ $each, div, span }) => {
        $each(arrayState, (item) => {
          div(item.name)
        })
        span(() => arrayState.length)
      }).paint(container)

      let divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['a', 'b', 'c', 'd', 'e'])
      expectSpecialCommentElementsInStatement(divElements)

      // Do the swap
      const tmp = arrayState[1]

      // @ts-ignore
      arrayState[1] = arrayState[3]
      // @ts-ignore
      arrayState[3] = tmp

      divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['a', 'd', 'c', 'b', 'e'])
      expectSpecialCommentElementsInStatement(divElements)

      const lengthElement = container.querySelectorAll('span')
      expectTextContentsToBeLike(lengthElement, ['5'])
    })
  })

  describe('methods', () => {
    test('fill', () => {
      const container = document.body

      const arrayState = state(new Array(3))

      component(({ $each, div }) => {
        $each(arrayState, (value) => {
          div(() => value.label)
        })
      }).paint(container)

      arrayState.fill({ label: 'a' })

      const divElements = container.querySelectorAll('div')

      expectTextContentsToBeLike(divElements, ['a', 'a', 'a'])
      expectSpecialCommentElementsInStatement(divElements)

      arrayState[0].label = 'A'
      expectTextContentsToBeLike(divElements, ['A', 'A', 'A'])
      expectSpecialCommentElementsInStatement(divElements)
    })

    test('copyWithin()', () => {
      const container = document.body

      const arrayState = state([ 'a', 'b', 'c', 'd', 'e' ])

      component(({ $each, div }) => {
        $each(arrayState, (value) => {
          div(value)
        })
      }).paint(container)

      // Copy to index 0 all elements from index 3 to the end
      arrayState.copyWithin(0, 3)

      const divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['d', 'e', 'c', 'd', 'e'])
      expectSpecialCommentElementsInStatement(divElements)
    })

    test('pop()', () => {
      const container = document.body

      const arrayState = state([ 'a', 'b', 'c' ])

      component(({ $each, div, span }) => {
        $each(arrayState, (value) => {
          div(value)
        })
        span(() => arrayState.length)
      }).paint(container)

      arrayState.pop()

      const divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['a', 'b'])
      expectSpecialCommentElementsInStatement(divElements)

      const lengthElement = container.querySelectorAll('span')
      expectTextContentsToBeLike(lengthElement, ['2'])
    })

    /**
     * This tests the ability of Paintor to place elements in correct order.
     *
     * Note:
     * There is an issue that the top level of elements have no parent
     * element, which makes it impossible to use functions like 'after'
     * or 'insertBefore', because they require parent element. Trick is
     * needed for the test example below to work in the browser.
     * Without it, the newly added element would be placed after the
     * 'for' loop's end comment. However, this problem does not happen
     * in JsDOM, so this test example doesn't test exactly that.
     */
    test('push()', () => {
      const container = document.body

      const arrayState = state([ 'a' ])

      component(({ $each, div, span }) => {
        $each(arrayState, (value) => {
          div(value)
        })
        span(() => arrayState.length)
      }).paint(container)

      arrayState.push('b')

      const divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['a', 'b'])
      expectSpecialCommentElementsInStatement(divElements)

      const lengthElement = container.querySelectorAll('span')
      expectTextContentsToBeLike(lengthElement, ['2'])
    })

    test('push() object and test reactivity', () => {
      const container = document.body

      const arrayState = state([ { val: 'a' } ])

      component(({ $each, div, span }) => {
        $each(arrayState, (value) => {
          div(() => value.val)
        })
        span(() => arrayState.length)
      }).paint(container)

      arrayState.push({ val: 'b' })
      arrayState.push({ val: 'c' })

      const divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['a', 'b', 'c'])
      expectSpecialCommentElementsInStatement(divElements)

      // @ts-ignore
      arrayState[2].val = 'c2'

      expectTextContentsToBeLike(divElements, ['a', 'b', 'c2'])


      const lengthElement = container.querySelectorAll('span')
      expectTextContentsToBeLike(lengthElement, ['3'])
    })

    test('reverse()', () => {
      const container = document.body

      const arrayState = state([ 'a', 'b', 'c' ])

      component(({ $each, div }) => {
        $each(arrayState, (value) => {
          div(value)
        })
      }).paint(container)

      arrayState.reverse()

      const divElements = container.querySelectorAll('div')

      expectTextContentsToBeLike(divElements, ['c', 'b', 'a'])
      expectSpecialCommentElementsInStatement(divElements)
    })

    test('shift()', () => {
      const container = document.body

      const arrayState = state([ 'a', 'b', 'c' ])

      component(({ $each, div, span }) => {
        $each(arrayState, (value) => {
          div(value)
        })
        span(() => arrayState.length)
      }).paint(container)

      arrayState.shift()

      const divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['b', 'c'])
      expectSpecialCommentElementsInStatement(divElements)

      const lengthElement = container.querySelectorAll('span')
      expectTextContentsToBeLike(lengthElement, ['2'])
    })

    test('sort()', () => {
      const container = document.body

      let arrayState = state([ 'March', 'Jan', 'Feb', 'Dec' ])

      component(({ $each, div }) => {
        $each(arrayState, (value) => {
          div(value)
        })
      }).paint(container)

      // Note: sort() mutates the Array and returns it
      arrayState = arrayState.sort()

      const divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['Dec', 'Feb', 'Jan', 'March'])
      expectSpecialCommentElementsInStatement(divElements)
    })

    test('splice()', () => {
      const container = document.body

      const arrayState = state([ 'a', 'c', 'd' ])

      component(({ $each, div, span }) => {
        $each(arrayState, (value) => {
          div(value)
        })
        span(() => arrayState.length)
      }).paint(container)

      // Insert 'b' at index 1
      arrayState.splice(1, 0, 'b')

      let divElements = container.querySelectorAll('div')

      expectTextContentsToBeLike(divElements, ['a', 'b', 'c', 'd'])
      expectSpecialCommentElementsInStatement(divElements)

      // Replace all elements with new elements
      arrayState.splice(0, 4, 'A', 'B', 'C', 'D')

      divElements = container.querySelectorAll('div')

      expectTextContentsToBeLike(divElements, ['A', 'B', 'C', 'D'])
      expectSpecialCommentElementsInStatement(divElements)

      // Remove half of the elements
      arrayState.splice(1, 2)

      divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['A', 'D'])
      expectSpecialCommentElementsInStatement(divElements)

      const lengthElement = container.querySelectorAll('span')
      expectTextContentsToBeLike(lengthElement, ['2'])
    })

    test('unshift()', () => {
      const container = document.body

      const arrayState = state([ 'c' ])

      component(({ $each, div, span }) => {
        $each(arrayState, (value) => {
          div(value)
        })
        span(() => arrayState.length)
      }).paint(container)

      arrayState.unshift('a', 'b')

      const divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['a', 'b', 'c'])
      expectSpecialCommentElementsInStatement(divElements)

      const lengthElement = container.querySelectorAll('span')
      expectTextContentsToBeLike(lengthElement, ['3'])
    })

    test('unshift() - using array.forEach()', () => {
      const container = document.body

      const arrayState = state([ 'c' ])

      component(({ div, span }) => {
        arrayState.forEach((value) => {
          div(value)
        })
        span(() => arrayState.length)
      }).paint(container)

      arrayState.unshift('a', 'b')

      const divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['a', 'b', 'c'])
      expectSpecialCommentElementsInStatement(divElements)

      const lengthElement = container.querySelectorAll('span')
      expectTextContentsToBeLike(lengthElement, ['3'])
    })
  })
})
