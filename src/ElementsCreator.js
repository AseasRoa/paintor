import { ElementsCollector } from './ElementsCollector.js'
import {
  addChildrenToStack,
  addChildToStack,
  addEventListenerIfPossible,
  appendChildrenToElement,
  arrayRemoveKey,
  forEachLoop,
  forLoop,
  format,
  getGlobalObject,
  insertAfter,
  isEventAttribute,
  modifyStyleRule,
  objectHasKey,
  setDataSetAttributesToElement,
  setElementAttrOrProp,
  stringToHTML,
} from './functions.js'
import { htmlTags } from './htmlTags.js'
import { HtmlTemplateParser } from './HtmlTemplateParser/HtmlTemplateParser.js'
import { Paintor } from './Paintor.js'
import { isState } from './State.js'
import { setSuggestItems, unsetSuggestedItems } from './StateSubscriptions.js'

/**
 * @typedef {Array<{key: (string | number | symbol), elements: (Node)[]}>} RenderedElementsMap
 */

class ElementsCreator {
  /** @type {Node[]} */
  finalElements = []

  /**
   * Each element of this array represents a Level of HTML elements.
   * Level 0 is the main level where eventually all elements are placed.
   * A new level is created from IF and FOR in order to collect the
   * elements separately. Then, when the IF or FOR statement ends, the
   * collected elements are moved to the upper level and that new level
   * is deleted.
   *
   * @type {ElementsCollector[]}
   */
  #collectedElements = [new ElementsCollector()]

  /**
   * The main element in which to append all the contents
   *
   * @type {HTMLElement | ShadowRoot | null}
   */
  #containerElement

  /** @type {Document} */
  #document

  /** @type {HTMLTemplateElement} */
  #dummyHtmlElement

  /**
   * Is String-Rendering mode
   *
   * @type {boolean}
   */
  #isSr = true

  /** @type {Template[]} */
  #templates = []

  /** @type {Translation[]} */
  #translations = []

  /** @type {Window} */
  #window

