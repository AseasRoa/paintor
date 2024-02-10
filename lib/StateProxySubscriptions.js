import { getLinkedStates, getStateProps } from './state.js'
import { addSubscription, removeSubscriptionsFrom } from './elementSubscriptions.js'

export class StateProxySubscriptions {
  /**
   * @type {(
   *   Map<
   *     string | symbol,
   *     Map<
   *       Node | Element | Comment | Text,
   *       Subscription[]
   *     >
   *   >
   * )}
   */
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
   * @param {RepaintFunction | null} repaintFunction
   * This is only used in the 'if()' function. It's a function that
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
    repaintFunction,
  ) {
    if (
      propertyName === '-s-if'
      || propertyName === '-s-forEach'
      || propertyName === '-s-reactive'
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

    const subscriptionsForElement = subscriptions.get(element)

    /*
     * Search for a subscription with the same parameters.
     * If such already exists, just don't create a new one.
     */
    for (const item of subscriptionsForElement) {
      if (
        item.propertyName === propertyName
        && item.subPropertyName === subPropertyName
        && item.bindFunction === bindFunction
        && item.repaintFunction === repaintFunction
      ) return
    }

    const stateSubscription = this

    // @ts-ignore
    const statePath = (getStateProps(state)?.path ?? '')

    /**
     * @type {Subscription}
     */
    const subscription = {
      propertyName,
      subPropertyName,
      bindFunction,
      repaintFunction,
      stateSubscription,
      statePath,
    }

    subscriptionsForElement.push(subscription)
    addSubscription(element, subscription)
  }

  /**
   * Remove any subscriptions that the element is subscribed to
   *
   * @param {Node} element
   */
  unsubscribe(element) {
    removeSubscriptionsFrom(element, this)

    for (const [prop, subscriptions] of this.#subscriptions) {
      subscriptions.delete(element)
    }
  }
}
