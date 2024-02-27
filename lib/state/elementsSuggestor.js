/**
 * @type {{
 *   state: null | State,
 *   bindFn: null | BindFn,
 *   element: null | Element | Comment,
 *   elementProp: string | symbol,
 *   elementInnerProp: string,
 *   repaintFn: null | RepaintFn
 * }}
 */
const suggestedItems = {
  state: null,
  bindFn: null,
  element: null,
  elementProp: '',
  elementInnerProp: '',
  repaintFn: null
}

/**
 * This function should be called just before calling the bindFn.
 * The idea is that the bindFn, along with its html element and
 * property name are suggested here to the proxy handler. When the
 * bindFn is called, any state used in it would trigger the
 * proxy get event, which means that it will be added to the
 * subscriptions.
 *
 * @param {State | null} state
 * @param {BindFn} bindFn
 * @param {Element | Comment | Text} element
 * @param {string | symbol} elementProp
 * @param {string} elementInnerProp
 * @param {null | RepaintFn} repaintFn
 */
function setSuggestedItems(
  state,
  bindFn,
  element,
  elementProp,
  elementInnerProp,
  repaintFn
) {
  suggestedItems.state = state
  suggestedItems.bindFn = bindFn
  suggestedItems.element = element
  suggestedItems.elementProp = elementProp
  suggestedItems.elementInnerProp = elementInnerProp
  suggestedItems.repaintFn = repaintFn
}

/**
 * Reset the suggested items
 *
 * @returns {void}
 */
function unsetSuggestedItems() {
  suggestedItems.state = null
  suggestedItems.bindFn = null
  suggestedItems.element = null
  suggestedItems.elementProp = ''
  suggestedItems.elementInnerProp = ''
  suggestedItems.repaintFn = null
}

export { suggestedItems, setSuggestedItems, unsetSuggestedItems }
