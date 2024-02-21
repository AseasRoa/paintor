import { Subscriptions } from './Subscriptions.js'

/** @type {WeakMap<HtmlElement, Subscription[]>} */
const elementSubscriptions = new WeakMap()

/**
 * @param {HtmlElement} element
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
 * @param {HtmlElement} element
 * @returns {boolean}
 */
export function hasSubscriptions(element) {
  return elementSubscriptions.has(element)
}

/**
 * Move subscription records from one DOM element into another DOM element.
 *
 * @param {HtmlElement} fromElement
 * @param {HtmlElement} toElement
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

    if (subscription.bindFunction !== bindFunction) {
      continue
    }

    /**
     * 1. Move the subscription record
     */

    if (newSubscriptionProperties) {
      for (const prop in newSubscriptionProperties) {
        subscription[prop] = newSubscriptionProperties[prop]
      }
    }

    addSubscription(toElement, subscription)

    /**
     * 2. Remove the subscription record from the origin element
     */

    elementSubs.splice(index, 1)

    /**
     * 3. If the array of subscriptions of the origin element
     * is now empty, remove it
     */

    if (elementSubs.length === 0) {
      elementSubscriptions.delete(fromElement)
    }

    /**
     * 4. Move subscriptions in subscriptionsInstance
     */

    for (
      const [prop, subscriptions]
      of subscription.subscriptionsInstance.subscriptions
    ) {
      const fromElementSubs = subscriptions.get(fromElement)

      if (!fromElementSubs) continue

      let index = fromElementSubs.length

      while (index > 0) {
        index -= 1

        const fromElementSub = fromElementSubs[index]

        if (!fromElementSub) break

        if (
          bindFunction === undefined
          || fromElementSub.bindFunction === bindFunction
        ) {
          fromElementSubs.splice(index, 1)

          if (fromElementSubs.length === 0) {
            subscriptions.delete(fromElement)
          }

          const toElementSubs = subscriptions.get(toElement) ?? []

          toElementSubs.push(subscription)
          subscriptions.set(toElement, toElementSubs)
        }
      }
    }
  }
}

/**
 * @param {HtmlElement} element
 * @param {Subscriptions} Subscriptions
 */
export function removeSubscriptionsFrom(element, Subscriptions) {
  const elementSubs = elementSubscriptions.get(element)

  if (elementSubs) {
    let index = elementSubs.length

    while (index > 0) {
      index -= 1

      if (
        // @ts-ignore
        elementSubs[index].subscriptionsInstance === Subscriptions
      ) {
        elementSubs.splice(index, 1)
      }
    }
  }
}

/**
 * @param {HtmlElement} element
 */
export function removeAllSubscriptions(element) {
  const elementSubs = elementSubscriptions.get(element)

  // No subscriptions to remove -> return
  if (!elementSubs) return

  let idx = elementSubs.length

  while (idx > 0) {
    idx -= 1

    if (!elementSubs[idx]) continue

    elementSubs[idx]?.subscriptionsInstance.unsubscribe(element)
  }

  elementSubscriptions.delete(element)
}
