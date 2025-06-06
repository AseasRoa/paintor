import { EnumStateAction, EnumSystemProps, symAccess } from '../common/constants.js'
import { setElementAttrOrProp, setElementStyleRule } from '../common/functions/dom.js'
import { isArray, isObjectOrArray } from '../common/functions/misc.js'
import { arrayFunction } from './arrayFunction/arrayFunction.js'
import { suggestedItems } from './elementsSuggestor.js'
import {
  EnumObserverType,
  runCallbacks,
  setLastProxyGetData
} from './observerSubs.js'
import {
  getLinkedStates,
  hasStateProps,
  isState,
  setStateProps
} from './stateProps.js'
import {
  getSubsBy,
  migrateStates,
  subscribe,
  unsubscribeState
} from './stateSubs.js'

const symIsProxy = Symbol('isProxy')

export class StateProxy {
  /**
   * @param {TargetObject} object
   * The input object that will be used to create
   * a proxy object with the same keys and values.
   * @param {ObjectKey} keyInParent
   * The path to the state:
   * <br>
   * - If the state is the parent state, this is an empty string.
   * <br>
   * - If the state is a child state, this is the path to it (dot notated).
   * @param {State | null} [parentState]
   * @returns {State}
   * @throws {Error}
   */
  createProxy(object, keyInParent, parentState = null) {
    /**
     * Performance hint: Access to the original object instead of
     * the proxy object whenever possible, because accessing a
     * proxy has worse performance.
     */

    if (!(isObjectOrArray(object))) {
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

    if (isObjectOrArray(object)) {
      if (!(hasStateProps(proxy))) {
        setStateProps(proxy, {
          key: keyInParent,
          parent: parentState,
          target: object
        })
      }
    }

    return proxy
  }

  /** @type {ProxyHandler<TargetObject>} */
  #handler = {
    get: (target, prop, receiver) => {
      /*
       * Recursive proxy creation
       *
       * The idea is, if we have a proxy object with regular objects in it,
       * we can turn each of these regular objects into a proxy object once
       * it is accessed here in 'get'. To find out whether the object is a
       * regular object or a proxy, we try to access a special property.
       * This property doesn't exist in neither object, but because the
       * proxy object has a 'get' handler, 'true' is returned.
       */
      if (prop === symIsProxy) return true

      if (
        isObjectOrArray(target[prop])
        && !target[prop][symIsProxy]
      ) {
        target[prop] = this.createProxy(target[prop], prop, receiver)

        return target[prop]
      }

      setLastProxyGetData(receiver, prop)

      /*
       * Why is hasOwn() needed?
       * If the state is for example an array, and its whole value is read,
       * then JS tries to read few extra properties first - map, length,
       * constructor
       */
      if (
        Object.hasOwn(target, prop)
        || prop === symAccess
      ) {
        if (
          suggestedItems.element
          && (
            !suggestedItems.state
            || suggestedItems.state === receiver
          )) {
          subscribe(
            receiver,
            prop,
            // @ts-expect-error
            suggestedItems.bindFn,
            suggestedItems.element,
            suggestedItems.elementProp,
            suggestedItems.elementInnerProp,
            suggestedItems.repaintFn
          )
        }

        return target[prop]
      }

      /*
       * Internal functions of Array
       */
      if (
        typeof prop === 'string'
        && isArray(target)
        && typeof target[prop] === 'function'
      ) {
        return arrayFunction(
          prop,
          target,
          receiver,
          this.#onArrayFunctionCallback,
        )
      }

      return target[prop]
    },
    set: (target, prop, value, receiver) => {
      if (
        prop === 'length'
        && isArray(target)
      ) {
        const oldValue = target[prop]

        // Not mandatory, as later the states are unsubscribed
        // with the removal of DOM elements
        if (value < oldValue) {
          for (let i = target.length - 1; i >= value; i--) {
            unsubscribeState(target[i], true)
          }
        }

        target[prop] = value

        this.#onArrayFunctionCallback(
          EnumStateAction.ARRAY_LENGTH, target, receiver, [value]
        )

        this.#onPropUpdate(prop, target, receiver, oldValue)
      }
      else if (Object.hasOwn(target, prop)) {
        if (
          isObjectOrArray(value)
          && (target[prop] !== value)
          && !(value instanceof Date)
        ) {
          if (target[prop] !== value) {
            if (isObjectOrArray(target[prop]) && isObjectOrArray(value)) {
              /**
               * - Find inner Arrays and set the length. This will cause
               *   only previously created DOM elements to be deleted
               * - Find inner Objects and delete their elements.
               */
              for (const key in value) {
                if (
                  isArray(value[key])
                  && isArray(target[prop][key])
                  && target[prop][key].length !== value[key].length
                ) {
                  target[prop][key].length = value[key].length
                }
                else if (
                  isObjectOrArray(value[key])
                  && isObjectOrArray(target[prop][key])
                ) {
                  this.#onDelete(prop, target, receiver)
                }
              }

              for (const key in target[prop]) {
                if (!(key in value)) {
                  this.#onDelete(key, target, receiver[prop])
                }
              }
            }

            const oldObject = target[prop]

            target[prop] = value

            migrateStates(oldObject, receiver[prop])

            for (const key in target[prop]) {
              this.#onUpdate(key, target[prop], receiver[prop], oldObject)
              this.#onPropUpdate(key, target[prop], receiver[prop], oldObject)
            }

            this.#onUpdate(prop, target, receiver, oldObject)
          }
        }
        else {
          if (target[prop] !== value) {
            const oldValue = target[prop]

            target[prop] = value

            this.#onDelete(prop, target, receiver)
            this.#onCreate(prop, target, receiver)
            this.#onPropUpdate(prop, target, receiver, oldValue)
          }
          else {
            const oldValue = target[prop]

            this.#onUpdate(prop, target, receiver, oldValue)
          }
        }
      }
      else {
        const initialArrayLength = (isArray(target))
          ? target.length
          : -1

        target[prop] = value

        this.#onPropCreate(prop, target, receiver)
        this.#onCreate(prop, target, receiver)

        if (isArray(target) && target.length !== initialArrayLength) {
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
     * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/deleteProperty
     * @param {TargetObject} target
     * @param {string | symbol} prop
     * @returns {boolean} A Boolean indicating whether
     * the property has been successfully deleted.
     */
    deleteProperty: (target, prop) => {
      const oldValue = target[prop]

      unsubscribeState(oldValue, true)

      delete target[prop]

      const linkedStates = getLinkedStates(target)

      if (linkedStates) {
        for (const linkedState of linkedStates) {
          this.#onPropDelete(prop, target, linkedState, oldValue)
          this.#onDelete(prop, target, linkedState)
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
    const subs = getSubsBy(updatedState, EnumSystemProps.reactive)

    if (!subs) return

    for (const [bindFn, subscriptions] of subs) {
      for (const sub of subscriptions) {
        const { repaintFn } = sub

        if (repaintFn) {
          repaintFn(action, updatedObject, updatedState, '', args)
        }
      }
    }
  }

  /**
   * @param {string | symbol} prop
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   */
  #onCreate(prop, updatedObject, updatedState) {
    this.#onCreateOrDelete(
      EnumStateAction.CREATE, prop, updatedObject, updatedState
    )
  }

  /**
   * @param {string | symbol} prop
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   */
  #onDelete(prop, updatedObject, updatedState) {
    this.#onCreateOrDelete(
      EnumStateAction.DELETE, prop, updatedObject, updatedState
    )
  }

  /**
   * @param {EnumStateAction} action
   * @param {string | symbol} prop
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   */
  #onCreateOrDelete(action, prop, updatedObject, updatedState) {
    const subs = getSubsBy(updatedState, EnumSystemProps.reactive)

    if (!subs) return

    for (const [bindFn, subscriptions] of subs) {
      for (const sub of subscriptions) {
        const { repaintFn } = sub

        if (repaintFn) {
          repaintFn(action, updatedObject, updatedState, prop)
        }
      }
    }
  }

