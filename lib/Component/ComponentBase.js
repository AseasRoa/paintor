/**
 * This class is used to prevent circular dependency
 */
class ComponentBase {
  /**
   * Notes:
   * - Used in class-components
   *
   * @type {State | null}
   */
  state = null

  /**
   * Notes:
   * - Used in class-components
   * - In order for this to be replaced with the child's method,
   * it must be defined here as a function, not as undefined or null
   *
   * @type {Template | null}
   */
  template = () => {
    console.assert(false, 'Should never be here')
  }

  /**
   * @returns {void}
   */
  clear() {}

  /**
   * @param {object} [options]
   * @param {string} [options.indent]
   * @returns {string}
   */
  html(options) {
    return ''
  }

  /**
   * @param {string | HTMLElement | HTMLElement[] | HTMLCollection} container
   * @returns {void}
   * @throws {Error}
   */
  paint(container) {}

  /**
   * @param {boolean} [on]
   * @returns {ComponentBase}
   */
  static(on = true) {
    return this
  }

  /**
   * @param {object} [options]
   * @param {string} [options.indent]
   * @returns {string}
   */
  staticHtml(options) {
    return ''
  }

  /**
   * @param {...Translation} translations
   * @returns {ComponentBase}
   */
  useTranslations(...translations) {
    return this
  }
}

export { ComponentBase }
