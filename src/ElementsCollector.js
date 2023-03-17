/**
 * This class has an array where HTML elements are stored.
 * The class methods provide an interface for managing this array.
 */
class ElementsCollector {
  /** @type {Node[]} */
  elements = []

  /**
   * Add one element to the array of collected elements
   *
   * @param {Node} element
   */
  addElement(element) {
    if (element) this.elements.push(element)
  }

  /**
   * Add multiple elements to the array of collected elements
   *
   * @param {Node[]} elements
   */
  addElements(elements) {
    for (let element of elements) {
      this.elements.push(element)
    }
  }

  /**
   * Returns the array of collected elements
   *
   * @returns {Node[]}
   */
  getElements() {
    return this.elements
  }

  /**
   * Import the elements from another ElementsCollector into this one
   *
   * @param {ElementsCollector} elementsCollector
   */
  importElements(elementsCollector) {
    const elements = elementsCollector.getElements()

    for (const element of elements) {
      this.addElement(element)
    }
  }

  /**
   * Clears the array of collected elements
   */
  removeAllElements() {
    this.elements = []
  }

  /**
   * From the list of collected elements remove any element present in the input array
   *
   * @param {Node[]} elements
   */
  removeTheseElements(elements) {
    if (elements.length > 0) {
      this.elements = this.elements.filter(
        (element) => !(elements.includes(element)),
      )
    }
  }
}

export { ElementsCollector }
