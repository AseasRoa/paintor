import { Component } from '../Component.js'
import { symAccess, symEmptyHandlerElements } from '../constants.js'
import { getStateProps } from '../state/state.js'
import { objectLength } from './misc.js'
import { isTemplate } from './template.js'

/**
 * "start" and "end" determine the direction and how many loops are applied
 * on the "handler" function. The loop breaks if "false" is returned by the
 * "handler" function
 *
 * @param {number} start
 * @param {number} end
 * @param {ForLoopIterableCallback} handler
 * @returns {boolean | Error}
 */
export function forLoop(start, end, handler) {
  if (typeof start !== 'number' || typeof end !== 'number') {
    return new Error('"start" and "end" arguments should be numbers')
  }

  if (!(handler instanceof Function)) {
    return new Error('"handler" argument should be a Function')
  }

  if (end >= start) {
    for (let key = start; key <= end; key++) {
      const ret = handler(key)

      if (ret === false) break
    }
  }
  else {
    for (let key = start; key >= end; key--) {
      const ret = handler(key)

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
 * @template T
 * @param {TemplateTree} tree
 * @param {1 | 2} forLoopType
 * - 1 is for "for" loop accepting JS objects as input (Object, Array, Map, Set)
 * - 2 is for "for" loop accepting state input
 * @param {(
 *   Array<T>
 *   | Object<string | number, T> | Map<string | number, T>
 * )} state
 * @param {ForLoopCallback<T>} handler
 * @param {ForLoopCallbackOnEmpty} [handlerOnEmpty]
 * @param {ObjectKey} [keyToRender]
 * @param {(key: number | string) => void} [beforeIterationCallback]
 * @param {(
 *   (
 *     key: ObjectKey,
 *     component?: Component | null
 *   ) => void
 * )} [iterationCallback]
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
  if (!(handler instanceof Function)) {
    throw new TypeError('"handler" argument should be a Function')
  }

  const stateProps = getStateProps(state)
  const object = (stateProps) ? stateProps.target : state
  const isProxy = forLoopType === 2 && Boolean(stateProps)

  if (object instanceof Map || object instanceof Set) {
    if (keyToRender === undefined) {
      if (
        object.size === 0
        && handlerOnEmpty instanceof Function
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
  else if (object instanceof Object) {
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
        && handlerOnEmpty instanceof Function
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
          object,
          isProxy,
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
        object,
        isProxy,
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
 * @template T
 * @param {TemplateTree} tree
 * @param {ForLoopCallback<T>} handler
 * @param {ObjectKey} keyToRender
 * @param {any} value
 * @param {(key: number | string) => void} [beforeIterationCallback]
 * @param {(
 *   (
 *     key: ObjectKey,
 *     component?: Component | null
 *   ) => void
 * )} [iterationCallback]
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

  // @ts-ignore
  let ret = handler(val, keyToRender)
  /** @type {Component | null} */
  let component = null

  if (ret instanceof Component) {
    component = ret
  }
  else if (isTemplate(ret)) {
    // @ts-ignore
    ret = ret(tree)
  }

  iterationCallback?.(keyToRender, component)

  return ret
}

/**
 * @template T
 * @param {TemplateTree} tree
 * @param {ForLoopCallback<T>} handler
 * @param {ObjectKey} keyToRender
 * @param {(
 *   Array<T>
 *   | Object<string | number, T> | Map<string | number, T>
 * )} state
 * @param {TargetObject} object
 * @param {boolean} isProxy
 * @param {(key: number | string) => void} [beforeIterationCallback]
 * @param {(
 *   (
 *     key: ObjectKey,
 *     component?: Component | null
 *   ) => void
 * )} [iterationCallback]
 */
function forEachLoopIterationOnObject(
  tree,
  handler,
  keyToRender,
  state,
  object,
  isProxy,
  beforeIterationCallback,
  iterationCallback
) {
  const value = (isProxy)
    ? (object[keyToRender] instanceof Object)
      ? state[keyToRender]
      : object[keyToRender]
    : object[keyToRender]

  return forEachLoopIteration(
    tree,
    handler,
    keyToRender,
    value,
    beforeIterationCallback,
    iterationCallback
  )
}
