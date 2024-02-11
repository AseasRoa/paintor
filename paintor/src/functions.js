/**
 * @param {number} max
 * @returns {number}
 */
export function random(max) {
  return Math.round(Math.random() * 1000) % max
}
