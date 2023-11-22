import { Comment, Document, DocumentFragment, Element, HTMLElement, Node, Text } from './orderedExports.js'
import { DOMException } from './exceptions/DOMException.js'

/**
 * String-Rendering DOM
 */
class Window {
  /** @type {typeof Comment} */
  Comment = Comment

  /** @type {typeof DocumentFragment} */
  DocumentFragment = DocumentFragment

  /** @type {typeof Element} */
  Element = Element

  /** @type {typeof HTMLElement} */
  HTMLElement = HTMLElement

  /** @type {typeof Node} */
  Node = Node

  /** @type {typeof Text} */
  Text = Text

  /** @type {typeof DOMException} */
  DOMException = DOMException

  /** @type {typeof Error} */
  Error = Error

  /** @type {typeof TypeError} */
  TypeError = TypeError

  /** @type {Document} */
  document

  constructor() {
    this.document = new Document()
  }
}

export { Window }
