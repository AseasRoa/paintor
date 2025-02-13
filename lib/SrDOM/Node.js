import { EnumNodeTypes } from './constants.js'
import { DOMException } from './exceptions/DOMException.js'

class Node {
  /** @type {Node | null} */
  nextSibling = null

  /** @type {Node | null} */
  previousSibling = null

  /** @type {string} */
  textContent = ''

  /** @type {Node[]} */
  #childNodes = []

  /**
   * @type {string}
   */
  #nodeName

  /** @type {EnumNodeTypes} */
  #nodeType

  /** @type {Node | null} */
  #parentNode = null

  /**
   * @param {EnumNodeTypes} nodeType
   * @param {string} nodeName
   */
  constructor(nodeType, nodeName) {
    this.#nodeType = nodeType
    this.#nodeName = nodeName
  }

  /**
   * @returns {string}
   */
  get baseURI() {
    return ''
  }

  /**
   * @returns {Node[]}
   */
  get childNodes() {
    return this.#childNodes
  }

  /**
   * @returns {Node | null}
   */
  get firstChild() {
    return this.#childNodes[0] ?? null
  }

  /**
   * @see https://www.w3schools.com/jsref/prop_node_nodename.asp
   * @returns {string}
   */
  get nodeName() {
    return this.#nodeName
  }

  /**
   * @returns {EnumNodeTypes}
   */
  get nodeType() {
    return this.#nodeType
  }

  /**
   * @see https://www.w3schools.com/jsref/prop_node_parentnode.asp
   * @returns {Node | null}
   */
  get parentNode() {
    return this.#parentNode
  }

  /**
   * Not in DOM
   *
   * @param {Node | null} parentNode
   */
  set parentNode(parentNode) {
    this.#parentNode = parentNode
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
   *
   * @param {Node} aChild
   * @throws {DOMException | TypeError}
   */
  appendChild(aChild) {
    // If the parent of aChild is not a Document, DocumentFragment,
    // or an Element.
    if (
      this.nodeType !== EnumNodeTypes.DOCUMENT_NODE
      && this.nodeType !== EnumNodeTypes.DOCUMENT_FRAGMENT_NODE
      && this.nodeType !== EnumNodeTypes.ELEMENT_NODE
    ) {
      throw new DOMException('This node type does not support this method.')
    }

    // If the current node is the Document, it already has body in it
    // and nothing more can be added.
    if (this.nodeType === EnumNodeTypes.DOCUMENT_NODE) {
      throw new DOMException('Failed to execute \'appendChild\' on \'Node\': Only one element on document allowed.')
    }

    // If aChild is not a DocumentFragment, a DocumentType, an Element,
    // or a CharacterData.
    if (!(aChild instanceof Node)) {
      const errorMessage = 'Failed to execute \'appendChild\' on \'Node\''
        + ': parameter 1 is not of type \'Node\'.'

      throw new TypeError(errorMessage)
    }

    // If the node already exists, do not append it
    if (this.#childNodes.includes(aChild)) {
      return
    }

    if (aChild === this) {
      throw new DOMException('Failed to execute \'appendChild\' on \'Node\': The new child element contains the parent.')
    }

    this.#childNodes.push(aChild)
    aChild.parentNode = this

    // Set nextSibling and previousSibling
    const prevKey = this.#childNodes.length - 2

    if (prevKey >= 0) {
      // @ts-expect-error
      this.#childNodes[prevKey].nextSibling = aChild
      aChild.previousSibling = this.#childNodes[prevKey] ?? null
    }
  }

  /**
   * TODO Make this function do whatever it has to do
   *
   * @returns {boolean}
   */
  contains() {
    return false
  }

  /**
   * TODO Check whether this function works correctly
   *
   * @param {Node} newElement
   * @param {Node} referenceElement
   * @returns {Node}
   */
  insertBefore(newElement, referenceElement) {
    /** @type {Node[]} */
    const newChildren = []

    for (const child of this.#childNodes) {
      if (child === referenceElement) {
        newChildren.push(newElement)
      }

      newChildren.push(child)
    }

    this.#childNodes = newChildren

    return newElement
  }

  /**
   * Removes a child node and returns the removed node.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
   * @param {Node} childNode
   * @returns {Node}
   * @throws {Error}
   */
  removeChild(childNode) {
    if (!childNode) {
      throw new Error(
        'Failed to execute \'removeChild\' on \'HTMLElement\': '
        + 'parameter 1 is not of type \'HTMLElement\'.',
      )
    }

    if (!this.#childNodes.includes(childNode)) {
      throw new Error(
        'Failed to execute \'removeChild\' on \'HTMLElement\': '
        + 'The node to be removed is not a child of this node.',
      )
    }

    this.#childNodes = this.#childNodes.filter((node) => node !== childNode)

    return childNode
  }
}

export { Node }
