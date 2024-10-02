import { Component } from './Component.js'
import {
  EnumSystemProps,
  HTML_TAGS,
  symEmptyHandlerElements
} from './constants.js'
import { ElementsCollector } from './ElementsCollector.js'
import {
  addChildrenToStack,
  addChildToStack,
  addEventListenerIfPossible,
  appendChildrenToElement,
  insertAfter,
  isEventAttribute,
  setDataSetAttributesToElement,
  setElementAttrOrProp,
  setElementStyleRule,
  stringToHTML
} from './functions/dom.js'
import { forEachLoop, forLoop } from './functions/loops.js'
import { isObjectOrArray, isPrimitive } from './functions/misc.js'
import { isTemplate } from './functions/template.js'
import { HtmlTemplateParser } from './HtmlTemplateParser/HtmlTemplateParser.js'
import { Repaintor } from './Repaintor.js'
import {
  setSuggestedItems,
  unsetSuggestedItems
} from './state/elementsSuggestor.js'
import { getStateProps, isState } from './state/state.js'
import {
  migrateSubscriptions,
  unsubscribeElementAndItsChildren
} from './state/subscriptions.js'
import { Translator } from './Translator.js'

class TemplateTreeClass {
  /**
   * Each element of this array represents a Level of HTML
   * elements.
   * Level 0 is the main level where eventually all elements
   * are placed.
   * A new level is created from IF and FOR in order to collect
   * the elements separately. Then, when the IF or FOR statement
   * ends, the collected elements are moved to the upper level
   * and that new level is deleted.
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
  #thisTree = this

  /** @type {(Template | Component)[]} */
  #templates = []

  /** @type {Translator} */
  #translator

  /** @type {Window} */
  #window

  /**
   * @param {Window} window
   * @param {null
   * | HTMLElement | Element | ShadowRoot} containerElement
   * @param {(Template | Component)[]} templates
   * @param {Translator} translator
   */
  constructor(window, containerElement, templates, translator) {
    /*
     * Initiate
     */
    this.#window = window
    this.#document = window.document
    this.#isSr = this.#document.baseURI === ''
    this.#containerElement = containerElement
    this.#templates = templates
    this.#translator = translator

    /*
     * Support template tree destructuring, like this: ({ div }) => div()
     * Note: The performance doesn't seem to be affected by this
     */
    for (
      const tagName
      of [...HTML_TAGS, ...['for', 'forEach', 'forState', 'html', 'if']]
    ) {
      this[tagName] = this[tagName].bind(this)
    }
  }

  /**
   * Used to track the last instance of this class, which
   * used the render function.
   * This is needed for functions like
   * reactiveArray.forEach(handler), in order to re-paint
   * the contents in the handler.
   *
   * @type {TemplateTree | null}
   */
  static lastTemplateTreeToRender = null

  /**
   * Create a DOM element (or multiple elements) and put it
   * into the elements collector
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
    let children = []
    let argumentID = 0

    for (const argument of args) {
      argumentID += 1

      if (typeof argument === 'string') {
        /*
         * In case of a string, create a new text node.
         * This way, multiple text nodes can be put into the
         * element,  mixed with http elements.
         */

