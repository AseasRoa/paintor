import { EnumStateAction } from './constants.js'
import { ElementsCollector } from './ElementsCollector.js'
import { isObjectOrArray, objectLength } from './functions/misc.js'
import { RepaintorActions } from './RepaintorActions.js'

class Repaintor {
  /** @type {WeakMap<Comment, KeyToElements>} */
  mapKeyToElements

  /** @type {RepaintorActions} */
  #actions

  /** @type {boolean} */
  #isSr

  /** @type {Comment} */
  #commentBegin

  /** @type {boolean} */
  #hasHandlerOnEmpty

  /**
   * @param {boolean} isSr
   * @param {ElementsCollector[]} collectedElements
   * @param {Comment} commentBegin
   * @param {Comment} commentEnd
   * @param {CallbackForState} callbackForState
   * @param {ObjectKey | undefined} keyToRender
   * @param {boolean} hasHandlerOnEmpty
   */
  constructor(
    isSr,
    collectedElements,
    commentBegin,
    commentEnd,
    callbackForState,
    keyToRender,
    hasHandlerOnEmpty
  ) {
    this.#isSr = isSr
    this.#commentBegin = commentBegin
    this.#hasHandlerOnEmpty = hasHandlerOnEmpty
    this.#actions = new RepaintorActions(
      collectedElements,
      commentBegin,
      commentEnd,
      callbackForState,
      keyToRender
    )
    this.mapKeyToElements = this.#actions.mapKeyToElements
  }

  /**
   * @type {RepaintFnForState}
   */
  repaint(action, updatedObject, updatedState, prop, arrayFunctionArgs) {
    if (this.#isSr || !isObjectOrArray(updatedObject)) {
      return
    }

    switch (action) {
      case EnumStateAction.CREATE: {
        this.#actions.create(updatedObject, updatedState, prop)
        break
      }
      case EnumStateAction.DELETE: {
        /**
         * Element has been deleted from the state?
         * - Remove the DOM elements
         * - Remove these same elements from the map
         */
        this.#actions.delete(prop)
        break
      }
      case EnumStateAction.UPDATE: {
        this.#actions.update(updatedObject, updatedState, prop)
        break
      }
      case EnumStateAction.ARRAY_SPLICE: {
        this.#actions.arraySplice(
          // @ts-ignore
          updatedObject, updatedState, arrayFunctionArgs
        )
        break
      }
      case EnumStateAction.ARRAY_REVERSE: {
        this.#actions.arrayReverse(updatedObject, updatedState)
        break
      }
      case EnumStateAction.ARRAY_SWAP: {
        // @ts-ignore
        this.#actions.arraySwap(arrayFunctionArgs)
        break
      }
      case EnumStateAction.ARRAY_COPY_WITHIN: {
        this.#actions.arrayCopyWithin(
          // @ts-ignore
          updatedObject, updatedState, arrayFunctionArgs
        )
        break
      }
      case EnumStateAction.ARRAY_SORT: {
        this.#actions.arraySort(updatedObject, updatedState)
        break
      }
      case EnumStateAction.ARRAY_LENGTH: {
        // @ts-ignore
        this.#actions.arrayLength(updatedObject, arrayFunctionArgs)
        break
      }
    }

    if (
      this.#hasHandlerOnEmpty
      // it's empty string when array function callback event is fired
      && (!(Array.isArray(updatedObject)) || prop === '')
      && objectLength(updatedObject) === 0
    ) {
      this.#actions.createElements(updatedState, this.#commentBegin, undefined)
    }
  }
}

export { Repaintor }
