/**
 * @see https://github.com/purposeindustries/window-or-global/blob/master/lib/index.js
 * @returns {Window | any}
 */
export function getGlobalObject() {
  return (typeof self === 'object' && self.self === self && self)
    || (typeof global === 'object' && global.global === global && global)
    // @ts-ignore
    || this
}

/**
 * @see https://github.com/tmpfs/format-util/blob/master/format.js
 * @param {string} fmt
 * @param {...any[]} args
 * @returns {string}
 */
export function format(fmt, ...args) {
  const re = /(%?)(%([ojdsif]))/ug

  fmt = fmt ?? ''

  if (args.length > 0) {
    /**
     * @param {string} match
     * @param {string} escaped % (for %%) or null (for anything else)
     * @param {string} ptn %o or %s or whatever
     * @param {string} flag The s from %s
     * @returns {string}
     */
    const replacer = (match, escaped, ptn, flag) => {
      const arg = args.shift()
      let out = ''

      switch (flag) {
        case 'o':
          if (Array.isArray(arg)) {
            out = JSON.stringify(arg)
          }
          break
        case 's':
          out = String(arg)
          break
        case 'd':
          out = String(Number(arg))
          break
        case 'j':
          out = JSON.stringify(arg)
          break
        case 'i':
          out = String(parseInt(String(arg), 10))
          break
        case 'f':
          out = String(parseFloat(String(arg)))
          break
      }

      if (!escaped) {
        return out
      }

      // @ts-ignore
      args.unshift(out)

      return match
    }

    fmt = fmt.replace(re, replacer)
  }

  // arguments, remained after the formatting
  if (args.length > 0) {
    fmt += ` ${args.join(' ')}`
  }

  // update escaped %% values
  fmt = fmt.replace(/%{2,2}/ug, '%')

  return String(fmt)
}

/**
 * Checks whether the input value is an object
 * (Object, Array, Map, Set, Date...), but not
 * function or null.
 *
 * There is an advantage, that checking only
 * for these is quicker than any "instanceof".
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isObjectOrArray(value) {
  return (
    typeof value === 'object'
    && typeof value !== 'function'
    && value !== null
  )
}

/**
 * @param {any} value
 * @returns {boolean}
 */
export function isPrimitive(value) {
  return !(
    value !== null
    && (typeof value === 'object' || typeof value === 'function')
  )
}

/**
 * @param {string} char
 * @returns {boolean}
 */
export function isWhitespace(char) {
  return (
    char === ' '
    || char === '\t'
    || char === '\r'
    || char === '\n'
  )
}

/**
 * @see https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
 * @template T
 * @param {T[]} array
 * @param {number} fromIndex
 * @param {number} toIndex
 * @returns {T[]}
 */
export function arrayMoveElement(array, fromIndex, toIndex) {
  if (toIndex >= array.length) {
    let k = toIndex - array.length + 1

    while (k > 0) {
      k -= 1

      // @ts-ignore
      array.push(undefined)
    }
  }

  // @ts-ignore
  array.splice(toIndex, 0, array.splice(fromIndex, 1)[0])

  return array
}

/**
 * @template T
 * @param {T[]} arr
 * @param {T} value
 * @param {boolean} [mutate]
 * @returns {T[]}
 */
export function arrayRemoveValue(arr, value, mutate = false) {
  // Do not mutate, return a new array
  if (!mutate) {
    return arr.filter((el) => {
      return el !== value
    })
  }

  // Mutate the input array
  while (true) {
    const index = arr.indexOf(value)

    if (index === -1) {
      break
    }

    arr.splice(index, 1)
  }

  return arr
}

/**
 * @param {Map<any, any> | Set<any> | Object<any, any>} object
 * @returns {number}
 */
export function objectLength(object) {
  if (object) {
    if (object instanceof Array) {
      return object.length
    }
    else if (object instanceof Map || object instanceof Set) {
      return object.size
    }
    else if (typeof object === 'object') {
      return Object.keys(object).length
    }
  }

  return 0
}

/**
 * Turns a string into boolean.
 * Covers the cases when the string is 'true', 'false' or a number.
 *
 * @param {string} string
 * @returns {boolean}
 */
export function stringToBoolean(string) {
  if (string === 'true') return true

  if (string === 'false') return false

  const int = parseInt(string)

  return (isNaN(int)) ? Boolean(string) : Boolean(int)
}