        const textNode = this.#document.createTextNode(
          this.#translator.translate(argument)
        )

        addChildToStack(textNode, children)
      }
      else if (typeof argument === 'number') {
        // The number is converted into a string

        const textNode = this.#document.createTextNode(
          argument.toString()
        )

        addChildToStack(textNode, children)
      }
      else if (typeof argument === 'function') {
        if (isTemplate(argument)) {
          const template = argument
          this.#statementHandlerForTemplate(template, children)
        }
        else {
          if (this.#isSr) {
            // @ts-ignore
            element.innerHTML = `(${argument.toString()})()`
          }
          else {
            if (element instanceof HTMLScriptElement) {
              const inlineScript = this.#document.createTextNode(
                `(${argument.toString()})()`
              )
              element.appendChild(inlineScript)
            }
            else {
              if (
                'value' in element
                // <li> has value, but it accepts only numbers
                && !(element instanceof HTMLLIElement)
              ) {
                this.#setPropertiesToElement(
                  element, { value: argument }
                )
              }
              else {
                this.#setPropertiesToElement(
                  element,
                  { textNode: argument },
                  this.#createNestFunction(element, children, argument)
                )
              }
            }
          }
        }
      }
      // @ts-ignore
      else if (argument instanceof this.#window.Node) {
        /*
         * This is a child, created by this function, to be
         * appended to its parent
         */
        addChildToStack(argument, children)
      }
      else if (Array.isArray(argument)) {
        const array = argument

        if (array.length === 0) {
          continue
        }

        let isChildrenArray = false

        for (const child of array) {
          if (
            // Node includes HTMLElement and Comment
            // @ts-ignore
            child instanceof this.#window.Node
          ) {
            isChildrenArray = true

            break
          }
        }

        /*
         * Case 1) Array, containing at least one child
         * to be added to their parent.
         *
         * In DOM, if some elements are not children,
         * they are turned into strings, but the same
         * produces error in SSR
         */
        if (isChildrenArray) {
          addChildrenToStack(argument, children)
        }
        /*
         * Case 2) Array, containing string to be formatted.
         */
        else {
          const textNode = this.#document.createTextNode(
            this.#translator.translateArray(argument),
          )
          addChildToStack(textNode, children)
        }
      }
      else if (argument instanceof Component) {
        const component = argument
        const generatedChildren = this.#componentGetElements(component)

        const { length } = generatedChildren

        if (length > 0) {
          for (const child of generatedChildren[length - 1] ?? []) {
            addChildToStack(child, children)
          }
        }
      }
      else if (argument instanceof Error) {
        element.textContent = this.#translator.translate(argument.message)
      }
      else if (argumentID === 1 && isObjectOrArray(argument)) {
        /*
         * If Object, and if it's the first argument, this is a
         * property.
         * This condition needs to be at the end of the 'if'
         * chain.
         */

        this.#setPropertiesToElement(element, argument)
      }
    }

    const level = this.#collectedElements.length - 1

    /**
     * Along with the known children, there might be unknown
     * children,
     * created from a function call such as templateCall($).
     * These unknown children would be placed after the first
     * known child.
     *
     * @example
     * x.div(x.span(), templateCall($))
     *
     * However, the scenario when the function call is the
     * first argument is not covered:
     * @example
     * x.div(templateCall(x), x.span())
     */
    if (children.length > 0) {
      // @ts-ignore
      const collectedElements = this.#collectedElements[level].getElements()
      const indexOfFirstKnownChild = collectedElements.indexOf(children[0])

      if (indexOfFirstKnownChild > -1) {
        if (
          children.length < collectedElements.length - indexOfFirstKnownChild
        ) {
          /*
           * Replace the children with all collected elements,
           * starting from the first known child
           */
          children = collectedElements.slice(indexOfFirstKnownChild)
        }
      }
    }

    appendChildrenToElement(element, children)

    // @ts-ignore
    this.#collectedElements[level].removeTheseElements(children)
    // @ts-ignore
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
    /**
     * @param {[*, *]} numbers
     */
    const callbackForFunction = (numbers) => {
      const from = parseInt(numbers[0])
      const to = parseInt(numbers[1])
      const result = forLoop(from, to, handler)

      if (result instanceof Error) console.error(result)
    }

    return this.#statementHandlerForFunctions(
      // @ts-ignore
      'for', [from, to], true, callbackForFunction
    )
  }

  /**
   * "for" loop for objects, arrays, maps and sets
   *
   * @template T
   * @param {T | function() : T} input
   * @param {ForLoopCallback<T>} handler
   * @param {ForLoopCallbackOnEmpty} [handlerOnEmpty]
   * @returns {Node[] | Error}
   */
  forEach(input, handler, handlerOnEmpty) {
    if (isState(input)) {
      return this.#resolverForStates(input, handler, handlerOnEmpty)
    }

    return this.#resolverForObjects(input, handler, handlerOnEmpty)
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
    const stateProps = getStateProps(input)

    if (stateProps) {
      const parentState = stateProps.parent

      if (!isState(parentState)) {
        throw new Error('The state must be a part of a state')
      }

      const keyToPaint = stateProps.key

      /** @type {ForLoopCallback<any>} */
      const handlerForState = (value, key) => {
        if (key !== keyToPaint) {
          return
        }

        if (isTemplate(handler)) {
          // @ts-ignore
          return handler(this.#thisTree)
        }

        const result = handler(value)

        if (typeof result === 'function') {
          // @ts-ignore
          return result(this.#thisTree)
        }

        return result
      }

      return this.#resolverForStates(
        parentState,
        handlerForState,
        handlerOnEmpty,
        keyToPaint
      )
    }

    return this.#resolverForStates(input, handler, handlerOnEmpty)
  }

  /**
   * @returns {Node[]}
   * @throws {Error}
   */
  getCreatedElements() {
    if (!this.#collectedElements[0]) {
      throw new Error('Missing data')
    }

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
   * A string when html is used as a function, or an array of
   * strings when used as template
   * @param {...*} keys
   * @returns {(Element | Node)[]}
   */
  html(strings, ...keys) {
    const elements = (
      keys.length === 0
      && this.#translator.translations.length === 0 // the faster method doesn't translate anything
    )
      ? this.#htmlForSimpleString(
        (Array.isArray(strings)) ? strings[0] ?? '' : strings
      )
      : this.#htmlForTemplateLiteral(
        (Array.isArray(strings)) ? strings : [strings], ...keys
      )

    for (const element of elements) {
      if (
        /*
         * Dummy tag (virtual mode) when simple string,
         * or text node when template literal.
         * In both cases the tag name is an empty string
         */
        // @ts-ignore
        element.tagName === ''
      ) {
        element.textContent = this.#translator.translate(element.textContent)
      }
    }

    return elements
  }

  /**
   * "IF" condition
   *
   * @param {boolean | StatementBindFn} condition
   * @param {Template
   *   | (function():(void | Template))
   * } handler
   * @param {Template
   *   | (function():(void | Template))
   * } [elseHandler]
   * @returns {Node[]}
   */
  if(condition, handler, elseHandler) {
    /**
     * If the condition is a value (true or false), the elements
     * are either created or not.
     *
     * If the condition is a function, two helper Comment
     * elements are created - one in the beginning and another
     * at the end.
     * All normal elements are placed in between.
     */

    /**
     * @param {any[]} data
     */
    const callbackForFunction = (data) => {
      const isTruthy = Boolean(data[0])

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

    return (typeof condition === 'function')
      ? this.#statementHandlerForFunctions(
        'if', [condition], true, callbackForFunction
      )
      : this.#statementHandlerSimple(condition, callbackForFunction)
  }

  /**
   * @returns {Promise<void>}
   */
  async render() {
    TemplateTreeClass.lastTemplateTreeToRender = this.#thisTree

    this.#collectedElements = [new ElementsCollector()] // Reset

    for (const template of this.#templates) {
      if (typeof template === 'function') {
        let result = template(this.#thisTree)

        if (result instanceof Promise) {
          result = await result
        }

        if (result && typeof result === 'string') {
          this.html(result)
        }
        else if (typeof result === 'function') {
          result(this.#thisTree)
        }
        else if (Array.isArray(result)) {
          let allComponents = true
          let allFunctions = true

          for (const value of result) {
            if (!(value instanceof Component)) {
              allComponents = false

              break
            }

            if (!(typeof value === 'function')) {
              allFunctions = false

              break
            }
          }

          if (allComponents) {
            for (const value of result) {
              if (!(value instanceof Component)) break

              this.#applyComponent(value, 0)
            }
          }
          else if (allFunctions) {
            for (const value of result) {
              if (!(typeof value === 'function')) break

              value(this.#thisTree)
            }
          }
        }
        else if (result instanceof Component) {
          this.#applyComponent(result, 0)
        }
      }
      else if (template instanceof Component) {
        this.#applyComponent(template, 0)
      }
    }

    this.#appendChildrenToContainer()
  }

  /**
   * @param {HTMLElement | Text} element
   * @param {any[]} children
   * @param {Function} fn
   * @returns {function(): void}
   */
  #createNestFunction(element, children, fn) {
    return () => {
      /**
       * @type {CallbackForFunction}
       */
      const callbackForFunction = (
        values,
        isInitialRun,
        commentBegin, // Should exist on the first run only
        commentEnd // Should exist on the first run only
      ) => {
        const value = values[0]

        if (
          typeof value === 'function'
          || value instanceof Component
        ) {
          if (isTemplate(value)) {
            value(this.#thisTree)

            if (isInitialRun) {
              const level = this.#collectedElements.length - 1

              const generatedElements
                // @ts-ignore
                = this.#collectedElements[level].getElements()

              addChildToStack(commentBegin, children)
              addChildrenToStack(generatedElements, children)
              addChildToStack(commentEnd, children)
            }
            else {
              children.length = 0 // maybe not necessary
            }
          }
          else {
            /** @type {Component} */
            const component = value
            const generatedChildren = this.#componentGetElements(component)

            if (isInitialRun) {
              addChildToStack(commentBegin, children)
              addChildrenToStack(generatedChildren[0] ?? [], children)
              addChildToStack(commentEnd, children)
            }
            else {
              this.#collectedElements[0]?.addElements(
                generatedChildren[0] ?? []
              )
            }
          }
        }
        else {
          if (isInitialRun && commentBegin) {
            unsubscribeElementAndItsChildren(commentBegin)
            this.#setPropertiesToElement(element, { textContent: value })
          }
        }
      }

      this.#statementHandlerForFunctions(
        'nest', [fn], true, callbackForFunction
      )
    }
  }

  /**
   * @returns {void}
   */
  #appendChildrenToContainer() {
    const containerElement = this.#containerElement

    if (containerElement) {
      appendChildrenToElement(containerElement, this.getCreatedElements())
    }
  }

  /**
   * @param {Component} component
   * @returns {Node[][]}
   */
  #componentGetElements(component) {
    const generatedChildren = (this.#isSr)
      ? component.useTranslations(this.#translator.translations).getElementsSr()
      : component.useTranslations(this.#translator.translations).getElements()

    return generatedChildren
  }

  /**
   * @param {Component} component
   * @param {number} [collectAtLevel]
   */
  #applyComponent(component, collectAtLevel = -1) {
    const generatedChildren = this.#componentGetElements(component)
    const level = (collectAtLevel < 0)
      ? this.#collectedElements.length - 1
      : collectAtLevel

    for (const childrenGroup of generatedChildren) {
      // @ts-ignore
      this.#collectedElements[level].addElements(childrenGroup)
    }
  }

  /**
   * @param {any} value
   * @returns {string}
   */
  #resolverBeforeIterationCallback(value) {
    return this.#translator.translate(value)
  }

  /**
   * @template T
   * @param {(T | function() : T) | State} input
   * @param {ForLoopCallback<T>} handler
   * @param {ForLoopCallbackOnEmpty} [handlerOnEmpty]
   * @returns {Node[] | Error}
   */
  #resolverForObjects(input, handler, handlerOnEmpty) {
    /**
     * @param {[State]} data
     */
    const callbackForFunction = (data) => {
      forEachLoop(
        this.#thisTree,
        1,
        data[0],
        handler,
        handlerOnEmpty,
        undefined,
        this.#resolverBeforeIterationCallback
      )
    }

    return this.#statementHandlerSimple(input, callbackForFunction)
  }

  /**
   * @template T
   * @param {(T | function() : T) | State} input
   * @param {ForLoopCallback<T>} handler
   * @param {ForLoopCallbackOnEmpty} [handlerOnEmpty]
   * @param {ObjectKey} [keyToRender]
   * @returns {Node[] | Error}
   */
  #resolverForStates(input, handler, handlerOnEmpty, keyToRender) {
    /** @type {Node[] | null} */
    let elementsOnEmpty = null

    if (!isState(input)) {
      return new Error('The input object must be a state')
    }

    /**
     * @type {CallbackForState}
     */
    const callbackForState = (
      state, elementsCollector, keyToRender, isArrayState = false
    ) => {
      /** @type {KeyToElements} */
      const keyToElements = isArrayState ? [] : {}

      /**
       * Initially there is 1 element - the forEach-begin
       * element. We want to start after this element.
       */
      let index = elementsCollector.getElements().length

      /**
       * @param {ObjectKey} key
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

        if (key === symEmptyHandlerElements) {
          if (elementsOnEmpty) {
            // Elements are rendered already, stop here
            return
          }

          // Save the elements, so then they can be removed
          elementsOnEmpty = elements
        }
        else {
          if (elementsOnEmpty) {
            for (const element of elementsOnEmpty) {
              unsubscribeElementAndItsChildren(element)
              // @ts-ignore
              element.remove()
            }

            elementsOnEmpty = null
          }
        }

        if (key === symEmptyHandlerElements) {
          Object.defineProperty(
            keyToElements,
            key,
            {
              value: elements,
              configurable: true,
              enumerable: false,
              writable: false
            }
          )
        }
        else {
          keyToElements[key] = elements
        }

        index = elementsFromCollector.length
      }

      forEachLoop(
        this.#thisTree,
        2,
        state,
        handler,
        handlerOnEmpty,
        keyToRender,
        this.#resolverBeforeIterationCallback,
        onIteration,
      )

      return keyToElements
    }

    return this.#statementHandlerForState(
      input,
      callbackForState,
      typeof handlerOnEmpty === 'function',
      keyToRender
    )
  }

  /**
   * Quicker version for the 'html' function that does not use
   * parsing, because the input is just a single string.
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
       * An element with no tag name is skipped in
       * the render stage.
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

    // @ts-ignore
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
   * @param {Comment} commentBegin
   * @param {Comment} commentEnd
   */
  #removeStatementElements(commentBegin, commentEnd) {
    /** @type {Comment | ChildNode | null} */
    let element = commentBegin.nextSibling

    while (element && element !== commentEnd) {
      // Delete all subscriptions for this element
      unsubscribeElementAndItsChildren(element)

      const elementToRemove = element

      element = element.nextSibling

      elementToRemove.remove() // Delete the element itself
    }
  }

  /**
   * @param {Comment} commentBegin
   * @param {Node[]} elements
   * @returns {boolean}
   * Returns false if there is no element after which to insert
   * the other elements, otherwise returns true
   */
  #insertStatementElements(commentBegin, elements) {
    if (!(this.#containerElement?.contains(commentBegin))) {
      return false
    }

    /** @type {Comment | Node} */
    let lastElement = commentBegin

    for (const newElement of elements) {
      insertAfter(newElement, lastElement)

      lastElement = newElement
    }

    return true
  }

  /**
   * @param {HTMLElement | Text} element
   * @param {(
   *   Object<
   *     string,
   *     (
   *       string
   *       | number
   *       | Object<*,*>
   *       | function(*) : *
   *       | BindFn
   *       | HTMLElement
   *     )
   *   >
   * )} properties
   * @param {Function} [callbackOnTemplate]
   */
  #setPropertiesToElement(element, properties, callbackOnTemplate) {
    for (const elementProp in properties) {
      let property = properties[elementProp]

      if (this.#isSr) {
        /*
         * When the property name is an event and the property
         * is a function, turn it into a string
         */
        if (isEventAttribute(elementProp) && typeof property === 'function') {
          setElementAttrOrProp(element, elementProp, property)

          continue
        }
      }
      else if (typeof property === 'function') {
        /*
         * If the property name is an event, for example onClick,
         * then the property is a function.
         * This function should not be immediately called to get
         * a value from it. Instead,  it should be added as a listener.
         */
        if (addEventListenerIfPossible(element, elementProp, property)) {
          continue
        }
      }

      if (typeof property === 'function') {
        /** @type {BindFn} */
        const bindFn = property

        setSuggestedItems(null, bindFn, element, elementProp, '', null)

        let value = bindFn(element)

        if (isTemplate(value) || value instanceof Component) {
          unsetSuggestedItems()

          if (callbackOnTemplate) {
            callbackOnTemplate()
          }

          continue
        }
        else if (typeof value === 'function') {
          /**
           * Remark "() => value"
           *
           * In forEach the value is provided as a function,
           * so it is not necessary to use it like this
           * () => value. However, when used like this,
           * the function returns a function. Resolve
           * the returned function here.
           */
          value = value()
        }
        else if (elementProp === 'textNode') {
          unsetSuggestedItems()

          const textNode = this.#document.createTextNode(value)

          element.appendChild(textNode)

          migrateSubscriptions(
            element,
            textNode,
            undefined,
            bindFn,
            { elementProp: 'textContent' }
          )

          continue
        }

        unsetSuggestedItems()

        value = isPrimitive(value)
          ? this.#translator.translate(value)
          : this.#translator.translateArray(value)

        if (elementProp) {
          setElementAttrOrProp(element, elementProp, value)
        }
      }
      else if (
        elementProp === 'style'
        && isObjectOrArray(property)
        // @ts-ignore
        && element instanceof this.#window.HTMLElement
      ) {
        // @ts-ignore
        this.#setStylesToElement(element, property)
      }
      else if (
        elementProp === 'data'
        && isObjectOrArray(property)
        // @ts-ignore
        && element instanceof this.#window.HTMLElement
      ) {
        // @ts-ignore
        setDataSetAttributesToElement(element, property)
      }
      else if (elementProp === 'textContent') {
        element[elementProp] = isPrimitive(property)
          ? this.#translator.translate(property)
          : this.#translator.translateArray(property)
      }
      else if (
        elementProp === 'innerText'
        || (
          elementProp === 'value'
          && (
            /*
             * Can't use HTMLInputElement here, because
             * it does not exist in SrDOM
             */
            // @ts-ignore
            element.tagName === 'INPUT'
            // @ts-ignore
            && (element.getAttribute('type') ?? '').toLowerCase() === 'button'
          )
        )
      ) {
        property = this.#translator.translate(property)
        setElementAttrOrProp(element, elementProp, property)
      }
      else {
        setElementAttrOrProp(element, elementProp, property)
      }
    }
  }

  /**
   * @param {HTMLElement} element
   * @param {(
   *   Object<
   *     keyof CSSStyleDeclaration,
   *     (string | BindFn)
   *   >
   * )} styleRules
   */
  #setStylesToElement(element, styleRules) {
    for (const ruleName in styleRules) {
      const ruleValue = styleRules[ruleName]
      let finalValue = ''

      if (typeof ruleValue === 'function') {
        const elementProp = 'style'
        const bindFn = ruleValue

        setSuggestedItems(
          null,
          bindFn,
          element,
          elementProp,
          ruleName,
          null
        )

        finalValue = bindFn(element)

        unsetSuggestedItems()
      }
      else {
        finalValue = ruleValue
      }

      if (typeof ruleName === 'string') {
        setElementStyleRule(element, ruleName, finalValue)
      }
    }
  }

  /**
   * @param {any} data
   * @param {function(any): void} callback
   * @returns {Node[]}
   */
  #statementHandlerSimple(data, callback) {
    const { thisLevel, upperLevel } = this.#beforeStatement()

    callback([data])

    return this.#afterStatement({ thisLevel, upperLevel })
  }

  #statementHandlerForTemplate(template, children) {
    const { thisLevel, upperLevel } = this.#beforeStatement()

    template(this.#thisTree)

    const generatedElements
      = (this.#collectedElements[thisLevel]?.getElements()) ?? []

    addChildrenToStack(generatedElements, children)

    this.#afterStatement({ thisLevel, upperLevel })
  }

  /**
   * @param {'if' | 'for' | 'nest'} type
   * @param {((function(): any) | any)[]} bindFns
   * @param {boolean} autoAddCommentElements
   * @param {function(
   *   any[],
   *   boolean,
   *   Comment | null,
   *   Comment | null
   * ): void} callbackForFunction
   * @returns {Node[]}
   */
  #statementHandlerForFunctions(
    type,
    bindFns,
    autoAddCommentElements,
    callbackForFunction
  ) {
    const { thisLevel, upperLevel } = this.#beforeStatement()

    /**
     * An array, containing a result for each bind function.
     *
     * @type {any[]}
     */
    const results = new Array(bindFns.length)

    // Is there any bind function at all?
    let isFunction = false

    for (const bindFn of bindFns) {
      if (typeof bindFn === 'function') {
        isFunction = true

        break
      }
    }

    if (isFunction) {
      const commentBegin = this.#document.createComment(`${type}-begin`)
      const commentEnd = this.#document.createComment(`${type}-end`)

      if (autoAddCommentElements) {
        // @ts-ignore
        this.#collectedElements[thisLevel].addElement(commentBegin)
      }

      /**
       * @type {() => void}
       */
      const repaintFnHelper = () => {
        if (this.#isSr) {
          return
        }

        const level = this.#collectedElements.length - 1

        // Clean all contents

        // @ts-ignore
        this.#collectedElements[level].removeAllElements()
        this.#removeStatementElements(commentBegin, commentEnd)

        // Create the new elements
        callbackForFunction(results, false, null, null)

        const success = this.#insertStatementElements(
          commentBegin,
          // @ts-ignore
          this.#collectedElements[level].getElements()
        )

        if (!success) {
          console.error('Element ', commentBegin, ' does not exist anymore')
        }
      }

      const element = commentBegin
      const elementProp = EnumSystemProps[type] ?? ''

      for (let key = 0; key < results.length; key++) {
        const bindFn = bindFns[key]

        if (typeof bindFn === 'function') {
          const repaintFn = (result) => {
            results[key] = result
            repaintFnHelper()
          }

          setSuggestedItems(
            null,
            bindFn,
            element,
            elementProp,
            '',
            repaintFn
          )

          results[key] = bindFn()

          unsetSuggestedItems()
        }
        else {
          results[key] = bindFns[key]
        }
      }

      // Run the handler function
      callbackForFunction(
        results, true, commentBegin, commentEnd
      )

      if (autoAddCommentElements) {
        // @ts-ignore
        this.#collectedElements[thisLevel].addElement(commentEnd)
      }
    }
    else {
      // Run the handler function directly
      callbackForFunction(bindFns, false, null, null)
    }

    return this.#afterStatement({ thisLevel, upperLevel })
  }

  /**
   * @param {any} state
   * @param {CallbackForState} callbackForState
   * @param {boolean} hasHandlerOnEmpty
   * @param {ObjectKey} [keyToRender]
   * @returns {Node[]}
   * @throws {Error}
   */
  #statementHandlerForState(
    state, callbackForState, hasHandlerOnEmpty, keyToRender
  ) {
    const { thisLevel, upperLevel } = this.#beforeStatement()

    const commentBegin = this.#document.createComment('reactive-begin')
    /**
     * Use the 'end' comment element as a storage for the rendered elements.
     * It's easier this way, and if the element is being deleted along with
     * the rendered elements, no references to these elements remains.
     *
     * @type {Comment}
     */
    const commentEnd = this.#document.createComment('reactive-end')
    const thisLevelCollectedElements = this.#collectedElements[thisLevel]

    if (!thisLevelCollectedElements) {
      throw new Error(`There are no collected elements at level ${thisLevel}`)
    }

    thisLevelCollectedElements.addElement(commentBegin)

    const repaintor = new Repaintor(
      this.#isSr,
      this.#collectedElements,
      commentBegin,
      commentEnd,
      callbackForState,
      keyToRender,
      hasHandlerOnEmpty
    )

    /**
     * @type {RepaintFnForState}
     */
    const repaintFn = (...args) => {
      repaintor.repaint(...args)
    }

    const elementProp = EnumSystemProps.reactive
    const bindFn = () => state

    setSuggestedItems(
      state,
      bindFn,
      commentEnd,
      elementProp,
      '',
      repaintFn
    )

    // In this callback the 'for' loop is called
    const isArrayState = Array.isArray(state)
    const added = callbackForState(
      state, thisLevelCollectedElements, undefined, isArrayState
    )

    /*
     * Key "symEmptyHandlerElements" keeps the DOM elements
     * from the OnEmpty handler, if it's used. We don't
     * need them here.
     *
     * Note: When an array has a Symbol key, it doesn't affect its .length
     */
    if (Object.hasOwn(added, symEmptyHandlerElements)) {
      delete added[symEmptyHandlerElements]
    }

    repaintor.mapKeyToElements.set(commentEnd, added)

    unsetSuggestedItems()

    thisLevelCollectedElements.addElement(commentEnd)

    return this.#afterStatement({ thisLevel, upperLevel })
  }

  /**
   * @param {(function():(void | Template)) | Template | Component} handler
   */
  #statementHandlerResolver(handler) {
    // 1) Function
    if (typeof handler === 'function') {
      // 2.1) Template Function
      if (isTemplate(handler)) {
        handler(this.#thisTree)

        return
      }

      // 2.2) Normal Function, returning Component or Template
      const result = handler(this.#thisTree)

      // @ts-ignore: We can throw any type to this function, because it checks
      // the input anyway, and returns nothing if the input is wrong type
      this.#statementHandlerResolver(result)

      return
    }

    // 2) Component
    // Notes: Checking for instanceof is much slower than any typeof
    if (handler instanceof Component) {
      this.#applyComponent(handler)
    }
  }

  /**
   * Prepare the levels to be used in IF or FOR loop,
   * and return them.
   * This method must be called in the IF or FOR loop,
   * before calling the handler.
   *
   * @returns {{thisLevel : number, upperLevel : number}}
   */
  #beforeStatement() {
    // Create a new level for collecting
    this.#collectedElements.push(new ElementsCollector())

    const thisLevel = this.#collectedElements.length - 1
    const upperLevel = thisLevel - 1

    return { thisLevel, upperLevel }
  }

  /**
   * This method should be called in the IF or FOR loop after
   * calling the handler.
   *
   * @param {object} input
   * @param {number} input.thisLevel
   * @param {number} input.upperLevel
   * @returns {Node[]}
   * @throws {Error}
   */
  #afterStatement({ thisLevel, upperLevel }) {
    const thisLevelCollector = this.#collectedElements[thisLevel]
    const upperLevelCollector = this.#collectedElements[upperLevel]

    if (
      !(thisLevelCollector instanceof ElementsCollector)
      || !(upperLevelCollector instanceof ElementsCollector)
    ) {
      throw new Error('Missing data')
    }

    /*
     * Save what will be returned, because
     * the array will be cleared
     */
    const elements = thisLevelCollector.getElements() ?? []

    /*
     * Move everything collected at this
     * level to the upper level...
     */
    upperLevelCollector.importElements(thisLevelCollector)

    // ... and clean this level
    thisLevelCollector.replaceElements([]) // to keep reference
    delete this.#collectedElements[thisLevel]
    this.#collectedElements.pop()

    return elements
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

const { prototype } = TemplateTreeClass

// prototype.createElement.bindArgs = bindArgs
Object.assign(prototype.createElement, { bindArgs })

HTML_TAGS.forEach((tagName) => {
  // @ts-ignore
  prototype[tagName] = prototype.createElement.bindArgs(tagName)
})

export { TemplateTreeClass }
