import { EnumStateAction, symAccess, symState } from './constants.js'
import { suggestedItems } from './elementsSuggestor.js'
import { modifyStyleRule, setElementAttrOrProp } from './functions.js'
import { SubscriptionsManager } from './SubscriptionsManager.js'

/** @typedef {Object<*, *> | Array<*>} ProxyObject */

class StateProxy {
  /** @type {SubscriptionsManager} */
  #subsManager

  constructor() {
    this.#subsManager = new SubscriptionsManager()
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
    if (!(object instanceof Object)) {
      throw new Error('Cannot create a Proxy on non-object')
    }

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
  //   const subscription = this.#subscriptions.subscriptions.get('-s-forEach')
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
   * @returns {ProxyHandler<ProxyObject>}
   */
  #createProxyHandler() {
    /** @type {ProxyHandler<ProxyObject>} */
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
            this.#subsManager.subscribe(
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
          return this.#onArrayFunction(target, receiver, prop)
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
          if (value instanceof Object) {
            target[prop] = this.createProxy(value)

            this.#onPropDelete(receiver, prop)
            this.#onPropCreate(receiver, prop)
          }
          else {
            target[prop] = value

            this.#onPropUpdate(receiver, prop, value)
          }
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
   * @param {ProxyObject} target
   * @param {State} receiver
   * @param {string} prop
   * @returns {Function | void}
   */
  #onArrayFunction(target, receiver, prop) {
    switch (prop) {
      case 'copyWithin': {
        // @ts-ignore
        return (...args) => {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          let [targetIndex, start, end] = args
          const { length } = target

          /**
           * Fix the arguments, according to the rules in the following link:
           *
           * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin
           */
          if (targetIndex < 0) targetIndex += length
          else if (targetIndex < -length) targetIndex = 0
          else if (targetIndex >= length) return
          else if (targetIndex > start) end = length - 1

          if (start < 0) start += length
          else if (start < -length || start === undefined) start = 0
          else if (start >= length) return

          if (end < 0) end += length
          else if (end < -length) end = 0
          else if (end >= length || end === undefined) end = length
          else if (end <= start) return

          // Apply the function
          const result = target[prop].apply(target, [targetIndex, start, end])

          this.#onArrayFunctionCallback(
            EnumStateAction.ARRAY_COPY_WITHIN,
            receiver,
            [targetIndex, start, end],
          )

          return result
        }
      }
      case 'reverse': {
        return () => {
          const result = target[prop].apply(target)

          for (let i = 0, len = target.length; i < len; i++) {
            const j = len - 1 - i

            if (i >= j) break

            this.#onArrayFunctionCallback(
              EnumStateAction.ARRAY_SWAP,
              receiver,
              [i, j],
            )
          }

          return result
        }
      }
      case 'shift': {
        return () => {
          const result = target[prop].apply(target)

          this.#onArrayFunctionCallback(
            EnumStateAction.ARRAY_SPLICE,
            receiver,
            [0, 1],
          )

          return result
        }
      }
      case 'sort': {
        // @ts-ignore
        return (...args) => {
          // @ts-ignore
          const result = target[prop].apply(target, args)

          this.#onArrayFunctionCallback(
            EnumStateAction.ARRAY_SORT,
            receiver,
            args,
          )

          return result
        }
      }
      case 'splice': {
        // @ts-ignore
        return (...args) => {
          const result = target[prop].apply(target, args)

          this.#onArrayFunctionCallback(
            EnumStateAction.ARRAY_SPLICE,
            receiver,
            args,
          )

          return result
        }
      }
      case 'unshift': {
        // @ts-ignore
        return (...args) => {
          const result = target[prop].apply(target, args)

          this.#onArrayFunctionCallback(
            EnumStateAction.ARRAY_SPLICE,
            receiver,
            [0, 0, ...args],
          )

          return result
        }
      }
      default: {
        return target[prop]
      }
    }
  }

  /**
   * @param {EnumStateAction} action
   * @param {State} updatedState
   * @param {any[]} args
   */
  #onArrayFunctionCallback(action, updatedState, args) {
    const subscription = this.#subsManager.subscriptions.get('-s-forEach')

    if (subscription) {
      for (let index = 0, length = subscription.length; index < length; index++) {
        const { statementRepaintFunction } = subscription[index]

        if (statementRepaintFunction) {
          // @ts-ignore
          statementRepaintFunction(action, updatedState, '', args)
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
    const subscription = this.#subsManager.subscriptions.get('-s-forEach')

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
  #onPropDelete(updatedState, prop) {
    this.#onPropCreateOrDelete(EnumStateAction.DELETE, updatedState, prop)
  }

  /**
   * @param {State} updatedState
   * @param {string | symbol} prop
   * @param {any} value
   */
  #onPropUpdate(updatedState, prop, value) {
    // 1. When the repaint function is outside all elements
    // const subscription = this.#subscriptions.subscriptions.get('-s-forEach')
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
    if (this.#subsManager.subscriptions.has(prop)) {
      const list = this.#subsManager.subscriptions.get(prop) ?? []

      for (const listItem of list) {
        const {
          element,
          propertyName,
          subPropertyName,
          bindFunction,
          statementRepaintFunction,
        } = listItem

        if (Object.hasOwn(element, '--deleted')) {
          this.#subsManager.unsubscribe(element)

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

export { StateProxy }
