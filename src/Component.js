import { ElementsCreator } from './ElementsCreator.js'
import {
  isBrowserEnvironment,
  isValidCustomElementName,
  selectorEndsWithId,
} from './functions.js'
import { Window as SrWindow } from './SrDOM/Window.js'
import { state } from './state.js'

const isBrowserEnv = isBrowserEnvironment()
const srWindow = new SrWindow()

class Component {
  state = null

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

  /** @type {boolean} */
  #renderCustomElements = false

  /** @type {string} */
  #selector = ''

  /** @type {string} */
  #selectorNonId = ''

  /** @type {Map<Translation | null, string>} */
  #staticHtmlCodes = new Map()

  /** @type {(Template | Component)[]} */
  #templates = []

  /** @type {Translation[]} */
  #translations = []

  /**
   * @returns {Node[][]}
   */
  getElements() {
    this.#render(null, window, true)

    return this.#finalElements
  }

  /**
   * @returns {Node[][]}
   */
  getElementsSr() {
    const window = this.#getSrWindow()

    this.#render('', window, true)

    return this.#finalElements
  }

  /**
   * Renders the components into an HTML code and returns it
   *
   * @param {object} [options]
   * @param {string} [options.indent='']
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
   * @param {boolean} [on=true]
   * @returns {Component}
   */
  static(on = true) {
    this.#isStatic = on

    return this
  }

  /**
   * @param {object} [options]
   * @param {string} [options.indent='']
   * @returns {string}
   */
  staticHtml(options) {
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
    if (this.#containerDOMElements) {
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
      this.#selector = container
      this.#renderCustomElements = false

      if (isValidCustomElementName(container)) {
        this.#renderCustomElements = true
      }
      else {
        if (!selectorEndsWithId(container)) {
          this.#selectorNonId = container
        }

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
    if (this.template instanceof Function) {
      this.state = (this.state)
        ? state(this.state)
        : this.state

      // @ts-ignore
      this.#templates.push(this.template.bind(this))
    }

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

    if (this.#renderCustomElements) {
      // Custom Elements

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

            component.#renderElements(window, this.shadowRoot, templates, translations, htmlOptions)
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
            const addedNodes = mutation.addedNodes

            for (let node of addedNodes) {
              // we track only elements, skip other nodes (e.g. text nodes)
              if (!(node instanceof HTMLElement)) continue

              // check the inserted element for being a code snippet
              if (node.matches(this.#selectorNonId)) {
                this.#renderElements(window, node, templates, translations, htmlOptions)
              }

              // or maybe there's a code snippet somewhere in its subtree?
              // for (let containerElement of node.querySelectorAll(this.#selectorNonId)) {
              //   this.#renderElements(window, containerElement, templates, translations, htmlOptions)
              // }
            }

          }
        })

        domObserver.observe(
          document.body,
          { attributes: false, childList: true, characterData: false, subtree: true },
        )
      }

      if (this.#containerDOMElements.length === 0) {
        this.#renderElements(window, null, templates, translations, htmlOptions)
      }
      else {
        for (const containerElement of this.#containerDOMElements) {
          this.#renderElements(window, containerElement, templates, translations, htmlOptions)
        }
      }
    }
  }

  /**
   * @param {Window} window
   * @param {Element | ShadowRoot | null} container
   * @param {(Template | Component)[]} templates
   * @param {Translation[]} translations
   * @param {object} [htmlOptions]
   * @param {string} [htmlOptions.indent]
   * @throws {Error}
   */
  #renderElements(window, container, templates, translations, htmlOptions = {}) {
    const creator = new ElementsCreator(
      window, container, templates, translations,
    )
    creator.render()

    this.#finalHtmlCode = creator.getHtmlCode(htmlOptions)
    this.#finalElements.push(creator.getCreatedElements())
  }
}

export { Component }
