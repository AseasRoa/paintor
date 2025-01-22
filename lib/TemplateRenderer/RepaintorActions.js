import { symEmptyHandlerElements } from '../common/constants.js'
import { toInt } from '../common/functions/misc.js'
import { setGetLastValue } from '../common/functions/set.js'
import { unsubscribeElementAndItsChildren } from '../state/stateSubs.js'
import { ElementsCollector } from './ElementsCollector.js'

/** @type {WeakMap<Comment, KeyToElements>} */
const $mapKeyToElements = new WeakMap()

class RepaintorActions {
  mapKeyToElements = $mapKeyToElements

  /** @type {ElementsCollector[]} */
  #collectors

  /** @type {Comment} */
  #commentBegin

  /** @type {Comment} */
  #commentEnd

  /** @type {CallbackForState} */
  #callbackForState

  /** @type {ObjectKey | undefined} */
  #keyToRender

  /**
   * @param {ElementsCollector[]} collectors
   * @param {Comment} commentBegin
   * @param {Comment} commentEnd
   * @param {CallbackForState} callbackForState
   * @param {ObjectKey | undefined} keyToRender
   */
  constructor(
    collectors,
    commentBegin,
    commentEnd,
    callbackForState,
    keyToRender
  ) {
    this.#collectors = collectors
    this.#commentBegin = commentBegin
    this.#commentEnd = commentEnd
    this.#callbackForState = callbackForState
    this.#keyToRender = keyToRender
  }

