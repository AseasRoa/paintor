export class DOMException extends Error {
  /**
   * @param {string} message
   * @param {string} [name]
   */
  constructor(message, name) {
    super(message)
    this.name = name ?? 'DOMException'
  }
}
