/**
 * This class has an array where HTML elements are stored. Its methods provide
 * an interface for managing this array.
 */
class ElementsCollector {
  /** @type HTMLElement[] */
  elements = []

  /**
   * Add one element to the array of collected elements
   * @param element
   */
  addElement(element) {
    this.elements.push(element)
  }

  /**
   * Returns the array of collected elements
   * @returns {HTMLElement[]}
   */
  getElements() {
    return this.elements
  }

  /**
   * Import the elements from another ElementsCollector into this one
   * @param {ElementsCollector} elementsCollector
   */
  importElements(elementsCollector) {
    const elements = elementsCollector.getElements()

    for (const element of elements)
      this.addElement(element)
  }

  /**
   * Clears the array of collected elements
   */
  removeAllElements() {
    this.elements = []
  }

  /**
   * From the list of collected elements remove any element present in the input array
   * @param {HTMLElement[]} elements
   */
  removeTheseElements(elements) {
    if (elements.length > 0) {
      const newElements = []

      for (const element of this.elements) {
        if (elements.indexOf(element) === -1)
          newElements.push(element)
      }

      this.elements = newElements
    }
  }
}

// eslint-disable-next-line import/prefer-default-export
export { ElementsCollector }
