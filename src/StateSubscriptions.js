import { setElementAttrOrProp, modifyStyleRule } from './functions.js'
import { symState, EnumStateAction, symAccess, symSubscriptions } from './constants.js'

/** @typedef {Object<*,*>} StateProxy */

/**
 * @type {{
 *   element: null | Element | Comment,
 *   propertyName: string,
 *   subPropertyName: string,
 *   bindFunction: null | BindFunction,
 *   statementRepaintFunction: null | StatementRepaintFunction
 * }}
 */
let suggestedItems = {
  element: null,
  propertyName: '',
  subPropertyName: '',
  bindFunction: null,
  statementRepaintFunction: null,
}

/**
 * This function should be called just before calling the bindFunction. The idea is
 * that the bindFunction, along with its html element and property name are suggested
 * here to the proxy handler. When the bindFunction is called, any state used in it
 * would trigger the proxy get event, which means that it will be added to the subscriptions.
 *
 * @param {Element | Comment | Text} element
 * @param {string} propertyName
 * @param {string} subPropertyName
 * @param {BindFunction} bindFunction
 * @param {null | StatementRepaintFunction} statementRepaintFunction
 */
function setSuggestItems(
  element,
  propertyName,
  subPropertyName,
  bindFunction,
  statementRepaintFunction,
) {
  suggestedItems.element = element
  suggestedItems.propertyName = propertyName
  suggestedItems.subPropertyName = subPropertyName
  suggestedItems.bindFunction = bindFunction
  suggestedItems.statementRepaintFunction = statementRepaintFunction
}

/**
 * Reset the suggested items
 *
 * @returns {void}
 */
function unsetSuggestedItems() {
  suggestedItems.element = null
  suggestedItems.propertyName = ''
  suggestedItems.subPropertyName = ''
  suggestedItems.bindFunction = null
  suggestedItems.statementRepaintFunction = null
}

/**
 * Move subscription records from one DOM element into another DOM element.
 * Subscription records are located in a special array in the DOM element.
 *
 * @param {Element | Comment | Text} fromElement
 * @param {Element | Comment | Text} toElement
 * @param {BindFunction} [bindFunction] Optionally filter by the bind function
 * @param {Partial<Subscription>} [newSubscriptionProperties] Optionally set these parameters
 */
function moveSubscriptions(fromElement, toElement, bindFunction, newSubscriptionProperties) {
  if (symSubscriptions in fromElement) {
    // @ts-ignore
    let index = fromElement[symSubscriptions].length

    while (index--) {
      /** @type {Subscription} */
      // @ts-ignore
      const subscription = fromElement[symSubscriptions][index]

      if (
        bindFunction === undefined
        || bindFunction === subscription.bindFunction
      ) {
        // 1. Move the subscription record
        subscription.element = toElement

        if (newSubscriptionProperties) {
          for (const prop in newSubscriptionProperties) {
            // @ts-ignore
            subscription[prop] = newSubscriptionProperties[prop]
          }
        }

        // @ts-ignore
        toElement[symSubscriptions] ??= []
        // @ts-ignore
        toElement[symSubscriptions].push(subscription)

        // 2. Remove the subscription record from the origin element
        // @ts-ignore
        fromElement[symSubscriptions].splice(index, 1)
      }
    }
  }
}

/**
 * @param {Node | Element | Comment | Text} element
 * @returns {boolean}
 */
function elementHasSubscriptions(element) {
  return Object.hasOwn(element, symSubscriptions)
}

class StateSubscriptions {
  /** @type {Map<string | symbol, Subscription[]>} */
  #subscriptions = new Map()

  /** @type {State} */
  #state = {}

