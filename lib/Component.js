import { ComponentRenderer } from './ComponentRenderer.js'

class Component {
  /**
   * Used in class component
   *
   * @type {State | undefined}
   */
  state

  /**
   * Used in class component
   *
   * @type {Template | undefined}
   */
  template

  /**
   * @type {ComponentRenderer}
   */
  #renderer

  constructor() {
    this.#renderer = new ComponentRenderer(this.state, this.template)
  }

  /**
   * @returns {ComponentRenderer}
   */
  get renderer() {
    return this.#renderer
  }

  /**
   * Clear the elements created by this Component
   *
   * @returns {void}
   */
  clear() {
    return this.#renderer.clear()
  }

  /**
   * Renders the components into an HTML code and returns it
   *
   * @param {object} [options]
   * @param {string} [options.indent]
   * @returns {string}
   */
  html(options) {
    return this.#renderer.html(options)
  }

  /**
   * @param {string | HTMLElement | HTMLElement[] | HTMLCollection} container
   * @returns {void}
   * @throws {Error}
   */
  paint(container) {
    return this.#renderer.paint(container)
  }

  /**
   * @param {boolean} [on]
   * @returns {Component}
   */
  static(on = true) {
    this.#renderer.static(on)

    return this
  }

  /**
   * @param {object} [options]
   * @param {string} [options.indent]
   * @returns {string}
   */
  staticHtml(options) {
    return this.#renderer.staticHtml(options)
  }

  /**
   * @param {...Translation} translations
   * @returns {Component}
   */
  useTranslations(...translations) {
    this.#renderer.useTranslations(...translations)

    return this
  }
}

export { Component }
