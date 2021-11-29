import { BOOLEAN_ATTRIBUTES, NODE_TYPES, SELF_CLOSING_TAGS } from './Constants.js'
import './typedefs.js'

/**
 * @param {number} tabsCount
 * @return {string}
 */
function generateTabs(tabsCount) {
  let output = ''

  for (let i = 0; i < tabsCount; i++)

    output += '\t'

  return output
}

/**
 * @param {string} html
 * @return {string}
 */
function escapeHTML(html) {
  let text = html

  // Remove white space between tags
  // text = text.replace(/>\s+</, '><')

  // Replace characters
  const charsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  }

  text = text.replace(/[&<>"]/g, (tag) => {
    let output = tag

    if (tag in charsToReplace)

      output = charsToReplace[tag]

    return output
  })

  return text
}

/**
 * @param {VirtualElementAttributeItem[]} attributes
 */
function generateAttributesString(attributes) {
  let output = ''

  for (const attribute of attributes) {
    const { name } = attribute
    let { value } = attribute

    if (BOOLEAN_ATTRIBUTES.includes(name)) {
      // Boolean Attributes in the browser are only false when they don't exist as attributes
      // Only few values can cause this to happen in the browser, like 0, false, undefined or null.
      if (
        value !== false
        && value !== 0
        && value !== undefined
        && value !== null
      )
        output += ` ${name}`
    } else {
      // Fix the value
      if (value instanceof Array) value = value.join(',')
      else if (value === true) value = 'true'
      else if (value === false) value = 'false'
      else if (value === undefined) value = 'undefined'
      else if (value === null) value = 'null'
      else value = value.toString()

      output += ` ${name}="${value}"`
    }
  }

  return output
}

/**
 * Turn something like 'background-color' into 'backgroundColor'
 * @param {string} str
 * @return {string}
 */
function formatStringToCamelCase(str) {
  const splitted = str.split('-')

  if (splitted.length === 1) return splitted[0]

  return (
    splitted[0]
    + splitted
        .slice(1)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join('')
  )
}

/**
 * @param {string} str
 * @return {StylesObject}
 */
function getStyleObjectFromString(str) {
  const style = {}

  str.split(';').forEach((el) => {
    const [property, value] = el.split(':')

    if (!property) return

    const formattedProperty = formatStringToCamelCase(property.trim())

    style[formattedProperty] = value.trim()
  })

  return style
}

/**
 * @param {string} str
 * @return {string}
 */
function formatStringFromCamelCase(str) {
  let output = ''

  output = str.replace(/([A-Z])/g, (all, char) => `-${char.toLowerCase()}`)

  return output
}

/**
 * @param {StylesObject} input
 * @return {string}
 */
function getStyleStringFromObject(input) {
  let style = ''

  for (const key in input) {
    const value = input[key]

    style += `${formatStringFromCamelCase(key)}:${value};`
  }

  return style.trim()
}

/**
 * Similar to a DOM element in the browser, but the result is HTML code.
 */
class VirtualElement {
  /** @type {VirtualElement | null} */
  nextSibling = null

  /** @type {VirtualElement | null} */
  previousSibling = null

  /** @type {VirtualElementAttributeItem[]} */
  #attributes = []

  /** @type {VirtualElement[]} */
  #children = []

  /** @type {VirtualElement | null} */
  #parentElement = null

  /** @type {string} */
  #tagName = ''

  /** @type {string} */
  #textContent = ''

  /**
   * An integer which specifies the type of the node.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
   * @type {NODE_TYPES}
   */
  #nodeType = NODE_TYPES.ELEMENT_NODE

  // Flags the current element as removed or not
  #removed = false

  /** @type {StylesObject} */
  #style = {}

  /**
   * @param {VirtualElement | null} parentElement
   * @param {string} tagName
   * @param {boolean} [isComment]
   */
  constructor(parentElement, tagName, isComment = false) {
    this.#parentElement = parentElement
    this.#tagName = tagName.toLowerCase()
    this.#nodeType = (isComment) ? NODE_TYPES.COMMENT_NODE : NODE_TYPES.ELEMENT_NODE
  }

  /**
   * @see https://www.w3schools.com/jsref/prop_html_classname.asp
   * @return {string}
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
   * @return {string}
   */
  get innerHTML() {
    return this.#textContent
  }

  /**
   * @param {string} text
   */
  set innerHTML(text) {
    this.#textContent = text
  }

  /**
   * @see https://www.w3schools.com/jsref/prop_node_innertext.asp
   * @return {string}
   */
  get innerText() {
    return this.textContent
  }

  /**
   * @param {string} text
   */
  set innerText(text) {
    this.textContent = text
  }

  /**
   * @see https://www.w3schools.com/jsref/prop_node_nodename.asp
   * @return {string}
   */
  get nodeName() {
    return this.#tagName.toUpperCase()
  }

  /**
   * @see https://www.w3schools.com/jsref/prop_node_nodetype.asp
   * @return {NODE_TYPES}
   */
  get nodeType() {
    return this.#nodeType
  }

