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
    throw new Error('state() only accepts Object or Array')
  }

  const stateProxy = new StateProxy()
  const rootKey = '' // It could be a name, but empty string works just fine
  const wrappedObject = { '': object }

  return stateProxy.createProxy(wrappedObject, '')[rootKey]
}

/**
 * @param {Object<*,*>} object
 * @returns {boolean}
 */
const isState = function(object) {
  return (object instanceof Object) && (symState in object)
}

/**
 * @param {State} state
 * @param {State} newState
 * @returns {void}
 */
function setState(state, newState) {
  if (!isState(state)) {
    throw new Error('The first argument in setState() must be a state object')
  }

  if (!(newState instanceof Object)) {
    throw new Error('The new state in setState() must be Object or Array')
  }

  const stateParent = state[symState].parent
  const statePath = state[symState].path

  stateParent[statePath] = newState
}

export { state, isState, setState }
