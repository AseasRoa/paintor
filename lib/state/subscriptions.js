import { EnumSystemProps } from '../constants.js'

/**
 * This map is where the subscriptions are stored.
 * It's multidimensional, and each subscription
 * is 3 layers deep, but when we are looking
 * for a subscription, we know all the three
 * pieces (state, stateProp and bindFn), which
 * means that we can get it fast.
 *
 * @type {(
 *   WeakMap<
 *     State,
 *     Map<
 *       StateProp,
 *       Map<
 *         BindFn,
 *         Subscription
 *       >
 *     >
 *   >
 * )}
 */
const $mapStateToPropToSubs = new WeakMap()

/**
 * This map acts more like a database index (if we
 * assume the database is the map with subscriptions).
 * Here, for each DOM element, we store the paths
 * to reach all subscriptions in the subscriptions map.
 * A path is an array, where each value is used as a
 * key to step into the map of subscriptions.
 *
 * @type {(
 *   WeakMap<
 *     HtmlElement,
 *     Array<[State, StateProp, BindFn]>
 *   >
 * )}
 */
const $indexElements = new WeakMap()

/**
 * @param {State} state
 * @param {StateProp} stateProp
 * @param {BindFn} bindFn
 * The function that is used instead of a fixed value.
 * For example: () => (state.clicks)
 * @param {Element | Comment} element
 * The HTML element for which the other parameters apply.
 * @param {string | symbol} elementProp
 * The name of the property of the HTML element, for
 * which the subscription is going to be created.
 * For example: 'style', 'value', 'textContent', 'innerHTML'.
 * @param {string} elementInnerProp
 * If the property name is 'style', the sub-property could be
 * any style property.
 * For example: 'fontSize'
 * @param {RepaintFn | null} repaintFn
 * Function that is used to repaint the elements in case the
 * condition is changed from false to true or vice versa.
 */
export function subscribe(
  state,
  stateProp,
  bindFn,
  element,
  elementProp,
  elementInnerProp,
  repaintFn
) {
  if (elementProp === EnumSystemProps.reactive) {
    stateProp = elementProp
  }

  /** @type {Subscription} */
  const subscription = {
    element,
    elementProp,
    elementInnerProp,
    repaintFn
  }

  addToWeakMap(state, stateProp, bindFn, subscription, element)
}

/**
 * Remove all or selected subscriptions that the element is subscribed to
 *
 * @param {Node} element
 * @param {string | symbol} [stateProp]
 * @param {BindFn} [bindFn]
 */
export function unsubscribe(element, stateProp, bindFn) {
  const indexItems = $indexElements.get(element)

  if (!indexItems) return

  const noFilters = (!stateProp && !bindFn) // no filters = clear all

  /**
   * Loop in reverse, because array elements
   * could be deleted while in the loop
   */

  let index = indexItems.length

  while (index > 0) {
    index -= 1

    const indexItem = indexItems[index]

    if (!indexItem) continue

    const [ itemState, itemProp, itemBindFn ] = indexItem

    // Skip if the current element should stay
    if (
      (stateProp && itemProp !== stateProp)
      || (bindFn && itemBindFn !== bindFn)
    ) continue

    // Delete the current element
    if (!noFilters) {
      indexItems.splice(index, 1)
    }

    // Delete from the subscriptions map
    $mapStateToPropToSubs.get(itemState)?.get(itemProp)?.delete(itemBindFn)

    // Cleanup the subscriptions map if empty elements remained
    const levelOne = $mapStateToPropToSubs.get(itemState)

    if (levelOne) {
      const levelTwo = levelOne.get(itemProp)

      if (levelTwo) {
        levelTwo.delete(itemBindFn)

        if (levelTwo.size === 0) {
          levelOne.delete(itemProp)

          if (levelOne.size === 0) {
            $mapStateToPropToSubs.delete(itemState)
          }
        }
      }
    }
  }

  if (noFilters || indexItems.length === 0) {
    $indexElements.delete(element)
  }
}

/**
 * Move subscription records from one DOM element into another DOM element.
 *
 * @param {HtmlElement} fromElement
 * @param {HtmlElement} toElement
 * @param {string | symbol} [stateProp]
 * @param {BindFn} [bindFn]
 * @param {Partial<Subscription>} [newSubscriptionProperties]
 */
