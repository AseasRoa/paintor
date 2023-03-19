import { ElementsCreator } from './ElementsCreator.js'
import {
  appendChildrenToElement,
  isBrowserEnvironment,
  isValidCustomElementName,
} from './functions.js'
import { Window as SrWindow } from './SrDOM/Window.js'

const isBrowserEnv = isBrowserEnvironment()
const srWindow = new SrWindow()

class Paintor {
  /** @type {string} */
  #containerCustomElementName = ''

  /**
   * The main element in which to append all the contents
   *
   * @type {HTMLElement | ShadowRoot | null}
   */
  #containerElement = null

  /** @type {HTMLElement[]} */
  #finalElements = []

  /**
   * In server mode this will hold the final WebApi code
   *
   * @type {string}
   */
  #finalHtmlCode = ''

  /** @type {boolean} */
  #isStatic = false

  /** @type {Template[]} */
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
   * @param {...Template} templates
   * @returns {Paintor}
   */
  compose(...templates) {
    if (templates instanceof Array) {
      for (const template of templates) {
        if (template instanceof Array) {
          this.#templates = [...this.#templates, () => template]
        }
        else {
          this.#templates.push(template)
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
   * @param {string | HTMLElement} container
   * @returns {void}
   */
  paint(container) {
    if (!isBrowserEnv) {
      throw new Error('You can only use this function in browser environment')
    }

    if (typeof container !== 'string' && !(container instanceof HTMLElement)) {
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
   * @returns {Paintor}
   */
  static(on = true) {
    this.#isStatic = on

    return this
  }

  /**
   * @param {...Translation} translations
   * @returns {Paintor}
   */
  useTranslations(...translations) {
    // Reset translations here, because the whole api chain (containing this function)
    // can be executed multiple times, but with different translations every time.
    this.#translations = []

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
  #clearContainerElement() {
    const el = this.#containerElement

    while (el?.firstChild) {
      el.removeChild(el.firstChild)
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
   * @param {string | HTMLElement | null} container
   * @param {Window} window
   * @param {Translation[]} translations
   * @param {Template[]} templates
   * @returns {boolean}
   * @throws {Error}
   */
  #init(container, window, translations, templates) {
    this.#initContainer(container, window)
    this.#initTranslations(translations)
    this.#initTemplates(templates)

    return true
  }

  /**
   * @param {string | HTMLElement | null} container
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
        this.#containerElement = (isSr)
          ? window.document.createElement('#container')
          : window.document.querySelector(container)

        if (!this.#containerElement) {
          throw new Error(`Could not find an element by the following query: ${container}`)
        }
      }
    }
    else {
      this.#containerElement = container
    }

    return true
  }

  /**
   * @param {Template[]} templates
   * @returns {boolean}
   * @throws {Error}
   */
  #initTemplates(templates) {
    for (let template of templates) {
      if (typeof template !== 'function') {
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
   * @param {HTMLElement | string | null} container
   * @param {Window} window
   * @param {boolean} clearContainer
   * @param {object} [htmlOptions]
   * @param {string} [htmlOptions.indent]
   * @throws {Error}
   */
  #render(container, window, clearContainer = true, htmlOptions = {}) {
    this.#init(container, window, this.#translations, this.#templates)

    if (clearContainer) {
      this.#clearContainerElement()
    }

    const templates = this.#templates
    const translations = this.#translations

    if (!window) {
      throw new Error('Missing window element')
    }

    if (
      !this.#containerElement
      && this.#containerCustomElementName
    ) {
      // Custom Elements

      /**
       * @param {Paintor} paintor
       * @returns {CustomElementConstructor}
       */
      const getCustomElementConstructor = (paintor) => {
        return class extends HTMLElement {
          constructor() {
            super()
            this.attachShadow({ mode: 'open' })
          }

          connectedCallback() {
            if (!this.shadowRoot) {
              throw new Error('Missing shadow root')
            }

            paintor.#containerElement = this.shadowRoot

            const creator = new ElementsCreator(
              window, paintor.#containerElement, templates, translations,
            )
            const children = creator.getCreatedElements()

            appendChildrenToElement(paintor.#containerElement, children)
          }
        }
      }

      customElements.define(
        this.#containerCustomElementName,
        getCustomElementConstructor(this),
      )
    }
    else {
      if (!this.#containerElement) {
        throw new Error('Missing containerElement')
      }

      // DOM or Virtual
      const creator = new ElementsCreator(
        window, this.#containerElement, templates, translations,
      )

      this.#finalHtmlCode = creator.finalPaint(htmlOptions)
      this.#finalElements = creator.finalElements
    }
  }
}

export { Paintor }
