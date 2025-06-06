import { EnumNodeTypes } from './constants.js'
import { Element } from './Element.js'
import { escapeHTML, getStyleObjectFromString } from './functions/string.js'

/**
 * Similar to a DOM element in the browser, but the result is HTML code.
 */
export class HTMLElement extends Element {
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
        this.#style[key] = (style[key] ?? '').toString()
      }
    }
  }
}