  /**
   * @param {State} state
   * @param {string | symbol} stateProp
   * @param {Element | Comment} element
   * The HTML element for which the other parameters apply.
   * @param {string} propertyName
   * The name of the property of the HTML element, for
   * which the subscription is going to be created.
   * For example: 'style', 'value', 'textContent', 'innerHTML'.
   * Also, '--if' for IF statement.
   * @param {string} subPropertyName
   * If the property name is 'style', the sub-property could be
   * any style property.
   * For example: 'fontSize'
   * @param {BindFunction} bindFunction
   * The function that is used instead of a fixed value.
   * For example: () => (state.clicks)
   * @param {StatementRepaintFunction | null} statementRepaintFunction
   * This is only used in the if() function. It's a function that
   * is used to repaint the elements in case the condition is changed
   * from false to true or vice versa.
   */
  subscribe(
    state,
    stateProp,
    element,
    propertyName,
    subPropertyName,
    bindFunction,
    statementRepaintFunction,
  ) {
    if (propertyName === '-s-if' || propertyName === '-s-forEach') {
      stateProp = propertyName
    }

    if (!this.#subscriptions.has(stateProp)) {
      this.#subscriptions.set(stateProp, [])
    }

    const subscriptions
            = this.#subscriptions.get(stateProp) ?? []

    // Search for a subscription with the same parameters.
    // If such already exists, just don't create a new one.
    for (const item of subscriptions) {
      if (
        item.element === element
        && item.propertyName === propertyName
        && item.subPropertyName === subPropertyName
        && item.bindFunction === bindFunction
        && item.statementRepaintFunction === statementRepaintFunction
      ) return
    }

    /**
     * @type {Subscription}
     */
    const subscription = {
      element,
      propertyName,
      subPropertyName,
      bindFunction,
      statementRepaintFunction,
    }

    subscriptions.push(subscription)

    // @ts-ignore
    element[symSubscriptions] ??= []
    // @ts-ignore
    element[symSubscriptions].push(subscription)
  }

