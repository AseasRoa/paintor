import { EnumNodeTypes } from './constants.js'
import { Node } from './Node.js'

class Text extends Node {
  constructor() {
    super(EnumNodeTypes.TEXT_NODE, '#text')
  }
}

export { Text }
