import { Observers } from '../Observers.js'
import { unsubscribe } from '../state/observers.js'

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
  return unsubscribe(target, type, listener)
}

export { on, off }
