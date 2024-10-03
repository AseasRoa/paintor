import { isObjectOrArray } from '../functions/misc.js'
import { StateProxy } from './StateProxy.js'

/**
 * @typedef {object} StateProps
 * @property {ObjectKey} key
 * @property {State | null} parent
 * @property {TargetObject} target
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
 * @returns {State | null}
 */
export const getParentState = function(state) {
  const stateProps = getStateProps(state)

  if (!stateProps) return null

  return stateProps.parent
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
  const states = mapObjectsToStates.get(props.target)

  if (!states) {
    mapObjectsToStates.set(props.target, [state])
  }
  else {
    if (!(states.includes(state))) states.push(state)
  }
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
  return (isObjectOrArray(object) && hasStateProps(object))
}

/**
 * @param {State} state
 * @param {State} newState
 * @returns {void}
 * @throws {Error}
 */
export function setState(state, newState) {
  const stateProps = getStateProps(state)

  if (!stateProps) {
    throw new Error('The first argument in setState() must be a state object')
  }

  if (!(isObjectOrArray(newState))) {
    throw new Error('The new state in setState() must be Object or Array')
  }

  const { key, parent } = stateProps

  if (parent) parent[key] = newState
}

/**
 * @template T
 * @param {T} object
 * Your input object or array
 * @returns {T}
 * A proxy object/array that looks the same as the input object/array
 * @throws {Error}
 */
export const state = function state(object) {
  if (!(object instanceof Object) && !Array.isArray(object)) {
    throw new Error('state() only accepts Object or Array')
  }

  const stateProps = getStateProps(object)

  if (stateProps) {
    object = stateProps.target
  }

  const stateProxy = new StateProxy()
  const rootKey = '' // It could be a name, but empty string works just fine
  const wrappedObject = { '': object }

  return stateProxy.createProxy(wrappedObject, '', null)[rootKey]
}