  /**
   * @param {Window} window
   * @param {HTMLElement | ShadowRoot | null} containerElement
   * @param {Template[]} templates
   * @param {Translation[]} [translations=[]]
   */
  constructor(window, containerElement, templates, translations = []) {
    this.#window = window
    this.#document = window.document
    this.#isSr = this.#document.baseURI === ''
    this.#containerElement = containerElement
    this.#templates = templates
    this.#translations = translations

    this.#dummyHtmlElement = this.#document.createElement('template')

    for (const template of this.#templates) {
      // @ts-ignore
      const returnedValue = template(this)

      if (returnedValue && typeof returnedValue === 'string') {
        this.html(returnedValue)
      }
      else if (returnedValue instanceof Paintor) {
        const generatedChildren = (this.#isSr)
          ? returnedValue.getElementsSr()
          : returnedValue.getElements()

        for (const childrenGroup of generatedChildren) {
          this.#collectedElements[0].addElements(childrenGroup)
        }
      }
      else if (returnedValue instanceof Function) {
        // @ts-ignore
        returnedValue(this)
      }
      else if (returnedValue instanceof Array) {
        let allPaintor = true
        let allFunctions = true

        for (const value of returnedValue) {
          if (!(value instanceof Paintor)) {
            allPaintor = false

            break
          }

          if (!(value instanceof Function)) {
            allFunctions = false

            break
          }
        }

        if (allPaintor) {
          for (const value of returnedValue) {
            if (!(value instanceof Paintor)) break

            const generatedChildren = (this.#isSr)
              ? value.getElementsSr()
              : value.getElements()

            for (const childrenGroup of generatedChildren) {
              this.#collectedElements[0].addElements(childrenGroup)
            }
          }
        }
        else if (allFunctions) {
          for (const value of returnedValue) {
            if (!(value instanceof Function)) break

            // @ts-ignore
            value(this)
          }
        }
      }
    }
  }

  /**
   * Create HTML element
   *
   * @param {string} tagName
   * @param {*} args
   * Different variants are possible:<br>
   * - String value - It will be textContent of the element. Use this in div tags and similar.
   * - Object value - For all the properties of the element, like "id", "class" and so on...
   * - Element (multiple arguments) - For other calls of this same function (creating children)
   * - Array - Alternative for creating children
   * @returns {HTMLElement | Text}
   */
  createElement(tagName, ...args) {
    const element = (tagName)
      ? this.#document.createElement(tagName)
      : this.#document.createTextNode('')

    /** @type {any[]} */
    let children = []
    let argumentID = 0

    for (const argument of args) {
      argumentID += 1

      if (typeof argument === 'string') {
        // In case of a string, create a new text node.
        // This way, multiple text nodes can be put into the element,
        // mixed with http elements.

        const textNode = this.#document.createTextNode(
          this.#translate(argument),
        )

        children = addChildToStack(textNode, children)
      }
      else if (typeof argument === 'number') {
        // The number is converted into a string

        const textNode = this.#document.createTextNode(argument.toString())

        children = addChildToStack(textNode, children)
      }
      // @ts-ignore
      else if (argument instanceof this.#window.Node) {
        // This is a child, created by this function, to be appended to its parent
        children = addChildToStack(argument, children)
      }
      else if (argument instanceof Array) {
        if (argument.length === 0) {
          continue
        }

        let isChildrenArray = false

        for (const child of argument) {
          if (
            // @ts-ignore
            child instanceof this.#window.Node // Node includes HTMLElement and Comment
          ) {
            isChildrenArray = true

            break
          }
        }

        // Case 1) Array, containing at least one child to be added to their parent
        // In DOM, if some elements are not children, they are turned into strings,
        // but the same produces error in SSR
        if (isChildrenArray) {
          children = addChildrenToStack(argument, children)
        }
        // Case 2) Array, containing string to be formatted
        else {
          const textNode = this.#document.createTextNode(
            this.#arrayTranslateFormatTranslate(argument),
          )

          children = addChildToStack(textNode, children)
        }
      }
      else if (argument instanceof Error) {
        // Error message

        element.textContent = this.#translate(argument.message)
      }
      else if (argument instanceof Paintor) {
        const generatedChildren = (this.#isSr)
          ? argument.getElementsSr()
          : argument.getElements()

        for (const childrenGroup of generatedChildren) {
          for (const child of childrenGroup) {
            children = addChildToStack(child, children)
          }
        }
      }
      else if (argument instanceof Function) {
        if (this.#isSr) {
          // @ts-ignore
          element.innerHTML = `(${argument.toString()})()`
        }
        else {
          if (element instanceof HTMLScriptElement) {
            const inlineScript = this.#document.createTextNode(`(${argument.toString()})()`)
            element.appendChild(inlineScript)
          }
          else {
            if (
              'value' in element
              && !(element instanceof HTMLLIElement) // <li> has value, but it accepts only numbers
            ) {
              this.#setPropertiesToElement(element, { value: argument })
            }
            else {
              const textNode = this.#document.createTextNode('')

              this.#setPropertiesToElement(textNode, { textContent: argument })

              children = addChildToStack(textNode, children)
            }
          }
        }
      }
      else if (
        argument instanceof Object
        && !(argument instanceof Function)
        && argumentID === 1
      ) {
        // If Object, and the first argument, this is a property.
        // This condition needs to be at the end of the 'if' chain.

        this.#setPropertiesToElement(element, argument)
      }
    }

    appendChildrenToElement(element, children)

    const level = this.#collectedElements.length - 1

    this.#collectedElements[level].removeTheseElements(children)
    this.#collectedElements[level].addElement(element)

    return element
  }

  /**
   * - Browser mode: Append the DOM elements at level 0 to the container element
   * - Server mode: Generate HTML code of the elements at level 0
   *
   * @param {object} htmlOptions
   * @param {string} [htmlOptions.indent='']
   * @returns {string}
   * - Browser mode: Empty string
   * - Server mode: The final HTML code
   */
  finalPaint(htmlOptions) {
    let finalHtmlCode = ''

    const children = this.getCreatedElements()
    const containerElement = this.#containerElement

    if (containerElement) {
      appendChildrenToElement(containerElement, children)
    }

    this.finalElements = children

    if (this.#isSr) {
      const virtualContainer = containerElement

      if (virtualContainer) {
        // @ts-ignore
        finalHtmlCode = virtualContainer.paintChildren(htmlOptions)
      }
    }

    return finalHtmlCode
  }

  /**
   * For loop with from-to numbers
   *
   * @param {number} from
   * @param {number} to
   * @param {ForLoopIterableCallback} handler
   * @returns {Node[] | Error}
   */
  for(from, to, handler) {
    const callback = () => {
      const result = forLoop(from, to, handler)

      if (result instanceof Error) console.error(result)
    }

    return this.#statementHandler('for', null, callback)
  }

  /**
   * "for" loop for objects, arrays, maps and sets
   *
   * @template T
   * @param {T | function() : T} input
   * @param {ForLoopCallback<T>} handler
   * @returns {Node[] | Error}
   */
  forEach(input, handler) {
    return this.#forEachLoop(1, input, handler)
  }

  /**
   * "for" loop for states
   *
   * @template T
   * @param {State} input
   * @param {ForLoopCallback<T>} handler
   * @returns {Node[] | Error}
   */
  forState(input, handler) {
    return this.#forEachLoop(2, input, handler)
  }

  /**
   * @returns {Node[]}
   */
  getCreatedElements() {
    const elements = this.#collectedElements[0].getElements()

    // Reset
    this.#collectedElements = [new ElementsCollector()]

    return elements
  }

  /**
   * @param {string[] | string} strings
   * A string when html is used as a function, or an array of strings when used as template
   * @param {...*} keys
   * @returns {(Element | Node)[]}
   */
  html(strings, ...keys) {
    const elements = (
      keys.length === 0
      && this.#translations.length === 0 // the faster method doesn't translate anything
    )
      ? this.#htmlForSimpleString((strings instanceof Array) ? strings[0] : strings)
      : this.#htmlForTemplateLiteral((strings instanceof Array) ? strings : [strings], ...keys)

    for (const element of elements) {
      if (
        // Dummy tag (virtual mode) when simple string, or text node when template literal
        // In both cases the tag name is an empty string
        // @ts-ignore
        element.tagName === ''
      ) {
        element.textContent = this.#translate(element.textContent)
      }
    }

    return elements
  }

  /**
   * "IF" condition
   *
   * @param {boolean | StatementBindFunction} condition
   * @param {function():void} handler
   * @param {function():void} [elseHandler]
   * @returns {Node[]}
   */
  if(condition, handler, elseHandler) {
    /**
     * If the condition is a value (true or false), the elements
     * are either created or not.
     *
     * If the condition is a function, two helper Comment elements
     * are created - one in the beginning and another at the end.
     * All normal elements are placed in between.
     */

    /**
     * @param {any} data
     */
    const callback = (data) => {
      if (Boolean(data)) {
        if (typeof handler === 'function') {
          handler()
        }
      }
      else {
        if (typeof elseHandler === 'function') {
          elseHandler()
        }
      }
    }

    return (condition instanceof Function)
      ? this.#statementHandlerForFunction('if', condition, callback)
      : this.#statementHandler('if', condition, callback)
  }

  /**
   * This method should be called in the IF or FOR loop after calling the handler.
   *
   * @param {object} input
   * @param {number} input.thisLevel
   * @param {number} input.upperLevel
   * @returns {Node[]}
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
   * @template T
   * @param {T[]} array
   * @returns {(string | T)[]}
   */
  #arrayTranslate(array) {
    const needsTranslation = Boolean(this.#translations)

    return (needsTranslation)
      ? array.map((value) => this.#translate(value))
      : array
  }

  /**
   * This function first translations each part of the input array,
   * then formats it, then translations the result.
   *
   * @template T
   * @param {T[]} array
   * The input array is supposed to be what would format() arguments be
   * (format string plus multiple arguments), but as an array.
   * @returns {string}
   */
  #arrayTranslateFormatTranslate(array) {
    return this.#translate(
      format.apply(
        null,
        // @ts-ignore
        this.#arrayTranslate(array),
      ),
    )
  }

