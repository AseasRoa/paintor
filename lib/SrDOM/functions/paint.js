import { Comment } from '../Comment.js'
import {
  BOOLEAN_ATTRIBUTES,
  EnumNodeTypes,
  SELF_CLOSING_TAGS
} from '../constants.js'
import { HTMLElement } from '../HTMLElement.js'
import { Node } from '../Node.js'
import { SVGElement } from '../SVGElement.js'
import { Text } from '../Text.js'
import { escapeHTML } from './string.js'

/**
 * @param {SrAttr[]} attributes
 * @returns {string}
 */
function generateAttributesString(attributes) {
  let output = ''

  for (const attribute of attributes) {
    const { name } = attribute
    let { value } = attribute

    if (BOOLEAN_ATTRIBUTES.has(name)) {
      /*
       * Boolean Attributes in the browser are only false when
       * they don't exist as attributes.
       * Only few values can cause this to happen in the browser,
       * like 0, false, undefined or null.
       */
      if (
        value !== false
        && value !== 0
        && value !== undefined
        && value !== null
      ) {
        output += ` ${name}`
      }
    }
    else {
      // Fix the value
      if (Array.isArray(value)) value = value.join(',')
      else if (value === true) value = 'true'
      else if (value === false) value = 'false'
      else if (value === undefined) value = 'undefined'
      else if (value === null) value = 'null'
      else if (typeof value === 'function') value = `return(${value.toString()}).call(this,window.event)`
      else value = value.toString()

      value = value.replace(/"/ug, '\\"')
      value = escapeHTML(value)

      output += ` ${name}="${value}"`
    }
  }

  return output
}

/**
 * @param {string} str
 * @returns {string}
 */
function formatStringFromCamelCase(str) {
  let output = ''

  output = str.replace(/([A-Z])/ug, (all, char) => `-${char.toLowerCase()}`)

  return output
}

/**
 * @param {StylesObject} input
 * @returns {string}
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
 * @param {HTMLElement | SVGElement} node
 * @param {string} indentWith
 * @param {string} indentCurrent
 * @param {boolean} isChild If true, a new row is put in the beginning
 * @returns {string}
 */
function paintHTMLElementOrSVGElement(
  node, indentWith, indentCurrent, isChild = false
) {
  let output = ''
  let indent = ''
  let newRow = ''

  if (indentWith) {
    indent = indentCurrent
    newRow = '\n'
  }

  const selfClosingTag = (SELF_CLOSING_TAGS.has(node.tagName))
  const attributes = generateAttributesString(node.attributes)

  let style = ''

  if (Object.keys(node.style).length > 0) {
    style = ` style="${getStyleStringFromObject(node.style)}"`
  }

  // Paint the opening tag (including attributes)
  if (isChild) output += newRow // Don't prepend with \n the very first element

  output += indent

  // Paint the opening tag
  if (node.tagName) {
    output += `<${node.tagName.toLowerCase()}${attributes}${style}`
    output += (selfClosingTag) ? '' : '>'
  }

  // Paint the text in the element
  output += node.textContent

  // Paint the children
  let children = ''

  for (const child of node.childNodes) {
    children += paint(child, indentWith, indentCurrent + indentWith, true)
  }

  if (children) {
    output += children + newRow + indent
  }

  // Paint the closing tag
  if (node.tagName !== '') {
    output += (selfClosingTag) ? '/>' : `</${node.tagName.toLowerCase()}>`
  }

  return output
}

/**
 * @param {Comment} node
 * @param {string} indentWith
 * @param {string} indentCurrent
 * @returns {string}
 */
function paintComment(node, indentWith, indentCurrent) {
  let indent = ''
  let newRow = ''

  if (indentWith) {
    indent = indentCurrent
    newRow = '\n'
  }

  return `${newRow}${indent}<!--${node.textContent}-->`
}

/**
 * @param {Text} node
 * @param {string} indentWith
 * @param {string} indentCurrent
 * @returns {string}
 */
function paintText(node, indentWith, indentCurrent) {
  let indent = ''
  let newRow = ''

  if (indentWith) {
    indent = indentCurrent
    newRow = '\n'
  }

  return `${newRow}${indent}${node.textContent}`
}

/**
 * @param {Node} node
 * @param {string} indentWith
 * @param {string} indentCurrent
 * @param {boolean} isChild If true, a new row is put in the beginning
 * @returns {string}
 * @throws {Error}
 */
function paint(node, indentWith, indentCurrent, isChild = false) {
  switch (node.nodeType) {
    case EnumNodeTypes.ELEMENT_NODE: {
      if (
        !(node instanceof HTMLElement)
        && !(node instanceof SVGElement)
      ) {
        throw new Error('')
      }

      return paintHTMLElementOrSVGElement(
        node, indentWith, indentCurrent, isChild
      )
    }
    case EnumNodeTypes.TEXT_NODE: {
      if (!(node instanceof Text)) {
        throw new Error('')
      }

      return paintText(node, indentWith, indentCurrent)
    }
    case EnumNodeTypes.COMMENT_NODE: {
      if (!(node instanceof Comment)) {
        throw new Error('')
      }

      return paintComment(node, indentWith, indentCurrent)
    }
  }

  return ''
}

/**
 * @param {Node} node
 * @param {object} htmlOptions
 * @param {string} [htmlOptions.indent]
 * @returns {string}
 */
export function paintChildren(node, { indent = '' }) {
  // Paint the children
  let children = ''
  let childNumber = 0

  for (const child of node.childNodes) {
    childNumber += 1

    // The first child will not be marked as a child,
    // so no \n will be put before it
    const isChild = childNumber > 1

    children += paint(child, indent, '', isChild)
  }

  return children
}
