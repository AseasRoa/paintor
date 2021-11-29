import { VirtualDocument, VirtualElement } from './VirtualDOM/VirtualDocument.js'
import './typedefs.js'

/**
 * @see https://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
 * @return {boolean}
 */
export function isBrowserEnvironment() {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')

  return isBrowser()
}

/**
 * Get the global scope, depending on what is desired and what is possible
 * @param {boolean} isBrowser
 * @param {EnvironmentMode | string} [desiredMode]
 * @return {TheGlobal}
 */
export function theGlobalScope(isBrowser, desiredMode = '') {
  return (!isBrowser || desiredMode === 'server') ? new VirtualDocument() : document
}

/**
 * @param {Array} inputChildren
 * @param {Array} childrenStack
 *
 * @returns {Array}
 */
export function addChildrenToStack(inputChildren, childrenStack) {
  for (const child of inputChildren)
    childrenStack.push(child)

  return childrenStack
}

/**
 * @param {string} attributeName
 * @return {boolean}
 */
export function isEventAttribute(attributeName) {
  const eventNameLowerCase = attributeName.toLowerCase()

  return eventNameLowerCase.indexOf('on') === 0
}

/**
 * @param {HTMLElement} element
 * @param {string} attributeName
 * @param {function} callback
 *
 * @returns {boolean}
 */
export function addEventListenerIfPossible(element, attributeName, callback) {
  if (
    !(element instanceof Node)
		|| (typeof attributeName !== 'string')
		|| (typeof callback !== 'function')
    || (isEventAttribute(attributeName) === false)
  ) return false

  element.addEventListener(attributeName.toLowerCase().substr(2), callback)

  return true
}

/**
 * For multiple elements it's faster to use document fragment
 * @param {HTMLElement} element
 * @param {HTMLElement[]} children
 */
function appendDOMChildrenToElement(element, children) {
  if (children.length === 1) {
    // It's faster to append single element like this
    element.appendChild(children[0])
  } else if (children.length > 1) {
    // Using document fragment, because it's faster for multiple elements
    const fragment = new DocumentFragment()

    for (const child of children) {
      if (child)
        fragment.append(child)
    }

    element.appendChild(fragment)
  }
}

/**
 * @param {VirtualElement} element
 * @param {VirtualElement[]} children
 */
function appendVirtualChildrenToElement(element, children) {
  for (const child of children) {
    if (child)
      element.appendChild(child)
  }
}

/**
 * @param {TheElement} element
 * - The element in which to append the children
 *
 * @param {TheElement[]} children
 * - The children to append, one or many arguments.
 * For example `<node1, node2>` or `<[node1, node2], node3>`
 */
export function appendChildrenToElement(element, children) {
  if (element instanceof VirtualElement)
    appendVirtualChildrenToElement(element, children)
  else
    appendDOMChildrenToElement(element, children)
}

/**
 * Turns the input function to a string and extracts what looks like this: stateName.varName1
 * @param {*} fn
 */
export function extractVariablesFromFunction(fn) {
  // TODO: Make it also detect bracket notation

  const string = fn.toString()
  const pattern = /(?:[^\w_$.]|^)([a-zA-Z_$][\w_$]*)\.([\w_$.]+)/g
  const list = {}

  let matches

  while ((matches = pattern.exec(string)) !== null) {
    const base = matches[1] // base in base.pa.th
    const path = matches[2] // pa.th in base.pa.th

    if (!(base in list))
      list[base] = {}

    if (!(path in list[base]))
      list[base][path] = []

    if (!list[base][path].includes(fn))
      list[base][path].push(fn)
  }

  return list
}

/**
 * In the "data" object there are pairs of keys and values and the "handler" function is looped
 * once for each pair. The loop breaks if "false" is returned by the "handler" function.
 *
 * @param {Object | Array} data
 * @param {Function} handler
 *
 * @returns {boolean | Error}
 */
export function forLoopOne(data, handler) {
  if (!(data instanceof Object) && !(data instanceof Array))
    return new Error('"data" argument should be an Object or an Array')

  if (!(handler instanceof Function))
    return new Error('"handler" argument should be a Function')

  for (const key in data) {
    const ret = handler(key, data[key])

    if (ret === false) break
  }

  return true
}

/**
 * "start" and "end" determine the direction and how many loops are applied on the "handler"
 * function. The loop breaks if "false" is returned by the "handler" function
 *
 * @param {number} start
 * @param {number} end
 * @param {Function} handler
 *
 * @returns {boolean | Error}
 */
export function forLoopTwo(start, end, handler) {
  if (typeof start !== 'number' || typeof end !== 'number')
    return new Error('"start" and "end" arguments should be numbers')

  if (!(handler instanceof Function))
    return new Error('"handler" argument should be a Function')

  if (end >= start) {
    for (let key = start; key <= end; key++) {
      const ret = handler(key)

      if (ret === false) break
    }
  } else {
    for (let key = start; key >= end; key--) {
      const ret = handler(key)

      if (ret === false) break
    }
  }

  return true
}

/**
 * Insert a new node after an existing node as a child node of a parent node
 * @see https://www.javascripttutorial.net/javascript-dom/javascript-insertafter/
 *
 * @param {Node} newNode
 * @param {Node} existingNode
 */
export function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling)
}

/**
 * Html elements have attributes and properties.
 * Here we set either the attribute ot the property.
 * Which one? Depends of the name of the attribute or property.
 * @param {HTMLElement} element
 * @param {string} attrOrPropName
 * @param {*} value
 */
export function setElementAttrOrProp(element, attrOrPropName, value) {
  // Decide between element attributes or element properties
  if (attrOrPropName in element) {
    // eslint-disable-next-line
    element[attrOrPropName] = value
  } else
    element.setAttribute(attrOrPropName, value)
}

/**
 * Modify the value of a CSS rule, if needed
 * @param {string} name
 * @param {*} value
 * @returns {*}
 */
export function styleRuleModificator(name, value) {
  let output = value

  if (
    (name === 'visibility' || name === 'backfaceVisibility')
    && (value === true || value === false || value === undefined || value === null)
  ) output = (value) ? 'visible' : 'hidden'

  if (
    (name === 'display')
    && (value === true || value === false || value === undefined || value === null)
  ) output = (value) ? '' : 'none'

  if (
    (name === 'flex')
    && (value === true || value === false || value === undefined || value === null)
  ) output = (value) ? 1 : 0

  return output
}
