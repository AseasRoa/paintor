import { isState } from './State.js'
import { symArrayAccess, symObjectAccess } from './symbols.js'

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
  const re = /(%?)(%([ojdsif]))/g

  if (args.length > 0) {
    /**
     * @param {string} match
     * @param {string} escaped % (for %%) or null (for anything else)
     * @param {string} ptn %o or %s or whatever
     * @param {string} flag The s from %s
     * @returns {string}
     */
    const replacer = (match, escaped, ptn, flag) => {
      let arg = args.shift()
      let out = ''

      switch (flag) {
        case 'o':
          if (Array.isArray(arg)) {
            out = JSON.stringify(arg)
          }
          break
        case 's':
          out = '' + arg
          break
        case 'd':
          out = '' + Number(arg)
          break
        case 'j':
          out = JSON.stringify(arg)
          break
        case 'i':
          out = '' + parseInt('' + arg, 10)
          break
        case 'f':
          out = '' + parseFloat('' + arg)
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
    fmt += ' ' + args.join(' ')
  }

  // update escaped %% values
  fmt = fmt.replace(/%{2,2}/g, '%')

  return '' + fmt
}

/**
 * @see https://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
 * @returns {boolean}
 */
export function isBrowserEnvironment() {
  if (isBrowserEnvironment.isIt === undefined) {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')

    isBrowserEnvironment.isIt = isBrowser()
  }

  return isBrowserEnvironment.isIt ?? false
}

/**
 * The environment doesn't change over time, so it's enough
 * to determine it once. This variable is used to store the
 * environment, it's a cache.
 *
 * @type {undefined | boolean}
 */
isBrowserEnvironment.isIt = undefined

/**
 * @template T
 * @param {T} inputChild
 * @param {T[]} childrenStack
 * @returns {T[]}
 */
export function addChildToStack(inputChild, childrenStack) {
  childrenStack.push(inputChild)

  return childrenStack
}

/**
 * @template T
 * @param {T[]} inputChildren
 * @param {T[]} childrenStack
 * @returns {T[]}
 */
export function addChildrenToStack(inputChildren, childrenStack) {
  for (const child of inputChildren) {
    childrenStack.push(child)
  }

  return childrenStack
}

/**
 * @param {string} attributeName
 * @returns {boolean}
 */
export function isEventAttribute(attributeName) {
  const eventNameLowerCase = attributeName.toLowerCase()

  return eventNameLowerCase.indexOf('on') === 0
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
 * @param {string} name
 * @returns {boolean}
 */
export function isValidCustomElementName(name) {
  return /^[a-z][a-z0-9-]+$/.test(name) && name.includes('-')
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

/**
 * @param {Element | Text} element
 * @param {string} attributeName
 * @param {EventListenerOrEventListenerObject} callback
 * @returns {boolean}
 */
export function addEventListenerIfPossible(element, attributeName, callback) {
  if (
    !(element instanceof window.Node)
		|| (typeof attributeName !== 'string')
		|| (typeof callback !== 'function')
    || (isEventAttribute(attributeName) === false)
  ) return false

  const eventSmallName = attributeName.toLowerCase().substring(2)

  element.addEventListener(eventSmallName, callback)

  return true
}

/**
 * For multiple elements it's faster to use document fragment
 *
 * @param {Node} element
 * @param {Node[]} children
 */
function appendDOMChildrenToElement(element, children) {
  if (children.length === 1) {
    // It's faster to append single element like this
    element.appendChild(children[0])
  }
  else if (children.length > 1) {
    // Using document fragment, because it's faster for multiple elements
    const fragment = new DocumentFragment()

    for (const child of children) {
      if (child) {
        fragment.append(child)
      }
    }

    element.appendChild(fragment)
  }
}

/**
 * @param {Node} element
 * @param {Node[]} children
 */
function appendVirtualChildrenToElement(element, children) {
  for (const child of children) {
    if (child) {
      element.appendChild(child)
    }
  }
}

/**
 * @param {Node | null} element
 * The element in which to append the children
 * @param {Node[]} children
 * The children to append, one or many arguments.
 * For example `<node1, node2>` or `<[node1, node2], node3>`
 */
export function appendChildrenToElement(element, children) {
  if (!element) return

  if (isBrowserEnvironment() && element instanceof window.Node) {
    appendDOMChildrenToElement(element, children)
  }
  else {
    appendVirtualChildrenToElement(element, children)
  }
}

/**
 * In the "data" object there are pairs of keys and values
 * and the "handler" function is looped once for each pair.
 * The loop breaks if "false" is returned by the "handler"
 * function.
 *
 * @template T
 * @param {1 | 2} forLoopType
 * @param {Array<T> | Object<string | number, T> | Map<string | number, T>} data
 * @param {ForLoopCallback<T>} handler
 * @param {(key: number | string) => void} [beforeIterationCallback]
 * @param {string | number | symbol} [keyToRender]
 * @param {(key: number | string) => void} [iterationCallback]
 * @returns {boolean}
 * @throws {TypeError}
 */
export function forEachLoop(
  forLoopType,
  data,
  handler,
  beforeIterationCallback,
  keyToRender,
  iterationCallback,
) {
  if (
    !(data instanceof Object)
    && !(data instanceof Array)
    && !(data instanceof Map)
    && !(data instanceof Set)
  ) {
    throw new TypeError('"data" argument should be an Object or an Array')
  }

  if (!(handler instanceof Function)) {
    throw new TypeError('"handler" argument should be a Function')
  }

  const isProxy = forLoopType === 2 && isState(data)

  if (
    data instanceof Map
    || data instanceof Set
  ) {
    // Force the proxy's "get" event by trying to access this dummy symbol key
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const nothing = isProxy ? data[symObjectAccess] : undefined

    for (const [key, value] of data.entries()) {
      if (keyToRender !== undefined && keyToRender !== key) {
        continue
      }

      let val = isProxy ? () => value : value

      if (beforeIterationCallback) {
        val = beforeIterationCallback?.(val)
      }

      const ret = handler(val, key)

      iterationCallback?.(key)

      if (ret === false) break
    }
  }
  else if (data instanceof Array) {
    /**
     * for-in doesn't work properly in this case,
     * because the numeric index turns into string.
     * That's why use the classic for loop is used.
     */

    // Force the proxy's "get" event by trying to access this dummy symbol key
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const nothing = isProxy ? data[symArrayAccess] : undefined

    for (let key = 0; key < data.length; key++) {
      if (keyToRender !== undefined && keyToRender !== key) {
        continue
      }

      let value = isProxy ? () => data[key] : data[key]

      if (beforeIterationCallback) {
        value = beforeIterationCallback?.(value)
      }

      const ret = handler(value, key)

      iterationCallback?.(key)

      if (ret === false) break
    }
  }
  else if (data instanceof Object) {
    /**
     * The Object loop must be at the end,
     * because Array, Set and Map are also Object.
     */

    // Force the proxy's "get" event by trying to access this dummy symbol key
    const nothing = isProxy ? data[symObjectAccess] : undefined

    for (const key in data) {
      if (keyToRender !== undefined && keyToRender !== key) {
        continue
      }

      let value = isProxy ? () => data[key] : data[key]

      if (beforeIterationCallback) {
        value = beforeIterationCallback?.(value)
      }

      const ret = handler(value, key)

      iterationCallback?.(key)

      if (ret === false) break
    }
  }

  return true
}

/**
 * "start" and "end" determine the direction and how many loops are applied on the "handler"
 * function. The loop breaks if "false" is returned by the "handler" function
 *
 * @param {number} start
 * @param {number} end
 * @param {ForLoopIterableCallback} handler
 * @returns {boolean | Error}
 */
export function forLoop(start, end, handler) {
  if (typeof start !== 'number' || typeof end !== 'number') {
    return new Error('"start" and "end" arguments should be numbers')
  }

  if (!(handler instanceof Function)) {
    return new Error('"handler" argument should be a Function')
  }

  if (end >= start) {
    for (let key = start; key <= end; key++) {
      const ret = handler(key)

      if (ret === false) break
    }
  }
  else {
    for (let key = start; key >= end; key--) {
      const ret = handler(key)

      if (ret === false) break
    }
  }

  return true
}

/**
 * @template T
 * @param {T[]} arr
 * @param {number} key
 * @returns {T[]}
 */
export function arrayRemoveKey(arr, key) {
  return arr.filter(function (el, index) {
    return index !== key
  })
}

/**
 * @template T
 * @param {T[]} arr
 * @param {T} value
 * @returns {T[]}
 */
export function arrayRemoveValue(arr, value) {
  return arr.filter(function (el) {
    return el !== value
  })
}

/**
 * Insert a new node after an existing node as a child node of a parent node
 *
 * @see https://www.javascripttutorial.net/javascript-dom/javascript-insertafter/
 * @param {Node} newNode
 * @param {Node} existingNode
 */
export function insertAfter(newNode, existingNode) {
  if (!existingNode) return

  const { nextSibling, parentNode } = existingNode

  if (parentNode) {
    parentNode.insertBefore(newNode, nextSibling)
  }
}

/**
 *
 * @param {HTMLElement} element
 * @param {Object<string, (string | number | boolean)>}dataSet
 */
export function setDataSetAttributesToElement(element, dataSet) {
  if (dataSet instanceof Object) {
    for (const key in dataSet) {
      const value = dataSet[key].toString()

      element.setAttribute(`data-${key}`, value)
    }
  }
}

/**
 * Html elements have attributes and properties.
 * Here we set either the attribute ot the property.
 * Which one? Depends on the name of the attribute or property.
 *
 * @param {Window} window
 * @param {Element | Text} element
 * @param {string} attrOrPropName
 * @param {*} value
 */
export function setElementAttrOrProp(window, element, attrOrPropName, value) {
  // Decide between element attributes or element properties
  if (attrOrPropName in element) {
    if (value instanceof Array) {
      // @ts-ignore
      element[attrOrPropName] = format.apply(null, value)
    }
    else {
      // @ts-ignore
      element[attrOrPropName] = value
    }
  }
  else {
    // @ts-ignore
    if (element instanceof window.Element) {
      // @ts-ignore
      element.setAttribute(attrOrPropName, value)
    }
  }
}

/**
 * Modify the value of a CSS rule, if needed
 *
 * @param {string} name
 * @param {*} value
 * @returns {*}
 */
export function modifyStyleRule(name, value) {
  let output = value

  if (
    (name === 'visibility' || name === 'backfaceVisibility')
    && (value === true || value === false || value === undefined || value === null)
  ) output = (value) ? 'visible' : 'hidden'

  if (
    (name === 'display')
    && (value === true || value === false || value === undefined || value === null)
  ) output = (value) ? '' : 'none'

  if (
    (name === 'flex')
    && (value === true || value === false || value === undefined || value === null)
  ) output = (value) ? 1 : 0

  return output
}

/**
 * @param {string} str
 * @returns {HTMLElement}
 */
export function stringToHTML(str) {
  const parser = new DOMParser()
  const doc    = parser.parseFromString(str, 'text/html')

  return doc.body
}

/**
 * @param {Map<any, any> | Set<any> | Object<any, any>} object
 * @param {any} key
 * @returns {boolean}
 */
export function objectHasKey(object, key) {
  if (object instanceof Map || object instanceof Set) {
    return object.has(key)
  }
  else {
    return (key in object)
  }
}

/**
 * @param {Map<any, any> | Set<any> | Object<any, any>} object
 * @param {any} key
 * @returns {any}
 */
export function objectGetValue(object, key) {
  if (object instanceof Map) {
    return object.get(key)
  }
  else if (object instanceof Set) {
    return object.has(key) ? key : undefined
  }
  else {
    return object[key]
  }
}

// /**
//  * @template K, T
//  * @param {T[] | Object<K, T> | Map<K, T> | Set<T>} input
//  * @param {(value: T, key: K) => boolean} callback
//  */
// export function forEach(input, callback) {
//   if (input instanceof Set) {
//     for (const value of input) {
//       if (callback(value, value) === false) break
//     }
//   }
// }
//
// const set = new Set(['One', 'Two', 'Three'])
//
// forEach(set, (value, key) => {
//   console.log(key, value)
// })
//
// const obj = { a: 'a' }
//
// for (const o of obj) {
//   console.log(o)
// }
