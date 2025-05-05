/* eslint-disable array-element-newline */

/**
 * @see https://developer.mozilla.org/docs/Web/HTML/Element
 * @see https://www.w3schools.com/tags/
 * @readonly
 */
export const HTML_TAGS = Object.freeze(new Set([
  'abbr', 'address', 'area', 'article', 'aside', 'audio',
  'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button',
  'canvas', 'caption', 'cite', 'code', 'col', 'colgroup',
  'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt',
  'em', 'embed',
  'fencedframe', 'fieldset', 'figcaption', 'figure', 'footer', 'form',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', // 'html',
  'i', 'iframe', 'img', 'input', 'ins',
  'kbd',
  'label', 'legend', 'li', 'link',
  'main', 'map', 'mark', 'menu', 'meta', 'meter',
  'nav', 'noscript',
  'object', 'ol', 'optgroup', 'option', 'output',
  'p', 'picture', 'pre', 'progress',
  'q',
  'rp', 'rt', 'ruby',
  's', 'samp', 'section', 'select', 'slot', 'small', 'source',
  'span', 'strong', 'sub', 'summary', 'sup',
  'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th',
  'thead', 'time', 'tr', 'track',
  'u', 'ul',
  'var', 'video',
  'wbr',
]))

/**
 * @see https://developer.mozilla.org/docs/Web/SVG/Reference/Element
 * @readonly
 */
export const SVG_TAGS = Object.freeze(new Set([
  'animate', 'animateMotion', 'animateTransform',
  'circle', 'clipPath',
  'defs', 'desc', 'discard',
  'ellipse',
  'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
  'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood',
  'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge',
  'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting',
  'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'foreignObject',
  'g',
  'line', 'linearGradient',
  'marker', 'mask', 'metadata', 'mpath',
  'path', 'pattern', 'polygon', 'polyline',
  'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'svg',
  'text', 'textPath', 'tspan',
  'use',
  'view',
]))

/**
 * @see https://developer.mozilla.org/docs/Web/SVG/Reference/Element
 * @readonly
 */
export const MUTUAL_TAGS = Object.freeze(new Set([
  'a',
  'script',
  'style',
  'title',
]))

/**
 * @see https://developer.mozilla.org/docs/Web/API/Document/createElementNS#namespaceuri
 * @readonly
 */
export const NAMESPACE_URI = Object.freeze({
  HTML: 'http://www.w3.org/1999/xhtml',
  SVG: 'http://www.w3.org/2000/svg',
  MathML: 'http://www.w3.org/1998/Math/MathML',
})