export function migrateSubscriptions(
  fromElement, toElement, stateProp, bindFn, newSubscriptionProperties
) {
  const indexItems = $indexElements.get(fromElement)
  let toIndexItems = $indexElements.get(toElement)

  if (!toIndexItems) {
    toIndexItems = []
    $indexElements.set(toElement, toIndexItems)
  }

  if (!indexItems) return

  const toIndexItemsInsertAtPosition = toIndexItems.length
  let index = indexItems.length

  while (index > 0) {
    index -= 1

    const indexItem = indexItems[index]

    if (!indexItem) continue

    const [ itemState, itemStateProp, itemBindFn ] = indexItem

    // Skip if the current element should stay
    if (
      (stateProp && itemStateProp !== stateProp)
      || (bindFn && itemBindFn !== bindFn)
    ) continue

    const subs = getSubsBy(itemState, itemStateProp)

    if (subs) {
      const subscription = subs.get(itemBindFn)

      if (subscription) {
        subscription.element = toElement

        if (newSubscriptionProperties) {
          for (const key in newSubscriptionProperties) {
            subscription[key] = newSubscriptionProperties[key]
          }
        }
      }
    }

    // Because we loop the "from" array in reverse order,
    // the elements in the "to" array must be pushed in
    // reverse order too, by placing them at the same
    // position.
    toIndexItems.splice(toIndexItemsInsertAtPosition, 0, indexItem)
    indexItems.splice(index, 1)
  }

  if (indexItems.length === 0) {
    $indexElements.delete(fromElement)
  }
}

/**
 * @param {State} fromState
 * @param {State} toState
 */
export function migrateStates(fromState, toState) {
  const fromMapPropToSubs = $mapStateToPropToSubs.get(fromState)

  if (!fromMapPropToSubs) {
    // Nothing to migrate
    return
  }

  let toMapPropToSubs = $mapStateToPropToSubs.get(toState)

  if (!toMapPropToSubs) {
    toMapPropToSubs = new Map()
    $mapStateToPropToSubs.set(toState, toMapPropToSubs)
  }

  for (const [prop, map] of fromMapPropToSubs) {
    for (const [bindFn, sub] of map) {
      const { element } = sub

      // Change the state in the index
      const indexItems = $indexElements.get(element)

      if (indexItems) {
        for (const item of indexItems) {
          if (item[0] === fromState) {
            item[0] = toState
          }
        }
      }
    }

    toMapPropToSubs.set(prop, map)
  }

  $mapStateToPropToSubs.delete(fromState)
}

/**
 * @param {HtmlElement} element
 * @returns {[State, StateProp, BindFn][] | undefined}
 */
export function getElementIndexes(element) {
  return $indexElements.get(element)
}

/**
 * @param {State} state
 * @param {StateProp} stateProp
 * @returns {Map<BindFn, Subscription> | undefined}
 */
export function getSubsBy(state, stateProp) {
  const mapPropToSubs = $mapStateToPropToSubs.get(state)

  if (mapPropToSubs) {
    return mapPropToSubs.get(stateProp)
  }

  return undefined
}

/**
 * @param {State} state
 * @param {StateProp} stateProp
 * @param {BindFn} bindFn
 * @param {Subscription} subscription
 * @param {HtmlElement} element
 */
function addToWeakMap(state, stateProp, bindFn, subscription, element) {
  let isSet = false
  const mapPropToSubs = $mapStateToPropToSubs.get(state)

  if (!mapPropToSubs) {
    const mapSubs = new Map()
    mapSubs.set(bindFn, subscription)

    const mapPropToSubs = new Map()
    mapPropToSubs.set(stateProp, mapSubs)

    $mapStateToPropToSubs.set(state, mapPropToSubs)
    isSet = true
  }
  else {
    const mapSubs = mapPropToSubs.get(stateProp)

    if (!mapSubs) {
      const mapSubs = new Map()
      mapSubs.set(bindFn, subscription)

      mapPropToSubs.set(stateProp, mapSubs)
      isSet = true
    }
    else {
      if (!mapSubs.has(bindFn)) {
        mapSubs.set(bindFn, subscription)
        isSet = true
      }
    }
  }

  // Index
  if (isSet) {
    const indexItems = $indexElements.get(element)

    if (!indexItems) {
      const indexItems = []
      /** @type {[State, StateProp, BindFn]} */
      const item = [state, stateProp, bindFn]
      indexItems.push(item)
      $indexElements.set(element, indexItems)
    }
    else {
      indexItems.push([state, stateProp, bindFn])
    }
  }
}
