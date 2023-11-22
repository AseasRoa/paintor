import { EnumNodeTypes } from './constants.js'
import { Node } from './Node.js'

class Comment extends Node {
  constructor() {
    super(EnumNodeTypes.COMMENT_NODE, '#comment')
  }
}

export default Comment

export { Comment }