  /**
   * Prepare the levels to be used in IF or FOR loop, and return them.
   * This method must be called in the IF or FOR loop, before calling
   * the handler.
   *
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
   * @template T
   * @param {ForLoopType} forLoopType
   * @param {(T | function() : T) | State} input
   * @param {ForLoopCallback<T>} handler
   * @returns {Node[] | Error}
   */
  #forEachLoop(forLoopType, input, handler) {
    /**
     * @param {any} value
     * @returns {any}
     */
    const beforeIterationCallback = (value) => {
      return this.#translate(value)
    }

    if (isState(input)) {
      /**
       * @param {State} data
       * @param {ElementsCollector} elementsCollector
       * @param {string | number | symbol} [keyToRender]
       * @returns {RenderedElementsMap}
       */
      const callbackForState = (data, elementsCollector, keyToRender) => {
        /** @type {RenderedElementsMap} */
        const renderedElementsMap = []

        /**
         * Initially there is 1 element - the forEach-begin element.
         * We want to start after this element.
         */
        let index = elementsCollector.getElements().length

        /**
         * @param {number | string} key
         */
        const onIteration = (key) => {
          const elementsFromCollector = elementsCollector.getElements()
          const elements = elementsFromCollector.slice(index)

          renderedElementsMap.push({ key, elements })

          index = elementsFromCollector.length
        }

        forEachLoop(forLoopType, data, handler, beforeIterationCallback, keyToRender, onIteration)

        return renderedElementsMap
      }

      return this.#statementHandlerForState('forEach', input, callbackForState)
    }