  /**
   * Remove any subscriptions that the element is subscribed to
   *
   * @param {Node} element
   */
  unsubscribe(element) {
    if (symSubscriptions in element) {
      delete element[symSubscriptions]
    }

    this.#subscriptions.forEach((subscription, key) => {
      this.#subscriptions.set(key, subscription.filter((item) => (item.element !== element)))
    })
  }

  /**
   * @template T
   * @param {T} object
   * The input object that will be used to create
   * a proxy object with the same keys and values.
   * @param {string} [statePath]
   * The path to the state:
   * <br>
   * - If the state is the parent state, this is an empty string.
   * <br>
   * - If the state is a child state, this is the path to it (dot notated).
   * @returns {T}
   */
  createProxy(object, statePath = '') {
    const handler = this.#createProxyHandler()
    const proxy = new Proxy(object, handler)

    // Store the path to the state in a special value in the
    // proxy object, but make that value invisible for "for"
    // (and similar) statements.
    // Object.defineProperty(proxy, '--state-path', {
    //   enumerable: false,
    //   configurable: false,
    //   writable: false,
    //   value: statePath,
    // })

    // Recursive proxy. To find all inner objects
    // and turn them into child states.
    for (const key in proxy) {
      if (!(proxy[key] instanceof Object)) {
        continue
      }

      const innerStatePath = (statePath === '') ? key : `${statePath}.${key}`

      proxy[key] = this.createProxy(proxy[key], innerStatePath)
    }

    this.#state = proxy

    return proxy
  }

  /**
   * This is called when "length" of an array is changed, which
   * happens when elements are being added or popped from the end
   * of the array. Not when delete is being used!
   *
   * @param {any[]} updatedState
   */
  // #onArrayLengthChange(updatedState) {
  //   const subscription = this.#subscriptions.get('-s-forEach')
  //
  //   if (subscription) {
  //     subscription.forEach((listItem) => {
  //       const { statementRepaintFunction } = listItem
  //
  //       if (statementRepaintFunction instanceof Function) {
  //         statementRepaintFunction(updatedState)
  //       }
  //     })
  //   }
  // }

  /**
   * @param {EnumStateAction} action
   * @param {State} updatedState
   * @param {string | symbol} prop
   */
  #onPropCreateOrDelete(action, updatedState, prop) {
    const subscription = this.#subscriptions.get('-s-forEach')

    if (subscription) {
      for (let index = 0, length = subscription.length; index < length; index++) {
        const { statementRepaintFunction } = subscription[index]

        if (statementRepaintFunction) {
          // @ts-ignore
          statementRepaintFunction(action, updatedState, prop)
        }
      }
    }
  }

  /**
   * @param {State} updatedState
   * @param {string | symbol} prop
   */
  #onPropCreate(updatedState, prop) {
    this.#onPropCreateOrDelete(EnumStateAction.CREATE, updatedState, prop)
  }

  /**
   * @param {State} updatedState
   * @param {string | symbol} prop
   * @param {any} value
   */
  #onPropUpdate(updatedState, prop, value) {
    // 1. When the repaint function is outside all elements
    // const subscription = this.#subscriptions.get('-s-forEach')
    //
    // if (subscription) {
    //   for (let index = 0, length = subscription.length; index < length; index++) {
    //     const { statementRepaintFunction } = subscription[index]
    //
    //     if (statementRepaintFunction) {
    //       // @ts-ignore
    //       statementRepaintFunction(EnumStateAction.UPDATE, updatedState, prop)
    //     }
    //   }
    // }

    // 2. Individual elements
    if (this.#subscriptions.has(prop)) {
      const list = this.#subscriptions.get(prop) ?? []

      for (const listItem of list) {
        const {
          element,
          propertyName,
          subPropertyName,
          bindFunction,
          statementRepaintFunction,
        } = listItem

        if (Object.hasOwn(element, '--deleted')) {
          this.unsubscribe(element)

          return
        }

        let result = bindFunction.call(element, element)

        if (propertyName === 'style' && subPropertyName) {
          // @ts-ignore
          element.style[subPropertyName]
              = modifyStyleRule(subPropertyName, result)
        }
        else if (
          propertyName === '--if'
          || propertyName === '--for'
          || propertyName === '--nest'
        ) {
          if (statementRepaintFunction) {
            // @ts-ignore
            statementRepaintFunction(result)
          }
        }
        else {
          /**
           * @see Remark "() => value"
           */
          if (result instanceof Function) {
            result = result()
          }

          // @ts-ignore
          setElementAttrOrProp(element, propertyName, result)
        }
      }
    }
  }

  /**
   * @param {State} updatedState
   * @param {string | symbol} prop
   */
  #onPropDelete(updatedState, prop) {
    this.#onPropCreateOrDelete(EnumStateAction.DELETE, updatedState, prop)
  }

  /**
   * @param {State} updatedState
   * @param {any[]} args
   */
  #onSplice(updatedState, args) {
    const subscription = this.#subscriptions.get('-s-forEach')

    if (subscription) {
      for (let index = 0, length = subscription.length; index < length; index++) {
        const { statementRepaintFunction } = subscription[index]

        if (statementRepaintFunction) {
          // @ts-ignore
          statementRepaintFunction(EnumStateAction.SPLICE, updatedState, '', args)
        }
      }
    }
  }

  /**
   * @param {State} updatedState
   * @param {[number, number]} numKeys
   */
  #onSwap(updatedState, numKeys) {
    const subscription = this.#subscriptions.get('-s-forEach')

    if (subscription) {
      for (
        let index = 0, length = subscription.length;
        index < length;
        index++
      ) {
        const { statementRepaintFunction } = subscription[index]

        if (statementRepaintFunction) {
          // @ts-ignore
          statementRepaintFunction(EnumStateAction.SWAP, updatedState, '', numKeys)
        }
      }
    }
  }

  /**
   * @returns {ProxyHandler<StateProxy>}
   */
  #createProxyHandler() {
    /** @type {ProxyHandler<StateProxy>} */
    const handler = {
      get: (target, prop, receiver) => {
        if (prop === symState) {
          return target[prop]
        }
        /**
         * Why is hasOwn() needed?
         * If the state is for example an array and its whole value is read,
         * then JS tries to read few extra properties first - map, length, constructor
         */
        else if (
          Object.hasOwn(target, prop)
          || prop === symAccess
        ) {
          /**
           * In the if below it would be enough to check just one element,
           * but because of TS more than one is checked
           */
          if (
            suggestedItems.element
            && suggestedItems.bindFunction
          ) {
            this.subscribe(
              target,
              prop,
              suggestedItems.element,
              suggestedItems.propertyName,
              suggestedItems.subPropertyName,
              suggestedItems.bindFunction,
              suggestedItems.statementRepaintFunction,
            )
          }
        }
        // Internal functions of Set() and Map()
        else if (
          (target instanceof Map || target instanceof Set)
          // @ts-ignore
          && target[prop] instanceof Function
        ) {
          /**
           * @see https://stackoverflow.com/questions/48452885/observe-changes-to-a-map-using-a-proxy
           */

          // @ts-ignore
          const fn = target[prop]

          /**
           * @param {any[]} args
           * @returns {*}
           */
          const boundFunction = (...args) => {
            const result = fn.apply(target, args)

            if (target instanceof Set) {
              if (prop === 'add') {
                this.#onPropCreate(receiver, prop)
              }
              else if (prop === 'delete') {
                this.#onPropDelete(receiver, prop)
              }
            }
            else if (target instanceof Map) {
              if (prop === 'set') {
                this.#onPropCreate(receiver, prop)
              }
              else if (prop === 'delete') {
                this.#onPropDelete(receiver, prop)
              }
            }

            return result
          }

          return boundFunction
        }
        else if (
          target instanceof Array
          // @ts-ignore
          && target[prop] instanceof Function
        ) {
          if (prop === 'splice') {
            // @ts-ignore
            return (...args) => {
              // @ts-ignore
              const result = target[prop].apply(target, args)

              this.#onSplice(receiver, args)

              return result
            }
          }
          else if (prop === 'unshift') {
            // @ts-ignore
            return (...args) => {
              const result = target[prop].apply(target, args)

              this.#onSplice(receiver, [0, 0, ...args])

              return result
            }
          }
          else if (prop === 'shift') {
            return () => {
              const result = target[prop].apply(target)

              this.#onSplice(receiver, [0, 1])

              return result
            }
          }
          else if (prop === 'reverse') {
            // @ts-ignore
            return () => {
              const result = target[prop].apply(target)

              for (let i = 0, len = target.length; i < len; i++) {
                const j = len - 1 - i

                if (i >= j) break

                this.#onSwap(receiver, [i, j])
              }

              return result
            }
          }
        }

        return target[prop]
      },
      set: (target, prop, value, receiver) => {
        if (prop === symState || prop === symAccess) {
          target[prop] = value
        }
        // Array's length is set every time after
        // adding or removing elements
        else if (target instanceof Array && prop === 'length') {
          target[prop] = value

          // this.#onArrayLengthChange(receiver)
        }
        else if (Object.hasOwn(target, prop)) {
          target[prop] = value

          this.#onPropUpdate(receiver, prop, value)
        }
        else {
          if (value instanceof Object) {
            target[prop] = this.createProxy(value)
          }
          else {
            target[prop] = value
          }

          this.#onPropCreate(receiver, prop)
        }

        return true
      },

      /**
       * Trap for the delete operator. This trap can intercept these operations:
       *  - delete proxy[foo] and delete proxy.foo
       *  - Reflect.deleteProperty()
       *
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/deleteProperty
       * @param {StateProxy} target
       * @param {string | symbol} prop
       * @returns {boolean}
       * A Boolean indicating whether the property has been successfully deleted.
       */
      deleteProperty: (target, prop) => {
        delete target[prop]

        this.#onPropDelete(target, prop)

        return true
      },
    }

    return handler
  }
}

export {
  StateSubscriptions,
  elementHasSubscriptions,
  moveSubscriptions,
  setSuggestItems,
  unsetSuggestedItems,
}
