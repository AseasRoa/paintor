// Combine the type with a function that returns the same type
export type Combo<T> = T | { (element:HTMLElement & Node): T }

/**
 * An Array, used to create printf-like format string
 *
 * @see https://nodejs.org/api/util.html#utilformatformat-args
 */
export type FormatArray = [
  string,
  ...Array<string|number|BigInt|Array<any>|Record<any>>
]
