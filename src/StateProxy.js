import { EnumStateAction, symAccess, symState } from './constants.js'
import { suggestedItems } from './elementsSuggestor.js'
import { modifyStyleRule, setElementAttrOrProp } from './functions.js'
import { StateProxyArrayFunctions } from './StateProxyArrayFunctions.js'
import { StateProxySubscriptions } from './StateProxySubscriptions.js'
import { isState } from './state.js'

/** @typedef {Object<*, *> | Array<*>} ProxyObject */

class StateProxy {
  /** @type {StateProxyArrayFunctions} */
  #arrayFunctions

  /** @type {StateProxySubscriptions} */
  #subs

  constructor() {
    this.#arrayFunctions = new StateProxyArrayFunctions()
    this.#subs = new StateProxySubscriptions()
  }

  /**
   * @template T
   * @param {T} object
   * The input object that will be used to create
   * a proxy object with the same keys and values.
   * @param {string} statePath
   * The path to the state:
   * <br>
   * - If the state is the parent state, this is an empty string.
   * <br>
   * - If the state is a child state, this is the path to it (dot notated).
   * @returns {T}
   */
  createProxy(object, statePath) {
    /**
     * Performance hint: Access to the original object instead of the proxy object
     * whenever possible, because accessing a proxy has worse performance.
     */

    if (!(object instanceof Object)) {
      throw new Error('Cannot create a Proxy on non-object')
    }

    if (
      isState(object)
      || object instanceof Date
    ) {
      return object
    }

    const handler = this.#createProxyHandler()
    const proxy   = new Proxy(object, handler)

    // Store the path to the state in a special value in the
    // proxy object, but make that value invisible for "for"
    // (and similar) statements.
    // Object.defineProperty(proxy, '--state-path', {
    //   enumerable: false,
    //   configurable: false,
    //   writable: false,
    //   value: statePath,
    // })

    if (object instanceof Object) {
      if (!(symState in proxy)) {
        proxy[symState] = { target: object, path: statePath }
      }
    }

    for (const key in object) {
      /**
       * Recursive proxy - find all inner objects and turn them into child states.
       */
      // @ts-ignore
      if (object[key] instanceof Object) {
        if (symState in proxy[key]) {
          continue
        }

        const innerStatePath = (statePath === '') ? key : `${statePath}.${key}`

        // @ts-ignore
        proxy[key] = this.createProxy(object[key], innerStatePath)
      }
      else {
        // This is done only to ensure that "set" event is triggered on the proxy
        // @ts-ignore
        proxy[key] = object[key]
      }
    }

    return proxy
  }