    /**
     * @param {State} data
     */
    const callback = (data) => {
      forEachLoop(forLoopType, data, handler, beforeIterationCallback)
    }

    if (input instanceof Function) {
      // @ts-ignore
      return this.#statementHandlerForFunction('forEach', input, callback)
    }

    return this.#statementHandler('forEach', input, callback)
  }

  /**
   * Quicker version for the 'html' function that does not use parsing,
   * because the input is just a single string.
   *
   * @param {string} string
   * @returns {(Element | Node)[]}
   */
  #htmlForSimpleString(string) {
    /** @type {(Element | Node)[]} */
    let elements = []

    if (this.#isSr) {
      // We create a new dummy element every time.
      // An element with no tag name is skipped in the render stage.
      const element = this.#document.createElement('')

      element.innerHTML = string ?? ''

      elements = [element]
    }
    else {
      if (false && 'DOMParser' in this.#document) {
        // @ts-ignore
        elements = stringToHTML(string.trim() ?? '').childNodes
      }
      else {
        // In DOM, we can reuse the same element
        const template = this.#dummyHtmlElement

        //element.setHTML(string.trim() ?? '')
        template.innerHTML = string.trim() ?? ''

        // childNodes also contains the text nodes
        elements = Array.from(template.content.childNodes)

        template.innerHTML = ''
      }
    }

    // Add the newly created elements into the collection
    const level = this.#collectedElements.length - 1

    this.#collectedElements[level].addElements(elements)

    return elements
  }

  /**
   * @param {string[]} strings
   * @param {...*} keys
   * @returns {(Element | Node)[]}
   */
  #htmlForTemplateLiteral(strings, ...keys) {
    const htmlTemplateParser = new HtmlTemplateParser(strings, keys)

    return htmlTemplateParser.generate(this)
  }

  /**
   * @param {Comment} beginCommentElement
   * @param {Node[]} elements
   * @returns {boolean}
   * Returns false if there is no element after which to insert the other elements,
   * otherwise returns true
   */
  #insertStatementElements(beginCommentElement, elements) {
    if (!(this.#containerElement?.contains(beginCommentElement))) {
      return false
    }

    /** @type {Node|Comment} */
    let lastElement = beginCommentElement

    for (const newElement of elements) {
      insertAfter(newElement, lastElement)

      lastElement = newElement
    }

    return true
  }

  /**
   * Remove all DOM elements, starting after BEGIN element and ending before END element.
   * BEGIN and END are a pair of two comment elements, one of the following pairs:
   * <!--IF BEGIN--> and <!--IF END-->
   * <!--FOR BEGIN--> and <!--FOR END-->
   *
   * @param {Comment} beginCommentElement
   * - The 'begin' Comment element
   * @returns {number}
   * - The number of deleted elements or -1 on failure
   */
  #removeStatementElements(beginCommentElement) {
    /**
     * @type {number}
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
     */
    const COMMENT_NODE = 8 // Node.COMMENT_NODE

    if (beginCommentElement.nodeType !== COMMENT_NODE) {
      return -1
    }

    // Decide what will be the text content of the end element
    const beginCommentElementText = beginCommentElement.textContent
    let endElementText = ''

    if (beginCommentElementText) {
      endElementText = beginCommentElementText.slice(0, -6) + '-end'
    }
    else {
      return -1
    }

    /**
     * Delete elements between the 'begin' and 'end' element,
     * including inner 'begin' and 'end' elements
     */

    let currentElement = beginCommentElement.nextSibling
    let statementsCounter = 0
    let deletedElementsCount = 0

    while (true) {
      if (currentElement === null) {
        break
      }

      if (currentElement.nodeType === COMMENT_NODE) {
        const text = currentElement.textContent

        if (text === beginCommentElementText) { // inner 'begin' element
          statementsCounter += 1
        }
        else if (text === endElementText) {
          statementsCounter -= 1

          if (statementsCounter < 0) {
            break
          }
        }
      }

      const { nextSibling } = currentElement

      this.#unsubscribeElementAndItsChildren(currentElement)

      currentElement.remove()
      deletedElementsCount += 1
      currentElement = nextSibling
    }

    return deletedElementsCount
  }

  /**
   * @param {HTMLElement | Text} element
   * @param {Object<string, string|number|Object<*,*>|function(*):*|BindFunction>} properties
   */
  #setPropertiesToElement(element, properties) {
    for (const propertyName in properties) {
      let property = properties[propertyName]

      if (this.#isSr) {
        // When the property name is an event and the property is a function, turn it into a string
        if (isEventAttribute(propertyName) && property instanceof Function) {
          setElementAttrOrProp(element, propertyName, property)

          continue
        }
      }
      else if (property instanceof Function) {
        // If the property name is an event (for example onClick),
        // then the property is a function. This function should not
        // be immediately called to get a value from it. Instead, it
        // should be added as a listener.
        if (addEventListenerIfPossible(element, propertyName, property)) {
          continue
        }
      }

      // if (propertyName === 'text') propertyName = 'textContent'

      if (property instanceof Function) {
        /** @type {BindFunction} */
        const bindFunction = property

        // this.#subscribeToBindings({
        //   element,
        //   propertyName,
        //   bindFunction,
        // })

        setSuggestItems(
          element,
          propertyName,
          '',
          bindFunction,
          null,
        )

        let value = bindFunction(element)

        if (value instanceof Function) {
          /**
           * Remark "() => value"
           *
           * In forEach the value is provided as a function, so it is not necessary
           * to use it like this () => value. However, when used like this, the function
           * returns a function. Resolve the returned function here.
           */
          value = value()
        }

        unsetSuggestedItems()

        if (value instanceof Array) {
          value = this.#arrayTranslateFormatTranslate(value)
        }
        else if (typeof value === 'string') {
          value = this.#translate(value)
        }

        setElementAttrOrProp(element, propertyName, value)
      }
      else if (
        // @ts-ignore
        element instanceof this.#window.HTMLElement
        && propertyName === 'style'
        && property instanceof Object
      ) {
        // @ts-ignore
        this.#setStylesToElement(element, property)
      }
      else if (
        // @ts-ignore
        element instanceof this.#window.HTMLElement
        && propertyName === 'data'
      ) {
        if (property instanceof Object) {
          // @ts-ignore
          setDataSetAttributesToElement(element, property)
        }
      }
      else if (propertyName === 'textContent') {
        if (property instanceof Array) {
          element[propertyName] = this.#arrayTranslateFormatTranslate(property)
        }
        else {
          element[propertyName] = this.#translate(property)
        }
      }
      else {
        if (
          propertyName === 'innerText'
          || (
            propertyName === 'value'
            && (
              // Can't use HTMLInputElement here, because it does not exist in SrDOM
              // @ts-ignore
              element.tagName === 'INPUT'
              // @ts-ignore
              && (element.getAttribute('type') ?? '').toLowerCase() === 'button'
            )
          )
        ) {
          property = this.#translate(property)
        }

        setElementAttrOrProp(element, propertyName, property)
      }
    }
  }

  /**
   * @param {HTMLElement} element
   * @param {Object<keyof CSSStyleDeclaration, (string | BindFunction)>} styleRules
   */
  #setStylesToElement(element, styleRules) {
    for (const ruleName in styleRules) {
      const ruleValue = styleRules[ruleName]
      let finalValue  = ''

      if (ruleValue instanceof Function) {
        const propertyName = 'style'
        const bindFunction = ruleValue

        // this.#subscribeToBindings({
        //   element,
        //   propertyName,
        //   subPropertyName: ruleName,
        //   bindFunction,
        // })

        setSuggestItems(
          element,
          propertyName,
          ruleName,
          bindFunction,
          null,
        )

        finalValue = bindFunction(element)

        unsetSuggestedItems()
      }
      else {
        finalValue = ruleValue
      }

      if (typeof ruleName === 'string') {
        // @ts-ignore
        element.style[ruleName] = modifyStyleRule(ruleName, finalValue)
      }
    }
  }

  /**
   * @param {'if' | 'for' | 'forEach'} type
   * @param {any} data
   * @param {function(any): void} callback
   * @returns {Node[]}
   */
  #statementHandler(type, data, callback) {
    const { thisLevel, upperLevel } = this.#beforeStatement()

    callback(data)

    return this.#afterStatement({ thisLevel, upperLevel })
  }

  /**
   * @param {'if' | 'for' | 'forEach'} type
   * @param {function(): any} bindFunction
   * @param {function(boolean | State): void} callback
   * @returns {Node[]}
   */
  #statementHandlerForFunction(type, bindFunction, callback) {
    const { thisLevel, upperLevel } = this.#beforeStatement()
    const isFunction = bindFunction instanceof Function

    if (isFunction) {
      const commentElementBegin = this.#document.createComment(`${type}-begin`)
      const commentElementEnd   = this.#document.createComment(`${type}-end`)

      this.#collectedElements[thisLevel].addElement(commentElementBegin)

      /**
       * @type {StatementRepaintFunction}
       */
      const statementRepaintFunction = (bindFunctionResult) => {
        // Clean all contents.
        this.#collectedElements[0].removeAllElements()
        this.#removeStatementElements(commentElementBegin)

        // Create the new elements
        callback(bindFunctionResult)

        const success = this.#insertStatementElements(
          commentElementBegin,
          this.#collectedElements[0].getElements(),
        )

        if (!success) {
          console.error('Element ', commentElementBegin, ' does not exist anymore')
        }
      }

      const element = commentElementBegin
      const propertyName = `--${type}` // --if or --for

      setSuggestItems(
        element,
        propertyName,
        '',
        bindFunction,
        statementRepaintFunction,
      )

      const resolved = bindFunction()

      // TODO maybe this one should be below the callback below?
      unsetSuggestedItems()

      // Run the handler function
      callback(resolved)

      this.#collectedElements[thisLevel].addElement(commentElementEnd)
    }
    else {
      const resolved = bindFunction

      // Run the handler function
      callback(resolved)
    }

    return this.#afterStatement({ thisLevel, upperLevel })
  }

  /**
   * @param {'forEach'} type
   * @param {any} state
   * @param {function(
   *   State, ElementsCollector, (string | number | symbol)=
   * ): RenderedElementsMap} callback
   * @returns {Node[]}
   */
  #statementHandlerForState(type, state, callback) {
    const { thisLevel, upperLevel } = this.#beforeStatement()

    const commentElementBegin = this.#document.createComment(`${type}-begin`)
    /**
     * Use the 'end' comment element as a storage for the rendered elements.
     * It's easier this way, and if the element is being deleted along with
     * the rendered elements, no references to these elements would remain.
     *
     * @type {Comment & {renderedElementsMap: RenderedElementsMap}}
     */
    // @ts-ignore
    const commentElementEnd = this.#document.createComment(`${type}-end`)

    this.#collectedElements[thisLevel].addElement(commentElementBegin)

    /**
     * TODO Refactor this function, because it's too long
     *
     * @type {StatementRepaintFunction} updatedState
     */
    const statementRepaintFunction = (updatedState) => {
      if (!(updatedState instanceof Object)) {
        return
      }

      // Remove what is not in the updated state
      for (let i = commentElementEnd.renderedElementsMap.length - 1; i >= 0; i--) {
        const item = commentElementEnd.renderedElementsMap[i]

        if (!(objectHasKey(updatedState, item.key))) {
          item.elements.forEach((element) => {
            // @ts-ignore
            element.remove()
          })

          commentElementEnd.renderedElementsMap
            = arrayRemoveKey(commentElementEnd.renderedElementsMap, i)
        }
      }

      /**
       * @type {Node}
       */
      let lastElement = commentElementBegin

      // Add what is not in the updated state
      const renderedElementsMapNew = []

      const keys = (
        updatedState instanceof Map
        || updatedState instanceof Set
        || updatedState instanceof Array
      )
        ? updatedState.keys()
        : Object.keys(updatedState)

      for (let i of keys) {
        /**
         * When Array, if an element is deleted, the key remains and the
         * value is undefined. But also, the array iterates differently
         * when 'of' or 'in' is used. With 'of', the deleted value is iterated,
         * while with 'if' it's not. That's why this 'in' is here, to prevent
         * iteration of deleted array elements.
         */
        if (!(i in updatedState)) {
          continue
        }

        let isKeyInRenderedElementsMap = false

        for (const item of commentElementEnd.renderedElementsMap) {
          if (item.key === i) {
            const { elements } = item

            lastElement = (elements.length > 0)
              ? elements[elements.length - 1]
              : lastElement
            renderedElementsMapNew.push(item)
            isKeyInRenderedElementsMap = true

            break
          }
        }

        if (!isKeyInRenderedElementsMap) {
          const added = callback(
            updatedState,
            this.#collectedElements[0],
            i,
          )

          for (const item of added) {
            renderedElementsMapNew.push(item)

            // eslint-disable-next-line @typescript-eslint/no-loop-func
            item.elements.forEach((element) => {
              // @ts-ignore
              lastElement.after(element)
              lastElement = element
            })
          }
        }
      }

      commentElementEnd.renderedElementsMap = renderedElementsMapNew
    }

    const propertyName = `-s-${type}` // --if or --for
    const bindFunction = () => state

    setSuggestItems(
      commentElementEnd,
      propertyName,
      '',
      bindFunction,
      statementRepaintFunction,
    )

    // In this callback the for loop is called
    commentElementEnd.renderedElementsMap = callback(
      state,
      this.#collectedElements[thisLevel],
    )

    unsetSuggestedItems()

    this.#collectedElements[thisLevel].addElement(commentElementEnd)

    return this.#afterStatement({ thisLevel, upperLevel })
  }

  /**
   * @param {any} input
   * @returns {string}
   */
  #translate(input) {
    if (typeof input === 'string') {
      const translated = this.#translateString(input, this.#translations)

      if (typeof translated === 'string') {
        return translated
      }

      // Use the global translation
      const globalObject = getGlobalObject()

      const globallyTranslated = this.#translateString(
        input,
        // @ts-ignore
        globalObject?.paintorTranslations,
      )

      if (typeof globallyTranslated === 'string') {
        return globallyTranslated
      }
    }

    return input
  }

  /**
   * @param {string} str
   * @param {Translation[]} [translations]
   * @returns {string | boolean}
   */
  #translateString(str, translations) {
    if (translations instanceof Array && translations.length > 0) {
      for (const translateObject of translations) {
        if (str in translateObject) {
          return translateObject[str]
        }
      }
    }

    return false
  }

  /**
   * Recursively search in an element's child nodes for
   * elements, who are used in state subscriptions, and
   * unsubscribe them. Also unsubscribe the initial element.
   *
   * Note: This function works only on the browser!
   *
   * @param {Node} element
   */
  #unsubscribeElementAndItsChildren(element) {
    if (Object.hasOwn(element, '--subscribed')) {
      Object.assign(element, { '--deleted': true })
    }

    element.childNodes.forEach(
      (child) => this.#unsubscribeElementAndItsChildren(child),
    )
  }
}

// Add methods in the prototype for each standard HTML tag

/**
 * @see https://stackoverflow.com/questions/13851088/how-to-bind-function-arguments-without-binding-this
 * @param {...any} boundArgs
 * @returns {function(...[*]):*}
 * @this {any}
 */
function bindArgs(...boundArgs) {
  const targetFunction = this

  /**
   * @param {...any} args
   * @returns {any}
   * @this {any}
   */
  return function targetFunctionCaller(...args) {
    return targetFunction.call(this, ...boundArgs, ...args)
  }
}

const { prototype } = ElementsCreator

// prototype.createElement.bindArgs = bindArgs
Object.assign(prototype.createElement, { bindArgs })

htmlTags.forEach((tagName) => {
  // @ts-ignore
  prototype[tagName] = prototype.createElement.bindArgs(tagName)
})

export { ElementsCreator }
