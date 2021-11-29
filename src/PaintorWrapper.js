import { Paintor } from './Paintor.js'
import { VirtualDocument } from './VirtualDOM/VirtualDocument.js'
import { VirtualElement } from './VirtualDOM/VirtualElement.js'
import './typedefs.js'

/**
 * This class complements the Paintor class and exists mostly because of treeFunction(), its
 * parameter specifically. If both classes are merged into one, then this parameter cannot be
 * typed correctly.
 */
class PaintorWrapper {
  /**
   * The main element in which to append all the contents
   * @type {TheElement | null}
   */
  #containerElement = null

  // A state is an Object where the key is the name of the state and the value is a Proxy object
  /** @type {Object<string, {}>} */
  #states = {}

  /** @type {TheGlobal} */
  #global

  #finalHtmlCode = '' // In server mode this will hold the final html code

  /**
   * @param {string | TheElement} target
   * @param {{}} states
   * @param {*} contents
   * @param {TheGlobal} theGlobal
   * @returns {PaintorWrapper}
   */
  constructor({
    target,
    states,
    contents,
    theGlobal,
  }) {
    this.#global = theGlobal

    const paintor = new Paintor(this)
    const result = this.#initConstructorArguments(target, states, contents)

    if (!(result instanceof Error)) {
      this.#clearContainerElement()
      contents(paintor, states)
      this.#finalHtmlCode = paintor.finalPaint()
    }
  }

  /**
   * @returns {TheElement}
   */
  get containerElement() {
    return this.#containerElement
  }

  /**
   * @return {HTMLDocument | VirtualDocument}
   */
  get global() {
    return this.#global
  }

  /**
   * @returns {Object<string, {}>}
   */
  get states() {
    return this.#states
  }

  /**
   * @return {string}
   */
  getHtmlCode() {
    return this.#finalHtmlCode
  }

  /**
   * @param {string | TheElement} target
   * @param {State | States} states
   * @param {Contents} treeFunction
   * @returns {Error | boolean}
   */
  #initConstructorArguments(target, states, treeFunction) {
    let valid

    // argument 1
    valid = this.#validateTarget(target)

    if (valid instanceof Error) return valid

    // argument 2
    valid = this.#validateStates(states)

    if (valid instanceof Error) return valid

    // argument 3
    valid = this.#validateTreeFunction(treeFunction)

    if (valid instanceof Error) return valid

    return true
  }

  /**
   * @param {string | TheElement} target
   * @returns {Error | boolean}
   */
  #validateTarget(target) {
    const isVirtualGlobal = this.#global instanceof VirtualDocument

    if (
      (isVirtualGlobal && target instanceof VirtualElement)
      || (!isVirtualGlobal && target instanceof Node)
    )
      this.#containerElement = target
    else if (typeof target === 'string') {
      this.#containerElement = (this.#global instanceof VirtualDocument)
        ? this.#global.createElement('#container')
        : document.getElementById(target)

      if (!this.#containerElement)
        return new Error(`Could not locate element #${target}`)
    } else {
      return new Error(
        'Wrong type for the container element. '
        + 'Expected <string> or <Node>, '
        + `got <${typeof target}>`,
      )
    }

    return true
  }

  /**
   * @param {State | States} states
   * @return {Error | boolean}
   */
  #validateStates(states) {
    if (!(states instanceof Object))
      return new Error('states must be an Object')

    for (const stateName in states) {
      const state = states[stateName]

      if ('--state-path' in state)
        this.states[stateName] = state
      else if (!(this.#global instanceof VirtualDocument))
        console.error(`The input "${stateName}" is "${typeof state}", but it should be a state`)
    }

    return true
  }

  /**
   * @param {Contents} treeFunction
   * @returns {Error | boolean}
   */
  #validateTreeFunction(treeFunction) {
    if (typeof treeFunction !== 'function')
      return new Error('treeFunction must be a function')

    return true
  }

  /**
   * Clear contents of the container element
   */
  #clearContainerElement() {
    const el = this.#containerElement

    while (el.firstChild)
      el.removeChild(el.firstChild)
  }
}

export { PaintorWrapper }
