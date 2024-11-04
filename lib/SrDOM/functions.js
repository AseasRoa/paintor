import { Comment } from './Comment.js'
import { BOOLEAN_ATTRIBUTES, SELF_CLOSING_TAGS } from './constants.js'
import { HTMLElement } from './HTMLElement.js'
import { Node } from './Node.js'
import { Text } from './Text.js'

/**
 * @param {string} html
 * @returns {string}
 */
function escapeHTML(html) {
  let text = html

  /** @type {Object<string, string>} */
  const charsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  }

  text = text.replace(/[&<>"]/ug, (tag) => {
    let output = tag

    if (tag in charsToReplace) {
      output = charsToReplace[tag] ?? ''
    }

    return output
  })

  return text
}

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
 * @param {Node} node
 * @param {string} indentWith
 * @param {string} indentCurrent
 * @param {boolean} isChild If true, a new row is put in the beginning
 * @returns {string}
 */
function paint(node, indentWith, indentCurrent, isChild = false) {
  let output = ''
  let indent = ''
  let newRow = ''

  if (indentWith) {
    indent = indentCurrent
    newRow = '\n'
  }

  if (node instanceof Comment) {
    output += `${newRow}${indent}<!--${node.textContent}-->`
  }
  else if (node instanceof Text) {
    output += `${newRow}${indent}${node.textContent}`
  }
  else if (node instanceof HTMLElement) {
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
    if (
      node.tagName !== ''
    ) {
      output += (selfClosingTag) ? '/>' : `</${node.tagName.toLowerCase()}>`
    }
  }

  return output
}

export { paint, escapeHTML }
