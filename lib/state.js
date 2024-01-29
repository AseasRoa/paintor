import { StateProxy } from './StateProxy.js'
import { symState } from './constants.js'

/**
 * @param {Object<*,*>} object
 * @returns {boolean}
 */
const isState = function(object) {
  const d = Object.getOwnPropertyDescriptor(object, symState)

  return (
    d instanceof Object
    // @ts-ignore
    && d.target !== object
  )
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

  if (isState(object)) {
    const d = Object.getOwnPropertyDescriptor(object, symState)
    // @ts-ignore
    object = d.target
  }

  const stateProxy = new StateProxy()
  const rootKey = '' // It could be a name, but empty string works just fine
  const wrappedObject = { '': object }

  return stateProxy.createProxy(wrappedObject, '')[rootKey]
}

export { state, isState, setState }
