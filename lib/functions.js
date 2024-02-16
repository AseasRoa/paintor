import { getStateProps } from './state.js'
import { symAccess, symEmptyHandlerElements, symTemplateFunction } from './constants.js'
import { Component } from './Component.js'

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
 * @see https://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
 * @returns {boolean}
 */
export function isBrowserEnvironment() {
  if (isBrowserEnvironment.isIt === undefined) {
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
 */
export function addChildToStack(inputChild, childrenStack) {
  childrenStack.push(inputChild)
}

/**
 * @template T
 * @param {T[]} inputChildren
 * @param {T[]} childrenStack
 */
export function addChildrenToStack(inputChildren, childrenStack) {
  for (const child of inputChildren) {
    childrenStack.push(child)
  }
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
  return /^[a-z][a-z0-9-]+$/u.test(name) && name.includes('-')
}

/**
 * @param {string} selector
 * @returns {boolean}
 */
export function selectorEndsWithId(selector) {
  return /#[a-z0-9-]+\s*$/u.test(selector)
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

    // @ts-ignore
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
 * @template T
 * @param {TemplateTree} templateTree
 * @param {ForLoopCallback<T>} handler
 * @param {ObjectKey} keyToRender
 * @param {any} value
 * @param {(key: number | string) => void} [beforeIterationCallback]
 * @param {(
 *   (
 *     key: ObjectKey,
 *     component?: Component | null
 *   ) => void
 * )} [iterationCallback]
 */
function forEachLoopIteration(
  templateTree,
  handler,
  keyToRender,
  value,
  beforeIterationCallback,
  iterationCallback
) {
  let val = value

  if (beforeIterationCallback) {
    val = beforeIterationCallback?.call(templateTree, val)
  }

  // @ts-ignore
  let ret = handler(val, keyToRender)
  /** @type {Component | null} */
  let component = null

  if (ret instanceof Component) {
    component = ret
  }
  // @ts-ignore
  else if (ret instanceof Function && ret[symTemplateFunction]) {
    // @ts-ignore
    ret = ret(templateTree)
  }

  // @ts-ignore
  iterationCallback?.(keyToRender, component)

  return ret
}

/**
 * @template T
 * @param {TemplateTree} templateTree
 * @param {ForLoopCallback<T>} handler
 * @param {ObjectKey} keyToRender
 * @param {(
 *   Array<T>
 *   | Object<string | number, T> | Map<string | number, T>
 * )} state
 * @param {TargetObject} object
 * @param {boolean} isProxy
 * @param {(key: number | string) => void} [beforeIterationCallback]
 * @param {(
 *   (
 *     key: ObjectKey,
 *     component?: Component | null
 *   ) => void
 * )} [iterationCallback]
 */
function forEachLoopIterationOnObject(
  templateTree,
  handler,
  keyToRender,
  state,
  object,
  isProxy,
  beforeIterationCallback,
  iterationCallback
) {
  const value = (isProxy)
    ? (object[keyToRender] instanceof Object)
      ? state[keyToRender]
      : object[keyToRender]
    : object[keyToRender]

  return forEachLoopIteration(
    templateTree,
    handler,
    keyToRender,
    value,
    beforeIterationCallback,
    iterationCallback
  )
}

/**
 * In the "data" object there are pairs of keys and values
 * and the "handler" function is looped once for each pair.
 * The loop breaks if "false" is returned by the "handler"
 * function.
 *
 * @template T
 * @param {TemplateTree} templateTree
 * @param {1 | 2} forLoopType
 * @param {(
 *   Array<T>
 *   | Object<string | number, T> | Map<string | number, T>
 * )} state
 * @param {ForLoopCallback<T>} handler
 * @param {ForLoopCallbackOnEmpty} [handlerOnEmpty]
 * @param {ObjectKey} [keyToRender]
 * @param {(key: number | string) => void} [beforeIterationCallback]
 * @param {(
 *   (
 *     key: ObjectKey,
 *     component?: Component | null
 *   ) => void
 * )} [iterationCallback]
 * @returns {boolean}
 * @throws {TypeError}
 */
export function forEachLoop(
  templateTree,
  forLoopType,
  state,
  handler,
  handlerOnEmpty,
  keyToRender,
  beforeIterationCallback,
  iterationCallback
) {
  if (!(handler instanceof Function)) {
    throw new TypeError('"handler" argument should be a Function')
  }

  const stateProps = getStateProps(state)
  const object = (stateProps) ? stateProps.target : state
  const isProxy = forLoopType === 2 && Boolean(stateProps)

  if (object instanceof Map || object instanceof Set) {
    if (keyToRender === undefined) {
      if (
        object.size === 0
        && handlerOnEmpty instanceof Function
      ) {
        handlerOnEmpty()
        iterationCallback?.(symEmptyHandlerElements)
      }

      for (const [key, value] of object.entries()) {
        const ret = forEachLoopIteration(
          templateTree,
          handler,
          key,
          value,
          beforeIterationCallback,
          iterationCallback
        )

        if (ret === false) break
      }
    }
    else {
      const value = object instanceof Set
        ? keyToRender
        : object.get(keyToRender)

      forEachLoopIteration(
        templateTree,
        handler,
        keyToRender,
        value,
        beforeIterationCallback,
        iterationCallback
      )
    }
  }
  else if (object instanceof Object) {
    /**
     * Dummy variable, used when the proxy needs to be
     * forced to fire "get" event.
     *
     * @type {any}
     */
    const nothing = (isProxy) ? state[symAccess] : undefined

    if (keyToRender === undefined) {
      if (
        objectLength(object) === 0
        && handlerOnEmpty instanceof Function
      ) {
        handlerOnEmpty()
        iterationCallback?.(symEmptyHandlerElements)
      }

      for (const key in object) {
        const ret = forEachLoopIterationOnObject(
          templateTree,
          handler,
          key,
          state,
          object,
          isProxy,
          beforeIterationCallback,
          iterationCallback
        )

        if (ret === false) break
      }
    }
    else {
      forEachLoopIterationOnObject(
        templateTree,
        handler,
        keyToRender,
        state,
        object,
        isProxy,
        beforeIterationCallback,
        iterationCallback
      )
    }
  }
  else {
    throw new TypeError(`The state argument should be an Object or an Array, but instead it is ${object}`)
  }

  return true
}

/**
 * "start" and "end" determine the direction and how many loops are applied
 * on the "handler" function. The loop breaks if "false" is returned by the
 * "handler" function
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
  arr.splice(key, 1)

  return arr
}

/**
 * @template T
 * @param {T[]} arr
 * @param {T} value
 * @returns {T[]}
 */
export function arrayRemoveValue(arr, value) {
  return arr.filter((el) => {
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
 * @param {Object<string, (string | number | boolean)>} dataSet
 */
export function setDataSetAttributesToElement(element, dataSet) {
  if (dataSet instanceof Object) {
    for (const key in dataSet) {
      const value = (dataSet[key] ?? '').toString()

      element.setAttribute(`data-${key}`, value)
    }
  }
}

/**
 * Html elements have attributes and properties.
 * Here we set either the attribute ot the property.
 * Which one? Depends on the name of the attribute or property.
 *
 * @param {Element | Text} element
 * @param {string} attrOrPropName
 * @param {*} value
 */
export function setElementAttrOrProp(element, attrOrPropName, value) {
  // Decide between element attributes or element properties
  if (attrOrPropName in element) {
    if (value instanceof Array) {
      // @ts-ignore
      element[attrOrPropName] = format.apply(null, value)
    }
    else {
      // @ts-ignore
      element[attrOrPropName] = value ?? ''
    }
  }
  else {
    if ('setAttribute' in element) {
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
    && (
      value === true || value === false || value === undefined || value === null
    )
  ) output = (value) ? 'visible' : 'hidden'

  if (
    (name === 'display')
    && (
      value === true || value === false || value === undefined || value === null
    )
  ) output = (value) ? '' : 'none'

  if (
    (name === 'flex')
    && (
      value === true || value === false || value === undefined || value === null
    )
  ) output = (value) ? 1 : 0

  return output
}

/**
 * @param {string} str
 * @returns {HTMLElement}
 */
export function stringToHTML(str) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(str, 'text/html')

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

  return (key in object)
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
    return (object.has(key)) ? key : undefined
  }

  return object[key]
}

/**
 * @param {Map<any, any> | Set<any> | Object<any, any>} object
 * @returns {number}
 */
export function objectLength(object) {
  if (object instanceof Array) {
    return object.length
  }
  else if (object instanceof Map || object instanceof Set) {
    return object.size
  }
  else if (object instanceof Object) {
    return Object.keys(object).length
  }

  return 0
}

/**
 * @see https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
 * @template T
 * @param {T[]} array
 * @param {number} oldIndex
 * @param {number} newIndex
 * @returns {T[]}
 */
export function arrayMoveIndex(array, oldIndex, newIndex) {
  if (newIndex >= array.length) {
    let k = newIndex - array.length + 1

    while (k > 0) {
      k -= 1

      // @ts-ignore
      array.push(undefined)
    }
  }

  // @ts-ignore
  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0])

  return array
}

/**
 * @param {...Element} elements
 */
export const chainElements = (...elements) => {
  for (let i = 1; i < elements.length; i++) {
    // @ts-ignore
    elements[i - 1].after(elements[i])
  }
}
