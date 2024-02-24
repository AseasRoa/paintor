import { expect } from 'vitest'

/**
 * @param {NodeListOf<Element | ChildNode> | undefined} elements
 * @param {any[] | Object<any, any>} values
 */
export function expectTextContentsToBeLike(elements, values) {
  if (elements === undefined) {
    expect(true).toBe(false)

    return
  }

  if (values instanceof Array) {
    expect(elements.length).toBe(values.length)

    values.forEach((value, index) => {
      expect(elements[index]?.textContent).toBe(value)
    })
  }
  else if (typeof values === 'object') {
    expect(elements.length).toBe(Object.keys(values).length)

    let key = 0

    for (const objKey in values) {
      expect(elements[key]?.textContent).toBe(values[objKey])

      key += 1
    }
  }
}
