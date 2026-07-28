// oxlint-disable-next-line unicorn/custom-error-definition
export class DOMException extends Error {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message)
    this.name = 'DOMException'
  }
}
