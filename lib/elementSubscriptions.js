import { StateProxySubscriptions } from './StateProxySubscriptions.js'

/** @typedef {Node | Element | Comment | Text} HttpElement */

/**
 * @type {WeakMap<Node | Element | Comment | Text, Subscription[]>}
 */
const elementSubscriptions = new WeakMap()


/**
 * @param {HttpElement} element
 * @param {Subscription} subscription
 */
export function addSubscription(element, subscription) {
  if (!elementSubscriptions.has(element)) {
    elementSubscriptions.set(element, [])
  }

  const subscriptions = elementSubscriptions.get(element)

  if (subscriptions) {
    subscriptions.push(subscription)
  }
}

/**
 * @param {HttpElement} element
 * @returns {boolean}
 */
export function hasSubscriptions(element) {
  return elementSubscriptions.has(element)
}

/**
 * Move subscription records from one DOM element into another DOM element.
 * Subscription records are located in a special array in the DOM element.
 *
 * @param {HttpElement} fromElement
 * @param {HttpElement} toElement
 * @param {BindFunction} [bindFunction] Optionally filter by the bind function
 * @param {Partial<Subscription>} [newSubscriptionProperties] Optionally set
 * these parameters
 */
export function moveSubscriptions(
  fromElement, toElement, bindFunction, newSubscriptionProperties
) {
  const elementSubs = elementSubscriptions.get(fromElement)

  if (!elementSubs) return

  let index = elementSubs.length

  while (index > 0) {
    index -= 1

    const subscription = elementSubs[index]

    if (!subscription) break

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

      addSubscription(toElement, subscription)

      /**
       * 2. Remove the subscription record from the origin element
       */

      elementSubs.splice(index, 1)
    }
  }
}

/**
 * @param {HttpElement} element
 * @param {StateProxySubscriptions} StateProxySubscriptions
 */
export function removeSubscriptionsFrom(element, StateProxySubscriptions) {
  const elementSubs = elementSubscriptions.get(element)

  if (elementSubs) {
    let index = elementSubs.length

    while (index > 0) {
      index -= 1

      if (
        // @ts-ignore
        elementSubs[index].stateSubscription === StateProxySubscriptions
      ) {
        elementSubs.splice(index, 1)
      }
    }
  }
}

/**
 * @param {HttpElement} element
 */
export function removeAllSubscriptions(element) {
  const elementSubs = elementSubscriptions.get(element)

  // No subscriptions to remove -> return
  if (!elementSubs) return

  let idx = elementSubs.length

  while (idx > 0) {
    idx -= 1

    if (!elementSubs[idx]) continue

    elementSubs[idx]?.stateSubscription.unsubscribe(element)
  }

  elementSubscriptions.delete(element)
}
