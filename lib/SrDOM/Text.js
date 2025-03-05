import { EnumNodeTypes } from './constants.js'
import { Node } from './Node.js'

export class Text extends Node {
  constructor() {
    super(EnumNodeTypes.TEXT_NODE, '#text')
  }
}
