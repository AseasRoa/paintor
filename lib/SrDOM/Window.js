import { Comment } from './Comment.js'
import { Document } from './Document.js'
import { DocumentFragment } from './DocumentFragment.js'
import { Element } from './Element.js'
import { DOMException } from './exceptions/DOMException.js'
import { HTMLElement } from './HTMLElement.js'
import { Node } from './Node.js'
import { Text } from './Text.js'

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
