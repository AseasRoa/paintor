import { ElementsCreator } from './ElementsCreator.js'
import {
  appendChildrenToElement,
  isBrowserEnvironment,
  isValidCustomElementName,
} from './functions.js'
import { Window as SrWindow } from './SrDOM/Window.js'

const isBrowserEnv = isBrowserEnvironment()
const srWindow = new SrWindow()

class Component {
  /** @type {string} */
  #containerCustomElementName = ''

  /**
   * The main element in which to append all the contents
   *
   * @type {HTMLElement[] | HTMLCollection}
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

  /** @type {(Template | Component)[]} */
  #templates = []

  /** @type {Map<Translation | null, string>} */
  #staticHtmlCodes = new Map()

  /** @type {Translation[]} */
  #translations = []

  /**
   * @param {string | HTMLElement} container
   * @returns {void}
   */
  appendTo(container) {
    if (!isBrowserEnv) {
      throw new Error('You can only do this in browser environment')
    }

    this.#render(container, window, false)
  }

  /**
   * @param {(Template | Component)[]} templates
   * @returns {Component}
   */
  compose(...templates) {
    if (templates instanceof Array) {
      for (const item of templates) {
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

  getElements() {
    this.#render(null, window, true)

    return this.#finalElements
  }

  /**
   * @param {object} [options]
   * @param {string} [options.indent='']
   * @returns {string}
   */
  getHtml(options) {
    if (this.#isStatic) {
      return this.getStaticHtml(options)
    }

    const window = this.#getSrWindow()

    this.#render('', window, true, options)

    return this.#finalHtmlCode
  }

  /**
   * @param {object} [options]
   * @param {string} [options.indent='']
   * @returns {string}
   */
  getStaticHtml(options) {
    const key = this.#translations[0] ?? null

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

  getElementsSr() {
    const window = this.#getSrWindow()

    this.#render('', window, true)

    return this.#finalElements
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
   * @param {boolean} [on=true]
   * @returns {Component}
   */
  static(on = true) {
    this.#isStatic = on

    return this
  }

  /**
   * @param {...Translation} translations
   * @returns {Component}
   */
  useTranslations(...translations) {
    // Reset translations here, because the whole api chain (containing this function)
    // can be executed multiple times, but with different translations every time.
    // EDIT: Commented out, so that translations can be used in Components
    // this.#translations = []

    translations.map((item) => {
      if (item instanceof Array) {
        item.forEach((subItem) => {
          if (!this.#translations.includes(subItem)) {
            this.#translations = [...this.#translations, subItem]
          }
        })
      }
      else if (item instanceof Object) {
        if (!this.#translations.includes(item)) {
          this.#translations = [...this.#translations, item]
        }
      }
    })

    return this
  }

  /**
   * Clear contents of the container element
   */
  #clearContainerElements() {
    if (this.#containerDOMElements
      && Symbol.iterator in this.#containerDOMElements
    ) {
      for (const el of this.#containerDOMElements) {
        while (el?.firstChild) {
          el.removeChild(el.firstChild)
        }
      }
    }
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
   * @param {string | HTMLElement | HTMLElement[] | HTMLCollection | null} container
   * @param {Window} window
   * @param {Translation[]} translations
   * @param {(Template | Component)[]} templates
   * @returns {boolean}
   * @throws {Error}
   */
  #init(container, window, translations, templates) {
    this.#finalElements = []
    this.#finalHtmlCode = ''

    this.#initContainer(container, window)
    this.#initTranslations(translations)
    this.#initTemplates(templates)

    return true
  }

  /**
   * @param {string | HTMLElement| HTMLElement[] | HTMLCollection | null} container
   * @param {Window} window
   * @returns {boolean}
   */
  #initContainer(container, window) {
    const isSr = window.document.baseURI === ''

    if (typeof container === 'string') {
      if (isValidCustomElementName(container)) {
        this.#containerCustomElementName = container
      }
      else {
        // @ts-ignore
        this.#containerDOMElements = (isSr)
          ? [window.document.createElement('#container')]
          : window.document.querySelectorAll(container)

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
      this.#containerDOMElements = container
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
    for (let template of templates) {
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
   * @param {Translation[]} translations
   * @returns {boolean}
   * @throws {Error}
   */
  #initTranslations(translations) {
    if (!(translations instanceof Array)) {
      throw new Error('The argument \'translations\' must be an Array')
    }

    this.#translations = translations

    return true
  }

  /**
   * @param { string | HTMLElement | HTMLElement[] | HTMLCollection | null} container
   * @param {Window} window
   * @param {boolean} clearContainers
   * @param {object} [htmlOptions]
   * @param {string} [htmlOptions.indent]
   * @throws {Error}
   */
  #render(container, window, clearContainers = true, htmlOptions = {}) {
    this.#init(container, window, this.#translations, this.#templates)

    if (clearContainers) {
      this.#clearContainerElements()
    }

    const templates = this.#templates
    const translations = this.#translations

    if (!window) {
      throw new Error('Missing window element')
    }

    if (this.#containerCustomElementName) {
      // Custom Elements

      /**
       * @returns {CustomElementConstructor}
       */
      const getCustomElementConstructor = () => {
        return class extends HTMLElement {
          constructor() {
            super()
            this.attachShadow({ mode: 'open' })
          }

          connectedCallback() {
            if (!this.shadowRoot) {
              throw new Error('Missing shadow root')
            }

            const creator = new ElementsCreator(
              window, this.shadowRoot, templates, translations,
            )
            const children = creator.getCreatedElements()

            appendChildrenToElement(this.shadowRoot, children)
          }
        }
      }

      customElements.define(
        this.#containerCustomElementName,
        getCustomElementConstructor(),
      )
    }
    else {
      // DOM or Virtual

      if (this.#containerDOMElements.length === 0) {
        const creator = new ElementsCreator(
          window, null, templates, translations,
        )

        this.#finalHtmlCode = creator.finalPaint(htmlOptions)
        this.#finalElements.push(creator.finalElements)
      }

      if (this.#containerDOMElements
        && Symbol.iterator in this.#containerDOMElements
      ) {
        for (const element of this.#containerDOMElements) {
          const creator = new ElementsCreator(
            window, element, templates, translations,
          )

          this.#finalHtmlCode = creator.finalPaint(htmlOptions)
          this.#finalElements.push(creator.finalElements)
        }
      }
    }
  }
}

export { Component }
