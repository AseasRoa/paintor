import { EnumNodeTypes } from './constants.js'
import { Node } from './Node.js'

class DocumentFragment extends Node {
  constructor() {
    super(EnumNodeTypes.DOCUMENT_FRAGMENT_NODE, '#document-fragment')
  }
}

export { DocumentFragment }
