
/**
 * TODO: This function is potentially slow
 *
 * @template T
 * @param {Set<T>} set
 * @returns {T | undefined}
 */
export function setGetLastValue(set) {
  let value = undefined

  for (const val of set) {
    value = val
  }

  return value
}

/**
 * @template T
 * @param {Set<T>} set
 * @param {number} index
 * @returns {T | undefined}
 */
export function setGetValueByIndex(set, index) {
  let i = -1

  for (const item of set) {
    i += 1

    if (i === index) {
      return item
    }
  }

  return undefined
}

/**
 * @param {Set<any>} set
 * @param {any} element
 * @returns {number}
 * @throws {Error}
 */
export function setIndexOf(set, element) {
  let index = -1

  if (!set.has(element)) {
    return index
  }

  for (const el of set) {
    index += 1

    if (el === element) {
      break
    }
  }

  return index
}

/**
 * @template T
 * @param {Set<T>} set
 * @param {T} elementToMove
 * @param {T} referenceElement
 * @returns {Set<T>}
 * @throws {Error}
 */
export function setMoveElementAfterAnother(
  set, elementToMove, referenceElement
) {
  if (!set.has(elementToMove) || !set.has(referenceElement)) {
    throw new Error('Cannot move one element after another, because one element is missing')
  }

  if (elementToMove === referenceElement) {
    throw new Error('Cannot move an element after itself')
  }

  const newSet = new Set()
  /**
   * States:
   *   - 1 - In search for referenceElement while adding other elements
   *   - 2 - referenceElement found
   *   - 3 - elementToMove added after referenceElement, adding the rest
   *
   * @type {number}
   */
  let state = 1

  for (const element of set) {
    if (state === 1) {
      if (element !== elementToMove) {
        newSet.add(element)
      }

      if (element === referenceElement) {
        state = 2
      }
    }
    else if (state === 2) {
      newSet.add(elementToMove)
      newSet.add(element)

      state = 3
    }
    else if (state === 3) {
      if (element !== elementToMove) {
        newSet.add(element)
      }
    }
  }

  if (state === 2) {
    newSet.add(elementToMove)
  }

  return newSet
}

/**
 * @template T
 * @param {Set<T>}set
 * @param {number} index
 * @returns {Set<T>}
 */
export function setSliceFromIndex(set, index) {
  const newSet = new Set()
  let count = -1

  for (const el of set) {
    count += 1

    if (count >= index) {
      newSet.add(el)
    }
  }

  return newSet
}

/**
 * Return a new Set(), which is a slice from the input Set(),
 * containing the elements of the original Set() after the
 * input element. The input element is included.
 *
 * @template T
 * @param {Set<T>}set
 * @param {T} element Inclusive
 * @returns {Set<T>}
 */
export function setSliceFromElement(set, element) {
  const newSet = new Set()

  if (!set.has(element)) {
    return newSet
  }

  let building = false

  for (const el of set) {
    if (el === element) {
      building = true
    }

    if (building) {
      newSet.add(el)
    }
  }

  return newSet
}
