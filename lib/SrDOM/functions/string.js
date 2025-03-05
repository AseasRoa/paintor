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
