/**
 * @typedef {object} StateProps
 * @property {ObjectKey} key
 * @property {State | null} parent
 * @property {TargetObject} target
 */

import { isObjectOrArray } from '../common/functions/misc.js'

/** @type {WeakMap<Object<*, *> | Array<*>, Set<State>>} */
const $mapObjectsToStates = new WeakMap()

/** @type {WeakMap<State, StateProps>} */
const $mapStateProps = new WeakMap()

/**
 * @param {State} state
 * @returns {StateProps | undefined}
 */
export function getStateProps(state) {
  return $mapStateProps.get(state)
}

/**
 * @param {State} state
 * @returns {boolean}
 */
export function hasStateProps(state) {
  return $mapStateProps.has(state)
}

/**
 * @param {State} state
 * @param {StateProps} props
 */
export function setStateProps(state, props) {
  $mapStateProps.set(state, props)
  const states = $mapObjectsToStates.get(props.target)

  if (!states) {
    $mapObjectsToStates.set(props.target, new Set([state]))
  }
  else {
    if (!(states.has(state))) states.add(state)
  }
}

/**
 * @param {State} state
 * @returns {State | null}
 */
export function getParentState(state) {
  const stateProps = getStateProps(state)

  if (!stateProps) return null

  return stateProps.parent
}

/**
 * @param {Object<*, *> | Array<*>} object
 * @returns {Set<State> | undefined}
 */
export function getLinkedStates(object) {
  return $mapObjectsToStates.get(object)
}

/**
 * @param {Object<*,*>} object
 * @returns {boolean}
 */
export function isState(object) {
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
