import { StateProxyArrayFunctions } from './StateProxyArrayFunctions.js'

/**
 * @type {WeakMap<TargetObject, StateProxyArrayFunctions>}
 */
const cache = new WeakMap()

/**
 * @param {string} fnName
 * @param {TargetObject} target
 * @param {State} receiver
 * @param {Function} callback
 */
function getArrayFunction(fnName, target, receiver, callback) {
  let stateProxyArrayFunctions = cache.get(target)

  if (!stateProxyArrayFunctions) {
    stateProxyArrayFunctions = new StateProxyArrayFunctions(
      target, receiver, callback
    )

    cache.set(target, stateProxyArrayFunctions)
  }

  return stateProxyArrayFunctions.getArrayFunction(fnName)
}

export { getArrayFunction }
