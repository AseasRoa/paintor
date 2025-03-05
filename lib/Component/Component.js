export class Component {
  /**
   * @type {State | undefined}
   */
  state

  /**
   * @returns {void}
   */
  onMount() {}

  /**
   * @returns {CSSStyleSheet | string}
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
