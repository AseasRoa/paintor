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
  const length = elements.length

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
  const id = 'container'

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('update', () => {
    const container = document.body

    const arrayState = state([ 'a', 'b', 'c' ])

    component(($) => {
      $.forState(arrayState, (value) => {
        $.div(value)
      })
    }).paint(container)

    arrayState[1] = 'updated'

    const allElements = container.querySelectorAll('*')

    expectTextContentsToBeLike(allElements, ['a', 'updated', 'c'])
    expectSpecialCommentElementsInStatement(allElements)
  })

  test('delete', () => {
    const container = document.body

    const arrayState = state([ 'a', 'b', 'c' ])

    component(($) => {
      $.forState(arrayState, (value) => {
        $.div(value)
      })
    }).paint(container)

    delete arrayState[1]

    const allElements = container.querySelectorAll('*')

    expectTextContentsToBeLike(allElements, ['a', 'c'])
    expectSpecialCommentElementsInStatement(allElements)
  })

  test('length', () => {
    const container = document.body

    const arrayState = state([ 'a', 'b', 'c' ])

    component(($) => {
      $.forState(arrayState, (value) => {
        $.div(value)
      })
    }).paint(container)

    arrayState.length = 1

    const allElements = container.querySelectorAll('*')

    expectTextContentsToBeLike(allElements, ['a'])
    expectSpecialCommentElementsInStatement(allElements)
  })

  test('copyWithin()', () => {
    const container = document.body

    const arrayState = state([ 'a', 'b', 'c', 'd', 'e' ])

    component(($) => {
      $.forState(arrayState, (value) => {
        $.div(value)
      })
    }).paint(container)

    // Copy to index 0 all elements from index 3 to the end
    arrayState.copyWithin(0, 3)

    const allElements = container.querySelectorAll('*')

    expectTextContentsToBeLike(allElements, ['d', 'e', 'c', 'd', 'e'])
    expectSpecialCommentElementsInStatement(allElements)
  })

  test('pop()', () => {
    const container = document.body

    const arrayState = state([ 'a', 'b', 'c' ])

    component(($) => {
      $.forState(arrayState, (value) => {
        $.div(value)
      })
    }).paint(container)

    arrayState.pop()

    const allElements = container.querySelectorAll('*')

    expectTextContentsToBeLike(allElements, ['a', 'b'])
    expectSpecialCommentElementsInStatement(allElements)
  })

  /**
   * This tests the ability of Paintor to place elements in correct order.
   *
   * Note:
   * There is an issue that the top level of elements have no parent element,
   * which makes it impossible to use functions like 'after' or 'insertBefore',
   * because they require parent element. Trick is needed for the test example below
   * to work in the browser. Without it, the newly added element would be placed
   * after the 'for' loop's end comment.
   * However, this problem does not happen in JsDOM, so this test example doesn't
   * test exactly that.
   */
  test('push()', () => {
    const container = document.body

    const arrayState = state([ 'a' ])

    component(($) => {
      $.forState(arrayState, (value) => {
        $.div(value)
      })
    }).paint(container)

    arrayState.push('b')

    const elements = container.querySelectorAll('*')

    expectTextContentsToBeLike(elements, ['a', 'b'])
    expectSpecialCommentElementsInStatement(elements)
  })

  test('reverse()', () => {
    const container = document.body

    const arrayState = state([ 'a', 'b', 'c' ])

    component(($) => {
      $.forState(arrayState, (value) => {
        $.div(value)
      })
    }).paint(container)

    arrayState.reverse()

    const elements = container.querySelectorAll('*')

    expectTextContentsToBeLike(elements, ['c', 'b', 'a'])
    expectSpecialCommentElementsInStatement(elements)
  })

  test('shift()', () => {
    const container = document.body

    const arrayState = state([ 'a', 'b', 'c' ])

    component(($) => {
      $.forState(arrayState, (value) => {
        $.div(value)
      })
    }).paint(container)

    arrayState.shift()

    const elements = container.querySelectorAll('*')

    expectTextContentsToBeLike(elements, ['b', 'c'])
    expectSpecialCommentElementsInStatement(elements)
  })

  test('sort()', () => {
    const container = document.body

    let arrayState = state([ 'March', 'Jan', 'Feb', 'Dec' ])

    component(($) => {
      $.forState(arrayState, (value) => {
        $.div(value)
      })
    }).paint(container)

    // Note: sort() mutates the Array and returns it
    arrayState = arrayState.sort()

    const elements = container.querySelectorAll('*')

    expectTextContentsToBeLike(elements, ['Dec', 'Feb', 'Jan', 'March'])
    expectSpecialCommentElementsInStatement(elements)
  })

  test('splice()', () => {
    const container = document.body

    const arrayState = state([ 'a', 'c', 'd' ])

    component(($) => {
      $.forState(arrayState, (value) => {
        $.div(value)
      })
    }).paint(container)

    // Insert 'b' at index 1
    arrayState.splice(1, 0, 'b')

    let elements = container.querySelectorAll('*')

    expectTextContentsToBeLike(elements, ['a', 'b', 'c', 'd'])
    expectSpecialCommentElementsInStatement(elements)

    // Replace all elements with new elements
    arrayState.splice(0, 4, 'A', 'B', 'C', 'D')

    elements = container.querySelectorAll('*')

    expectTextContentsToBeLike(elements, ['A', 'B', 'C', 'D'])
    expectSpecialCommentElementsInStatement(elements)

    // Remove half of the elements
    arrayState.splice(1, 2)

    elements = container.querySelectorAll('*')
    expectTextContentsToBeLike(elements, ['A', 'D'])
    expectSpecialCommentElementsInStatement(elements)
  })

  test('unshift()', () => {
    const container = document.body

    const arrayState = state([ 'c' ])

    component(($) => {
      $.forState(arrayState, (value) => {
        $.div(value)
      })
    }).paint(container)

    arrayState.unshift('a', 'b')

    const elements = container.querySelectorAll('*')

    expectTextContentsToBeLike(elements, ['a', 'b', 'c'])
    expectSpecialCommentElementsInStatement(elements)
  })

  test('unshift() - using array.forEach()', () => {
    const container = document.body

    const arrayState = state([ 'c' ])

    component(($) => {
      arrayState.forEach((value) => {
        $.div(value)
      })
    }).paint(container)

    arrayState.unshift('a', 'b')

    const elements = container.querySelectorAll('*')

    expectTextContentsToBeLike(elements, ['a', 'b', 'c'])
    expectSpecialCommentElementsInStatement(elements)
  })
})
