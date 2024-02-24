import { format } from './misc.js'

/**
 * @see https://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
 * @returns {boolean}
 */
export function isBrowserEnvironment() {
  if (isBrowserEnvironment.isIt === undefined) {
    const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')

    isBrowserEnvironment.isIt = isBrowser()
  }

  return isBrowserEnvironment.isIt ?? false
}

/**
 * The environment doesn't change over time, so it's enough
 * to determine it once. This variable is used to store the
 * environment, it's a cache.
 *
 * @type {undefined | boolean}
 */
isBrowserEnvironment.isIt = undefined

export const isBrowserEnv = isBrowserEnvironment()

/**
 * @template T
 * @param {T} inputChild
 * @param {T[]} childrenStack
 */
export function addChildToStack(inputChild, childrenStack) {
  childrenStack.push(inputChild)
}

/**
 * @template T
 * @param {T[]} inputChildren
 * @param {T[]} childrenStack
 */
export function addChildrenToStack(inputChildren, childrenStack) {
  for (const child of inputChildren) {
    childrenStack.push(child)
  }
}


/**
 * @param {string} attributeName
 * @returns {boolean}
 */
export function isEventAttribute(attributeName) {
  const eventNameLowerCase = attributeName.toLowerCase()

  return eventNameLowerCase.indexOf('on') === 0
}

/**
 * @param {string} name
 * @returns {boolean}
 */
export function isValidCustomElementName(name) {
  return /^[a-z][a-z0-9-]+$/u.test(name) && name.includes('-')
}

/**
 * @param {string} selector
 * @returns {boolean}
 */
export function selectorEndsWithId(selector) {
  return /#[a-z0-9-]+\s*$/u.test(selector)
}

/**
 * @param {Element | Text} element
 * @param {string} attributeName
 * @param {EventListenerOrEventListenerObject} callback
 * @returns {boolean}
 */
export function addEventListenerIfPossible(element, attributeName, callback) {
  if (
    !(element instanceof window.Node)
    || (typeof attributeName !== 'string')
    || (typeof callback !== 'function')
    || (isEventAttribute(attributeName) === false)
  ) {
    return false
  }

  const eventSmallName = attributeName.toLowerCase().substring(2)

  element.addEventListener(eventSmallName, callback)

  return true
}

/**
 * @param {Node} element
 * @param {Node[]} children
 */
function appendDOMChildrenToElement(element, children) {
  /*
   * Notes:
   * - It's faster to add 1 element directly.
   * - It's faster to add multiple elements with a fragment.
   */

  if (children.length === 1) {
    // @ts-ignore
    element.appendChild(children[0])
  }
  else if (children.length > 1) {
    const fragment = new DocumentFragment()

    for (const child of children) {
      fragment.append(child)
    }

    element.appendChild(fragment)
  }
}

/**
 * @param {Node} element
 * @param {Node[]} children
 */
function appendVirtualChildrenToElement(element, children) {
  for (const child of children) {
    element.appendChild(child)
  }
}

/**
 * @param {Node | null} element
 * @param {Node[]} children
 */
export function appendChildrenToElement(element, children) {
  if (isBrowserEnv && element instanceof window.Node) {
    appendDOMChildrenToElement(element, children)
  }
  else {
    if (element) {
      appendVirtualChildrenToElement(element, children)
    }
  }
}

/**
 * Insert a new node after an existing node as a child node of a parent node
 *
 * @see https://www.javascripttutorial.net/javascript-dom/javascript-insertafter/
 * @param {Node} newNode
 * @param {Node} existingNode
 */
export function insertAfter(newNode, existingNode) {
  if (!existingNode) return

  const { nextSibling, parentNode } = existingNode

  if (parentNode) {
    parentNode.insertBefore(newNode, nextSibling)
  }
}

/**
 *
 * @param {HTMLElement} element
 * @param {Object<string, (string | number | boolean)>} dataSet
 */
export function setDataSetAttributesToElement(element, dataSet) {
  if (typeof dataSet === 'object') {
    for (const key in dataSet) {
      const value = (dataSet[key] ?? '').toString()

      element.setAttribute(`data-${key}`, value)
    }
  }
}

/**
 * Html elements have attributes and properties.
 * Here we set either the attribute ot the property.
 * Which one? Depends on the name of the attribute or property.
 *
 * @param {Element | Text} element
 * @param {string} attrOrPropName
 * @param {*} value
 */
export function setElementAttrOrProp(element, attrOrPropName, value) {
  // Decide between element attributes or element properties
  if (attrOrPropName in element) {
    if (value instanceof Array) {
      // @ts-ignore
      element[attrOrPropName] = format.apply(null, value)
    }
    else {
      element[attrOrPropName] = value ?? ''
    }
  }
  else if ('setAttribute' in element) {
    element.setAttribute(attrOrPropName, value)
  }
}

/**
 * Modify the value of a CSS rule, if needed
 *
 * @param {string} name
 * @param {*} value
 * @returns {*}
 */
function modifyStyleRule(name, value) {
  let output = value

  if (
    value === true || value === false
    || value === undefined || value === null
  ) {
    if (name === 'display') {
      output = (value) ? '' : 'none'
    }
    else if (name === 'flex') {
      output = (value) ? 1 : 0
    }
    else if (name === 'visibility' || name === 'backfaceVisibility') {
      output = (value) ? 'visible' : 'hidden'
    }
  }

  return output
}

/**
 * @param {HtmlElement} element
 * @param {string} prop
 * @param {string} value
 */
export function setElementStyleRule(element, prop, value) {
  // @ts-ignore
  element.style[prop] = modifyStyleRule(prop, value)
}

/**
 * @param {string} str
 * @returns {HTMLElement}
 */
export function stringToHTML(str) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(str, 'text/html')

  return doc.body
}

/**
 * @param {...Element} elements
 */
export const chainElements = (...elements) => {
  for (let i = 1; i < elements.length; i++) {
    // @ts-ignore
    elements[i - 1].after(elements[i])
  }
}
