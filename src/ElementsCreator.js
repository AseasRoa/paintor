import { Component } from './Component.js'
import { EnumStateAction, HTML_TAGS, symState, symTemplateFunction } from './constants.js'
import { ElementsCollector } from './ElementsCollector.js'
import { setSuggestedItems, unsetSuggestedItems } from './elementsSuggestor.js'
import {
  addChildrenToStack,
  addChildToStack,
  addEventListenerIfPossible,
  appendChildrenToElement,
  arrayRemoveKey,
  chainElements,
  forEachLoop,
  forLoop,
  format,
  getGlobalObject,
  insertAfter,
  isEventAttribute,
  modifyStyleRule,
  objectLength,
  setDataSetAttributesToElement,
  setElementAttrOrProp,
  stringToHTML,
} from './functions.js'
import { HtmlTemplateParser } from './HtmlTemplateParser/HtmlTemplateParser.js'
import { isState } from './state.js'
import {
  hasSubscriptions,
  moveSubscriptions,
  removeAllSubscriptions,
} from './StateProxySubscriptions.js'

/**
 * @typedef {Array<{key: (string | number | symbol | undefined), elements: (Node)[]}>} RenderedElementsMap
 */

/**
 * @typedef {Comment & {renderedElementsMap: RenderedElementsMap}} RenderedElementsCollectorElement
 */

class ElementsCreator {
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
   * @type {Element | ShadowRoot | null}
   */
  #containerElement

  /** @type {Document} */
  #document

  /**
   * Is String-Rendering mode
   *
   * @type {boolean}
   */
  #isSr = true

  /**
   * Used only for Browser rendering.
   * This element is used by html(), in its simple mode.
   *
   * @type {HTMLTemplateElement | null}
   */
  #reusableTemplateElement = null

  /**
   * The type TemplateTree is the "face" of this class.
   * Both have the same parts, but are made differently.
   * Sometimes this class must be passed as an argument
   * to a function for which the type of the argument is
   * TemplateTree, and putting @ts-ignore is necessary.
   * So, this "conversion" here is to prevent placing
   * multiple @ts-ignore
   *
   * @type {TemplateTree}
   */
  // @ts-ignore
  #templateTree = this

  /** @type {(Template | Component)[]} */
  #templates = []

  /** @type {Translation[]} */
  #translations = []

  /** @type {Window} */
  #window

  /**
   * @param {Window} window
   * @param {HTMLElement | Element | ShadowRoot | null} containerElement
   * @param {(Template | Component)[]} templates
   * @param {Translation[]} [translations]
   */
  constructor(window, containerElement, templates, translations = []) {
    this.#window           = window
    this.#document         = window.document
    this.#isSr             = this.#document.baseURI === ''
    this.#containerElement = containerElement
    this.#templates        = templates
    this.#translations     = translations

    /*
     * HTML_TAGS.forEach((tagName) => {
     *   // @ts-ignore
     *   this[tagName] = this[tagName].bind(this)
     * })
     */
  }

