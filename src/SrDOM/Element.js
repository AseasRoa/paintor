import { EnumNodeTypes } from './constants.js'
import { escapeHTML } from './functions.js'
import { Node } from './Node.js'

export class Element extends Node {
  /** @type {SrAttr[]} */
  #attributes = []

  /** @type {string} */
  #tagName = ''

  /**
   * @param {EnumNodeTypes} nodeType
   * @param {string} tagName
   */
  constructor(nodeType, tagName) {
    super(nodeType, tagName.toUpperCase())

    this.#tagName = tagName.toUpperCase()
  }

  /**
   * @returns {SrAttr[]}
   */
  get attributes() {
    return this.#attributes
  }

  /**
   * Includes only Element nodes
   *
   * @returns {Element[]}
   */
  get children() {
    // @ts-ignore
    return this.childNodes.filter((node) => node instanceof Element)
  }

  /**
   * @see https://www.w3schools.com/jsref/prop_html_classname.asp
   * @returns {string}
   */
  get className() {
    let className = ''

    for (const attribute of this.#attributes) {
      if (attribute.name === 'class') {
        className = attribute.value
        break
      }
    }

    return className
  }

  /**
   * @param {string} className
   */
  set className(className) {
    this.setAttribute('class', className)
  }

  /**
   * @see https://www.w3schools.com/jsref/prop_html_innerhtml.asp
   * @returns {string}
   */
  get innerHTML() {
    return this.textContent
  }

  /**
   * @param {string} text
   */
  set innerHTML(text) {
    this.textContent = text
  }

  /**
   * @returns {string}
   */
  get tagName() {
    return this.#tagName
  }

  /**
   * This method is used to add an element in form of a Node object
   * or a DOMString (basically means text).
   *
   * @param {Node | string} childElement
   */
  append(childElement) {
    if (childElement instanceof Node) {
      this.appendChild(childElement)
    }
    else {
      this.textContent = escapeHTML(childElement.toString())
    }
  }

  /**
   * @param {string} attributeName
   * @returns {string | null}
   */
  getAttribute(attributeName) {
    let name = ''

    // Fix the name
    name = attributeName.trim().toLowerCase()

    if (!name) {
      return null
    }

    const index = this.#attributes.findIndex((attribute) => attribute.name === name)

    if (index === -1) {
      return null
    }
    else {
      return this.#attributes[index].value
    }
  }

  /**
   * Removes the element from the children list of its parent.
   *
   * @returns {void}
   */
  remove() {
    this.parentNode?.removeChild(this)
  }

  /**
   * In Chrome there are the following rules:
   * - Attributes are painted in the order of their definition
   * - If an attribute is redefined, the last value is painted
   * - If an attribute is redefined, its place in the order is where the initial definition is
   * - Name: If the attribute has no name, it's not painted
   * - Name: Attribute names are lower case
   * - Value: If boolean type, this is converted to string - "true" or "false"
   * - Value: If undefined or null, it is converted to empty string
   * - Value: If Array, the value is all values separated with commas
   * - Value: If Object, the value is [object Object]
   * - Value: If Boolean Attribute (hidden, disabled...), it doesn't have value
   *
   * @see https://www.w3schools.com/jsref/met_element_setattribute.asp
   * @param {string} attributeName
   * @param {*} attributeValue
   */
  setAttribute(attributeName, attributeValue) {
    let name = ''

    // Fix the name
    name = attributeName.trim().toLowerCase()

    if (!name) {
      return
    }

    // Fix the value
    // Nope, the value is not fixed here. Instead, the actual value is preserved here.
    // It's fixed later on the paining stage, because a special care is needed
    // for Boolean Attributes

    // Set
    const value = attributeValue
    const index = this.#attributes.findIndex((attribute) => attribute.name === name)

    if (index === -1) {
      this.#attributes.push({ name, value })
    }
    else {
      this.#attributes[index] = { name, value }
    }
  }
}