  /**
   * @see https://www.w3schools.com/jsref/prop_node_parentelement.asp
   * @return {VirtualElement | null}
   */
  get parentElement() {
    return this.#parentElement
  }

  /**
   * @param {VirtualElement | null} parentElement
   */
  set parentElement(parentElement) {
    this.#parentElement = parentElement
  }

  /**
   * @return {string}
   */
  get tagName() {
    return this.#tagName.toUpperCase()
  }

  /**
   * @see https://www.w3schools.com/jsref/prop_node_textcontent.asp
   * @return {string}
   */
  get textContent() {
    return this.#textContent
  }

  /**
   * @param {string} text
   */
  set textContent(text) {
    this.#textContent = escapeHTML(text.toString())
  }

  /**
   * @see https://www.w3schools.com/jsref/prop_html_style.asp
   * @return {StylesObject}
   */
  get style() {
    return this.#style
  }

  /**
   * @param {string | {}} input
   * @return {StylesObject}
   */
  set style(input) {
    if (typeof input === 'string') {
      const style = getStyleObjectFromString(input)

      for (const key in style)
        this.#style[key] = style[key].toString()
    }

    return this.#style
  }

  /**
   * This method is used to add an element in form of a Node object
   * or a DOMString (basically means text).
   * @param {VirtualElement | string} childElement
   */
  append(childElement) {
    if (childElement instanceof VirtualElement)
      this.appendChild(childElement)
    else
      this.textContent = childElement
  }

  /**
   * Similar to the .append method, this method is used to elements
   * in the DOM, but in this case, only accepts a Node object.
   * @param {VirtualElement} childElement
   */
  appendChild(childElement) {
    const child = childElement

    if (this.nodeType === NODE_TYPES.COMMENT_NODE)
      throw new Error('This node type does not support this method.')

    if (!(child instanceof VirtualElement)) {
      const errorMessage = 'Failed to execute \'appendChild\' on \'Element\''
        + ': parameter 1 is not of type \'Element\'.'

      throw new Error(errorMessage)
    }

    child.parentElement = this
    this.#children.push(child)

    // Set nextSibling and previousSibling
    const prevKey = this.#children.length - 2

    if (prevKey >= 0) {
      this.#children[prevKey].nextSibling = child
      child.previousSibling = this.#children[prevKey]
    }
  }

  /**
   * @param {number} [tabsCount] - Value of -1 means that no tabs or empty space is painted
   * @param {boolean} isChild - If true, a new row is put in the beginning
   * @return {string}
   */
  paint(tabsCount = 0, isChild = false) {
    if (this.#removed)
      return ''

    let output = ''
    let tabs = ''
    let newRow = ''

    if (tabsCount > -1) {
      tabs = generateTabs(tabsCount)
      newRow = '\n'
    }

    if (this.nodeType === NODE_TYPES.COMMENT_NODE)
      output += `${newRow}${tabs}<!--${this.textContent}-->`

    else {
      const selfClosingTag = (SELF_CLOSING_TAGS.includes(this.#tagName))
      const attributes = generateAttributesString(this.#attributes)

      let style = ''

      if (Object.keys(this.style).length > 0)
        style = ` style="${getStyleStringFromObject(this.style)}"`

      // Paint the opening tag (including attributes)
      if (isChild) output += newRow // Don't prepend with \n the very first element

      output += `${tabs}<${this.#tagName}${attributes}${style}`
      output += (selfClosingTag) ? '' : '>'

      // Paint the text in the element
      output += this.#textContent

      // Paint the children
      let children = ''

      for (const child of this.#children)
        children += child.paint((tabsCount === -1) ? -1 : tabsCount + 1, true)

      if (children)
        output += children + newRow + tabs

      // Paint the closing tag
      output += (selfClosingTag) ? '/>' : `</${this.#tagName}>`
    }

    return output
  }

  /**
   * @return {string}
   */
  paintChildren() {
    // Paint the children
    let children = ''
    let childNumber = 0

    for (const child of this.#children) {
      childNumber += 1

      // The first child will not be marked as a child, so no \n will be put before it
      const isChild = childNumber > 1

      children += child.paint(0, isChild)
    }

    return children
  }

  remove() {
    this.#removed = true
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
   * @see https://www.w3schools.com/jsref/met_element_setattribute.asp
   * @param {string} attributeName
   * @param {*} attributeValue
   */
  setAttribute(attributeName, attributeValue) {
    let name = ''

    // Fix the name
    name = attributeName.trim().toLowerCase()

    if (!name)
      return

    // Fix the value
    // Nope, the value is not fixed here. Instead, the actual value is preserved here.
    // It's fixed later on the paining stage, because a special care is needed
    // for Boolean Attributes

    // Set
    const value = attributeValue
    const index = this.#attributes.findIndex((attribute) => attribute.name === name)

    if (index === -1)
      this.#attributes.push({ name, value })
    else
      this.#attributes[index] = { name, value }
  }
}

export { VirtualElement }
