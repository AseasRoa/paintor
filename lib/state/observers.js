import { symObserverAccessProp } from '../constants.js'
import { isState } from './state.js'
import { lastGetData } from './StateProxy.js'

/**
 * @typedef {(
 *   Map<
 *     ObjectKey | undefined,
 *     Set<ObserverListener>
 *   >
 * )} SubscriptionsMapItem
 */

/**
 * @typedef {(
 *   WeakMap<State, SubscriptionsMapItem>
 * )} SubscriptionsMap
 */

/**
 * @readonly
 * @enum {number}
 */
export const EnumTypes = Object.freeze({
  CREATE: 0,
  CHANGE: 1,
  DELETE: 2,
  SET: 3
})

/**
 * @type {Map<EnumTypes, SubscriptionsMap>}
 */
const $maps = new Map()
$maps.set(EnumTypes.CREATE, new WeakMap())
$maps.set(EnumTypes.CHANGE, new WeakMap())
$maps.set(EnumTypes.DELETE, new WeakMap())
$maps.set(EnumTypes.SET, new WeakMap())

/**
 * @param {any} target
 * @param {EnumTypes} type
 * @param {ObjectKey | undefined} prop
 * @param {ObserverListener} listener
 * @throws {Error}
 */
export function subscribe(target, type, prop, listener) {
  fakeTrapTrigger(target)

  const mapOne = $maps.get(type)

  if (!mapOne) {
    throw new Error(`Wrong observer type ${type}`)
  }

  const mapTwo = mapOne.get(target)

  if (!mapTwo) {
    /** @type {SubscriptionsMapItem} */
    const mapTwo = new Map()
    mapTwo.set(prop, new Set([listener]))
    mapOne.set(target, mapTwo)
  }
  else {
    const listeners = mapTwo.get(prop)

    if (!listeners) {
      mapTwo.set(prop, new Set([listener]))
    }
    else {
      if (!listeners.has(listener)) {
        listeners.add(listener)
      }
    }
  }
}

/**
 * @param {any} target
 * @param {EnumTypes} [type]
 * @param {ObserverListener} [listener]
 * @throws {Error}
 */
export function unsubscribe(target, type, listener) {
  if (type && !($maps.has(type))) {
    throw new Error(`Invalid observer type "${type}"`)
  }

  fakeTrapTrigger(target)

  const receiver = lastGetData.receiver ?? target

  if (!isState(receiver)) {
    // This should never be reached
    throw new Error('Invalid observer receiver')
  }

  if (!type) {
    for (const key in EnumTypes) {
      unsubscribeHelper(EnumTypes[key], receiver, lastGetData.prop, listener)
    }
  }
  else {
    unsubscribeHelper(type, receiver, lastGetData.prop, listener)
  }
}

/**
 * If the target is not a state, then most probably it is
 * an element from a state that is number, string, etc.
 * For example the function call might look like this:
 * unsubscribe(myState.key)
 * In this case, the 'get' proxy trap has just been
 * triggered.
 *
 * But if the target is a state, this does not trigger
 * the 'get' trap. To trigger it, we are using a
 * non-existent symbol property. In this case we also
 * want to unset the prop (to not be the symbol).
 *
 * @param {any} target
 */
function fakeTrapTrigger(target) {
  if (isState(target)) {
    target[symObserverAccessProp]
    lastGetData.prop = undefined
  }
}

/**
 * @param {EnumTypes} type
 * @param {State} receiver
 * @param {ObjectKey} [prop]
 * @param {ObserverListener} [listener]
 * @throws {Error}
 */
function unsubscribeHelper(type, receiver, prop, listener) {
  const mapOne = $maps.get(type)

  if (!mapOne) {
    throw new Error(`Wrong observer type ${type}`)
  }

  const mapTwo = mapOne.get(receiver)

  if (mapTwo) {
    const listeners = mapTwo.get(prop)

    if (listeners) {
      if (!listener) {
        listeners.clear()
      }
      else {
        listeners.delete(listener)
      }
    }
  }
}

/**
 * @param {EnumTypes} type
 * @param {TargetObject} target
 * @param {State} state
 * @param {ObjectKey} key
 * @param {any} [oldValue]
 */
export function runCallbacks(type, target, state, key, oldValue) {
  if (key === 'length' && Array.isArray(target)) {
    return
  }

  const subsForProp = getSubsBy(type, state, key)

  if (subsForProp) {
    const value = target[key]

    for (const listener of subsForProp) {
      listener({ key, value, oldValue, state, target })
    }
  }

  const subsForUndefined = getSubsBy(type, state, undefined)

  if (subsForUndefined) {
    const value = target[key]

    for (const listener of subsForUndefined) {
      listener({ key, value, oldValue, state, target })
    }
  }
}

/**
 * @param {EnumTypes} type
 * @param {State} state
 * @param {ObjectKey | undefined} prop
 * @returns {Set<ObserverListener> | undefined}
 * @throws {Error}
 */
export function getSubsBy(type, state, prop) {
  const mapOne = $maps.get(type)

  if (!mapOne) {
    throw new Error(`Wrong observer type ${type}`)
  }

  const mapTwo = mapOne.get(state)

  if (mapTwo) {
    return mapTwo.get(prop)
  }

  return undefined
}

export default { getSubsBy, runCallbacks, EnumTypes, subscribe, unsubscribe }
