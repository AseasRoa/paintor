import { symAccess, symEmptyHandlerElements } from '../common/constants.js'
import { isObjectOrArray, objectLength } from '../common/functions/misc.js'
import { getStateProps } from '../state/stateProps.js'
import { execHandler, resultResolver } from './functions.js'

/**
 * "start" and "end" determine the direction and how many loops are applied
 * on the "handler" function. The loop breaks if "false" is returned by the
 * "handler" function
 *
 * @param {TemplateTree} tree
 * @param {number} start
 * @param {number} end
 * @param {ForLoopIterableCallback} handler
 * @returns {boolean | Error}
 */
export function forLoop(tree, start, end, handler) {
  if (
    Number.isNaN(start) || Number.isNaN(end)
    || start === Infinity || end === Infinity
    || start === -Infinity || end === -Infinity
  ) {
    return true
  }

  if (typeof start !== 'number' || typeof end !== 'number') {
    return new Error('"start" and "end" arguments should be numbers')
  }

  if (!(typeof handler === 'function')) {
    return new Error('"handler" argument should be a Function')
  }

  if (end >= start) {
    for (let key = start; key <= end; key++) {
      const ret = execHandler(tree, handler, key)

      if (ret === false) break
    }
  }
  else {
    for (let key = start; key >= end; key--) {
      const ret = execHandler(tree, handler, key)

      if (ret === false) break
    }
  }

  return true
}

/**
 * In the "data" object there are pairs of keys and values
 * and the "handler" function is looped once for each pair.
 * The loop breaks if "false" is returned by the "handler"
 * function.
 *
 * @param {TemplateTree} tree
 * @param {1 | 2} forLoopType
 * Loop type:
 * - 1 is for "for" loop accepting JS objects as input (Object, Array, Map, Set)
 * - 2 is for "for" loop accepting state input
 * @param {State} state
 * @param {ForLoopCallback} handler
 * @param {ForLoopCallbackOnEmpty} [handlerOnEmpty]
 * @param {ObjectKey} [keyToRender]
 * @param {(key: number | string) => void} [beforeIterationCallback]
 * @param {(key: ObjectKey) => void} [iterationCallback]
 * @returns {boolean}
 * @throws {TypeError}
 */
export function forEachLoop(
  tree,
  forLoopType,
  state,
  handler,
  handlerOnEmpty,
  keyToRender,
  beforeIterationCallback,
  iterationCallback
) {
  if (!(typeof handler === 'function')) {
    throw new TypeError('"handler" argument should be a Function')
  }

  const stateProps = getStateProps(state)
  const object = (stateProps) ? stateProps.target : state
  const isProxy = forLoopType === 2 && Boolean(stateProps)

  if (object instanceof Map || object instanceof Set) {
    if (keyToRender === undefined) {
      if (
        object.size === 0
        && typeof handlerOnEmpty === 'function'
      ) {
        handlerOnEmpty()
        iterationCallback?.(symEmptyHandlerElements)
      }

      for (const [key, value] of object.entries()) {
        const ret = forEachLoopIteration(
          tree,
          handler,
          key,
          value,
          beforeIterationCallback,
          iterationCallback
        )

        if (ret === false) break
      }
    }
    else {
      const value = object instanceof Set
        ? keyToRender
        : object.get(keyToRender)

      forEachLoopIteration(
        tree,
        handler,
        keyToRender,
        value,
        beforeIterationCallback,
        iterationCallback
      )
    }
  }
  else if (isObjectOrArray(object)) {
    /**
     * Dummy variable, used when the proxy needs to be
     * forced to fire "get" event.
     *
     * @type {any}
     */
    const nothing = (isProxy) ? state[symAccess] : undefined

    if (keyToRender === undefined) {
      if (
        objectLength(object) === 0
        && typeof handlerOnEmpty === 'function'
      ) {
        handlerOnEmpty()
        iterationCallback?.(symEmptyHandlerElements)
      }

      for (const key in object) {
        const ret = forEachLoopIterationOnObject(
          tree,
          handler,
          key,
          state,
          beforeIterationCallback,
          iterationCallback
        )

        if (ret === false) break
      }
    }
    else {
      forEachLoopIterationOnObject(
        tree,
        handler,
        keyToRender,
        state,
        beforeIterationCallback,
        iterationCallback
      )
    }
  }
  else {
    throw new TypeError(`The state argument should be an Object or an Array, but instead it is ${object}`)
  }

  return true
}

/**
 * @param {TemplateTree} tree
 * @param {ForLoopCallback} handler
 * @param {ObjectKey} keyToRender
 * @param {any} value
 * @param {(key: number | string) => void} [beforeIterationCallback]
 * @param {(key: ObjectKey) => void} [iterationCallback]
 * @returns {void|boolean}
 */
function forEachLoopIteration(
  tree,
  handler,
  keyToRender,
  value,
  beforeIterationCallback,
  iterationCallback
) {
  let val = value

  if (beforeIterationCallback) {
    val = beforeIterationCallback?.call(tree, val)
  }

  let result = handler(val, keyToRender)

  result = resultResolver(tree, result)

  iterationCallback?.(keyToRender)

  return result
}

/**
 * @template T
 * @param {TemplateTree} tree
 * @param {ForLoopCallback} handler
 * @param {ObjectKey} keyToRender
 * @param {(
 *   Array<T>
 *   | Object<string | number, T> | Map<string | number, T>
 * )} state
 * @param {(key: number | string) => void} [beforeIterationCallback]
 * @param {(key: ObjectKey) => void} [iterationCallback]
 * @returns {Template|void|boolean}
 */
function forEachLoopIterationOnObject(
  tree,
  handler,
  keyToRender,
  state,
  beforeIterationCallback,
  iterationCallback
) {
  const value = state[keyToRender]

  return forEachLoopIteration(
    tree,
    handler,
    keyToRender,
    value,
    beforeIterationCallback,
    iterationCallback
  )
}
