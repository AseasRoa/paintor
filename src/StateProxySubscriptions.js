import { symState, symSubscriptions } from './constants.js'

export class StateProxySubscriptions {
  /** @type {Map<string | symbol, Map<Node | Element | Comment | Text, Subscription[]>>} */
  #subscriptions = new Map()

  get subscriptions() {
    return this.#subscriptions
  }

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
    if (
      propertyName === '-s-if'
      || propertyName === '-s-forEach'
      || propertyName === '-s-forState'
    ) {
      stateProp = propertyName
    }

    if (!this.#subscriptions.has(stateProp)) {
      this.#subscriptions.set(stateProp, new Map())
    }

    const subscriptions = this.#subscriptions.get(stateProp) ?? new Map()

    if (!subscriptions.has(element)) {
      subscriptions.set(element, [])
    }

    const elementSubscriptions = subscriptions.get(element)

    // Search for a subscription with the same parameters.
    // If such already exists, just don't create a new one.
    for (const item of elementSubscriptions) {
      if (
        item.propertyName === propertyName
        && item.subPropertyName === subPropertyName
        && item.bindFunction === bindFunction
        && item.statementRepaintFunction === statementRepaintFunction
      ) return
    }

    /**
     * @type {Subscription}
     */
    const subscription = {
      propertyName,
      subPropertyName,
      bindFunction,
      statementRepaintFunction,
      stateSubscription: this,
      // @ts-ignore
      statePath: (state?.[symState]?.path ?? ''),
    }

    elementSubscriptions.push(subscription)

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
    if (
      symSubscriptions in element
      && element[symSubscriptions] instanceof Array
    ) {
      /** @type {Subscription[]} */
      const subs = element[symSubscriptions]
      let index = subs.length

      while (index--) {
        if (subs[index].stateSubscription === this) {
          subs.splice(index, 1)
        }
      }
    }

    for (const [key, subscriptions] of this.#subscriptions) {
      subscriptions.delete(element)
    }
  }
}

/**
 * @param {Node | Element | Comment | Text} element
 * @returns {boolean}
 */
export function hasSubscriptions(element) {
  return Object.hasOwn(element, symSubscriptions)
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
export function moveSubscriptions(fromElement, toElement, bindFunction, newSubscriptionProperties) {
  if (
    symSubscriptions in fromElement
    && fromElement[symSubscriptions] instanceof Array
  ) {
    let index = fromElement[symSubscriptions].length

    while (index--) {
      /** @type {Subscription} */
      const subscription = fromElement[symSubscriptions][index]

      if (
        bindFunction === undefined
        || bindFunction === subscription.bindFunction
      ) {
        /**
         * 1. Move the subscription record
         */

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

        /**
         * 2. Remove the subscription record from the origin element
         */
        fromElement[symSubscriptions].splice(index, 1)
      }
    }
  }
}

/**
 * @param {Node | Element | Comment | Text} element
 */
export function removeAllSubscriptions(element) {
  /** @type {Subscription[]} */
  // @ts-ignore
  const elementSubs = element[symSubscriptions]

  // No subscriptions to remove -> return
  if (elementSubs === undefined) return

  let idx = elementSubs.length

  while (idx--) {
    if (!elementSubs[idx]) continue

    elementSubs[idx].stateSubscription.unsubscribe(element)
  }

  // @ts-ignore
  delete element[symSubscriptions]
}
