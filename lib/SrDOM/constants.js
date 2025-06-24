export { BOOLEAN_ATTRIBUTES, SELF_CLOSING_TAGS } from '../common/constants.js'

/**
 * An integer that identifies what the node is.
 * It distinguishes different kind of nodes from
 * each other, such as elements, text and comments.
 *
 * @see https://developer.mozilla.org/docs/Web/API/Node/nodeType
 * @readonly
 * @enum {number}
 */
export const EnumNodeTypes = {
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3,
  CDATA_SECTION_NODE: 4,
  PROCESSING_INSTRUCTION_NODE: 7,
  COMMENT_NODE: 8,
  DOCUMENT_NODE: 9,
  DOCUMENT_TYPE_NODE: 10,
  DOCUMENT_FRAGMENT_NODE: 11,
}
