import { EnumStateAction } from '../constants.js'
import { TemplateTreeClass } from '../TemplateTreeClass.js'

class ArrayFunctions {
  /** @type {TargetObject} */
  #target

  /** @type {State} */
  #receiver

  /** @type {Function} */
  #callback

  /**
   * @param {TargetObject} target
   * @param {State} receiver
   * @param {Function} callback
   */
  constructor(target, receiver, callback) {
    this.#target = target
    this.#receiver = receiver
    this.#callback = callback
  }

  /**
   * Although this function is also public, like the array
   * functions, it will not be possible to call it like
   * this - array.getArrayFunction() - because JS will throw
   * TypeError before even calling it.
   *
   * @param {string} fnName
   * @returns {Function | void}
   */
  getArrayFunction(fnName) {
    if (fnName in this) {
      return this[fnName]
    }

    return this.#target[fnName]
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
  copyWithin = (...args) => {
    const target = this.#target
    const receiver = this.#receiver

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

    this.#callback(
      EnumStateAction.ARRAY_COPY_WITHIN,
      target,
      receiver,
      [targetIndex, start, end],
    )

    return result
  }

  fill = (...args) => {
    const target = this.#target
    const receiver = this.#receiver
    const result = target.fill.apply(target, args)

    let obj = args[0]

    for (let i = 0; i < target.length; i++) {
      receiver[i] = obj

      if (i === 0) {
        // On the first iteration the object is touched and turned
        // into proxy. For the following iterations use the proxy
        obj = receiver[i]
      }
    }

    return result
  }

  /**
   * @param {(value: string, index: number, array: string[]) => void} callbackFn
   * @param {any} thisArg
   */
  forEach = (callbackFn, thisArg) => {
    const target = this.#target
    const receiver = this.#receiver
    const currentTree = TemplateTreeClass.lastTemplateTreeToRender

    currentTree?.forEach(receiver, (value, key) => {
      // @ts-ignore
      callbackFn.apply(thisArg, [value, key, target])
    })
  }

  /**
   * @param {any} args
   * @returns {number}
   */
  push = (...args) => {
    const target = this.#target
    const receiver = this.#receiver
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

    /*
     * Not necessary to touch the length here, because push() triggers
     * .set() on the proxy, and the length is updated there
     */
    // this.#touchLength(receiver, prevLength)

    return newLength
  }

  /**
   * pop() triggers the 'deleteProperty' trap of the proxy
   */

  reverse = () => {
    const target = this.#target
    const receiver = this.#receiver
    const result = target.reverse.apply(target)

    this.#callback(EnumStateAction.ARRAY_REVERSE, target, receiver)

    return result
  }

  shift = () => {
    const target = this.#target
    const receiver = this.#receiver
    const prevLength = target.length
    const result = target.shift.apply(target)

    this.#callback(
      EnumStateAction.ARRAY_SPLICE,
      target,
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
  sort = (...args) => {
    const target = this.#target
    const receiver = this.#receiver
    const result = target.sort.apply(target, args)

    this.#callback(EnumStateAction.ARRAY_SORT, target, receiver, args)

    return result
  }

  /**
   * @param {any} args
   * @returns {TargetObject}
   */
  splice = (...args) => {
    const target = this.#target
    const receiver = this.#receiver
    const prevLength = target.length
    const result = target.splice.apply(target, args)

    this.#callback(EnumStateAction.ARRAY_SPLICE, target, receiver, args)
    this.#touchLength(receiver, prevLength)

    return result
  }

  /**
   * @param {any} args
   * @returns {number}
   */
  unshift = (...args) => {
    const target = this.#target
    const receiver = this.#receiver
    const prevLength = target.length
    const result = target.unshift.apply(target, args)

    this.#callback(
      EnumStateAction.ARRAY_SPLICE,
      target,
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
      Object.assign(receiver, { length })
    }
  }
}

export { ArrayFunctions }
