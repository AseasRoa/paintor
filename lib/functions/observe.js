import { Observers } from '../state/Observers.js'
import { EnumObserverType, unsubscribe } from '../state/observerSubs.js'

/**
 * @param {ObserverType} [type]
 * @returns {EnumObserverType | undefined}
 */
function getObserverType(type) {
  switch (type) {
    case 'create': return EnumObserverType.CREATE
    case 'change': return EnumObserverType.CHANGE
    case 'delete': return EnumObserverType.DELETE
    case 'set': return EnumObserverType.SET
    default: return undefined
  }
}

/**
 * @param {any} from
 * @returns {Observers}
 */
function on(from) {
  return new Observers(from)
}

/**
 * @param {any} target
 * @param {ObserverType} [type]
 * @param {ObserverListener} [listener]
 * @returns {void}
 */
function off(target, type, listener) {
  return unsubscribe(target, getObserverType(type), listener)
}

export { off, on }
