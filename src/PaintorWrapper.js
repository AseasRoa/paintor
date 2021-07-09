import { Paintor } from './Paintor.js'
import './typedefs.js'

/**
 * This class complements the Paintor class and exists mostly because of treeFunction(), its
 * parameter specifically. If both classes are merged into one, then this parameter cannot be
 * typed correctly.
 */
class PaintorWrapper {
  /**
   * The main element in which to append all the contents
   * @type {HTMLElement | null}
   */
  #containerElement = null

  // A state is an Object where the key is the name of the state and the value is a Proxy object
  /** @type {Object<string, {}>} */
  #states = {}

  /**
   * @param {string|HTMLElement} target
   * @param {{}} states
   * @param {*} contents
   * @returns {PaintorWrapper}
   */
  constructor(target, states, contents) {
    const paintor = new Paintor(this)
    const result = this.#initConstructorArguments(target, states, contents)

    if (!(result instanceof Error)) {
      this.#clearContainerElement()
      contents(paintor)
      paintor.finalPaint()
    }
  }

  /**
   * @returns {HTMLElement}
   */
  get containerElement() {
    return this.#containerElement
  }

  /**
   * @returns {Object<string, {}>}
   */
  get states() {
    return this.#states
  }

  /**
   * @param {string|HTMLElement} target
   * @param {State|States} states
   * @param {Contents} treeFunction
   * @returns {Error|boolean}
   */
  #initConstructorArguments(target, states, treeFunction) {
    // argument 1
    if (target instanceof Node)
      this.#containerElement = target
    else if (typeof target === 'string') {
      this.#containerElement = document.getElementById(target)

      if (!this.#containerElement)
        return new Error(`Could not locate element #${target}`)
    } else {
      return new Error(
        'Wrong type for the container element. '
        + 'Expected <string> or <Node>, '
        + `got <${typeof target}>`,
      )
    }

    // argument 2
    if (!(states instanceof Object))
      return new Error('states must be an Object')

    for (const stateName in states) {
      if ('--state-path' in states[stateName])
        this.states[stateName] = states[stateName]
      else {
        // Give an error when the object is not a state object
        console.error(
          `The input "${stateName}" is "${typeof states[stateName]}", `
          + 'but it should be a state',
        )
      }
    }

    // argument 3
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
