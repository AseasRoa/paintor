/* eslint-disable vitest/expect-expect */

import { component, state } from '#paintor'
import { expectTextContentsToBeLike } from './functions.js'

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
    test('update', () => {
      const container = document.body

      const arrayState = state([ 'a', 'b', 'c' ])

      component(($) => {
        $.forEach(arrayState, (value) => {
          $.div(value)
        })
        $.span(() => arrayState.length)
      }).paint(container)

      arrayState[1] = 'updated'

      const divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['a', 'updated', 'c'])
      expectSpecialCommentElementsInStatement(divElements)

      const lengthElement = container.querySelectorAll('span')
      expectTextContentsToBeLike(lengthElement, ['3'])
    })

    test('delete', () => {
      const container = document.body

      const arrayState = state([ 'a', 'b', 'c' ])

      component(($) => {
        $.forEach(arrayState, (value) => {
          $.div(value)
        })
        $.span(() => arrayState.length)
      }).paint(container)

      delete arrayState[1]

      const divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['a', 'c'])
      expectSpecialCommentElementsInStatement(divElements)

      const lengthElement = container.querySelectorAll('span')
      expectTextContentsToBeLike(lengthElement, ['3'])
    })

    test('length', () => {
      const container = document.body

      const arrayState = state([ 'a', 'b', 'c' ])

      component(($) => {
        $.forEach(arrayState, (value) => {
          $.div(value)
        })
        $.span(() => arrayState.length)
      }).paint(container)

      arrayState.length = 1

      const divElements = container.querySelectorAll('div')
      expectTextContentsToBeLike(divElements, ['a'])
      expectSpecialCommentElementsInStatement(divElements)

      const lengthElement = container.querySelectorAll('span')
      expectTextContentsToBeLike(lengthElement, ['1'])
    })
  })

  describe('methods', () => {
    test('copyWithin()', () => {
      const container = document.body

      const arrayState = state([ 'a', 'b', 'c', 'd', 'e' ])

      component(($) => {
        $.forEach(arrayState, (value) => {
          $.div(value)
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

      component(($) => {
        $.forEach(arrayState, (value) => {
          $.div(value)
        })
        $.span(() => arrayState.length)
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

      component(($) => {
        $.forEach(arrayState, (value) => {
          $.div(value)
        })
        $.span(() => arrayState.length)
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

      component(($) => {
        $.forEach(arrayState, (value) => {
          $.div(() => value.val)
        })
        $.span(() => arrayState.length)
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

      component(($) => {
        $.forEach(arrayState, (value) => {
          $.div(value)
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

      component(($) => {
        $.forEach(arrayState, (value) => {
          $.div(value)
        })
        $.span(() => arrayState.length)
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

      component(($) => {
        $.forEach(arrayState, (value) => {
          $.div(value)
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

      component(($) => {
        $.forEach(arrayState, (value) => {
          $.div(value)
        })
        $.span(() => arrayState.length)
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

      component(($) => {
        $.forEach(arrayState, (value) => {
          $.div(value)
        })
        $.span(() => arrayState.length)
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

      component(($) => {
        arrayState.forEach((value) => {
          $.div(value)
        })
        $.span(() => arrayState.length)
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
