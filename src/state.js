import { setElementAttrOrProp, styleRuleModificator } from './functions.js'
import './typedefs.js'

class StateSubscriptions {
  subscriptions = {}

  /** @type {ProxyHandler} */
  proxy

  /**
   * @template T
   * @param {T} object - A generic parameter that flows through to the return type
   * @return {T}
   */
  constructor(object) {
    this.proxy = this.#createProxy(object)
  }

  /**
   * @returns {ProxyHandler}
   */
  getState() {
    return this.proxy
  }

  /**
   * A function that binds the property of a html element with element from a state
   * @param {string} path
   * @param {HTMLElement} element
   * @param {string} propertyName
   * @param {string} subPropertyName
   * @param {BindFunction} bindFunction
   * @param {function} [statementCallback]
   */
  subscribe(path, element, propertyName, subPropertyName, bindFunction, statementCallback) {
    this.subscriptions[path] = this.subscriptions[path] || []

    // Search for the same subscription. If it already exists, don't make new one
    for (const item of this.subscriptions[path]) {
      if (
        item.element === element
        && item.propertyName === propertyName
        && item.subPropertyName === subPropertyName
        && item.bindFunction === bindFunction
        && item.statementCallback === statementCallback
      ) return
    }

    this.subscriptions[path].push({
      element,
      propertyName,
      subPropertyName,
      bindFunction,
      statementCallback,
    })
  }

  /**
   * A function that removes binds from html element
   * @param {HTMLElement} element
   */
  unsubscribe(element) {
    for (const key in this.subscriptions) {
      const subscriptionsGroup = this.subscriptions[key]
      let subscriptionRemoved = false

      for (let i = 0; i < subscriptionsGroup.length; i++) {
        const item = subscriptionsGroup[i]

        // if the element is marked for deletion, delete the subscription as well
        if (item.element === element) {
          delete subscriptionsGroup[i]
          subscriptionRemoved = true
        }
      }

      // If a subscription has been removed from the array,
      // remove the remaining empty element of the array
      if (subscriptionRemoved)
        this.subscriptions[key] = this.subscriptions[key].filter(Boolean)
    }
  }

  /**
   * @template T
   * @param {T} object
   * @param {string} [statePath]
   * @return {T}
   */
  #createProxy(object, statePath = '') {
    /** @type {ProxyHandler} */
    const handler = {}

    handler.get = (target, prop) => {
      if (prop === '--subscribe')
        return this

      return target[prop]
    }

    handler.set = (target, prop, value) => {
      if (prop === '--subscribe')
        return true

      // eslint-disable-next-line no-param-reassign
      target[prop] = value

      let path = target['--state-path']

      path = path ? `${path}.${prop}` : prop

      if (path in this.subscriptions) {
        const list = this.subscriptions[path] || []

        for (const i in list) {
          const {
            element,
            propertyName,
            subPropertyName,
            bindFunction,
            statementCallback,
          } = list[i]

          if (element['--deleted'])
            this.unsubscribe(element)
          else {
            const result = bindFunction(element)

            if (propertyName === 'style' && subPropertyName)
              element.style[subPropertyName] = styleRuleModificator(subPropertyName, result)
            else if (propertyName === '--if')
              statementCallback(result)
            else
              setElementAttrOrProp(element, propertyName, result)
          }
        }
      }

      return true
    }

    const proxy = new Proxy(object, handler)

    Object.defineProperty(proxy, '--state-path', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: statePath,
    })

    // Recursive proxy
    for (const key in proxy) {
      if (proxy[key] instanceof Object) {
        const innerStatePath = (statePath === '') ? key : `${statePath}.${key}`

        proxy[key] = this.#createProxy(proxy[key], innerStatePath)
      }
    }

    return proxy
  }
}

/**
 * @template T
 * @param {T} object - A generic parameter that flows through to the return type
 * @return {T}
 */
function createState(object) {
  const stateSubscriptions = new StateSubscriptions(object)

  return stateSubscriptions.getState()
}

export { createState }
