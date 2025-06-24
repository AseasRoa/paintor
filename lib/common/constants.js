/**
 * @see https://gist.github.com/ArjanSchouten/0b8574a6ad7f5065a5e7#gistcomment-3231272
 * @readonly
 * @enum {Set<string>}
 */
export const BOOLEAN_ATTRIBUTES = Object.freeze(new Set([
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
  // Update
  'draggable',
  'inert',
  'itemscope',
  'spellcheck',
  'translate',
]))

/**
 * List of HTML tags
 *
 * @see http://xahlee.info/js/html5_non-closing_tag.html
 * @readonly
 * @enum {Set<string>}
 */
export const SELF_CLOSING_TAGS = Object.freeze(new Set([
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
]))

/**
 * @readonly
 * @enum {number}
 */
export const EnumStateAction = {
  CREATE: 1,
  READ: 2,
  UPDATE: 3,
  DELETE: 4,
  ARRAY_COPY_WITHIN: 5,
  ARRAY_LENGTH: 6,
  ARRAY_PUSH: 7,
  ARRAY_REVERSE: 8,
  ARRAY_SORT: 9,
  ARRAY_SPLICE: 10,
  ARRAY_SWAP: 11,
}

/**
 * @readonly
 */
export const EnumSystemProps = {
  if: Symbol('prop-if'),
  for: Symbol('prop-for'),
  reactive: Symbol('prop-reactive')
}
export const symAccess = Symbol('Access')
export const symObserverAccessProp = Symbol('ObserverAccessProp')
export const symEmptyHandlerElements = Symbol('EmptyHandlerElements')
