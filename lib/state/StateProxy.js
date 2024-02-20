import { EnumStateAction, symAccess } from '../constants.js'
import { modifyStyleRule, setElementAttrOrProp } from '../functions/misc.js'
import { suggestedItems } from './elementsSuggestor.js'
import { getArrayFunction } from './getArrayFunction.js'
import {
  getLinkedStates,
  getStateProps,
  hasStateProps,
  isState,
  setStateProps
} from './state.js'
import { Subscriptions } from './Subscriptions.js'

class StateProxy {
  /** @type {Subscriptions} */
  #subs

  constructor() {
    this.#subs = new Subscriptions()
  }

  /**
   * @template T
   * @param {T} object
   * The input object that will be used to create
   * a proxy object with the same keys and values.
   * @param {ObjectKey} keyInParent
   * The path to the state:
   * <br>
   * - If the state is the parent state, this is an empty string.
   * <br>
   * - If the state is a child state, this is the path to it (dot notated).
   * @param {State | null} [parentState]
   * @returns {T}
   */
  createProxy(object, keyInParent, parentState = null) {
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

    const handler = this.#handler
    const proxy = new Proxy(object, handler)

    if (object instanceof Object) {
      if (!(hasStateProps(proxy))) {
        setStateProps(proxy, {
          key: keyInParent,
          parent: parentState,
          target: object
        })
      }
    }

    for (const key in object) {
      /**
       * Recursive proxy - find all inner objects and turn
       * them into child states.
       */
      if (object[key] instanceof Object) {
        if (hasStateProps(proxy[key])) {
          continue
        }

        proxy[key] = this.createProxy(object[key], key, proxy)
      }
      else {
        /*
         * This is done only to ensure that "set" event is
         * triggered on the proxy
         */
        proxy[key] = object[key]
      }
    }

    return proxy
  }

  /** @type {ProxyHandler<TargetObject>} */
  #handler = {
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
        if (suggestedItems.element) {
          this.#subs.subscribe(
            receiver,
            prop,
            suggestedItems.element,
            suggestedItems.propertyName,
            suggestedItems.subPropertyName,
            // @ts-ignore
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
          EnumStateAction.ARRAY_LENGTH, target, receiver, [value]
        )

        this.#onPropUpdate(prop, target, receiver)
      }
      else if (Object.hasOwn(target, prop)) {
        if (
          value instanceof Object
          && !(value instanceof Date)
        ) {
          if (isState(value)) {
            if (target[prop] !== value) {
              target[prop] = value

              this.#onPropUpdateInForState(prop, target, receiver)
              this.#onPropUpdate(prop, target, receiver)
            }
          }
          else {
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
                  this.#onPropDelete(prop, target, receiver)
                }
              }

              for (const key in target[prop]) {
                if (!(key in value)) {
                  this.#onPropDelete(key, target, receiver[prop])
                }
              }
            }

            const parentState = isState(receiver) ? receiver : null

            target[prop] = this.createProxy(value, prop, parentState)

            this.#onPropUpdateInForState(prop, target, receiver)
          }
        }
        else {
          if (target[prop] !== value) {
            target[prop] = value

            this.#onPropUpdateInForState(prop, target, receiver)
            this.#onPropUpdate(prop, target, receiver)
          }
          else {
            this.#onPropUpdateInForState(prop, target, receiver)
          }
        }
      }
      else {
        const initialArrayLength = (target instanceof Array)
          ? target.length
          : -1

        if (
          value instanceof Object
          && !(isState(value))
        ) {
          target[prop] = this.createProxy(value, prop, receiver)
        }
        else {
          target[prop] = value
        }

        this.#onPropCreate(prop, target, receiver)

        if (target instanceof Array && target.length !== initialArrayLength) {
          receiver.length = target.length
        }
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
          this.#onPropDelete(prop, target, linkedState)
        }
      }

      return true
    }
  }

  /**
   * @param {EnumStateAction} action
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   * @param {any[]} args
   */
  #onArrayFunctionCallback = (action, updatedObject, updatedState, args) => {
    const subscriptions = this.#subs.subscriptions.get('-s-reactive')

    if (!subscriptions) {
      return
    }

    for (const [element, elementSubscriptions] of subscriptions) {
      for (const subscription of elementSubscriptions) {
        if (subscription.state !== updatedState) continue

        const repaintFunction = subscription.repaintFunction

        if (repaintFunction) {
          // @ts-ignore
          repaintFunction(action, updatedObject, updatedState, '', args)
        }
      }
    }
  }

  /**
   * @param {string | symbol} prop
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   */
  #onPropCreate(prop, updatedObject, updatedState) {
    this.#onPropCreateOrDelete(
      EnumStateAction.CREATE, prop, updatedObject, updatedState
    )
  }

  /**
   * @param {EnumStateAction} action
   * @param {string | symbol} prop
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   */
  #onPropCreateOrDelete(action, prop, updatedObject, updatedState) {
    const subscriptions = this.#subs.subscriptions.get('-s-reactive')

    if (!subscriptions) {
      return
    }

    for (const [element, elementSubscriptions] of subscriptions) {
      for (const subscription of elementSubscriptions) {
        if (subscription.state !== updatedState) continue

        const repaintFunction = subscription.repaintFunction

        if (repaintFunction) {
          // @ts-ignore
          repaintFunction(action, updatedObject, updatedState, prop)
        }
      }
    }
  }

  /**
   * @param {string | symbol} prop
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   */
  #onPropDelete(prop, updatedObject, updatedState) {
    this.#onPropCreateOrDelete(
      EnumStateAction.DELETE, prop, updatedObject, updatedState
    )
  }

  /**
   * @param {string | symbol} prop
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   */
  #onPropUpdate(prop, updatedObject, updatedState) {
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
          state
        } = subscription

        if (state !== updatedState) continue

        let result = bindFunction.call(element, element)

        if (propertyName === 'style' && subPropertyName) {
          // @ts-ignore
          element.style[subPropertyName]
            = modifyStyleRule(subPropertyName, result)
        }
        else if (
          propertyName === '--if'
          || propertyName === '--forEach'
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
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   */
  #onPropUpdateInForState(prop, updatedObject, updatedState) {
    const stateProps = getStateProps(updatedState)

    if (!(stateProps)) {
      throw new Error('Missing meta data')
    }

    const subscriptions = this.#subs.subscriptions.get('-s-reactive')

    if (!subscriptions) {
      return
    }

    for (const [element, elementSubscriptions] of subscriptions) {
      for (const subscription of elementSubscriptions) {
        const subscriptionStateProps = getStateProps(subscription.state)

        if (
          subscriptionStateProps
          && (subscriptionStateProps.parent !== stateProps.parent)
        ) {
          continue
        }

        const repaintFunction = subscription.repaintFunction

        if (repaintFunction) {
          repaintFunction(
            // @ts-ignore
            EnumStateAction.UPDATE, updatedObject, updatedState, prop
          )
        }
      }
    }
  }
}

export { StateProxy }
