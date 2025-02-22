/**
 * Used for components where template() is not returned,just used
 *
 * @type {({ strings: (string | string[]), keys: any })[]}
 */
export const cssQueue = []


/**
 * @param {string | string[]} strings
 * @param {...*} keys
 * @returns {void}
 */
export function css(strings, ...keys) {
  cssQueue.push({ strings, keys })
}
