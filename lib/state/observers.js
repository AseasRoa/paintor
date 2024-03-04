import { symObserverAccessProp } from '../constants.js'
import { arrayRemoveValue } from '../functions/misc.js'
import { isState } from './state.js'
import { lastGetData } from './StateProxy.js'

/**
 * @typedef {(
 *   WeakMap<
 *     State,
 *     Map<
 *       ObjectKey | undefined,
 *       Array<ObserverListener>
 *     >
 *   >
 * )} SubscriptionsMap
 */

/**
 * @type {{
 *   create: SubscriptionsMap,
 *   change: SubscriptionsMap,
 *   delete: SubscriptionsMap,
 *   set: SubscriptionsMap
 * }}
 */
const $maps = {
  create: new WeakMap(),
  change: new WeakMap(),
  delete: new WeakMap(),
  set: new WeakMap()
}

/**
 * @param {any} target
 * @param {ObserverType} type
 * @param {ObjectKey | undefined} prop
 * @param {ObserverListener} listener
 */
export function subscribe(target, type, prop, listener) {
  fakeTrapTrigger(target)

  const mapOne = $maps[type]
  const mapTwo = mapOne.get(target)

  if (!mapTwo) {
    /** @type {Map<ObjectKey | undefined, Array<ObserverListener>>} */
    const mapTwo = new Map()
    mapTwo.set(prop, [listener])
    mapOne.set(target, mapTwo)
  }
  else {
    const listeners = mapTwo.get(prop)

    if (!listeners) {
      mapTwo.set(prop, [listener])
    }
    else {
      if (!listeners.includes(listener)) {
        listeners.push(listener)
      }
    }
  }
}

/**
 * @param {any} target
 * @param {ObserverType} [type]
 * @param {ObserverListener} [listener]
 */
export function unsubscribe(target, type, listener) {
  if (type && !(type in $maps)) {
    throw new Error(`Invalid observer type "${type}"`)
  }

  fakeTrapTrigger(target)

  const receiver = lastGetData.receiver ?? target

  if (!isState(receiver)) {
    // This should never be reached
    throw new Error('Invalid observer receiver')
  }

  if (!type) {
    for (const type in $maps) {
      unsubscribeHelper(type, receiver, lastGetData.prop, listener)
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

function unsubscribeHelper(type, receiver, prop, listener) {
  const mapOne = $maps[type]
  const mapTwo = mapOne.get(receiver)

  if (mapTwo) {
    const listeners = mapTwo.get(prop)

    if (listeners) {
      if (!listener) {
        listeners.length = 0
      }
      else {
        arrayRemoveValue(listeners, listener, true)
      }
    }
  }
}

/**
 * @param {ObserverType} type
 * @param {TargetObject} target
 * @param {State} state
 * @param {ObjectKey} key
 * @param {any} [oldValue]
 */
export function runCallbacks(type, target, state, key, oldValue) {
  if (key === 'length' && target instanceof Array) {
    return
  }

  const value = target[key]
  const subsForProp = getSubsBy(type, state, key)

  if (subsForProp) {
    for (const cb of subsForProp) {
      cb({ key, value, oldValue, state, target })
    }
  }

  const subsForUndefined = getSubsBy(type, state, undefined)

  if (subsForUndefined) {
    for (const cb of subsForUndefined) {
      cb({ key, value, oldValue, state, target })
    }
  }
}

/**
 * @param {ObserverType} types
 * @param {State} state
 * @param {ObjectKey | undefined} prop
 * @returns {ObserverListener[] | undefined}
 */
export function getSubsBy(types, state, prop) {
  const mapOne = $maps[types]
  const mapTwo = mapOne.get(state)

  if (mapTwo) {
    return mapTwo.get(prop)
  }

  return undefined
}

export default { getSubsBy, runCallbacks, subscribe, unsubscribe }
