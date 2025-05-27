import { EnumNodeTypes } from './constants.js'
import { Element } from './Element.js'
import { getStyleObjectFromString } from './functions/string.js'

export class SVGElement extends Element {
  /** @type {StylesObject} */
  #style = {}

  /**
   * @param {string} tagName
   */
  constructor(tagName) {
    super(EnumNodeTypes.ELEMENT_NODE, tagName)
  }

  /**
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
