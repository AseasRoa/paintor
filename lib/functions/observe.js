import { Observers } from '../Observers.js'
import { EnumTypes, unsubscribe } from '../state/observers.js'

/**
 * @param {any} from
 * @returns {Observers}
 */
function on(from) {
  return new Observers().useInputs(from)
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

/**
 * @param {ObserverType} [type]
 * @returns {EnumTypes | undefined}
 */
function getObserverType(type) {
  if (type) {
    switch (type) {
      case 'create': return EnumTypes.CREATE
      case 'change': return EnumTypes.CHANGE
      case 'delete': return EnumTypes.DELETE
      case 'set': return EnumTypes.SET
    }
  }

  return undefined
}

export { on, off }