  /**
   * Create a DOM element (or multiple elements) and put it into the elements collector
   *
   * @param {string} tagName
   * @param {*} args
   * @returns {HTMLElement | Text}
   */
  createElement(tagName, ...args) {
    const element = (tagName)
      ? this.#document.createElement(tagName)
      : this.#document.createTextNode('')

    /** @type {any[]} */
    let children   = []
    let argumentID = 0

    for (const argument of args) {
      argumentID += 1

      if (typeof argument === 'string') {
        /*
         * In case of a string, create a new text node.
         * This way, multiple text nodes can be put into the element,
         * mixed with http elements.
         */

        const textNode = this.#document.createTextNode(
          this.#translate(argument),
        )

        addChildToStack(textNode, children)
      }
      else if (typeof argument === 'number') {
        // The number is converted into a string

        const textNode = this.#document.createTextNode(
          argument.toString(),
        )

        addChildToStack(textNode, children)
      }
      // @ts-ignore
      else if (argument instanceof this.#window.Node) {
        // This is a child, created by this function, to be appended to its parent
        addChildToStack(argument, children)
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

        /*
         * Case 1) Array, containing at least one child to be added to their parent.
         *
         * In DOM, if some elements are not children, they are turned into strings,
         * but the same produces error in SSR
         */
        if (isChildrenArray) {
          addChildrenToStack(argument, children)
        }
        /*
         * Case 2) Array, containing string to be formatted.
         */
        else {
          const textNode = this.#document.createTextNode(
            this.#arrayTranslateFormatTranslate(argument),
          )

          addChildToStack(textNode, children)
        }
      }
      else if (argument instanceof Error) {
        // Error message

        element.textContent = this.#translate(argument.message)
      }
      else if (argument instanceof Component) {
        const generatedChildren = (this.#isSr)
          ? argument.useTranslations(this.#translations).getElementsSr()
          : argument.useTranslations(this.#translations).getElements()

        const { length } = generatedChildren

        if (length > 0) {
          for (const child of generatedChildren[length - 1]) {
            addChildToStack(child, children)
          }
        }
      }
      else if (argument instanceof Function) {
        // Is it a Template function?
        if (argument[symTemplateFunction]) {
          const { thisLevel, upperLevel } = this.#beforeStatement()

          argument(this.#templateTree)

          const generatedElements = this.#collectedElements[thisLevel].getElements()

          addChildrenToStack(generatedElements, children)

          this.#afterStatement({ thisLevel, upperLevel })
        }
        else {
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
                // eslint-disable-next-line no-loop-func
                const callbackOnTemplate = () => {
                  this.#statementHandlerForFunction(
                    'nest',
                    argument,
                    true,
                    (
                      value,
                      isInitialRun,
                      commentElementBegin, // Should be Comment element on the first run only
                      commentElementEnd, // Should be Comment element on the first run only
                    ) => {
                      if (value instanceof Function || value instanceof Component) {
                        if (value instanceof Component) {
                          const generatedChildren = (this.#isSr)
                            ? value.useTranslations(this.#translations).getElementsSr()
                            : value.useTranslations(this.#translations).getElements()

                          if (isInitialRun) {
                            addChildToStack(commentElementBegin, children)
                            addChildrenToStack(generatedChildren[0], children)
                            addChildToStack(commentElementEnd, children)
                          }
                          else {
                            this.#collectedElements[0].addElements(generatedChildren[0])
                          }
                        }
                        else if (symTemplateFunction in value) {
                          value(this.#templateTree)

                          if (isInitialRun) {
                            const level = this.#collectedElements.length - 1

                            const generatedElements = this.#collectedElements[level].getElements()

                            addChildToStack(commentElementBegin, children)
                            addChildrenToStack(generatedElements, children)
                            addChildToStack(commentElementEnd, children)
                          }
                          else {
                            children.length = 0 // maybe not necessary
                          }
                        }
                      }
                      else {
                        if (isInitialRun && commentElementBegin) {
                          this.#unsubscribeElementAndItsChildren(commentElementBegin)
                          this.#setPropertiesToElement(element, { textContent: value })
                        }
                      }
                    })
                }

                this.#setPropertiesToElement(
                  element, { textNode: argument }, callbackOnTemplate,
                )
              }
            }
          }
        }
      }
      else if (
        argument instanceof Object
        && !(argument instanceof Function)
        && argumentID === 1
      ) {
        /*
         * If Object, and if it's the first argument, this is a property.
         * This condition needs to be at the end of the 'if' chain.
         */

        this.#setPropertiesToElement(element, argument)
      }
    }

    const level = this.#collectedElements.length - 1

    /**
     * Along with the known children, there might be unknown children,
     * created from a function call such as templateCall($). These unknown
     * children would be placed after the first known child.
     *
     * @example
     * $.div($.span(), templateCall($))
     *
     * However, the scenario when the function call is the first argument is
     * not covered:
     * @example
     * $.div(templateCall($), $.span())
     */
    if (children.length > 0) {
      const collectedElements      = this.#collectedElements[level].getElements()
      const indexOfFirstKnownChild = collectedElements.indexOf(children[0])

      if (indexOfFirstKnownChild > -1) {
        if (children.length < collectedElements.length - indexOfFirstKnownChild) {
          // Replace the children with all collected elements, starting from the first known child
          children = collectedElements.slice(indexOfFirstKnownChild)
        }
      }
    }

    appendChildrenToElement(element, children)

    this.#collectedElements[level].removeTheseElements(children)
    this.#collectedElements[level].addElement(element)

    return element
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
   * @param {ForLoopCallbackOnEmpty} handlerOnEmpty
   * @returns {Node[] | Error}
   */
  forState(input, handler, handlerOnEmpty) {
    return this.#forEachLoop(2, input, handler, handlerOnEmpty)
  }

  /**
   * @returns {Node[]}
   */
  getCreatedElements() {
    return this.#collectedElements[0].getElements()
  }

  /**
   * - Browser mode: Returns an empty string
   * - Server mode: Generate HTML code of the elements at level 0
   *
   * @param {object} htmlOptions
   * @param {string} [htmlOptions.indent]
   * @returns {string}
   * - Browser mode: Empty string
   * - Server mode: The final HTML code
   */
  getHtmlCode(htmlOptions) {
    let htmlCode = ''

    if (this.#isSr) {
      const containerElement = this.#containerElement

      if (containerElement) {
        // @ts-ignore
        htmlCode = containerElement.paintChildren(htmlOptions)
      }
    }

    return htmlCode
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
        /*
         * Dummy tag (virtual mode) when simple string, or text node when template literal.
         * In both cases the tag name is an empty string
         */
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
   * @param {(function():(void | Template)) | Template} handler
   * @param {(function():(void | Template)) | Template} [elseHandler]
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
    const callbackForFunction = (data) => {
      const isTruthy = Boolean(data)

      if (isTruthy) {
        if (handler) {
          this.#statementHandlerResolver(handler)
        }
      }
      else {
        if (elseHandler) {
          this.#statementHandlerResolver(elseHandler)
        }
      }
    }

    return (condition instanceof Function)
      ? this.#statementHandlerForFunction(
        'if', condition, true, callbackForFunction,
      )
      : this.#statementHandler(
        'if', condition, callbackForFunction,
      )
  }

  async render() {
    this.#collectedElements = [new ElementsCollector()] // Reset

    for (const template of this.#templates) {
      if (template instanceof Function) {
        let returnedValue = template(this.#templateTree)

        if (returnedValue instanceof Promise) {
          returnedValue = await returnedValue
        }

        if (returnedValue && typeof returnedValue === 'string') {
          this.html(returnedValue)
        }
        else if (returnedValue instanceof Component) {
          this.#applyComponent(returnedValue, 0)
        }
        else if (returnedValue instanceof Function) {
          returnedValue(this.#templateTree)
        }
        else if (returnedValue instanceof Array) {
          let allComponents = true
          let allFunctions  = true

          for (const value of returnedValue) {
            if (!(value instanceof Component)) {
              allComponents = false

              break
            }

            if (!(value instanceof Function)) {
              allFunctions = false

              break
            }
          }

          if (allComponents) {
            for (const value of returnedValue) {
              if (!(value instanceof Component)) break

              this.#applyComponent(value, 0)
            }
          }
          else if (allFunctions) {
            for (const value of returnedValue) {
              if (!(value instanceof Function)) break

              value(this.#templateTree)
            }
          }
        }
      }
      else if (template instanceof Component) {
        this.#applyComponent(template, 0)
      }
    }

    this.#appendChildrenToContainer()
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

    // ... and clean this level
    this.#collectedElements[thisLevel].replaceElements([]) // to keep reference
    delete this.#collectedElements[thisLevel]
    this.#collectedElements.pop()

    return elements
  }

  #appendChildrenToContainer() {
    const containerElement = this.#containerElement

    if (containerElement) {
      appendChildrenToElement(containerElement, this.getCreatedElements())
    }
  }

  /**
   * @param {Component} component
   * @param {number} [collectAtLevel]
   */
  #applyComponent(component, collectAtLevel = -1) {
    const generatedChildren = (this.#isSr)
      ? component.useTranslations(this.#translations).getElementsSr()
      : component.useTranslations(this.#translations).getElements()

    const level = (collectAtLevel < 0)
      ? this.#collectedElements.length - 1
      : collectAtLevel

    for (const childrenGroup of generatedChildren) {
      this.#collectedElements[level].addElements(childrenGroup)
    }
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
    this.#collectedElements.push(new ElementsCollector())

    const thisLevel  = this.#collectedElements.length - 1
    const upperLevel = thisLevel - 1

    return { thisLevel, upperLevel }
  }

  /**
   * @template T
   * @param {ForLoopType} forLoopType
   * @param {(T | function() : T) | State} input
   * @param {ForLoopCallback<T>} handler
   * @param {ForLoopCallbackOnEmpty} [handlerOnEmpty]
   * @returns {Node[] | Error}
   */
  #forEachLoop(forLoopType, input, handler, handlerOnEmpty) {
    /** @type {Node[] | null} */
    let renderedElementsMapOnEmpty = null

    /**
     * @param {any} value
     * @returns {any}
     */
    const beforeIterationCallback = (value) => {
      return this.#translate(value)
    }

    if (forLoopType === 2 && isState(input)) {
      /**
       * @param {State} state
       * @param {ElementsCollector} elementsCollector
       * @param {string | number | symbol} [keyToRender]
       * @returns {RenderedElementsMap}
       */
      const callbackForState = (state, elementsCollector, keyToRender) => {
        /** @type {RenderedElementsMap} */
        const renderedElementsMap = []

        /**
         * Initially there is 1 element - the forEach-begin element.
         * We want to start after this element.
         */
        let index = elementsCollector.getElements().length

        /**
         * @param {number | string} [key]
         * @param {Component | null} [component]
         */
        const onIteration = (key, component = null) => {
          /**
           * When the handler of the loop is a Component,
           * the component arg is that Component.
           */
          if (component) {
            this.#statementHandlerResolver(component)
          }

          const elementsFromCollector = elementsCollector.getElements()

          const elements = (index === 0)
            ? elementsFromCollector
            : elementsFromCollector.slice(index)

          if (key === undefined) {
            if (renderedElementsMapOnEmpty) {
              // Elements are rendered already, stop here
              return
            }

            // Save the elements, so then they can be removed
            renderedElementsMapOnEmpty = elements
          }
          else {
            if (renderedElementsMapOnEmpty) {
              for (const element of renderedElementsMapOnEmpty) {
                this.#unsubscribeElementAndItsChildren(element)
                // @ts-ignore
                element.remove()
              }

              renderedElementsMapOnEmpty = null
            }
          }

          renderedElementsMap.push({ key, elements })

          index = elementsFromCollector.length
        }

        forEachLoop(
          this.#templateTree,
          forLoopType,
          state,
          handler,
          handlerOnEmpty,
          beforeIterationCallback,
          keyToRender,
          onIteration,
        )

        return renderedElementsMap
      }

      return this.#statementHandlerForState(
        'forState',
        input,
        callbackForState,
        handlerOnEmpty instanceof Function,
      )
    }

    /**
     * @param {State} data
     */
    const callbackForFunction = (data) => {
      forEachLoop(
        this.#templateTree,
        forLoopType,
        data,
        handler,
        handlerOnEmpty,
        beforeIterationCallback,
      )
    }

    const type = (forLoopType === 1) ? 'forEach' : 'forState'

    if (input instanceof Function) {
      return this.#statementHandlerForFunction(
        type,
        input,
        true,
        // @ts-ignore
        callbackForFunction,
      )
    }

    return this.#statementHandler(type, input, callbackForFunction)
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
      /*
       * We create a new dummy element every time.
       * An element with no tag name is skipped in the render stage.
       */
      const element = this.#document.createElement('')

      element.innerHTML = string ?? ''

      elements = [element]
    }
    else {
      if (
        false
        && 'DOMParser' in this.#window
      ) {
        elements = Array.from(stringToHTML(string.trim() ?? '').childNodes)
      }
      else {
        if (!this.#reusableTemplateElement) {
          this.#reusableTemplateElement = this.#document.createElement('template')
        }

        // In DOM, we can reuse the same element
        const template = this.#reusableTemplateElement

        // element.setHTML(string.trim() ?? '')
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
   * @param {RenderedElementsCollectorElement} commentElementEnd
   * @param {string | Symbol} prop
   * @param {boolean} isArray
   */
  #removeRenderedElements(commentElementEnd, prop, isArray) {
    let index = commentElementEnd.renderedElementsMap.length

    while (index > 0) {
      index -= 1

      if (!commentElementEnd.renderedElementsMap[index]) continue

      if (prop === '*' || commentElementEnd.renderedElementsMap[index].key === prop) {
        for (const element of commentElementEnd.renderedElementsMap[index].elements) {
          // @ts-ignore
          if (element.renderedElementsMap) { // inner end element
            // @ts-ignore
            this.#removeRenderedElements(element, '*', true)
          }

          // Delete all subscriptions for this element
          this.#unsubscribeElementAndItsChildren(element)

          // @ts-ignore
          element.remove() // Delete the element itself
        }

        if (isArray) {
          commentElementEnd.renderedElementsMap[index].elements.length = 0

          delete commentElementEnd.renderedElementsMap[index]
        }
        else {
          commentElementEnd.renderedElementsMap
            = arrayRemoveKey(commentElementEnd.renderedElementsMap, index)
        }
      }
    }
  }

  /**
   * @param {HTMLElement | Text} element
   * @param {Object<string, string|number|Object<*,*>|function(*):*|BindFunction|HTMLElement>} properties
   * @param {Function} [callbackOnTemplate]
   */
  #setPropertiesToElement(element, properties, callbackOnTemplate) {
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
        /*
         * If the property name is an event (for example onClick),
         * then the property is a function. This function should not
         * be immediately called to get a value from it. Instead, it
         * should be added as a listener.
         */
        if (addEventListenerIfPossible(element, propertyName, property)) {
          continue
        }
      }

      // if (propertyName === 'text') propertyName = 'textContent'

      if (property instanceof Function) {
        /** @type {BindFunction} */
        const bindFunction = property

        setSuggestedItems(
          element,
          propertyName,
          '',
          bindFunction,
          null,
        )

        let value = bindFunction(element)

        if (
          (value instanceof Function && Object.hasOwn(value, symTemplateFunction))
          || value instanceof Component
        ) {
          unsetSuggestedItems()

          if (callbackOnTemplate) {
            callbackOnTemplate()
          }

          continue
        }
        else if (value instanceof Function) {
          /**
           * Remark "() => value"
           *
           * In forEach the value is provided as a function, so it is not necessary
           * to use it like this () => value. However, when used like this, the function
           * returns a function. Resolve the returned function here.
           */
          value = value()
        }
        else {
          if (propertyName === 'textNode') {
            unsetSuggestedItems()

            const textNode = this.#document.createTextNode(value)

            element.appendChild(textNode)

            moveSubscriptions(
              element, textNode, bindFunction, { propertyName: 'textContent' },
            )

            continue
          }
        }

        unsetSuggestedItems()

        if (value instanceof Array) {
          value = this.#arrayTranslateFormatTranslate(value)
        }
        else if (typeof value === 'string') {
          value = this.#translate(value)
        }

        if (propertyName) {
          setElementAttrOrProp(element, propertyName, value)
        }
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
              /*
               * Can't use HTMLInputElement here, because it does not exist in SrDOM
               */
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

        setSuggestedItems(
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
   * @param {'if' | 'for' | 'forEach' | 'forState'} type
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
   * @param {'if' | 'for' | 'forEach' | 'forState' | 'nest'} type
   * @param {function(): any} bindFunction
   * @param {boolean} autoAddCommentElements
   * @param {function((boolean | State | Template | Component), boolean, Comment?, Comment?): void} callbackForFunction
   * @returns {Node[]}
   */
  #statementHandlerForFunction(type, bindFunction, autoAddCommentElements, callbackForFunction) {
    const { thisLevel, upperLevel } = this.#beforeStatement()
    const isFunction                = bindFunction instanceof Function

    if (isFunction) {
      const commentElementBegin = this.#document.createComment(`${type}-begin`)
      const commentElementEnd   = this.#document.createComment(`${type}-end`)

      if (autoAddCommentElements) {
        this.#collectedElements[thisLevel].addElement(commentElementBegin)
      }

      /**
       * @type {StatementRepaintFunctionForFunction}
       */
      const statementRepaintFunction = (bindFunctionResult) => {
        if (this.#isSr) {
          return
        }

        const level = this.#collectedElements.length - 1

        // Clean all contents.
        this.#collectedElements[level].removeAllElements()

        // Create the new elements
        callbackForFunction(bindFunctionResult, false, null, null)

        const success = this.#insertStatementElements(
          commentElementBegin,
          this.#collectedElements[level].getElements(),
        )

        if (!success) {
          console.error('Element ', commentElementBegin, ' does not exist anymore')
        }
      }

      const element      = commentElementBegin
      const propertyName = `--${type}` // --if or --for

      setSuggestedItems(
        element,
        propertyName,
        '',
        bindFunction,
        statementRepaintFunction,
      )

      const bindFunctionResult = bindFunction()

      unsetSuggestedItems()

      // Run the handler function
      callbackForFunction(bindFunctionResult, true, commentElementBegin, commentElementEnd)

      if (autoAddCommentElements) {
        this.#collectedElements[thisLevel].addElement(commentElementEnd)
      }
    }
    else {
      const resolved = bindFunction

      // Run the handler function
      callbackForFunction(resolved, false, null, null)
    }

    return this.#afterStatement({ thisLevel, upperLevel })
  }

  /**
   * @param {'forState'} type
   * @param {any} state
   * @param {function(
   *   State, ElementsCollector, (string | number | symbol)=
   * ): RenderedElementsMap} callbackForState
   * @param {boolean} hasHandlerOnEmpty
   * @returns {Node[]}
   */
  #statementHandlerForState(type, state, callbackForState, hasHandlerOnEmpty) {
    const { thisLevel, upperLevel } = this.#beforeStatement()

    const commentElementBegin = this.#document.createComment(`${type}-begin`)
    /**
     * Use the 'end' comment element as a storage for the rendered elements.
     * It's easier this way, and if the element is being deleted along with
     * the rendered elements, no references to these elements remains.
     *
     * @type {RenderedElementsCollectorElement}
     */
    // @ts-ignore
    const commentElementEnd = this.#document.createComment(`${type}-end`)

    this.#collectedElements[thisLevel].addElement(commentElementBegin)

    /**
     * @param {State} updatedState
     * @param {State} updatedObject
     * @param {Node} lastElement
     * @param {string | symbol | undefined} prop
     */
    const createElements = (updatedState, updatedObject, lastElement, prop) => {
      let isTemporaryLevel = false

      if (commentElementBegin.parentElement) {
        /*
         * When the loop is in inner level, make a new temporary collector,
         * which will be deleted after that. Otherwise, the new elements are
         * placed on level 0
         */
        this.#collectedElements.push(new ElementsCollector())
        isTemporaryLevel = true
      }

      const level   = this.#collectedElements.length - 1
      const added   = callbackForState(updatedState, this.#collectedElements[level], prop)
      const isArray = updatedObject instanceof Array

      for (const item of added) {
        // prop would be undefined when using the state is empty, so don't add this item in the map
        if (prop !== undefined) {
          if (isArray) {
            // @ts-ignore
            commentElementEnd.renderedElementsMap[prop] = item
          }
          else {
            commentElementEnd.renderedElementsMap.push(item)
          }
        }

        for (const element of item.elements) {
          if (level === 0) {
            /**
             * Parent element is needed in order to apply 'after'.
             * But if for example there is a for loop (for a state) at top level and
             * immediately after that a new element is added to the state, that new
             * element can't be properly added after the previous one, because of the
             * lack of parent element.
             * Because of this, let's reorder the collected elements.
             */

            this.#collectedElements[level].moveElementAfterAnother(element, lastElement)
          }

          // @ts-ignore
          lastElement.after(element)
          lastElement = element
        }
      }

      if (isTemporaryLevel) {
        this.#collectedElements.pop()
      }
    }

    /**
     * TODO Refactor this function, because it's too long
     *
     * @type {StatementRepaintFunctionForState}
     */
    const statementRepaintFunction = (action, updatedState, prop, arrayFunctionArgs) => {
      // @ts-ignore
      const stateParams   = updatedState[symState]
      const updatedObject = stateParams.target

      if (!(updatedObject instanceof Object)) {
        return
      }

      if (this.#isSr) {
        return
      }

      if (action === EnumStateAction.CREATE) {
        /** @type {null | string} */
        let prevKey = null

        const iterator = (
          updatedObject instanceof Map
          || updatedObject instanceof Set
        )
          ? updatedObject.keys()
          : Object.keys(updatedObject)

        for (const i of iterator) {
          if (i === prop) {
            break
          }

          prevKey = i
        }

        /**
         * @type {Node}
         */
        let lastElement = commentElementBegin

        if (prevKey !== null) {
          for (const item of commentElementEnd.renderedElementsMap) {
            if (!item) continue

            if (item.key === prevKey) {
              const { elements } = item

              lastElement = (elements.length > 0)
                ? elements[elements.length - 1]
                : lastElement

              break
            }
          }
        }

        createElements(updatedObject, updatedObject, lastElement, prop)
      }
      /**
       * Element has been deleted from the state?
       * - Remove the DOM elements
       * - Remove these same elements from .renderedElementsMap
       */
      if (action === EnumStateAction.DELETE) {
        const isArray = updatedObject instanceof Array

        this.#removeRenderedElements(commentElementEnd, prop, isArray)
      }
      else if (action === EnumStateAction.UPDATE) {
        statementRepaintFunction(EnumStateAction.DELETE, updatedState, prop, undefined)
        statementRepaintFunction(EnumStateAction.CREATE, updatedState, prop, undefined)
      }
      else if (action === EnumStateAction.ARRAY_SPLICE) {
        if (updatedObject instanceof Array) {
          /**
           * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
           */
          // @ts-ignore
          // eslint-disable-next-line prefer-const
          let [start, deleteCount, ...newItems] = arrayFunctionArgs

          if (deleteCount === Infinity) {
            deleteCount = updatedObject.length - start
          }
          else if (deleteCount < 0) {
            deleteCount = 0
          }

          if (deleteCount > 0) {
            for (
              let i = start,
                  length = start + deleteCount;
              i < length;
              i++
            ) {
              statementRepaintFunction(
                EnumStateAction.DELETE, updatedState, i.toString(), undefined,
              )
              delete commentElementEnd.renderedElementsMap[i]
            }
          }

          const oldSize  = commentElementEnd.renderedElementsMap.length
          const newSize  = updatedObject.length
          const sizeDiff = newSize - oldSize

          // The array needs to be enlarged?
          if (sizeDiff > 0) {
            commentElementEnd.renderedElementsMap.length = newSize

            // Update keys in the map
            for (
              let index = newSize - 1;
              index >= start + newItems.length;
              index--
            ) {
              const oldIndex = index - sizeDiff

              if (oldIndex < 0) break

              commentElementEnd.renderedElementsMap[index]
                = commentElementEnd.renderedElementsMap[oldIndex]

              commentElementEnd.renderedElementsMap[index].key
                = index.toString()

              delete commentElementEnd.renderedElementsMap[oldIndex]
            }
          }
          else if (sizeDiff < 0) {
            commentElementEnd.renderedElementsMap.splice(start, deleteCount)

            // Update keys in the map
            for (
              let index = newSize - 1;
              index >= start + newItems.length;
              index--
            ) {
              commentElementEnd.renderedElementsMap[index].key = index.toString()
            }
          }

          if (newItems.length > 0) {
            for (
              let index = start;
              index < start + newItems.length;
              index++
            ) {
              statementRepaintFunction(
                EnumStateAction.CREATE, updatedState, index.toString(), undefined,
              )
            }
          }
        }

        commentElementEnd.renderedElementsMap.length = updatedObject.length
      }
      else if (action === EnumStateAction.ARRAY_SWAP) {
        const [key1, key2] = arrayFunctionArgs

        // Change siblings (swap elements objects by reference)
        const tmp                                            = commentElementEnd.renderedElementsMap[key2].elements
        commentElementEnd.renderedElementsMap[key2].elements = commentElementEnd.renderedElementsMap[key1].elements
        commentElementEnd.renderedElementsMap[key1].elements = tmp

        for (let i = 1; i < commentElementEnd.renderedElementsMap.length; i++) {
          chainElements(
            // @ts-ignore
            ...commentElementEnd.renderedElementsMap[i - 1].elements,
            ...commentElementEnd.renderedElementsMap[i].elements,
          )
        }
      }
      else if (action === EnumStateAction.ARRAY_COPY_WITHIN) {
        const [target, start, end] = arrayFunctionArgs

        for (
          let fromIndex = start,
              toIndex = target;
          fromIndex < end;
          fromIndex++, toIndex++
        ) {
          statementRepaintFunction(
            EnumStateAction.DELETE, updatedState, toIndex.toString(), undefined,
          )
          statementRepaintFunction(
            EnumStateAction.CREATE, updatedState, toIndex.toString(), undefined,
          )
        }
      }
      else if (action === EnumStateAction.ARRAY_SORT) {
        for (
          let index = 0,
              length = updatedObject.length;
          index < length;
          index++
        ) {
          statementRepaintFunction(
            EnumStateAction.DELETE, updatedState, index.toString(), undefined,
          )
          statementRepaintFunction(
            EnumStateAction.CREATE, updatedState, index.toString(), undefined,
          )
        }
      }
      else if (action === EnumStateAction.ARRAY_PUSH) {
        const length = updatedObject.length

        let mapIndex    = commentElementEnd.renderedElementsMap.length
        let lastElement = commentElementBegin

        while (mapIndex > 0) {
          mapIndex -= 1

          const item = commentElementEnd.renderedElementsMap[mapIndex]

          if (!item) continue

          const elementsLength = item.elements.length

          if (elementsLength > 0) {
            // @ts-ignore
            lastElement = item.elements[elementsLength - 1]

            break
          }
        }

        prop = (length - 1).toString()

        createElements(updatedObject, updatedObject, lastElement, prop)
      }
      else if (action === EnumStateAction.ARRAY_LENGTH) {
        const newLength = arrayFunctionArgs?.[0] ?? 0

        if (newLength < commentElementEnd.renderedElementsMap.length) {
          let index = commentElementEnd.renderedElementsMap.length

          while (index > 0) {
            index -= 1

            if (index < newLength) break

            // Skip if already deleted.
            if (commentElementEnd.renderedElementsMap[index] === undefined) {
              continue
            }

            statementRepaintFunction(EnumStateAction.DELETE, updatedState, index.toString(), undefined)
          }
        }

        if (updatedObject instanceof Array) {
          commentElementEnd.renderedElementsMap.length = updatedObject.length
        }
      }

      if (
        hasHandlerOnEmpty
        // it's empty string when array function callback event is fired
        && (!(updatedObject instanceof Array) || prop === '')
        && objectLength(updatedObject) === 0
      ) {
        createElements(updatedState, updatedObject, commentElementBegin, undefined)
      }
    }

    const propertyName = `-s-${type}` // --if or --for
    const bindFunction = () => state

    setSuggestedItems(
      commentElementEnd,
      propertyName,
      '',
      bindFunction,
      statementRepaintFunction,
    )

    // In this callback the 'for' loop is called
    const added = callbackForState(state, this.#collectedElements[thisLevel])

    if (added.length === 1 && added[0].key === undefined) {
      // Initial draw on empty state. We don't want the result from it, because then it interferes.
      added.splice(0, 1)
    }

    commentElementEnd.renderedElementsMap = added

    unsetSuggestedItems()

    this.#collectedElements[thisLevel].addElement(commentElementEnd)

    return this.#afterStatement({ thisLevel, upperLevel })
  }

  /**
   * @param {(function():(void | Template)) | Template | Component} handler
   */
  #statementHandlerResolver(handler) {
    // 1) Component
    if (handler instanceof Component) {
      this.#applyComponent(handler)

      return
    }

    // 2) Template Function
    if (
      handler instanceof Function
      // @ts-ignore
      && handler[symTemplateFunction]
    ) {
      handler(this.#templateTree)

      return
    }

    // 3) Normal Function
    if (handler instanceof Function) {
      // @ts-ignore
      const ret = handler()

      // 3.1) Normal Function returns Component or Template
      if (ret instanceof Component || ret instanceof Function) {
        this.#statementHandlerResolver(ret)
      }
    }
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
    if (hasSubscriptions(element)) {
      Object.assign(element, { '--deleted': true })
      removeAllSubscriptions(element)
    }

    /**
     * Unsubscribe each child element recursively.
     *
     * Performance Notes:
     * - This loop is reached too often for its performance to be ignored
     * - Used .forEach() before, but while loop is more than 30% faster
     */

    let index = element.childNodes.length

    while (index > 0) {
      index -= 1

      this.#unsubscribeElementAndItsChildren(element.childNodes[index])
    }
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

HTML_TAGS.forEach((tagName) => {
  // @ts-ignore
  prototype[tagName] = prototype.createElement.bindArgs(tagName)
})

export { ElementsCreator }
