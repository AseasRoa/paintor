import { EnumNodeTypes } from './constants.js'
import { Element } from './Element.js'

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
      output = charsToReplace[tag]
    }

    return output
  })

  return text
}

/**
 * Turn something like 'background-color' into 'backgroundColor'
 *
 * @param {string} str
 * @returns {string}
 */
function formatStringToCamelCase(str) {
  const split = str.split('-')

  if (split.length === 1) return split[0]

  const appdx = split.slice(1).map(
    (word) => word[0].toUpperCase() + word.slice(1)
  ).join('')

  return (split[0] + appdx)
}

/**
 * @param {string} str
 * @returns {StylesObject}
 */
function getStyleObjectFromString(str) {
  /** @type {StylesObject} */
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
 * Similar to a DOM element in the browser, but the result is HTML code.
 */
class HTMLElement extends Element {
  /** @type {StylesObject} */
  #style = {}

  /**
   * @param {string} tagName
   */
  constructor(tagName) {
    super(EnumNodeTypes.ELEMENT_NODE, tagName)
  }

  /**
   * @see https://www.w3schools.com/jsref/prop_node_innertext.asp
   * @returns {string}
   */
  get innerText() {
    return this.textContent
  }

  /**
   * @param {string} text
   */
  set innerText(text) {
    this.textContent = escapeHTML(text.toString())
  }

  /**
   * @see https://www.w3schools.com/jsref/prop_html_style.asp
   * @returns {StylesObject}
   */
  get style() {
    return this.#style
  }

  /**
   * @param {string | StylesObject} input
   */
  set style(input) {
    /*
     * In the browser there are few ways to set the style:
     * - By setting each individual property (.style.color = red)
     * - By setting '.style.cssText' to a string (.style.cssText = 'color:red')
     * - By setting '.style' itself to a string (.style = 'color:red')
     */

    if (typeof input === 'string') {
      const style = getStyleObjectFromString(input)

      for (const key in style) {
        this.#style[key] = style[key].toString()
      }
    }
  }
}

export { HTMLElement }
