/* eslint-disable max-classes-per-file */

import { ClassComponent } from '../ClassComponent/ClassComponent.js'
import {
  isBrowserEnv,
  isValidCustomElementName,
  selectorEndsWithId
} from '../common/functions/dom.js'
import { template } from '../export/template.js'
import { Window as SrWindow } from '../SrDOM/index.js'
import { state } from '../state/state.js'
import { unsubscribe } from '../state/stateSubs.js'
import { TemplateRenderer } from '../TemplateRenderer/TemplateRenderer.js'
import { Translator } from '../Translator/Translator.js'

const srWindow = new SrWindow()

export class Composition {
  /**
   * The main element in which to append all the contents
   *
   * @type {(Node | Element | HTMLElement)[]}
   */
  #containerDOMElements = []

  /** @type {Set<Node>[]} */
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

  /** @type {Map<Translation | null, Set<Node>[]>} */
  #staticFinalElements = new Map()

  /** @type {Map<Translation | null, string>} */
  #staticHtmlCodes = new Map()

  /** @type {Composable[]} */
  #composables = []

  /** @type {Translator} */
  #translator = new Translator()

  /**
   * @type {boolean}
   */
  #initialized = false

  /**
   * Clear the elements created by this Composition
   *
   * @returns {void}
   */
  clear() {
    for (const elements of this.#finalElements) {
      for (const element of elements) {
        unsubscribe(element)
        // @ts-expect-error
        element.remove()
      }
    }

    this.#finalElements.length = 0
    this.#finalHtmlCode = ''

    this.#staticFinalElements.clear()
    this.#staticHtmlCodes.clear()
  }

  /**
   * @returns {Set<Node>[]}
   */
  getElements() {
    if (this.#isStatic) {
      return this.#getElementsAsStatic(null)
    }

    this.#render(null, window, true)

    return this.#finalElements
  }

  /**
   * @returns {Set<Node>[]}
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
   * Renders the composition into an HTML code and returns it
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
   * @throws {Error}
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
      && !(Array.isArray(container))
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
   * @returns {Composition}
   */
  static(on = true) {
    this.#isStatic = Boolean(on)

    if (!on && this.#staticHtmlCodes.size > 0) {
      this.#staticHtmlCodes.clear()
    }

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
   * @param {...Composable} from
   * @returns {void}
   */
  useComposables(...from) {
    if (Array.isArray(from)) {
      for (const item of from) {
        if (Array.isArray(item)) {
          for (const composable of item) {
            this.#composables.push(composable)
          }
        }
        else {
          this.#composables.push(item)
        }
      }
    }
  }

  /**
   * @param {...Translation} translations
   * @returns {Composition}
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
   * Clear the elements created by this Composition, but only
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
      unsubscribe(element)
      // @ts-expect-error
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
   * @returns {Set<Node>[]}
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
    // @ts-expect-error
    return srWindow
  }

  /**
   * @param {(
   * string | HTMLElement | HTMLElement[] | HTMLCollection | null
   * )} container
   * @param {Window} window
   * @throws {Error}
   */
  #init(container, window) {
    if (this.#initialized) return

    this.#initialized = true

    this.#finalElements.length = 0
    this.#finalHtmlCode = ''

    this.#initContainer(container, window)
    this.#initComposables()
  }

  /**
   * @param {(
   * string | HTMLElement| HTMLElement[] | HTMLCollection | null
   * )} container
   * @param {Window} window
   * @returns {boolean}
   * @throws {Error}
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
    else if (Array.isArray(container)) {
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
   * @returns {boolean}
   * @throws {Error}
   */
  #initComposables() {
    for (let i = 0; i < this.#composables.length; i++) {
      const composable = this.#composables[i]

      if (composable instanceof ClassComponent) {
        this.#composables[i] = this.#convertClassToFunctionComponent(composable)
      }

      if (!(typeof this.#composables[i] === 'function')) {
        throw new Error('The template must be a function')
      }
    }

    return true
  }

  /**
   * @param {ClassComponent} classComponent
   * @returns {Template}
   * @throws {TypeError}
   */
  #convertClassToFunctionComponent(classComponent) {
    if (classComponent instanceof ClassComponent) {
      if (!(typeof classComponent.template === 'function')) {
        throw new TypeError(
          `Class component ${
            classComponent.constructor.name
          } must have a template that is a method`
        )
      }

      classComponent.state = (classComponent.state)
        ? state(classComponent.state)
        : classComponent.state

      return template(classComponent.template.bind(classComponent))
    }

    return template(() => {}) // never reached
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
    this.#init(container, window)

    if (clearContainers) {
      this.#clearContainerElements()
    }

    const composables = this.#composables

    if (!window) {
      throw new Error('Missing window element')
    }

    if (this.#renderCustomElements) {
      // Already defined?
      if (customElements.get(this.#selector)) {
        // Re-render all custom element
        const customElements = document.getElementsByTagName(this.#selector)

        for (const customElement of customElements) {
          this.#renderElements(
            window, customElement.shadowRoot, composables, htmlOptions
          )
        }

        return
      }

      /**
       * @param {Composition} composition
       * @returns {CustomElementConstructor}
       */
      const getCustomElementConstructor = (composition) => {
        return class extends HTMLElement {
          constructor() {
            super()
            this.attachShadow({ mode: 'open' })
          }

          connectedCallback() {
            if (!this.shadowRoot) {
              throw new Error('Missing shadow root')
            }

            composition.#renderElements(
              window, this.shadowRoot, composables, htmlOptions
            )
          }

          disconnectedCallback() {
            composition.clear()
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
                this.#renderElements(window, node, composables, htmlOptions)
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
        this.#renderElements(window, null, composables, htmlOptions)
      }
      else {
        for (const containerElement of this.#containerDOMElements) {
          this.#renderElements(
            window,
            // @ts-expect-error
            containerElement,
            composables,
            htmlOptions
          )
        }
      }
    }
  }

  /**
   * @param {Window} window
   * @param {Element | ShadowRoot | null} container
   * @param {Composable[]} composables
   * @param {object} [htmlOptions]
   * @param {string} [htmlOptions.indent]
   * @returns {void}
   * @throws {Error}
   */
  #renderElements(window, container, composables, htmlOptions = {}) {
    const treeRenderer = new TemplateRenderer(
      window, container, composables, this.#translator,
    )

    treeRenderer.render().then(() => undefined)

    this.#finalHtmlCode = treeRenderer.getHtmlCode(htmlOptions)
    this.#finalElements.push(treeRenderer.getCreatedElements())
  }
}
