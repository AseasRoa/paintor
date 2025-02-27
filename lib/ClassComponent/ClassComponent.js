class ClassComponent {
  /**
   * @type {State | undefined}
   */
  state

  /**
   * @returns {CSSStyleSheet | string} sheet
   */
  css() {
    return ''
  }

  /**
   * Note: This is defined as a method, so then
   * it can be replaced in the instance
   *
   * @type {Template}
   */
  template() {}
}

export { ClassComponent }