  /**
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   * @param {string | symbol} prop
   */
  create(updatedObject, updatedState, prop) {
    /** @type {null | string} */
    let prevKey = null

    if (Array.isArray(updatedObject)) {
      // @ts-ignore
      let prevIndex = parseInt(prop)

      // eslint-disable-next-line no-plusplus
      while (prevIndex--) {
        // Break at the first non-empty value
        if (updatedObject[prevIndex] !== undefined) {
          prevKey = String(prevIndex)
          break
        }
      }
    }
    else {
      // TODO Find a faster way to get the previous key
      const iterator = Object.keys(updatedObject)

      // @ts-ignore
      const prevIndex = iterator.indexOf(prop) - 1

      if (prevIndex > -1) {
        // @ts-ignore
        prevKey = iterator[prevIndex]
      }
    }

    let lastElement = this.#commentBegin

    if (prevKey !== null) {
      /** @type {KeyToElements | undefined} */
      const keyToElements = $mapKeyToElements.get(this.#commentEnd)

      if (keyToElements) {
        /** @type {Set<Node>} */
        const elements = keyToElements[prevKey]

        // @ts-ignore
        lastElement = (elements && elements.size > 0)
          ? setGetLastValue(elements)
          : lastElement
      }
    }

    this.createElements(updatedState, lastElement, prop)
  }

  /**
   * @param {string | symbol} prop
   */
  delete(prop) {
    this.#removeRenderedElements(this.#commentBegin, this.#commentEnd, prop)
  }

  /**
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   * @param {string | symbol} prop
   */
  update(updatedObject, updatedState, prop) {
    this.delete(prop)
    this.create(updatedObject, updatedState, prop)
  }

  /**
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   */
  arraySort(updatedObject, updatedState) {
    for (
      let index = 0, length = updatedObject.length;
      index < length;
      index++
    ) {
      const prop = index.toString()
      this.delete(prop)
      this.create(updatedObject, updatedState, prop)
    }
  }

  /**
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   * @param {[
   *   number | string,
   *   number | string,
   *   number | string
   * ]} arrayFunctionArgs
   */
  arraySplice(updatedObject, updatedState, arrayFunctionArgs) {
    const keyToElements = $mapKeyToElements.get(this.#commentEnd)

    if (Array.isArray(keyToElements)) {
      /**
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
       */
      // @ts-ignore
      // eslint-disable-next-line prefer-const
      let [start, deleteCount, ...newItems] = arrayFunctionArgs

      start = toInt(start)
      deleteCount = toInt(deleteCount)

      if (deleteCount === Infinity) {
        deleteCount = updatedObject.length - start
      }
      else if (deleteCount < 0) {
        deleteCount = 0
      }

      if (deleteCount > 0) {
        for (
          let i = start, length = start + deleteCount;
          i < length;
          i++
        ) {
          const prop = i.toString()
          this.delete(prop)
        }
      }

      // Inject an array (with empty values) into the map
      // with the same size as the amount of new items
      const placeholderArray = Array(newItems.length)
      keyToElements.splice(start, deleteCount, ...placeholderArray)

      if (newItems.length > 0) {
        for (
          let index = start;
          index < start + newItems.length;
          index++
        ) {
          const prop = index.toString()
          this.create(updatedObject, updatedState, prop)
        }
      }

      keyToElements.length = updatedObject.length
    }
  }

  /**
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   */
  arrayReverse(updatedObject, updatedState) {
    for (
      let i = 0, len = updatedObject.length;
      i < len;
      i++
    ) {
      const j = len - 1 - i

      if (i >= j) break

      this.arraySwap([i, j])
    }
  }

  /**
   * @param {[
   *   number | string,
   *   number | string
   * ]} arrayFunctionArgs
   */
  arraySwap(arrayFunctionArgs) {
    let [key1, key2] = arrayFunctionArgs

    key1 = toInt(key1)
    key2 = toInt(key2)

    // Change siblings (swap elements objects by reference)

    const keyToElements = $mapKeyToElements.get(this.#commentEnd)

    if (Array.isArray(keyToElements)) {
      const leftGroup = keyToElements[key1]
      const rightGroup = keyToElements[key2]

      if (leftGroup && rightGroup) {
        /**
         * Move groups of elements
         */

        if (leftGroup.size > 0) {
          // The element closest to the left group on its left side
          let leftBorderElement = this.#commentBegin

          let key = key1

          // eslint-disable-next-line no-plusplus
          while (key--) {
            const group = keyToElements[key]

            if (!group) {
              continue
            }

            const groupLength = group.size

            if (groupLength > 0) {
              leftBorderElement = group[groupLength - 1]

              break
            }
          }

          leftBorderElement.after(...rightGroup)
        }

        if (rightGroup.size > 0) {
          // The element closest to the right group of its right side
          let rightBorderElement = this.#commentEnd

          for (let i = key2 + 1; i < keyToElements.length; i++) {
            const group = keyToElements[i]

            if (!group) {
              continue
            }

            const groupLength = group.size

            if (groupLength > 0) {
              rightBorderElement = group[0]

              break
            }
          }

          rightBorderElement.before(...leftGroup)
        }

        // Swap elements in the map
        const tmp = keyToElements[key2]

        // @ts-ignore
        keyToElements[key2] = keyToElements[key1]
        // @ts-ignore
        keyToElements[key1] = tmp
      }
    }
  }

  /**
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   * @param {[
   *   number | string,
   *   number | string,
   *   number | string
   * ]} arrayFunctionArgs
   */
  arrayCopyWithin(updatedObject, updatedState, arrayFunctionArgs) {
    let [target, start, end] = arrayFunctionArgs

    target = toInt(target)
    start = toInt(start)
    end = toInt(end)

    for (
      let fromIndex = start, toIndex = target;
      fromIndex < end;
      fromIndex++, toIndex++
    ) {
      const prop = toIndex.toString()
      this.delete(prop)
      this.create(updatedObject, updatedState, prop)
    }
  }

  /**
   * @param {TargetObject} updatedObject
   * @param {[number | string]} arrayFunctionArgs
   */
  arrayLength(updatedObject, arrayFunctionArgs) {
    let newLength = arrayFunctionArgs?.[0] ?? 0

    newLength = toInt(newLength)

    const keyToElements = $mapKeyToElements.get(this.#commentEnd)

    if (Array.isArray(keyToElements)) {
      const length = keyToElements.length

      if (newLength < length) {
        if (newLength === 0) {
          this.#removeRenderedElements(
            this.#commentBegin,
            this.#commentEnd,
            '*',
            true
          )
        }
        else {
          let index = length

          while (index > 0) {
            index -= 1

            if (index < newLength) break

            // Skip if already deleted.
            if (keyToElements[index] === undefined) {
              continue
            }

            const prop = index.toString()
            this.#removeRenderedElements(
              this.#commentBegin,
              this.#commentEnd,
              prop,
              true
            )
          }
        }
      }

      keyToElements.length = newLength
    }
  }

  /**
   * @param {State} updatedState
   * @param {Node} lastElement
   * @param {ObjectKey} [prop]
   */
  createElements(updatedState, lastElement, prop) {
    if (this.#keyToRender !== undefined && this.#keyToRender !== prop) {
      return
    }

    let isTemporaryLevel = false

    if (this.#commentBegin.parentElement) {
      /*
       * When the loop is in inner level, make a new temporary collector,
       * which will be deleted after that. Otherwise, the new elements are
       * placed on level 0
       */
      this.#collectors.push(new ElementsCollector())
      isTemporaryLevel = true
    }

    const level = this.#collectors.length - 1
    const added = this.#callbackForState(
      updatedState,
      // @ts-ignore
      this.#collectors[level],
      prop,
      false
    )
    const keyToElements = $mapKeyToElements.get(this.#commentEnd)

    if (added[symEmptyHandlerElements]) {
      this.#createElementsHelper(
        added[symEmptyHandlerElements],
        keyToElements,
        prop,
        lastElement
      )
    }
    else {
      for (const key in added) {
        const elements = added[key]

        this.#createElementsHelper(
          elements,
          keyToElements,
          prop,
          lastElement
        )
      }
    }

    if (isTemporaryLevel) {
      this.#collectors.pop()
    }
  }

