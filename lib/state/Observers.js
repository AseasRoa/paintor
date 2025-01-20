import { EnumObserverType, getLastProxyGetData, subscribe } from './observerSubs.js'
import { isState } from './state.js'

export class Observers {
  /** @type {any} */
  #from

  /**
   * @param {any} from
   */
  constructor(from) {
    this.#from = from
  }

  /**
   * @param {ObserverListener} listener
   * @returns {void}
   */
  create(listener) {
    return this.#subscribe(EnumObserverType.CREATE, listener)
  }

  /**
   * @param {ObserverListener} listener
   * @returns {void}
   */
  change(listener) {
    return this.#subscribe(EnumObserverType.CHANGE, listener)
  }

  /**
   * @param {ObserverListener} listener
   * @returns {void}
   */
  delete(listener) {
    return this.#subscribe(EnumObserverType.DELETE, listener)
  }

  /**
   * @param {ObserverListener} listener
   * @returns {void}
   */
  set(listener) {
    return this.#subscribe(EnumObserverType.SET, listener)
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
      const proxyReceiverData = getLastProxyGetData()

      if (!proxyReceiverData.receiver) {
        throw new Error('Cannot observe a non-state')
      }

      subscribe(
        proxyReceiverData.receiver,
        type,
        proxyReceiverData.prop,
        listener
      )
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
