/**
 * @param {string} html
 * @returns {string}
 */
export function escapeHTML(html) {
  let text = html

  /** @type {Object<string, string>} */
  const charsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  }

  text = text.replace(/[&<>"]/ug, (tag) => {
    let output = tag

    if (tag in charsToReplace) {
      output = charsToReplace[tag] ?? ''
    }

    return output
  })

  return text
}

/**
 * @param {string} str
 * @returns {StylesObject}
 */
export function getStyleObjectFromString(str) {
  /** @type {StylesObject} */
  const style = {}

  str.split(';').forEach((el) => {
    const [property, value] = el.split(':')

    if (!property) return

    const formattedProperty = formatStringToCamelCase(property.trim())

    style[formattedProperty] = (value ?? '').trim()
  })

  return style
}

/**
 * Turn something like 'background-color' into 'backgroundColor'
 *
 * @param {string} str
 * @returns {string}
 */
function formatStringToCamelCase(str) {
  const split = str.split('-')

  if (split.length === 1) {
    // @ts-expect-error
    return split[0]
  }

  const appendix = split.slice(1).map(
    (word) => (word[0] ?? '').toUpperCase() + word.slice(1)
  ).join('')

  return (split[0] + appendix)
}
