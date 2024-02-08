import { EnumStateAction, symAccess } from './constants.js'
import { suggestedItems } from './elementsSuggestor.js'
import { modifyStyleRule, setElementAttrOrProp } from './functions.js'
import { getArrayFunction } from './getArrayFunction.js'
import { StateProxySubscriptions } from './StateProxySubscriptions.js'
import { getLinkedStates, getStateProps, hasStateProps, isState, setStateProps } from './state.js'

class StateProxy {
  /** @type {StateProxySubscriptions} */
  #subs

  constructor() {
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
   * @param {State | null} [parentState]
   * @returns {T}
   */
  createProxy(object, statePath, parentState = null) {
    /*
     * // Wrap the object in a "base" object
     * if (!statePath && parentState === undefined) {
     *   const baseObj = { '#base': object }
     *   const baseState = this.createProxy(baseObj, '', null)
     *
     *   object = baseState['#base']
     * }
     */

    /**
     * Performance hint: Access to the original object instead of
     * the proxy object whenever possible, because accessing a
     * proxy has worse performance.
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
    const proxy = new Proxy(object, handler)

    if (object instanceof Object) {
      if (!(hasStateProps(proxy))) {
        setStateProps(proxy, {
          target: object,
          path: statePath,
          parent: parentState
        })
      }
    }

    for (const key in object) {
      /**
       * Recursive proxy - find all inner objects and turn
       * them into child states.
       */
      // @ts-ignore
      if (object[key] instanceof Object) {
        if (hasStateProps(proxy[key])) {
          continue
        }

        const innerStatePath = (statePath === '') ? key : `${statePath}.${key}`

        // @ts-ignore
        proxy[key] = this.createProxy(object[key], innerStatePath, proxy)
      }
      else {
        /*
         * This is done only to ensure that "set" event is
         * triggered on the proxy
         */
        // @ts-ignore
        proxy[key] = object[key]
      }
    }

    return proxy
  }

  /**
   * @returns {ProxyHandler<TargetObject>}
   */
  #createProxyHandler() {
    /** @type {ProxyHandler<TargetObject>} */
    const handler = {
      get: (target, prop, receiver) => {
        const stateProps = getStateProps(target)

        /*
         * If the target is a Proxy, get the original target
         */
        if (stateProps) {
          target = stateProps.target
        }

        /**
         * Why is hasOwn() needed?
         * If the state is for example an array and its whole value is read,
         * then JS tries to read few extra properties first - map, length,
         * constructor
         */
        if (
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
              suggestedItems.repaintFunction,
            )
          }
        }
        /*
         * Internal functions of Array
         */
        else if (
          target instanceof Array
          // @ts-ignore
          && target[prop] instanceof Function
          && typeof prop === 'string'
        ) {
          return getArrayFunction(
            prop, target, receiver, this.#onArrayFunctionCallback
          )
        }

