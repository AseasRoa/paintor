import { EnumTypes, subscribe } from './state/observers.js'
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

  create(listener) {
    return this.#subscribe(EnumTypes.CREATE, listener)
  }

  change(listener) {
    return this.#subscribe(EnumTypes.CHANGE, listener)
  }

  delete(listener) {
    return this.#subscribe(EnumTypes.DELETE, listener)
  }

  set(listener) {
    return this.#subscribe(EnumTypes.SET, listener)
  }

  /**
   * @param {EnumObserverType} type
   * @param {ObserverListener} listener
   * @throws {Error}
   */
  #subscribe(type, listener) {
    this.#verifyListener(listener)

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

  /**
   * @param {ObserverListener} listener
   * @throws {Error}
   */
  #verifyListener(listener) {
    if (!listener) {
      throw new Error('You must provide a listener function')
    }
  }
}

export { Observers }
