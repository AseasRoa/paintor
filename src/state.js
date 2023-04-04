import { StateSubscriptions } from './StateSubscriptions.js'
import { symStateId } from './symbols.js'

let stateIdCounter = 0

/**
 * @template T
 * @param {T} object
 * Your input object or array
 * @returns {T}
 * A proxy object/array that looks the same as the input object/array
 */
const state = function state(object) {
  if (!(object instanceof Object)) {
    throw new Error('state() only accepts Object, Array, Set or Map as input value.')
  }

  const stateSubscriptions = new StateSubscriptions()
  const proxy = stateSubscriptions.createProxy(object)

  stateIdCounter += 1
  // @ts-ignore
  proxy[symStateId] = stateIdCounter

  return proxy
}

/**
 * @param {Object<*,*>} object
 * @returns {boolean}
 */
const isState = function (object) {
  return (object instanceof Object) && (symStateId in object)
}

export { state, isState }
