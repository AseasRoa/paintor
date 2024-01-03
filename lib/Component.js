/* eslint-disable max-classes-per-file */

import { ElementsCreator } from './ElementsCreator.js'
import {
  isBrowserEnvironment,
  isValidCustomElementName,
  selectorEndsWithId,
} from './functions.js'
import { Window as SrWindow } from './SrDOM/Window.js'
import { state } from './state.js'
import { removeAllSubscriptions } from './StateProxySubscriptions.js'
import { Translator } from './Translator.js'


const isBrowserEnv = isBrowserEnvironment()
const srWindow = new SrWindow()

class Component {
  state = null

  /**
   * The main element in which to append all the contents
   *
   * @type {(Node | Element | HTMLElement)[]}
   */
  #containerDOMElements = []

  /** @type {Node[][]} */
  #finalElements = []

  /**
   * In server mode this will hold the final WebApi code
   *
   * @type {string}
   */
  #finalHtmlCode = ''

  /** @type {boolean} */
  #isStatic = false

  /** @type {boolean} */
  #renderCustomElements = false

  /** @type {string} */
  #selector = ''

  /** @type {string} */
  #selectorNonId = ''

  /** @type {Map<Translation | null, Node[][]>} */
  #staticFinalElements = new Map()

  /** @type {Map<Translation | null, string>} */
  #staticHtmlCodes = new Map()

  /** @type {(Template | Component)[]} */
  #templates = []

  /** @type {Translator} */
  #translator = new Translator()

  /**
   * @type {boolean}
   */
  #initialized = false

  /**
   * Clear the elements created by this Component
   */
  clear() {
    for (const elements of this.#finalElements) {
      for (const element of elements) {
        removeAllSubscriptions(element)
        // @ts-ignore
        element.remove()
      }
    }

    this.#finalElements.length = 0
    this.#finalHtmlCode = ''

    this.#staticFinalElements.clear()
    this.#staticHtmlCodes.clear()
  }

  /**
   * @returns {Node[][]}
   */
  getElements() {
    if (this.#isStatic) {
      return this.#getElementsAsStatic(null)
    }

    this.#render(null, window, true)

    return this.#finalElements
  }

  /**
   * @returns {Node[][]}
   */
  getElementsSr() {
    if (this.#isStatic) {
      return this.#getElementsAsStatic('')
    }

    const window = this.#getSrWindow()

    this.#render('', window, true)

    return this.#finalElements
  }

  /**
   * Renders the components into an HTML code and returns it
   *
   * @param {object} [options]
   * @param {string} [options.indent]
   * @returns {string}
   */
  html(options) {
    if (this.#isStatic) {
      return this.staticHtml(options)
    }

    const window = this.#getSrWindow()

    this.#render('', window, true, options)

    return this.#finalHtmlCode
  }

  /**
   * @param {string | HTMLElement | HTMLElement[] | HTMLCollection} container
   * @returns {void}
   */
  paint(container) {
    if (!isBrowserEnv) {
      throw new Error('You can only use this function in browser environment')
    }

    if (!container) {
      throw new Error('No container selected.')
    }

    if (
      typeof container !== 'string'
      && !(container instanceof HTMLElement)
      && !(container instanceof NodeList)
      && !(container instanceof Array)
      && !(container instanceof HTMLCollection)
    ) {
      throw new Error(
        'Wrong type for the container element. '
        + 'Expected <string> or <Node>, '
        + `got <${typeof container}>`,
      )
    }

    this.#render(container, window, true)
  }

  /**
   * @param {boolean} [on]
   * @returns {Component}
   */
  static(on = true) {
    this.#isStatic = on

    return this
  }

  /**
   * @param {object} [options]
   * @param {string} [options.indent]
   * @returns {string}
   */
  staticHtml(options) {
    const key = this.#translator.translations[0] ?? null

    if (!this.#staticHtmlCodes.has(key)) {
      const window = this.#getSrWindow()

      this.#render('', window, true, options)
      this.#staticHtmlCodes.set(
        key,
        this.#finalHtmlCode,
      )
    }

