/* eslint-disable array-element-newline */

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
  'span', 'strong', /* 'style', */ 'sub', 'summary', 'sup', 'svg',
  'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th',
  'thead', 'time', 'title', 'tr', 'track',
  'u', 'ul',
  'var', 'video',
  'wbr',
])

/**
 * List of HTML tags for elements with ability to attach shadow to
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
 * @readonly
 * @enum {Set<string>}
 */
export const TAGS_SUPPORTING_SHADOW = Object.freeze(new Set([
  'ARTICLE',
  'ASIDE',
  'BLOCKQUOTE',
  'BODY',
  'DIV',
  'FOOTER',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'HEADER',
  'MAIN',
  'NAV',
  'P',
  'SECTION',
  'SPAN'
]))
