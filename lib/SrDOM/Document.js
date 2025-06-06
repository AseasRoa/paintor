import { NAMESPACE_URI } from '../TemplateRenderer/constants.js'
import { Comment } from './Comment.js'
import { EnumNodeTypes } from './constants.js'
import { DocumentFragment } from './DocumentFragment.js'
import { Element } from './Element.js'
import { HTMLElement } from './HTMLElement.js'
import { Node } from './Node.js'
import { SVGElement } from './SVGElement.js'
import { Text } from './Text.js'

/**
 * Similar to 'document' in the browser, but used to create virtual elements
 * that end up generating HTML string instead of DOM elements.
 */
export class Document extends Node {
  /**
   * @type { number }
   * @readonly
   */
  ELEMENT_NODE = EnumNodeTypes.ELEMENT_NODE

  /**
   * @type { number }
   * @readonly
   */
  ATTRIBUTE_NODE = EnumNodeTypes.ATTRIBUTE_NODE

  /**
   * @type { number }
   * @readonly
   */
  TEXT_NODE = EnumNodeTypes.TEXT_NODE

  /**
   * @type { number }
   * @readonly
   */
  CDATA_SECTION_NODE = EnumNodeTypes.CDATA_SECTION_NODE

  /**
   * @type { number }
   * @readonly
   */
  PROCESSING_INSTRUCTION_NODE = EnumNodeTypes.PROCESSING_INSTRUCTION_NODE

  /**
   * @type { number }
   * @readonly
   */
  COMMENT_NODE = EnumNodeTypes.COMMENT_NODE

  /**
   * @type { number }
   * @readonly
   */
  DOCUMENT_NODE = EnumNodeTypes.DOCUMENT_NODE

  /**
   * @type { number }
   * @readonly
   */
  DOCUMENT_TYPE_NODE = EnumNodeTypes.DOCUMENT_TYPE_NODE

  /**
   * @type { number }
   * @readonly
   */
  DOCUMENT_FRAGMENT_NODE = EnumNodeTypes.DOCUMENT_FRAGMENT_NODE

  /** @type {HTMLElement} */
  #body

  /**
   * For HTML documents, this is usually only the root <html> element.
   *
   * @type {Element[]}
   */
  #children = []

  constructor() {
    super(EnumNodeTypes.DOCUMENT_NODE, '#document')

    const html = new HTMLElement('html')
    const head = new HTMLElement('head')
    const body = new HTMLElement('body')

    html.appendChild(head)
    html.appendChild(body)

    this.#children.push(html)

    this.#body = body
  }

  /**
   * @returns {HTMLElement}
   */
  get body() {
    return this.#body
  }

  /**
   * For HTML documents, this is usually only the root <html> element.
   *
   * @see https://developer.mozilla.org/docs/Web/API/Document/children
   * @returns {Element[]}
   */
  get children() {
    return this.#children
  }

  /**
   * @returns {null}
   */
  get parentElement() {
    return null
  }

  /**
   * @returns {DocumentFragment}
   */
  createDocumentFragment() {
    return new DocumentFragment()
  }

  /**
   * @param {string} [text]
   * @returns {Comment}
   */
  createComment(text = '') {
    const element = new Comment()

    element.textContent = text

    return element
  }

  /**
   * @param {string} tagName
   * @returns {HTMLElement}
   */
  createElement(tagName) {
    return new HTMLElement(tagName)
  }

  /**
   * @param {string} namespaceURI
   * @param {string} qualifiedName
   * @returns {Element}
   */
  createElementNS(namespaceURI, qualifiedName) {
    switch (namespaceURI) {
      case NAMESPACE_URI.HTML: return new HTMLElement(qualifiedName)
      case NAMESPACE_URI.SVG: return new SVGElement(qualifiedName)
    }

    return new HTMLElement(qualifiedName)
  }

  /**
   * @param {string} text
   * @returns {Text}
   */
  createTextNode(text) {
    const element = new Text()

    element.textContent = text

    return element
  }
}
