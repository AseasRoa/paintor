/**
 * @type {{
 *   element: null | Element | Comment,
 *   propertyName: string,
 *   subPropertyName: string,
 *   bindFunction: null | BindFunction,
 *   repaintFunction: null | RepaintFunction
 * }}
 */
const suggestedItems = {
  element: null,
  propertyName: '',
  subPropertyName: '',
  bindFunction: null,
  repaintFunction: null,
}

/**
 * This function should be called just before calling the bindFunction.
 * The idea is that the bindFunction, along with its html element and
 * property name are suggested here to the proxy handler. When the
 * bindFunction is called, any state used in it would trigger the
 * proxy get event, which means that it will be added to the
 * subscriptions.
 *
 * @param {Element | Comment | Text} element
 * @param {string} propertyName
 * @param {string} subPropertyName
 * @param {BindFunction} bindFunction
 * @param {null | RepaintFunction} repaintFunction
 */
function setSuggestedItems(
  element,
  propertyName,
  subPropertyName,
  bindFunction,
  repaintFunction,
) {
  suggestedItems.element = element
  suggestedItems.propertyName = propertyName
  suggestedItems.subPropertyName = subPropertyName
  suggestedItems.bindFunction = bindFunction
  suggestedItems.repaintFunction = repaintFunction
}

/**
 * Reset the suggested items
 *
 * @returns {void}
 */
function unsetSuggestedItems() {
  suggestedItems.element = null
  suggestedItems.propertyName = ''
  suggestedItems.subPropertyName = ''
  suggestedItems.bindFunction = null
  suggestedItems.repaintFunction = null
}

export { suggestedItems, setSuggestedItems, unsetSuggestedItems }
