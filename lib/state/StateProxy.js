import { EnumStateAction, EnumSystemProps, symAccess } from '../constants.js'
import { setElementAttrOrProp, setElementStyleRule } from '../functions/dom.js'
import { suggestedItems } from './elementsSuggestor.js'
import { getArrayFunction } from './getArrayFunction.js'
import {
  getLinkedStates,
  hasStateProps,
  isState,
  setStateProps
} from './state.js'
import { getSubsBy, migrateStates, subscribe } from './subscriptions.js'

const symIsProxy = Symbol('isProxy')

class StateProxy {
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

    if (!(typeof object === 'object')) {
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

    if (typeof object === 'object') {
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

      if (typeof target[prop] === 'object' && !target[prop].symIsProxy) {
        target[prop] = this.createProxy(target[prop], prop, receiver)

        return target[prop]
      }

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
            // @ts-ignore
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
        target instanceof Array
        && typeof target[prop] === 'function'
        && typeof prop === 'string'
      ) {
        return getArrayFunction(
          prop, target, receiver, this.#onArrayFunctionCallback
        )
      }

      return target[prop]
    },
    set: (target, prop, value, receiver) => {
      if (
        target instanceof Array
        && prop === 'length'
      ) {
        target[prop] = value

        this.#onArrayFunctionCallback(
          EnumStateAction.ARRAY_LENGTH, target, receiver, [value]
        )

        this.#onPropUpdate(prop, target, receiver)
      }
      else if (Object.hasOwn(target, prop)) {
        if (
          typeof value === 'object'
          && !(value instanceof Date)
          && (target[prop] !== value)
        ) {
          if (target[prop] !== value) {
            if (
              typeof target[prop] === 'object'
              && typeof value === 'object'
            ) {
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
                  typeof value[key] === 'object'
                  && typeof target[prop][key] === 'object'
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

            const prevObject = target[prop]

            target[prop] = value

            migrateStates(prevObject, receiver[prop])

            for (const key in target[prop]) {
              this.#onPropUpdateInForState(key, target[prop], receiver[prop])
            }

            this.#onPropUpdateInForState(prop, target, receiver)
          }
        }
        else {
          if (target[prop] !== value) {
            target[prop] = value

            this.#onPropDelete(prop, target, receiver)
            this.#onPropCreate(prop, target, receiver)
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
          typeof value === 'object'
          && !(isState(value))
        ) {
          target[prop] = value
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
    const subs = getSubsBy(updatedState, EnumSystemProps.reactive)

    if (!subs) return

    for (const [bindFn, sub] of subs) {
      const repaintFn = sub.repaintFn

      if (repaintFn) {
        repaintFn(action, updatedObject, updatedState, '', args)
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
    const subs = getSubsBy(updatedState, EnumSystemProps.reactive)

    if (!subs) return

    for (const [bindFn, sub] of subs) {
      const repaintFn = sub.repaintFn

      if (repaintFn) {
        repaintFn(action, updatedObject, updatedState, prop)
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
    const subs = getSubsBy(updatedState, prop)

    if (!subs) return

    for (const [bindFn, sub] of subs) {
      const { element, elementProp, elementInnerProp, repaintFn } = sub
      let result = bindFn.call(element, element)

      if (elementProp === 'style' && elementInnerProp) {
        setElementStyleRule(element, elementInnerProp, result)
      }
      else if (
        elementProp === EnumSystemProps.if
        || elementProp === EnumSystemProps.for
        || elementProp === EnumSystemProps.nest
      ) {
        if (repaintFn) {
          // @ts-ignore
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

        // @ts-ignore
        setElementAttrOrProp(element, elementProp, result)
      }
    }
  }

  /**
   * @param {string | symbol} prop
   * @param {TargetObject} updatedObject
   * @param {State} updatedState
   */
  #onPropUpdateInForState(prop, updatedObject, updatedState) {
    const subs = getSubsBy(updatedState, EnumSystemProps.reactive)

    if (!subs) return

    for (const [bindFn, sub] of subs) {
      const repaintFn = sub.repaintFn

      if (repaintFn) {
        repaintFn(
          EnumStateAction.UPDATE, updatedObject, updatedState, prop
        )
      }
    }
  }
}

export { StateProxy }
