import { BOOLEAN_ATTRIBUTES } from '../constants.js'
import { format, isObjectOrArray } from './misc.js'

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
 * @param {Set<T>} childrenStack
 */
export function addChildToStack(inputChild, childrenStack) {
  childrenStack.add(inputChild)
}

/**
 * @template T
 * @param {T[] | Set<T>} inputChildren
 * @param {Set<T>} childrenStack
 */
export function addArrayChildrenToStack(inputChildren, childrenStack) {
  for (const child of inputChildren) {
    childrenStack.add(child)
  }
}

/**
 * @template T
 * @param {Set<T>} inputChildren
 * @param {Set<T>} childrenStack
 */
export function addChildrenToStack(inputChildren, childrenStack) {
  for (const child of inputChildren) {
    childrenStack.add(child)
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
 * @param {Node | Element} element
 * @param {Set<Node>} children
 */
export function appendChildrenToElement(element, children) {
  /**
   * Notes: It's common knowledge that for multiple elements
   * DocumentFragment is faster, but I did some tests, and
   * it turns out that directly appending elements is faster
   */

  for (const child of children) {
    /**
     * The element could already be appended to another element.
     * In this case, I don't want to re-append it, so continue here.
     */
    if (child.parentNode) {
      continue
    }

    if (('shadowRoot' in element) && element.shadowRoot) {
      element.shadowRoot.appendChild(child)
    }
    else {
      element.appendChild(child)
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
 * @param {HTMLElement} element
 * @param {Object<string, (string | number | boolean)>} dataSet
 */
export function setDataSetAttributesToElement(element, dataSet) {
  if (isObjectOrArray(dataSet)) {
    for (const key in dataSet) {
      const value = (dataSet[key] ?? '').toString()

      element.setAttribute(`data-${key}`, value)
    }
  }
}

/**
 * HTML elements have attributes and properties.
 * Here we set either the attribute ot the property.
 * Which one? Depends on the name of the attribute or property.
 *
 * @param {Element | Text} element
 * @param {string} attrOrPropName
 * @param {*} value
 */
export function setElementAttrOrProp(element, attrOrPropName, value) {
  // 1) Try property
  if (attrOrPropName in element && typeof element[attrOrPropName] === 'string') {
    if (Array.isArray(value)) {
      // @ts-expect-error
      element[attrOrPropName] = format.apply(null, value)
    }
    else {
      element[attrOrPropName] = value ?? ''
    }
  }
  // 2) Try attribute
  else if ('setAttribute' in element) {
    const attrValue = modifyAttrValue(attrOrPropName, value)

    if (attrValue === undefined || attrValue === null) {
      element.removeAttribute(attrOrPropName)
    }
    else {
      if (Array.isArray(attrValue)) {
        // @ts-expect-error
        element.setAttribute(attrOrPropName, format.apply(null, attrValue))
      }
      else {
        element.setAttribute(attrOrPropName, attrValue)
      }
    }
  }
}

/**
 * Modify the value of a CSS rule, if needed
 *
 * @param {string} name
 * @param {*} value
 * @returns {*}
 */
function modifyAttrValue(name, value) {
  let output = value

  if (
    value === true || value === false
    || value === undefined || value === null
  ) {
    if (BOOLEAN_ATTRIBUTES.has(name)) {
      output = (value) ? '' : null
    }
  }

  return output
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
  // @ts-expect-error
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
