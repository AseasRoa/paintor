import { EnumStateAction } from './constants.js'
import { ElementsCreator } from './ElementsCreator.js'

/** @typedef {Object<*, *> | Array<*>} TargetObject */

export class StateProxyArrayFunctions {
  /**
   * @type {{receiver: State, target: TargetObject, callback: Function}}
   */
  #arrayFnObjects = {
    receiver: [],
    target: [],
    callback: () => {}
  }

  /**
   * @param {string} fnName
   * @param {TargetObject} target
   * @param {State} receiver
   * @param {Function} callback
   * @returns {Function | void}
   */
  callArrayFn(fnName, target, receiver, callback) {
    this.#arrayFnObjects.target = target
    this.#arrayFnObjects.receiver = receiver
    this.#arrayFnObjects.callback = callback

    switch (fnName) {
      case 'push': return this.#arrayFnPush
      case 'copyWithin': return this.#arrayFnCopyWithin
      case 'reverse': return this.#arrayFnReverse
      case 'shift': return this.#arrayFnShift
      case 'sort': return this.#arrayFnSort
      case 'splice': return this.#arrayFnSplice
      case 'unshift': return this.#arrayFnUnshift
      case 'forEach': return this.#arrayFnForEach
      default: return target[fnName]
    }
  }

  /**
   * The copyWithin() method of Array instances shallow
   * copies part of this array to another location in
   * the same array and returns this array without
   * modifying its length.
   *
   * @param {any} args
   * @returns {any}
   */
  #arrayFnCopyWithin = (...args) => {
    const { target, receiver } = this.#arrayFnObjects

    let [targetIndex, start, end] = args
    const { length } = target

    /**
     * Fix the arguments, according to the rules in the following link:
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin
     */
    if (targetIndex < 0) targetIndex += length
    else if (targetIndex < -length) targetIndex = 0
    else if (targetIndex >= length) return
    else if (targetIndex > start) end = length - 1

    if (start < 0) start += length
    else if (start < -length || start === undefined) start = 0
    else if (start >= length) return

    if (end < 0) end += length
    else if (end < -length) end = 0
    else if (end >= length || end === undefined) end = length
    else if (end <= start) return

    // Apply the function
    const result = target.copyWithin.apply(target, [targetIndex, start, end])

    this.#arrayFnObjects.callback(
      EnumStateAction.ARRAY_COPY_WITHIN,
      receiver,
      [targetIndex, start, end],
    )

    return result
  }

  /**
   * @param {(value: string, index: number, array: string[]) => void} callbackFn
   * @param {any} thisArg
   */
  #arrayFnForEach = (callbackFn, thisArg) => {
    const { target, receiver } = this.#arrayFnObjects
    const currentTree = ElementsCreator.lastTemplateTreeToRender

    currentTree?.forEach(receiver, (value, key) => {
      // @ts-ignore
      callbackFn.apply(thisArg, [value, key, target])
    })
  }

  /**
   * @param {any} args
   * @returns {number}
   */
  #arrayFnPush = (...args) => {
    const { target, receiver } = this.#arrayFnObjects
    const prevLength = target.length

    /*
     * Instead of using push(), we are settings values
     * on the proxy, thus going through the 'set' trap
     */

    let newLength = prevLength - 1

    for (const arg of args) {
      newLength += 1
      receiver[newLength] = arg
    }

    this.#touchLength(receiver, prevLength)

    return newLength
  }

  #arrayFnReverse = () => {
    const { target, receiver } = this.#arrayFnObjects
    const result = target.reverse.apply(target)

    for (let i = 0, len = target.length; i < len; i++) {
      const j = len - 1 - i

      if (i >= j) break

      this.#arrayFnObjects.callback(
        EnumStateAction.ARRAY_SWAP,
        receiver,
        [i, j]
      )
    }

    return result
  }

  #arrayFnShift = () => {
    const { target, receiver } = this.#arrayFnObjects
    const prevLength = target.length
    const result = target.shift.apply(target)

    this.#arrayFnObjects.callback(
      EnumStateAction.ARRAY_SPLICE,
      receiver,
      [0, 1]
    )
    this.#touchLength(receiver, prevLength)

    return result
  }

  /**
   * @param {any} args
   * @returns {TargetObject}
   */
  #arrayFnSort = (...args) => {
    const { target, receiver } = this.#arrayFnObjects
    const result = target.sort.apply(target, args)

    this.#arrayFnObjects.callback(EnumStateAction.ARRAY_SORT, receiver, args)

    return result
  }

  /**
   * @param {any} args
   * @returns {TargetObject}
   */
  #arrayFnSplice = (...args) => {
    const { target, receiver } = this.#arrayFnObjects
    const prevLength = target.length
    const result = target.splice.apply(target, args)

    this.#arrayFnObjects.callback(EnumStateAction.ARRAY_SPLICE, receiver, args)
    this.#touchLength(receiver, prevLength)

    return result
  }

  /**
   * @param {any} args
   * @returns {TargetObject}
   */
  #arrayFnUnshift = (...args) => {
    const { target, receiver } = this.#arrayFnObjects
    const prevLength = target.length
    const result = target.unshift.apply(target, args)

    this.#arrayFnObjects.callback(
      EnumStateAction.ARRAY_SPLICE,
      receiver,
      [0, 0, ...args]
    )
    this.#touchLength(receiver, prevLength)

    return result
  }

  /**
   * Set the 'length' property, so the proxy is informed
   *
   * @param {State} receiver
   * @param {number} prevLength
   */
  #touchLength(receiver, prevLength) {
    // @ts-ignore
    const length = receiver.length

    if (prevLength !== length) {
      // @ts-ignore
      // eslint-disable-next-line no-self-assign
      receiver.length = receiver.length
    }
  }
}
