/**
 * @type {{
 *   element: null | Element | Comment,
 *   propertyName: string,
 *   subPropertyName: string,
 *   bindFunction: null | BindFunction,
 *   statementRepaintFunction: null | StatementRepaintFunction
 * }}
 */
let suggestedItems = {
  element                 : null,
  propertyName            : '',
  subPropertyName         : '',
  bindFunction            : null,
  statementRepaintFunction: null,
}

/**
 * This function should be called just before calling the bindFunction. The idea is
 * that the bindFunction, along with its html element and property name are suggested
 * here to the proxy handler. When the bindFunction is called, any state used in it
 * would trigger the proxy get event, which means that it will be added to the subscriptions.
 *
 * @param {Element | Comment | Text} element
 * @param {string} propertyName
 * @param {string} subPropertyName
 * @param {BindFunction} bindFunction
 * @param {null | StatementRepaintFunction} statementRepaintFunction
 */
function setSuggestedItems(
  element,
  propertyName,
  subPropertyName,
  bindFunction,
  statementRepaintFunction,
) {
  suggestedItems.element                  = element
  suggestedItems.propertyName             = propertyName
  suggestedItems.subPropertyName          = subPropertyName
  suggestedItems.bindFunction             = bindFunction
  suggestedItems.statementRepaintFunction = statementRepaintFunction
}

/**
 * Reset the suggested items
 *
 * @returns {void}
 */
function unsetSuggestedItems() {
  suggestedItems.element                  = null
  suggestedItems.propertyName             = ''
  suggestedItems.subPropertyName          = ''
  suggestedItems.bindFunction             = null
  suggestedItems.statementRepaintFunction = null
}

export { suggestedItems, setSuggestedItems, unsetSuggestedItems }
