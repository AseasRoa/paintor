import { arrayMoveIndex } from './functions.js'

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
   * @param {Node} element
   * @returns {boolean}
   */
  hasElement(element) {
    return this.elements.indexOf(element) > -1
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
   */
  moveElementAfterAnother(elementToMove, referenceElement) {
    const indexOfElementToMove    = this.elements.indexOf(elementToMove)
    const indexOfReferenceElement = this.elements.indexOf(referenceElement)

    if (indexOfElementToMove === -1 || indexOfReferenceElement === -1) {
      throw new Error('Cannot move one element after another, because one element is missing')
    }

    if (indexOfReferenceElement - indexOfElementToMove === 1) {
      // no need to move
      return
    }

    this.elements = arrayMoveIndex(
      this.elements,
      indexOfElementToMove,
      indexOfReferenceElement + 1,
    )
  }

  /**
   * Clears the array of collected elements
   */
  removeAllElements() {
    this.elements.length = 0
  }

  /**
   * From the list of collected elements remove any element present in the input array
   *
   * @param {Node[]} elements
   */
  removeTheseElements(elements) {
    let indexInput = elements.length

    while (indexInput--) {
      let indexOutput = this.elements.length

      while (indexOutput--) {
        if (elements[indexInput] === this.elements[indexOutput]) {
          this.elements.splice(indexOutput, 1)

          continue // remove only the first occurrence
        }
      }
    }

    // if (elements.length > 0) {
    //   this.elements = this.elements.filter(
    //     (element) => !(elements.includes(element)),
    //   )
    // }
  }

  /**
   * @param {Node[]} elements
   */
  replaceElements(elements) {
    this.elements = elements
  }
}

export { ElementsCollector }
