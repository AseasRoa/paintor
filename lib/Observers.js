import { subscribe } from './state/observers.js'
import { isState } from './state/state.js'
import { lastGetData } from './state/StateProxy.js'

class Observers {
  /** @type {any} */
  #from

  /**
   * @param {any} from
   * @returns {Observers}
   */
  useInputs(from) {
    this.#from = from

    return this
  }

  create(callback) {
    return this.#subscribe('create', callback)
  }

  change(callback) {
    return this.#subscribe('change', callback)
  }

  delete(callback) {
    return this.#subscribe('delete', callback)
  }

  set(callback) {
    return this.#subscribe('set', callback)
  }

  /**
   * @param {ObserverType} type
   * @param {ObserverListener} listener
   */
  #subscribe(type, listener) {
    this.#verifyCallback(listener)

    if (isState(this.#from)) {
      subscribe(this.#from, type, undefined, listener)
    }
    else {
      if (!lastGetData.receiver) {
        throw new Error('Cannot observe a non-state')
      }

      subscribe(lastGetData.receiver, type, lastGetData.prop, listener)
    }
  }

  #verifyCallback(callback) {
    if (!callback) {
      throw new Error('You must provide a callback function')
    }
  }
}

export { Observers }
