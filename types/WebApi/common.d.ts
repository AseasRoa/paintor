export type Bindable<T> = T | ((element: HTMLElement) => T)
export type Reactive<T> = T | (() => T)

/**
 * Types that can be turned into string when displaying string in HTML elements
 */
export type StringConvertible = string | number | BigInt | undefined | null

/**
 * An Array, used to create printf-like format string
 *
 * @see https://nodejs.org/api/util.html#utilformatformat-args
 */
export type TextArray = [
  string,
  ...Array<string|number|BigInt|Array<any>|Record<any, any>>
]
