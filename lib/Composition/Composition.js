import {
  isBrowserEnv,
  isValidCustomElementName,
  selectorEndsWithId
} from '../common/functions/dom.js'
import { Component } from '../Component/Component.js'
import { css, template } from '../export/component.js'
import { Window as SrWindow } from '../SrDOM/index.js'
import { state } from '../state/state.js'
import { unsubscribe } from '../state/stateSubs.js'
import { ifUndefinedGetQueuedTemplate } from '../TemplateRenderer/functions.js'
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

    this.#render(null, globalThis, true)

    return this.#finalElements
  }

  /**
   * @returns {Set<Node>[]}
   */
  getElementsSr() {
    if (this.#isStatic) {
      return this.#getElementsAsStatic('')
    }

    const global = this.#getSrWindow()

    this.#render('', global, true)

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

    const global = this.#getSrWindow()

    this.#render('', global, true, options)

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

    this.#render(container, globalThis, true)
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
      const global = this.#getSrWindow()

      this.#render('', global, true, options)
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
        // oxlint-disable-next-line no-unmodified-loop-condition
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
      const global = this.#getSrWindow()

      this.#render(container, global, true)
      this.#staticFinalElements.set(key, this.#finalElements,)
    }

    return this.#staticFinalElements.get(key) ?? []
  }

  /**
   * This method is for tricking TS that the string-rendering DOM's Window
   * has the same type of the browser DOM's window
   *
   * @returns {typeof globalThis}
   */
  #getSrWindow() {
    // @ts-expect-error
    return srWindow
  }

  /**
   * @param {(
   * string | HTMLElement | HTMLElement[] | HTMLCollection | null
   * )} container
   * @param {typeof globalThis} global
   * @throws {Error}
   */
  #init(container, global) {
    if (this.#initialized) return

    this.#initialized = true

    this.#finalElements.length = 0
    this.#finalHtmlCode = ''

    this.#initContainer(container, global)
    this.#initComposables()
  }

  /**
   * @param {(
   * string | HTMLElement| HTMLElement[] | HTMLCollection | null
   * )} container
   * @param {typeof globalThis} global
   * @returns {boolean}
   * @throws {Error}
   */
  #initContainer(container, global) {
    const isSr = global.document.baseURI === ''

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
          ? [global.document.createElement('#container')]
          : global.document.querySelectorAll(container)

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
    for (let i = this.#composables.length - 1; i >= 0; i--) {
      const composable = this.#composables[i]

      if (composable instanceof Component) {
        this.#composables[i] = this.#convertClassToFunctionComponent(composable)
      }

      // @ts-expect-error
      this.#composables[i] = ifUndefinedGetQueuedTemplate(this.#composables[i])

      if (!(typeof this.#composables[i] === 'function')) {
        throw new Error('The component must have a template')
      }
    }

    return true
  }

  /**
   * @param {Component} classComponent
   * @returns {Template}
   * @throws {TypeError}
   */
  #convertClassToFunctionComponent(classComponent) {
    if (classComponent instanceof Component) {
      if (!(typeof classComponent.template === 'function')) {
        throw new TypeError(
          `Class component ${
            classComponent.constructor.name
          } must have a template that is a method`
        )
      }

      const boundTemplate = classComponent.template.bind(classComponent)

      classComponent.state = (classComponent.state)
        ? state(classComponent.state)
        : classComponent.state

      if (classComponent.css) {
        let sheet = classComponent.css.apply(classComponent) ?? ''

        if (!(typeof sheet === 'string')) {
          throw new TypeError(
            `Class component ${
              classComponent.constructor.name
            } must return string in its css() method`
          )
        }

        sheet = sheet.trim()

        if (sheet) css(sheet)
      }

      if (classComponent.onMount) {
        boundTemplate['onMount']
          = classComponent.onMount.bind(classComponent)
      }

      return template(boundTemplate)
    }

    return template(() => {}) // never reached
  }

  /**
   * @param {(
   *   string | HTMLElement | HTMLElement[] | HTMLCollection | null
   * )} container
   * @param {typeof globalThis} global
   * @param {boolean} clearContainers
   * @param {object} [htmlOptions]
   * @param {string} [htmlOptions.indent]
   * @throws {Error}
   */
  #render(container, global, clearContainers = true, htmlOptions = {}) {
    this.#init(container, global)

    if (clearContainers) {
      this.#clearContainerElements()
    }

    const composables = this.#composables

    if (!global) {
      throw new Error('Missing window element')
    }

    if (this.#renderCustomElements) {
      // Already defined?
      if (customElements.get(this.#selector)) {
        // Re-render all custom element
        const customElements = document.getElementsByTagName(this.#selector)

        for (const customElement of customElements) {
          this.#renderElements(
            global, customElement.shadowRoot, composables, htmlOptions
          )
        }

        return
      }

      /**
       * @param {Composition} composition
       * @returns {CustomElementConstructor}
       */
      const getCustomElementConstructor = (composition) => {
        // oxlint-disable-next-line max-classes-per-file
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
              global, this.shadowRoot, composables, htmlOptions
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
                this.#renderElements(global, node, composables, htmlOptions)
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
        this.#renderElements(global, null, composables, htmlOptions)
      }
      else {
        for (const containerElement of this.#containerDOMElements) {
          this.#renderElements(
            global,
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
   * @param {typeof globalThis} global
   * @param {Element | ShadowRoot | null} container
   * @param {Composable[]} composables
   * @param {object} [htmlOptions]
   * @param {string} [htmlOptions.indent]
   * @returns {void}
   * @throws {Error}
   */
  #renderElements(global, container, composables, htmlOptions = {}) {
    const treeRenderer = new TemplateRenderer(
      global, container, composables, this.#translator,
    )

    treeRenderer.render().then(() => undefined)

    this.#finalHtmlCode = treeRenderer.getHtmlCode(htmlOptions)
    this.#finalElements.push(treeRenderer.getCreatedElements())
  }
}