    return this.#staticHtmlCodes.get(key) ?? ''
  }

  /**
   * @param {TemplateTree} tree
   * @returns {void
   *   | string
   *   | HTMLElement | HTMLElement[]
   *   | Component | Component[]
   *   | Template | Template[]
   * }
   */
  template(tree) {
  }

  /**
   * @param {...(Template | Template[] | Component | Component[])} from
   * @returns {Component}
   */
  useTemplates(...from) {
    if (from instanceof Array) {
      for (const item of from) {
        if (item instanceof Array) {
          for (const template of item) {
            this.#templates.push(template)
          }
        }
        else {
          this.#templates.push(item)
        }
      }
    }

    return this
  }

  /**
   * @param {...Translation} translations
   * @returns {Component}
   */
  useTranslations(...translations) {
    this.#translator.useTranslations(...translations)

    return this
  }

  /**
   * Clear contents of the container element
   */
  #clearContainerElements() {
    if (this.#containerDOMElements) {
      for (const el of this.#containerDOMElements) {
        while (el?.firstChild) {
          el.removeChild(el.firstChild)
        }
      }
    }
  }

  /**
   * Clear the elements created by this Component, but only
   * for particular container
   *
   * @param {Node} containerElement
   */
  #clearForContainer(containerElement) {
    let indexFound = -1
    let i = -1

    for (const container of this.#containerDOMElements) {
      i += 1

      if (containerElement === container) {
        indexFound = i
      }
    }

    if (indexFound === -1) {
      return
    }

    delete this.#containerDOMElements[indexFound]

    for (const element of this.#finalElements[indexFound] ?? []) {
      removeAllSubscriptions(element)
      // @ts-ignore
      element.remove()
    }

    delete this.#finalElements[indexFound]
    this.#finalHtmlCode = ''

    for (const [translation, elements] of this.#staticFinalElements) {
      delete elements[indexFound]
    }

    this.#staticHtmlCodes.clear()
  }

  /**
   * @param {string | null} container
   * @returns {Node[][]}
   */
  #getElementsAsStatic(container) {
    const key = this.#translator.translations[0] ?? null

    if (!this.#staticFinalElements.has(key)) {
      const window = this.#getSrWindow()

      this.#render(container, window, true)
      this.#staticFinalElements.set(key, this.#finalElements,)
    }

    return this.#staticFinalElements.get(key) ?? []
  }

  /**
   * This method is for tricking TS that the string-rendering DOM's Window
   * has the same type of the browser DOM's window
   *
   * @returns {Window}
   */
  #getSrWindow() {
    // @ts-ignore
    return srWindow
  }

  /**
   * @param {(
   * string | HTMLElement | HTMLElement[] | HTMLCollection | null
   * )} container
   * @param {Window} window
   * @param {(Template | Component)[]} templates
   * @throws {Error}
   */
  #init(container, window, templates) {
    if (this.#initialized) return

    this.#initialized = true

    this.#finalElements.length = 0
    this.#finalHtmlCode = ''

    this.#initContainer(container, window)
    this.#initTemplates(templates)
  }

  /**
   * @param {(
   * string | HTMLElement| HTMLElement[] | HTMLCollection | null
   * )} container
   * @param {Window} window
   * @returns {boolean}
   */
  #initContainer(container, window) {
    const isSr = window.document.baseURI === ''

    if (typeof container === 'string') {
      this.#selector = container
      this.#renderCustomElements = false

      if (isValidCustomElementName(container)) {
        this.#renderCustomElements = true
      }
      else {
        if (!selectorEndsWithId(container)) {
          this.#selectorNonId = container
        }

        const nodeList = (isSr)
          ? [window.document.createElement('#container')]
          : window.document.querySelectorAll(container)

        this.#containerDOMElements = Array.from(nodeList)

        if (!this.#containerDOMElements) {
          throw new Error(`Could not find an element by the following query: ${container}`)
        }
      }
    }
    else if (container instanceof HTMLElement) {
      this.#containerDOMElements = [container]
    }
    else if (
      container instanceof NodeList
      || container instanceof HTMLCollection
    ) {
      this.#containerDOMElements = Array.from(container)
    }
    else if (container instanceof Array) {
      for (const element of container) {
        if (!(element instanceof HTMLElement)) {
          throw new Error('All elements in the input array must be DOM elements')
        }
      }

      this.#containerDOMElements = container
    }

    return true
  }

  /**
   * @param {(Template | Component)[]} templates
   * @returns {boolean}
   * @throws {Error}
   */
  #initTemplates(templates) {
    if (this.template instanceof Function) {
      this.state = (this.state)
        ? state(this.state)
        : this.state

      this.#templates.push(this.template.bind(this))
    }

    for (const template of templates) {
      if (
        !(template instanceof Function)
        && !(template instanceof Component)
      ) {
        throw new Error('The template must be a function')
      }
    }

    return true
  }

  /**
   * @param {(
   *   string | HTMLElement | HTMLElement[] | HTMLCollection | null
   * )} container
   * @param {Window} window
   * @param {boolean} clearContainers
   * @param {object} [htmlOptions]
   * @param {string} [htmlOptions.indent]
   * @throws {Error}
   */
  #render(container, window, clearContainers = true, htmlOptions = {}) {
    this.#init(container, window, this.#templates)

    if (clearContainers) {
      this.#clearContainerElements()
    }

    const templates = this.#templates

    if (!window) {
      throw new Error('Missing window element')
    }

    if (this.#renderCustomElements) {
      // Custom Elements

      // Already defined?
      if (customElements.get(this.#selector)) {
        // Re-render all custom element
        const customElements = document.getElementsByTagName(this.#selector)

        for (const customElement of customElements) {
          this.#renderElements(
            window, customElement.shadowRoot, templates, htmlOptions
          )
        }

        return
      }

      /**
       * @param {Component} component
       * @returns {CustomElementConstructor}
       */
      const getCustomElementConstructor = (component) => {
        return class extends HTMLElement {
          constructor() {
            super()
            this.attachShadow({ mode: 'open' })
          }

          connectedCallback() {
            if (!this.shadowRoot) {
              throw new Error('Missing shadow root')
            }

            component.#renderElements(
              window, this.shadowRoot, templates, htmlOptions
            )
          }

          disconnectedCallback() {
            component.clear()
          }
        }
      }

      customElements.define(
        this.#selector,
        getCustomElementConstructor(this),
      )
    }
    else {
      // DOM or SrDOM

      if (this.#selectorNonId) {
        const domObserver = new MutationObserver((mutationList) => {
          for (const mutation of mutationList) {
            const { addedNodes, removedNodes } = mutation

            for (const node of addedNodes) {
              // we track only elements, skip other nodes (e.g. text nodes)
              if (!(node instanceof HTMLElement)) continue

              // check the inserted element for being a code snippet
              if (node.matches(this.#selectorNonId)) {
                this.#renderElements(window, node, templates, htmlOptions)
              }
            }

            for (const node of removedNodes) {
              this.#clearForContainer(node)
            }
          }
        })

        domObserver.observe(
          document.body,
          {
            attributes: false,
            childList: true,
            characterData: false,
            subtree: true
          },
        )
      }

      if (this.#containerDOMElements.length === 0) {
        this.#renderElements(window, null, templates, htmlOptions)
      }
      else {
        for (const containerElement of this.#containerDOMElements) {
          // @ts-ignore
          this.#renderElements(window, containerElement, templates, htmlOptions)
        }
      }
    }
  }

  /**
   * @param {Window} window
   * @param {Element | ShadowRoot | null} container
   * @param {(Template | Component)[]} templates
   * @param {object} [htmlOptions]
   * @param {string} [htmlOptions.indent]
   * @throws {Error}
   */
  #renderElements(window, container, templates, htmlOptions = {}) {
    const creator = new ElementsCreator(
      window, container, templates, this.#translator,
    )
    creator.render()

    this.#finalHtmlCode = creator.getHtmlCode(htmlOptions)
    this.#finalElements.push(creator.getCreatedElements())
  }
}

export { Component }
