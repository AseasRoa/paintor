import { ElementsCollector } from './ElementsCollector.js'
import {
  addChildrenToStack, addEventListenerIfPossible,
  appendChildrenToElement, extractVariablesFromFunction,
  forLoopOne,
  forLoopTwo,
  insertAfter, setElementAttrOrProp, styleRuleModificator,
} from './functions.js'
import htmlTags from './htmlTags.js'
import './typedefs.js'

class Paintor {
  /**
   * Each element of this array represents a Level of HTML elements.
   * Level 0 is the main level where eventually all elements are placed.
   * A new level is created from IF and FOR in order to collect the elements separately. Then,
   * when the IF or FOR statement ends, the collected elements are moved to the upper level
   * and that new level is deleted.
   * @type ElementsCollector[]
   */
  #collectedElements = [new ElementsCollector()]

  /** @type {PaintorWrapper} */
  #paintorWrapper

  /**
   * @param {PaintorWrapper} paintorWrapper
   */
  constructor(paintorWrapper) {
    this.#paintorWrapper = paintorWrapper
  }

  /**
   * Create HTML element
   *
   * @param {string} tagName
   * @param {*} args
   * Three variants are possible:<br>
   * - String value - It will be textContent of the element. Use this in div tags and similar.
   * - Object value - For all the properties of the element, like "id", "class" and so on...
   * - HTMLElement (multiple arguments) - For other calls of this same function
   * @returns {HTMLElement}
   */
  createElement(tagName, ...args) {
    const element = document.createElement(tagName)
    let children = []
    let argumentID = 0

    for (const argument of args) {
      argumentID += 1

      if (typeof argument === 'string' || typeof argument === 'number') {
        // In case of a string, it is the Text content of the node

        element.textContent = argument
      } else if (argument instanceof Function) {
        const propertyName = 'propertyName'
        const bindFunction = argument

        this.#subscribeToBindings({ element, propertyName, bindFunction })

        element[propertyName] = bindFunction(element)
      } else if (argument instanceof Node) {
        // If Node, this is a child (created by this function) to be appended to its parent

        children.push(argument)
      } else if (argument instanceof Array) {
        // If Array, it contains children to be added to their parent

        children = addChildrenToStack(argument, children)
      } else if (argument instanceof Error) {
        // Error message

        element.textContent = argument
      } else if (argument instanceof Object && argumentID === 1) {
        // If Object and first argument, this is a property
        // ! This condition needs to be at the end of the 'if' chain

        this.#setPropertiesToElement({
          element,
          properties: argument,
        })
      }
    }

    appendChildrenToElement(element, children)

    if (children.length >= 0) {
      const elcLevel = this.#collectedElements.length - 1

      this.#collectedElements[elcLevel].removeTheseElements(children)
      this.#collectedElements[elcLevel].addElement(element)
    }

    return element
  }

  /**
   * At the end paint the DOM elements at level 0
   */
  finalPaint() {
    appendChildrenToElement(
      this.#paintorWrapper.containerElement,
      this.#collectedElements[0].getElements(),
    )

    // Reset
    this.#collectedElements = [new ElementsCollector()]
  }

  /**
   * "FOR" loop
   * @returns {Error|HTMLElement[]}
   */
  forLoop(...args) {
    // 1) Parse arguments
    if (args.length < 2 || args.length > 3)
      return new Error(`Wrong number of arguments. Expected 2 or 3, got ${args.length}`)

    let data
    let handler
    let start = 0
    let end = 0

    // 1 when the input is Object/Array,
    // 2 when the input is a number,
    // 3 if two numbers
    let loopType = 0

    if (args.length === 2) {
      [data, handler] = args

      if (typeof args[0] !== 'number')
        loopType = 1
      else {
        loopType = 2

        if (args[0] >= 0) {
          start = 0
          end = args[0] - 1
        } else {
          start = -args[0] - 1
          end = 0
        }
      }
    } else if (args.length === 3) {
      [start, end, handler] = args
      loopType = 3
    }

    // 2) Run For
    const levels = this.#beforeStatement()

    let result = null

    if (loopType === 1)
      result = forLoopOne(data, handler)

    else if (loopType === 2 || loopType === 3)
      result = forLoopTwo(start, end, handler)

    const elements = this.#afterStatement(levels)

    if (result instanceof Error)
      return result

    return elements
  }

  /**
   * "IF" condition
   * @param {boolean|StatementBindFunction} condition
   * @param {function():void} handler
   * @returns {HTMLElement[]}
   */
  if(condition, handler) {
    const { thisLevel, upperLevel } = this.#beforeStatement()

    if (typeof condition === 'function') {
      const bindFunction = condition
      const commentElementBegin = document.createComment('IF BEGIN')
      this.#collectedElements[thisLevel].addElement(commentElementBegin)

      /** @type {StatementCallback} */
      const statementCallback = (allow) => {
        this.#collectedElements[0].removeAllElements()
        this.#removeStatementElements(commentElementBegin)

        if (allow) handler()

        const success = this.#insertStatementElements(
          commentElementBegin,
          this.#collectedElements[0].getElements(),
        )

        if (!success)
          console.error('Element ', commentElementBegin, ' does not exist anymore')
      }

      this.#subscribeToBindings({
        element: commentElementBegin,
        propertyName: '--if',
        bindFunction,
        statementCallback,
      })
    }

    const allow = (condition instanceof Function) ? condition() : condition

    // Run the handler function
    if (allow && (typeof handler === 'function'))
      handler()

    if (typeof condition === 'function') {
      const commentElementEnd = document.createComment('IF END')

      this.#collectedElements[thisLevel].addElement(commentElementEnd)
    }

    return this.#afterStatement({ thisLevel, upperLevel })
  }

  /**
   * @param {Comment} beginElement
   * @param {HTMLElement[]} elements
   * @returns {boolean}
   * - Returns false if there is no element after which to insert the other elements,
   * otherwise returns true
   */
  #insertStatementElements(beginElement, elements) {
    let lastElement = beginElement

    if (document.body.contains(lastElement) === false)
      return false

    for (const newElement of elements) {
      insertAfter(newElement, lastElement)

      lastElement = newElement
    }

    return true
  }

  /**
   * Remove all DOM elements, starting after BEGIN element and ending before END element.
   * BEGIN and END are pair of two comment elements, one of the following pairs:
   * <!--IF BEGIN--> and <!--IF END-->
   * <!--FOR BEGIN--> and <!--FOR END-->
   * @param {Comment} beginElement
   * @returns {number} - The number of deleted elements or -1 on failure
   */
  #removeStatementElements(beginElement) {
    if (beginElement.nodeType !== Node.COMMENT_NODE)
      return -1

    // Decide what will be the text content of the end element
    const beginElementText = beginElement.textContent
    let endElementText = ''

    if (beginElementText === 'IF BEGIN')
      endElementText = 'IF END'
    else if (beginElementText === 'FOR BEGIN')
      endElementText = 'FOR END'
    else
      return -1

    // Delete elements until the 'end' element is found
    let currentElement = beginElement.nextSibling
    let statementsCounter = 0
    let deletedElements = 0

    while (true) {
      if (currentElement === null)
        break

      let isBeginElement = false

      if (currentElement.nodeType === Node.COMMENT_NODE) {
        const text = currentElement.textContent

        if (text === beginElementText) {
          statementsCounter += 1
          isBeginElement = true
        } else if (text === endElementText) {
          statementsCounter -= 1

          if (statementsCounter < 0)
            break
        }
      }

      const { nextSibling } = currentElement

      // Mark any BEGIN element from inner statements for further deletion
      if (isBeginElement) currentElement['--deleted'] = true

      currentElement.remove()
      deletedElements += 1
      currentElement = nextSibling
    }

    return deletedElements
  }

  /**
   * This method should be called in the IF or FOR loop before calling the handler
   * @returns {{thisLevel : number, upperLevel : number}}
   */
  #beforeStatement() {
    // Create a new level for collecting
    const thisLevel = this.#collectedElements.length
    const upperLevel = thisLevel - 1

    this.#collectedElements.push(new ElementsCollector())

    return { thisLevel, upperLevel }
  }

  /**
   * This method should be called in the IF or FOR loop after calling the handler
   * @param {number} thisLevel
   * @param {number} upperLevel
   * @returns {HTMLElement[]}
   */
  #afterStatement({ thisLevel, upperLevel }) {
    // Save what will be returned, because the array will be cleared
    const elements = this.#collectedElements[thisLevel].getElements()

    // Move everything collected at this level to the upper level...
    this.#collectedElements[upperLevel].importElements(this.#collectedElements[thisLevel])
    this.#collectedElements[thisLevel].removeAllElements()

    // ... and clean this level
    delete this.#collectedElements[thisLevel]
    this.#collectedElements.pop()

    return elements
  }

  /**
   * @param {HTMLElement} element
   * @param {Object<string, string|number|{}|Function>} properties
   */
  #setPropertiesToElement({ element, properties }) {
    for (const propertyName in properties) {
      const property = properties[propertyName]

      if (addEventListenerIfPossible(element, propertyName, property))
        continue

      // if (propertyName === 'text') propertyName = 'textContent'

      if (property instanceof Function) {
        const bindFunction = property

        this.#subscribeToBindings({ element, propertyName, bindFunction })

        const value = bindFunction(element)

        setElementAttrOrProp(element, propertyName, value)
      } else if (propertyName === 'style' && property instanceof Object) {
        const styleRules = property

        for (const ruleName in styleRules) {
          const ruleValue = styleRules[ruleName]
          let finalValue = ''

          if (ruleValue instanceof Function) {
            const bindFunction = ruleValue

            this.#subscribeToBindings({
              element,
              propertyName,
              subPropertyName: ruleName,
              bindFunction,
            })

            finalValue = bindFunction(element)
          } else
            finalValue = ruleValue

          // eslint-disable-next-line no-param-reassign
          element.style[ruleName] = styleRuleModificator(ruleName, finalValue)
        }
      } else
        setElementAttrOrProp(element, propertyName, property)
    }
  }

  /**
   * @param {HTMLElement|Comment} element
   * @param {string} propertyName
   * @param {string} [subPropertyName]
   * @param {BindFunction|StatementBindFunction} [bindFunction]
   * @param {StatementCallback} [statementCallback]
   */
  #subscribeToBindings({
    element,
    propertyName,
    subPropertyName = '',
    bindFunction,
    statementCallback,
  }) {
    const result = extractVariablesFromFunction(bindFunction)

    for (const stateName in result) {
      if (!(stateName in this.#paintorWrapper.states)) {
        // console.error(`State "${stateName}" is not defined`)
        continue
      }

      for (const path in result[stateName]) {
        const exploded = path.split('.')

        let obj = this.#paintorWrapper.states[stateName]

        for (let key = 0; key < exploded.length - 1; key++) {
          const value = exploded[key]
          obj = obj[value]
        }

        const stateSubscriptions = this.#paintorWrapper.states[stateName]['--subscribe']

        stateSubscriptions.subscribe(
          path,
          element,
          propertyName,
          subPropertyName,
          bindFunction,
          statementCallback,
        )
      }
    }
  }
}

/**
 * https://stackoverflow.com/questions/13851088/how-to-bind-function-arguments-without-binding-this
 *
 * @param boundArgs
 * @returns {function(...[*]) : *}
 */
Function.prototype.bindArgs = function bindArgs(...boundArgs) {
  const targetFunction = this

  return function targetFunctionCaller(...args) {
    return targetFunction.call(this, ...boundArgs, ...args)
  }
}

// Add methods in the prototype for each standard HTML tag
for (const tagName of htmlTags)
  Paintor.prototype[tagName] = Paintor.prototype.createElement.bindArgs(tagName)

// "for" is placed below, otherwise if it is in the class, the typings for its multiple
// overloads doesn't work correctly.
// Must have an empty row below this comment section, otherwise it is considered a description

Paintor.prototype.for = Paintor.prototype.forLoop

export { Paintor }
