import { setMoveElementAfterAnother } from '../common/functions/set.js'

/**
 * This class has an array where HTML elements are stored.
 * Its methods are managing this array.
 */
export class ElementsCollector {
  /** @type {Set<Node>} */
  elements = new Set()

  /**
   * Add one element to the array of collected elements
   *
   * @param {Node} element
   */
  addElement(element) {
    if (element) this.elements.add(element)
  }

  /**
   * Add multiple elements to the array of collected elements
   *
   * @param {Set<Node>} elements
   */
  addElements(elements) {
    for (const element of elements) {
      this.elements.add(element)
    }
  }

  /**
   * Returns the array of collected elements
   *
   * @returns {Set<Node>}
   */
  getElements() {
    return this.elements
  }

  /**
   * @param {Node} element
   * @returns {boolean}
   */
  hasElement(element) {
    return this.elements.has(element)
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
   * @param {Node} elementToMove
   * @param {Node} referenceElement
   * @throws {Error}
   */
  moveElementAfterAnother(elementToMove, referenceElement) {
    return setMoveElementAfterAnother(
      this.elements, elementToMove, referenceElement
    )
  }

  /**
   * Clears the array of collected elements
   */
  removeAllElements() {
    this.elements.clear()
  }

  /**
   * From the list of collected elements remove any element
   * present in the input array
   *
   * @param {Node[]} elements
   */
  removeTheseElements(elements) {
    for (const element of elements) {
      this.elements.delete(element)
    }
  }

  /**
   * @param {Set<Node>} elements
   */
  replaceElements(elements) {
    this.elements = elements
  }
}
