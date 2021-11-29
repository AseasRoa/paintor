import './typedefs.js'
import { VirtualElement } from './VirtualElement.js'

/**
 * Similar to 'document' in the browser, but used to create virtual elements
 * that end up generating HTML string instead of DOM elements.
 */
class VirtualDocument {
  /** @type {VirtualElement} */
  #container

  constructor() {
    this.#container = new VirtualElement(null, 'body')
  }

  /** @type {VirtualElement} */
  get body() {
    return this.#container
  }

  /**
   * @return {null}
   */
  get parentElement() {
    return null
  }

  /**
   * @param {string} text
   * @return {VirtualElement}
   */
  createComment(text = '') {
    const element = new VirtualElement(null, '', true)

    element.textContent = text

    return element
  }

  /**
   * @param {string} tagName
   */
  createElement(tagName) {
    return new VirtualElement(null, tagName, false)
  }

  /**
   * @param {boolean} [prettyPrint]
   * @return {string}
   */
  paint(prettyPrint = true) {
    const tabsCount = (prettyPrint) ? 0 : -1

    return this.body.paint(tabsCount)
  }
}

export { VirtualDocument, VirtualElement }