  /**
   * @param {string | symbol} prop
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   * @param {any} oldValue
   */
  #onUpdate(prop, updatedObject, updatedState, oldValue) {
    // State subs
    runCallbacks(
      EnumObserverType.CHANGE, updatedObject, updatedState, prop, oldValue
    )
    runCallbacks(
      EnumObserverType.SET, updatedObject, updatedState, prop, oldValue
    )

    const subs = getSubsBy(updatedState, EnumSystemProps.reactive)

    if (!subs) return

    for (const [bindFn, subscriptions] of subs) {
      for (const sub of subscriptions) {
        const { repaintFn } = sub

        if (repaintFn) {
          repaintFn(
            EnumStateAction.UPDATE, updatedObject, updatedState, prop
          )
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
    runCallbacks(
      EnumObserverType.CREATE, updatedObject, updatedState, prop
    )
    runCallbacks(
      EnumObserverType.SET, updatedObject, updatedState, prop
    )
  }

  /**
   * @param {string | symbol} prop
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   * @param {any} oldValue
   */
  #onPropDelete(prop, updatedObject, updatedState, oldValue) {
    runCallbacks(
      EnumObserverType.DELETE, updatedObject, updatedState, prop, oldValue
    )
  }

  /**
   * @param {string | symbol} prop
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   * @param {any} oldValue
   */
  #onPropUpdate(prop, updatedObject, updatedState, oldValue) {
    // State subs
    runCallbacks(
      EnumObserverType.CHANGE, updatedObject, updatedState, prop, oldValue
    )
    runCallbacks(
      EnumObserverType.SET, updatedObject, updatedState, prop, oldValue
    )

    // DOM subs
    const subs = getSubsBy(updatedState, prop)

    if (!subs) return

    for (const [bindFn, subscriptions] of subs) {
      for (const sub of subscriptions) {
        const { element, elementProp, elementInnerProp, repaintFn } = sub
        let result = bindFn.call(element, element)

        if (elementProp === 'style' && elementInnerProp) {
          setElementStyleRule(element, elementInnerProp, result)
        }
        else if (
          elementProp === EnumSystemProps.if
          || elementProp === EnumSystemProps.for
        ) {
          if (repaintFn) {
            // @ts-expect-error
            repaintFn(result)
          }
        }
        else {
          /**
           * @see Remark "() => value"
           */
          if (typeof result === 'function') {
            result = result()
          }

          /**
           * TODO: I don't like this functionality being here
           *
           * Keep the first class if it starts with '--'.
           * Such class prefix comes from using scoped css.
           */
          if (elementProp === 'className' || elementProp === 'class') {
            if (
              // @ts-expect-error
              element.className.startsWith('--')
            ) {
              // @ts-expect-error
              const originalClassNames = element.className.split(' ')

              if (typeof result === 'string') {
                result = originalClassNames[0] + ' ' + result
              }
              else if (Array.isArray(result)) {
                result = [originalClassNames[0], ...result]
              }
            }
          }

          // @ts-expect-error
          setElementAttrOrProp(element, elementProp, result)
        }
      }
    }
  }
}
