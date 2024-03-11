import { EnumSystemProps } from '../constants.js'
import { isObjectOrArray } from '../functions/misc.js'

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
 *         Subscription[]
 *       >
 *     >
 *   >
 * )}
 */
const $mapSPBS = new WeakMap()

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
    $mapSPBS.get(itemState)?.get(itemProp)?.delete(itemBindFn)

    // Cleanup the subscriptions map if empty elements remained
    const mapPBS = $mapSPBS.get(itemState)

    if (mapPBS) {
      const mapBS = mapPBS.get(itemProp)

      if (mapBS) {
        mapBS.delete(itemBindFn)

        if (mapBS.size === 0) {
          mapPBS.delete(itemProp)

          if (mapPBS.size === 0) {
            $mapSPBS.delete(itemState)
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
 * Recursively search in an element's child nodes for
 * elements, who are used in state subscriptions, and
 * unsubscribe them. Also unsubscribe the initial element.
 *
 * Note: This function works only in the browser!
 *
 * TODO: This function is kinda slow, because it looks into
 *   each child node. Find a way to make the process faster
 *   by Not looking into nodes that have no subscriptions.
 *
 * @param {Node} element
 */
export function unsubscribeElementAndItsChildren(element) {
  unsubscribe(element)

  /**
   * Unsubscribe each child node recursively.
   * Use childNodes instead of children, because
   * childNodes includes text nodes.
   */

  if (!element.hasChildNodes()) {
    return
  }

  const childNodes = element.childNodes
  let index = childNodes.length

  while (index > 0) {
    index -= 1

    // @ts-ignore
    unsubscribeElementAndItsChildren(childNodes[index])
  }
}

/**
 * @param {State} state
 * @param {boolean} recursive
 */
export function unsubscribeState(state, recursive = true) {
  if (!state || !isObjectOrArray(state)) return

  const mapPBS = $mapSPBS.get(state)

  if (mapPBS) {
    for (const [stateProp, mapBS] of mapPBS) {
      for (const [bindFn, subs] of mapBS) {
        for (const sub of subs) {
          const element = sub.element
          const indexItems = $indexElements.get(element)

          if (!indexItems) continue

          let index = indexItems.length

          while (index > 0) {
            index -= 1

            const indexItem = indexItems[index]

            if (!indexItem) continue

            if (indexItem[0] === state) {
              indexItems.splice(index, 1)
            }
          }

          if (indexItems.length === 0) {
            $indexElements.delete(element)
          }
        }
      }
    }

    $mapSPBS.delete(state)
  }

  if (recursive) {
    for (const key in state) {
      unsubscribeState(state[key], true)
    }
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
      const subscriptions = subs.get(itemBindFn)

      if (subscriptions) {
        for (const subscription of subscriptions) {
          if (!(subscription.element === fromElement)) continue

          subscription.element = toElement

          if (newSubscriptionProperties) {
            for (const key in newSubscriptionProperties) {
              subscription[key] = newSubscriptionProperties[key]
            }
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
 * In the map and index of subscriptions, replace one state with another
 *
 * @param {State} fromState
 * @param {State} toState
 */
export function migrateStates(fromState, toState) {
  const fromMapPBS = $mapSPBS.get(fromState)

  if (!fromMapPBS) {
    // Nothing to migrate
    return
  }

  /**
   * Important notes:
   * - If there are no records related to toState, create them.
   * - If there are records related to toState, merge the data
   *   (related to fromState) without deleting existing data.
   */

  let toMapPBS = $mapSPBS.get(toState)

  if (!toMapPBS) {
    toMapPBS = new Map()
    $mapSPBS.set(toState, toMapPBS)
  }

  for (const [fromProp, fromBS] of fromMapPBS) {
    let toMapBS = toMapPBS.get(fromProp)

    if (!toMapBS) {
      toMapBS = new Map()
      toMapPBS.set(fromProp, toMapBS)
    }

    for (const [fromBindFn, fromSubs] of fromBS) {
      let toSubs = toMapBS.get(fromBindFn)

      if (!toSubs) {
        toSubs = []
        toMapBS.set(fromBindFn, toSubs)
      }

      for (const fromSub of fromSubs) {
        const { element } = fromSub

        toSubs.push(fromSub)

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
    }
  }

  $mapSPBS.delete(fromState)
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
 * @returns {Map<BindFn, Subscription[]> | undefined}
 */
export function getSubsBy(state, stateProp) {
  const mapPBS = $mapSPBS.get(state)

  if (mapPBS) {
    return mapPBS.get(stateProp)
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
  const mapPBS = $mapSPBS.get(state)

  if (!mapPBS) {
    /** @type {Map<BindFn, Subscription[]>} */
    const mapBS = new Map()
    mapBS.set(bindFn, [subscription])

    const mapPBS = new Map()
    mapPBS.set(stateProp, mapBS)

    $mapSPBS.set(state, mapPBS)
    isSet = true
  }
  else {
    const mapBS = mapPBS.get(stateProp)

    if (!mapBS) {
      /** @type {Map<BindFn, Subscription[]>} */
      const mapBS = new Map()
      mapBS.set(bindFn, [subscription])

      mapPBS.set(stateProp, mapBS)
      isSet = true
    }
    else {
      const subs = mapBS.get(bindFn)

      if (!subs) {
        mapBS.set(bindFn, [subscription])
        isSet = true
      }
      else {
        let exists = false

        // Search for the same subscription
        for (const sub of subs) {
          if (
            sub.element === subscription.element
            && sub.elementProp === subscription.elementProp
            && sub.elementInnerProp === subscription.elementInnerProp
            && sub.repaintFn === subscription.repaintFn
          ) {
            exists = true

            break
          }
        }

        if (!exists) {
          subs.push(subscription)
          isSet = true
        }
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
