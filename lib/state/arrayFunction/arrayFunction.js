import { ArrayFunctions } from './ArrayFunctions.js'

/**
 * @type {WeakMap<TargetObject, ArrayFunctions>}
 */
const $mapArrayFunctions = new WeakMap()

/**
 * @param {string} fnName
 * @param {TargetObject} target
 * @param {State} receiver
 * @param {Function} callback
 * @returns {Function | void}
 */
export function arrayFunction(fnName, target, receiver, callback) {
  let arrayFunctions = $mapArrayFunctions.get(target)

  if (!arrayFunctions) {
    arrayFunctions = new ArrayFunctions(target, receiver, callback)

    $mapArrayFunctions.set(target, arrayFunctions)
  }

  return arrayFunctions.getArrayFunction(fnName)
}
