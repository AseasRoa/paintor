/**
 * @see https://gist.github.com/ArjanSchouten/0b8574a6ad7f5065a5e7#gistcomment-3231272
 * @readonly
 * @type {string[]}
 */
export const BOOLEAN_ATTRIBUTES = [
  'async',
  'autofocus',
  'autoplay',
  'checked',
  'contenteditable',
  'controls',
  'default',
  'defer',
  'disabled',
  'formNoValidate',
  'frameborder',
  'hidden',
  'ismap',
  'itemscope',
  'loop',
  'multiple',
  'muted',
  'nomodule',
  'novalidate',
  'open',
  'readonly',
  'required',
  'reversed',
  'scoped',
  'selected',
  'typemustmatch',
]

/**
 * An integer that identifies what the node is.
 * It distinguishes different kind of nodes from each other, such as elements, text and comments.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
 * @readonly
 * @enum {number}
 */
export const NODE_TYPES = {
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

/**
 * List of HTML tags
 * @see http://xahlee.info/js/html5_non-closing_tag.html
 * @readonly
 * @type {string[]}
 */
export const SELF_CLOSING_TAGS = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
  'command',
  'keygen',
  'menuitem',
]