        return target[prop]
      },
      set: (target, prop, value, receiver) => {
        if (target instanceof Array && prop === 'length') {
          target[prop] = value

          this.#onArrayFunctionCallback(
            EnumStateAction.ARRAY_LENGTH, receiver, [value],
          )
          this.#onPropUpdateInForState(prop, receiver)
          this.#onPropUpdate(prop)
        }
        else if (Object.hasOwn(target, prop)) {
          if (
            value instanceof Object
            && !(value instanceof Date)
            && !(isState(value)) // prevents infinite loop
          ) {
            let statePath = (typeof prop === 'string') ? prop : ''
            const stateProps = getStateProps(receiver)

            // If the target is already a proxy state, prepend the path from it
            if (stateProps && stateProps.path !== '') {
              statePath = stateProps.path + '.' + statePath
            }

            if (target[prop] instanceof Object && value instanceof Object) {
              /**
               * - Find inner Arrays and set the length. This will cause
               *   only previously created DOM elements to be deleted
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
                  this.#onPropDelete(prop, receiver)
                }
              }

              for (const key in target[prop]) {
                if (!(key in value)) {
                  this.#onPropDelete(key, receiver[prop])
                }
              }
            }

            const parentState = isState(receiver) ? receiver : null

            target[prop] = this.createProxy(value, statePath, parentState)

            this.#onPropUpdateInForState(prop, receiver)

            // this.#onPropDelete(prop, receiver)

            // this.#onPropCreate(prop, receiver)

            // this.#onPropUpdate(prop)
          }
          else if (value instanceof Object
            && !(value instanceof Date)
            && (isState(value))
          ) {
            target[prop] = value

            this.#onPropUpdateInForState(prop, receiver)
            this.#onPropUpdate(prop)
          }
          else {
            target[prop] = value

            this.#onPropUpdateInForState(prop, receiver)
            this.#onPropUpdate(prop)
          }
        }
        else {
          if (
            value instanceof Object
            && !(isState(value))
          ) {
            let statePath = (typeof prop === 'string') ? prop : ''
            const stateProps = getStateProps(receiver)

            // If the target is already a proxy state, prepend the path from it
            if (stateProps && stateProps.path !== '') {
              statePath = stateProps.path + '.' + statePath
            }

            target[prop] = this.createProxy(
              value,
              statePath,
              receiver
            )
          }
          else {
            target[prop] = value
          }

          this.#onPropCreate(prop, receiver)
        }

        return true
      },

      /**
       * Trap for the delete operator. This trap can intercept
       * the following operations:
       *  - delete proxy[foo] and delete proxy.foo
       *  - Reflect.deleteProperty()
       *
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/deleteProperty
       * @param {TargetObject} target
       * @param {string | symbol} prop
       * @returns {boolean} A Boolean indicating whether
       * the property has been successfully deleted.
       */
      deleteProperty: (target, prop) => {
        delete target[prop]

        const linkedStates = getLinkedStates(target)

        if (linkedStates) {
          for (const linkedState of linkedStates) {
            this.#onPropDelete(prop, linkedState)
          }
        }

        return true
      }
    }

    return handler
  }

  /**
   * @param {State} updatedState
   * @param {Subscription} elementSubscription
   * @returns {RepaintFunction | null}
   */
  #getRepaintFunction(updatedState, elementSubscription) {
    const stateProps = getStateProps(updatedState)

    if (!stateProps) {
      throw new Error('Missing meta data')
    }

    const { repaintFunction, statePath } = elementSubscription

    if (stateProps.path !== statePath || !repaintFunction) {
      return null
    }

    return repaintFunction
  }

  /**
   * @param {EnumStateAction} action
   * @param {State} updatedState
   * @param {any[]} args
   */
  #onArrayFunctionCallback = (action, updatedState, args) => {
    const subscriptions = this.#subs.subscriptions.get('-s-reactive')

    if (!subscriptions) {
      return
    }

    for (const [element, elementSubscriptions] of subscriptions) {
      for (
        let index = 0,
            length = elementSubscriptions.length;
        index < length;
        index++
      ) {
        const repaintFunction = this.#getRepaintFunction(
          updatedState,
          // @ts-ignore
          elementSubscriptions[index]
        )

        if (repaintFunction) {
          // @ts-ignore
          repaintFunction(action, updatedState, '', args)
        }
      }
    }
  }

  /**
   * @param {string | symbol} prop
   * @param {State} updatedState
   */
  #onPropCreate(prop, updatedState) {
    this.#onPropCreateOrDelete(EnumStateAction.CREATE, prop, updatedState)
  }

  /**
   * @param {EnumStateAction} action
   * @param {string | symbol} prop
   * @param {State} updatedState
   */
  #onPropCreateOrDelete(action, prop, updatedState) {
    const subscriptions = this.#subs.subscriptions.get('-s-reactive')

    if (!subscriptions) {
      return
    }

    for (const [element, elementSubscriptions] of subscriptions) {
      for (
        let index = 0,
            length = elementSubscriptions.length;
        index < length;
        index++
      ) {
        const repaintFunction = this.#getRepaintFunction(
          updatedState,
          // @ts-ignore
          elementSubscriptions[index],
        )

        if (repaintFunction) {
          // @ts-ignore
          repaintFunction(action, updatedState, prop)
        }
      }
    }
  }

  /**
   * @param {string | symbol} prop
   * @param {State} updatedState
   */
  #onPropDelete(prop, updatedState) {
    this.#onPropCreateOrDelete(EnumStateAction.DELETE, prop, updatedState)
  }

  /**
   * @param {string | symbol} prop
   */
  #onPropUpdate(prop) {
    const subscriptions = this.#subs.subscriptions.get(prop)

    if (!subscriptions) {
      return
    }

    for (const [element, elementSubscriptions] of subscriptions) {
      for (const subscription of elementSubscriptions) {
        const {
          propertyName,
          subPropertyName,
          bindFunction,
          repaintFunction,
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
          if (repaintFunction) {
            // @ts-ignore
            repaintFunction(result)
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
   * @param {string | symbol} prop
   * @param {State} updatedState
   */
  #onPropUpdateInForState(prop, updatedState) {
    const stateProps = getStateProps(updatedState)

    if (!(stateProps)) {
      throw new Error('Missing meta data')
    }

    const subscriptions = this.#subs.subscriptions.get('-s-reactive')

    if (!subscriptions) {
      return
    }

    for (const [element, elementSubscriptions] of subscriptions) {
      for (
        let index = 0, length = elementSubscriptions.length;
        index < length;
        index++
      ) {
        const repaintFunction = this.#getRepaintFunction(
          updatedState,
          // @ts-ignore
          elementSubscriptions[index],
        )

        if (repaintFunction) {
          // @ts-ignore
          repaintFunction(EnumStateAction.UPDATE, updatedState, prop)
        }
      }
    }
  }
}

export { StateProxy }
