import { StateProxy } from './StateProxy.js'
import { symState } from './constants.js'

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

  const stateProxy = new StateProxy()

  return stateProxy.createProxy(object, '')
}

/**
 * @param {Object<*,*>} object
 * @returns {boolean}
 */
const isState = function(object) {
  return (object instanceof Object) && (symState in object)
}

export { state, isState }
