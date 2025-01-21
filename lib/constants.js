/* eslint-disable array-element-newline */

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
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element
 * @see https://www.w3schools.com/tags/
 * @readonly
 * @type {readonly string[]}
 */
export const HTML_TAGS = Object.freeze([
  'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio',
  'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button',
  'canvas', 'caption', 'cite', 'code', 'col', 'colgroup',
  'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt',
  'em', 'embed',
  'fieldset', 'figcaption', 'figure', 'footer', 'form',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', // 'html',
  'i', 'iframe', 'img', 'input', 'ins',
  'kbd',
  'label', 'legend', 'li', 'link',
  'main', 'map', 'mark', 'meta', 'meter',
  'nav', 'noscript',
  'object', 'ol', 'optgroup', 'option', 'output',
  'p', 'picture', 'pre', 'progress',
  'q',
  'rp', 'rt', 'ruby',
  's', 'samp', 'script', 'section', 'select', 'slot', 'small', 'source',
  'span', 'strong', 'style', 'sub', 'summary', 'sup', 'svg',
  'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th',
  'thead', 'time', 'title', 'tr', 'track',
  'u', 'ul',
  'var', 'video',
  'wbr',
])

/**
 * @readonly
 */
export const EnumSystemProps = {
  if: Symbol('prop-if'),
  for: Symbol('prop-for'),
  nest: Symbol('prop-nest'),
  reactive: Symbol('prop-reactive')
}
export const symAccess = Symbol('Access')
export const symObserverAccessProp = Symbol('ObserverAccessProp')
export const symEmptyHandlerElements = Symbol('EmptyHandlerElements')