  #createElementsHelper(elements, keyToElements, prop, lastElement) {
    /*
     * prop is a Symbol when the OnEmpty handler is used,
     * but we don't need these elements in the map
     */
    if (prop !== symEmptyHandlerElements && prop !== undefined) {
      keyToElements[prop] = elements
    }

    const level = this.#collectors.length - 1

    /**
     * Notes: DocumentFragment is slower than appending elements directly
     */
    for (const element of elements) {
      if (level === 0 && this.#collectors.length > level) {
        /**
         * Parent element is needed in order to apply 'after'.
         * But if for example there is a for loop (for a state)
         * at top level and immediately after that a new element
         * is added to the state, that new element can't be properly
         * added after the previous one, because of the lack of
         * parent element. Because of this, let's reorder the
         * collected elements.
         */

        // @ts-ignore
        this.#collectors[level].moveElementAfterAnother(
          element,
          lastElement
        )
      }

      lastElement.after(element)
      lastElement = element
    }
  }

  /**
   * @param {Comment} commentBegin
   * @param {Comment} commentEnd
   * @param {ObjectKey} prop
   * @param {boolean} [removeSubscriptions]
   */
  #removeRenderedElements(
    commentBegin,
    commentEnd,
    prop,
    removeSubscriptions = true
  ) {
    const keyToElements = $mapKeyToElements.get(commentEnd)

    if (!keyToElements) {
      return
    }

    if (prop === '*') {
      /**
       * Quick remove explained:
       *
       * When all elements can be removed, instead of calling
       * .remove() for each element, it's much faster to set
       * textContent of the parent element to an empty string.
       * We have Begin and End elements. First we need to check
       * whether they are the first and last elements in the
       * parent, because we don't want to delete other existing
       * elements. Then, set textContent of the parent to empty
       * string. Then, bring back the Begin and End elements.
       */
      if (
        commentBegin !== commentEnd
        && commentBegin.previousElementSibling === null
        && commentEnd.nextElementSibling === null
      ) {
        for (const key in keyToElements) {
          this.#removeRenderedElementsHelper(
            keyToElements,
            key,
            removeSubscriptions,
            false
          )
        }
        const parentElement = commentBegin.parentElement

        if (parentElement) {
          parentElement.textContent = ''
          parentElement.appendChild(commentBegin)
          parentElement.appendChild(commentEnd)
        }
      }
      else {
        for (const key in keyToElements) {
          this.#removeRenderedElementsHelper(
            keyToElements,
            key,
            removeSubscriptions,
            true
          )
        }
      }

      if (Array.isArray(keyToElements)) {
        keyToElements.length = 0
      }
    }
    else {
      this.#removeRenderedElementsHelper(
        keyToElements,
        prop,
        removeSubscriptions,
        true
      )
    }
  }

  /**
   * @param {KeyToElements} keyToElements
   * @param {ObjectKey} key
   * @param {boolean} [removeSubscriptions]
   * @param {boolean} [removeDomElement]
   */
  #removeRenderedElementsHelper(
    keyToElements,
    key,
    removeSubscriptions = true,
    removeDomElement = true
  ) {
    /** @type {Node[]} */
    const elements = keyToElements[key]

    if (!elements) return

    // Remove DOM elements
    for (const element of elements) {
      // @ts-ignore
      if ($mapKeyToElements.has(element)) { // inner end element
        // @ts-ignore
        this.#removeRenderedElements(element, element, '*')
      }

      if (removeSubscriptions) {
        // Delete all subscriptions for this element
        unsubscribeElementAndItsChildren(element)
      }

      if (removeDomElement) {
        // @ts-ignore
        element.remove() // Delete the element itself
      }
    }

    // Remove from map
    delete keyToElements[key]
  }
}

export { RepaintorActions }