  /**
   * @returns {ProxyHandler<ProxyObject>}
   */
  #createProxyHandler() {
    /** @type {ProxyHandler<ProxyObject>} */
    const handler = {
      get: (target, prop, receiver) => {
        // If the target is a Proxy, get the original target
        if (symState in target) {
          target = target[symState].target
        }

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
           * In the "if" below it would be enough to check just one element,
           * but because of TS more than one is checked
           */
          if (
            suggestedItems.element
            && suggestedItems.bindFunction
          ) {
            this.#subs.subscribe(
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
          && typeof prop === 'string'
        ) {
          return this.#arrayFunctions.callArrayFn(
            prop, target, receiver, this.#onArrayFunctionCallback,
          )
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

          this.#onArrayFunctionCallback(
            EnumStateAction.ARRAY_LENGTH, receiver, [value],
          )
        }
        else if (Object.hasOwn(target, prop)) {
          if (
            value instanceof Object
            && !(value instanceof Date)
            && !(isState(value)) // prevents infinite loop
          ) {
            let statePath = (typeof prop === 'string') ? prop : ''

            // If the target is already a proxy state, prepend the path from it
            if (symState in target && target[symState].path !== '') {
              statePath = target[symState].path + '.' + statePath
            }

            if (target[prop] instanceof Object && value instanceof Object) {
              /**
               * - Find inner Arrays and set the length. This will cause only previously
               * created DOM elements to be deleted
               * - Find inner Objects and delete their elements.
               */
              for (const key in value) {
                if (
                  value[key] instanceof Array
                  && target[prop][key] instanceof Array
                  && target[prop][key].length !== value[key].length
                ) {
                  target[prop][key].length = value[key].length
                }
                else if (
                  value[key] instanceof Object
                  && target[prop][key] instanceof Object
                ) {
                  this.#onPropDelete(target, prop)
                }
              }

              for (const key in target[prop]) {
                if (!(key in value)) {
                  this.#onPropDelete(target[prop], key)
                }
              }

              /**
               * When in an Object a whole Array is set, its new values could be primitive
               * and non-reactive. Loop through the array and for each primitive value that
               * is changed, fire the update events.
               */
              // for (const i in value) {
              //   if (!(value[i] instanceof Object)) {
              //     if (value[i] !== target[prop][i]) {
              //       target[prop][symState] ??= { target: value, path: statePath }
              //       target[prop][i] = value[i]
              //
              //       this.#onPropDelete(target[prop], i)
              //       this.#onPropCreate(target[prop], i)
              //     }
              //   }
              // }
            }

            target[prop] = this.createProxy(value, statePath)

            this.#onPropUpdateInForState(receiver, prop, value)
            //this.#onPropDelete(receiver, prop)
            //this.#onPropCreate(receiver, prop)
            //this.#onPropUpdate(receiver, prop, value)
          }
          else if (value instanceof Object
            && !(value instanceof Date)
            && (isState(value))
          ) {
            target[prop] = value

            this.#onPropUpdateInForState(receiver, prop, value)
            this.#onPropUpdate(receiver, prop, value)
          }
          else {
            target[prop] = value

            this.#onPropUpdateInForState(receiver, prop, value)
            this.#onPropUpdate(receiver, prop, value)
          }
        }
        else {
          if (
            value instanceof Object
            && !(isState(value))
          ) {
            target[prop] = this.createProxy(value, '')
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
       * @param {ProxyObject} target
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

  /**
   * @param {State} updatedState
   * @param {Subscription} elementSubscription
   * @returns {StatementRepaintFunction | null}
   */
  #getStatementRepaintFunction(updatedState, elementSubscription) {
    if (!(symState in updatedState)) {
      throw new Error('The state must have symState')
    }

    const { statementRepaintFunction, statePath } = elementSubscription

    if (
      // @ts-ignore
      updatedState?.[symState].path !== statePath
      || !statementRepaintFunction
    ) {
      return null
    }

    return statementRepaintFunction
  }

  /**
   * @param {EnumStateAction} action
   * @param {State} updatedState
   * @param {any[]} args
   */
  #onArrayFunctionCallback = (action, updatedState, args) => {
    const subscriptions = this.#subs.subscriptions.get('-s-forState')

    if (subscriptions) {
      for (const [element, elementSubscriptions] of subscriptions) {
        for (let index = 0, length = elementSubscriptions.length; index < length; index++) {
          const statementRepaintFunction = this.#getStatementRepaintFunction(
            updatedState,
            elementSubscriptions[index],
          )

          if (statementRepaintFunction) {
            // @ts-ignore
            statementRepaintFunction(action, updatedState, '', args)
          }
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
   * @param {EnumStateAction} action
   * @param {State} updatedState
   * @param {string | symbol} prop
   */
  #onPropCreateOrDelete(action, updatedState, prop) {
    const subscriptions = this.#subs.subscriptions.get('-s-forState')

    if (subscriptions) {
      for (const [element, elementSubscriptions] of subscriptions) {
        for (let index = 0, length = elementSubscriptions.length; index < length; index++) {
          const statementRepaintFunction = this.#getStatementRepaintFunction(
            updatedState,
            elementSubscriptions[index],
          )

          if (statementRepaintFunction) {
            // @ts-ignore
            statementRepaintFunction(action, updatedState, prop)
          }
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
   * @param {string | symbol} prop
   * @param {any} value
   */
  #onPropUpdate(updatedState, prop, value) {
    if (this.#subs.subscriptions.has(prop)) {
      const subscriptions = this.#subs.subscriptions.get(prop)

      if (subscriptions) {
        for (const [element, elementSubscriptions] of subscriptions) {
          for (const subscription of elementSubscriptions) {
            const {
              propertyName,
              subPropertyName,
              bindFunction,
              statementRepaintFunction,
            } = subscription

            if (Object.hasOwn(element, '--deleted')) {
              this.#subs.unsubscribe(element)

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
    }
  }

  /**
   * @param {State} updatedState
   * @param {string | symbol} prop
   * @param {any} value
   */
  #onPropUpdateInForState(updatedState, prop, value) {
    if (!(symState in updatedState)) {
      throw new Error('The state must have symState')
    }

    const subscriptions = this.#subs.subscriptions.get('-s-forState')

    if (subscriptions) {
      for (const [element, elementSubscriptions] of subscriptions) {
        for (
          let index = 0, length = elementSubscriptions.length;
          index < length;
          index++
        ) {
          const statementRepaintFunction = this.#getStatementRepaintFunction(
            updatedState,
            elementSubscriptions[index],
          )

          if (statementRepaintFunction) {
            // @ts-ignore
            statementRepaintFunction(EnumStateAction.UPDATE, updatedState, prop)
          }
        }
      }
    }
  }
}

export { StateProxy }
