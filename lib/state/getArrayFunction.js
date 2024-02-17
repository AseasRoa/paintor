import { ArrayFunctions } from './ArrayFunctions.js'

/**
 * @type {WeakMap<TargetObject, ArrayFunctions>}
 */
const cache = new WeakMap()

/**
 * @param {string} fnName
 * @param {TargetObject} target
 * @param {State} receiver
 * @param {Function} callback
 */
function getArrayFunction(fnName, target, receiver, callback) {
  let arrayFunctions = cache.get(target)

  if (!arrayFunctions) {
    arrayFunctions = new ArrayFunctions(
      target, receiver, callback
    )

    cache.set(target, arrayFunctions)
  }

  return arrayFunctions.getArrayFunction(fnName)
}

export { getArrayFunction }
