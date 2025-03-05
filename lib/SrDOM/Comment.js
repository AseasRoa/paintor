import { EnumNodeTypes } from './constants.js'
import { Node } from './Node.js'

export class Comment extends Node {
  constructor() {
    super(EnumNodeTypes.COMMENT_NODE, '#comment')
  }
}

export default Comment
