import { StateProxy } from './StateProxy.js'

/**
 * @typedef {object} StateProps
 * @property {State} target
 * @property {string} path
 * @property {State | null} parent
 */

/** @type {WeakMap<State, StateProps>} */
const mapStateProps = new WeakMap()

/** @type {WeakMap<Object<*, *> | Array<*>, State[]>} */
const mapObjectsToStates = new WeakMap()

/**
 * @param {State} state
 * @returns {StateProps | undefined}
 */
export const getStateProps = function(state) {
  return mapStateProps.get(state)
}

/**
 * @param {State} state
 * @returns {boolean}
 */
export const hasStateProps = function(state) {
  return mapStateProps.has(state)
}

/**
 * @param {State} state
 * @param {StateProps} props
 */
export const setStateProps = function(state, props) {
  mapStateProps.set(state, props)
  const states = mapObjectsToStates.get(props.target) ?? []

  if (!(states.includes(state))) states.push(state)

  mapObjectsToStates.set(props.target, states)
}

/**
 * @param {Object<*, *> | Array<*>} object
 * @returns {State[] | undefined}
 */
export const getLinkedStates = function(object) {
  return mapObjectsToStates.get(object)
}

/**
 * @param {Object<*,*>} object
 * @returns {boolean}
 */
export const isState = function(object) {
  return (
    object instanceof Object
    // @ts-ignore
    && hasStateProps(object)
  )
}

/**
 * @param {State} state
 * @param {State} newState
 * @returns {void}
 */
export function setState(state, newState) {
  const stateProps = getStateProps(state)

  if (!stateProps) {
    throw new Error('The first argument in setState() must be a state object')
  }

  if (!(newState instanceof Object)) {
    throw new Error('The new state in setState() must be Object or Array')
  }

  const stateParent = stateProps.parent

  if (stateParent) {
    stateParent[stateProps.path] = newState
  }
}

/**
 * @template T
 * @param {T} object
 * Your input object or array
 * @returns {T}
 * A proxy object/array that looks the same as the input object/array
 */
export const state = function state(object) {
  if (!(object instanceof Object)) {
    throw new Error('state() only accepts Object or Array')
  }

  const stateProps = getStateProps(object)

  if (stateProps) {
    // @ts-ignore
    object = stateProps.target
  }

  const stateProxy = new StateProxy()
  const rootKey = '' // It could be a name, but empty string works just fine
  const wrappedObject = { '': object }

  return stateProxy.createProxy(wrappedObject, '', null)[rootKey]
}