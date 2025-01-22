import { isWhitespace, stringToBoolean } from '../common/functions/misc.js'
import { SELF_CLOSING_TAGS } from './constants.js'
import { HtmlTemplateParserElement } from './HtmlTemplateParserElement.js'

/**
 * This class is used to turn JS template literals
 * (containing HTML code) into properly ordered
 * Template Tree.
 */
class HtmlTemplateParser {
  #attrName = ''

  /**
   * The quote symbol in <...attr="value"> - a single or
   * a double quote.
   * When the attribute has no quote, for example
   * <...attr=123...>, the quote would be an empty space.
   *
   * @type {"'" | "\"" | " " | ''}
   */
  #attrQuote = ''

  /** @type {any} */
  #attrValue = ''

  /** @type {Object<string, any>} */
  #attributes = {}

  /**
   * Usually a string, but it could be function, boolean, number...
   *
   * @type {any}
   */
  #char

  /** @type {any} */
  #charPrevious

  /** @type {any[]} */
  #data = []

  /**
   * Would be set to the method that is going to be used
   * for the next char iteration
   *
   * @type {() => void}
   */
  #stage = this.#stageNothing

  #styleAttrName = ''

  /** @type {any} */
  #styleAttrValue = ''

  /** @type {Object<string, any>} */
  #styles = {}

  #tagName = ''

  #tagNameClosing = ''

  #textContents = ''

  /** @type {HtmlTemplateParserElement} */
  #topElement = new HtmlTemplateParserElement()

  /** @type {HtmlTemplateParserElement} */
  #currentElement = this.#topElement

  /**
   * @param {string[]} strings
   * @param {any[]} keys
   */
  constructor(strings, keys) {
    this.#data = this.#mergeStringsAndKeys(strings, keys)

    this.#rotate()
  }

  /**
   * @param {(
   *   import('../TemplateRenderer/TemplateRenderer.js').TemplateRenderer
   * )} tree
   * @returns {(HTMLElement | Text)[]}
   * @throws {Error}
   */
  generate(tree) {
    if (this.#tagName || this.#tagNameClosing) {
      throw new Error('Some HTML tag is not closed')
    }

    return this.#generateChildren(tree, this.#topElement)
  }

  /**
   * @param {any} to
   * @param {any} data
   * @returns {any}
   */
  #appendData(to, data) {
    if (typeof to === 'function') {
      /*
       * The input is a function. In this case:
       *
       * - If the data to append is also a function,
       *   return that function.
       * - If the data to append is not a function,
       *   return the input.
       */

      return (typeof data === 'function')
        ? data
        : to
    }

    return (
      typeof to === 'string'
      && (
        typeof data === 'string'
        || typeof data === 'number'
        || typeof data === 'boolean'
      )
    )
      ? to + data.toString()
      : data
  }

  /**
   * @param {(
   *   import('../TemplateRenderer/TemplateRenderer.js').TemplateRenderer
   * )} tree
   * @param {HtmlTemplateParserElement} element
   * @returns {(HTMLElement | Text)[]}
   */
  #generateChildren(tree, element) {
    /** @type {(HTMLElement | Text)[]} */
    const output = []

    for (const child of element.children) {
      let el = null

      if (child.tagName === 'if') {
        el = tree.if(
          stringToBoolean(child.attributes['condition'] ?? ''),
          () => {
            this.#generateChildren(tree, child)
          },
        )
      }
      else if (child.tagName === 'for') {
        if ('iterations' in child.attributes) {
          el = tree.for(
            0,
            parseInt(child.attributes['iterations'] ?? 0) - 1,
            () => {
              this.#generateChildren(tree, child)

              return undefined
            },
          )
        }
        else if ('from' in child.attributes || 'to' in child.attributes) {
          el = tree.for(
            parseInt(child.attributes['from'] ?? 0),
            parseInt(child.attributes['to'] ?? 0),
            () => {
              this.#generateChildren(tree, child)

              return undefined
            },
          )
        }
      }
      else if (child.tagName === 'forEach') {
        if ('object' in child.attributes) {
          el = tree.forEach(
            child.attributes['object'] ?? {},
            () => {
              this.#generateChildren(tree, child)

              return undefined
            },
          )
        }
      }
      else {
        el = tree.createElement(
          child.tagName,
          child.attributes,
          this.#generateChildren(tree, child),
        )

        output.push(el)
      }
    }

    return output
  }

  #makeNewElement() {
    const parent = this.#currentElement
    const attributes = this.#attributes

    if (Object.keys(this.#styles).length > 0) {
      attributes['style'] = this.#styles
    }

    const child = this.#currentElement.newChild(parent, attributes)

    child.tagName = this.#tagName

    this.#currentElement = child
  }

  /**
   * JS Templates provide two arrays - a string array and keys array.
   * This function is designed to merge these two into a single array.
   *
   * @param {string[]} strings
   * @param {any[]} [keys]
   * @returns {any[]}
   */
  #mergeStringsAndKeys(strings, keys = []) {
    const output = []

    for (let index = 0; index < strings.length; index++) {
      if (strings[index]) {
        output.push(strings[index])
      }

      if (keys[index] !== undefined) {
        output.push(keys[index])
      }
    }

    return output
  }

  #rotate() {
    for (
      let dataIndex = 0;
      dataIndex < this.#data.length;
      dataIndex++
    ) {
      if (typeof this.#data[dataIndex] === 'string') {
        for (
          let charIndex = 0;
          charIndex < this.#data[dataIndex].length;
          charIndex++
        ) {
          this.#char = this.#data[dataIndex][charIndex]
          this.#charPrevious = this.#data[dataIndex][charIndex - 1]

          // this.#char, this.#stage.name)

          this.#stage()
        }
      }
      else {
        this.#char = this.#data[dataIndex]
        this.#charPrevious = undefined

        // console.log(this.#char, this.#stage.name)

        this.#stage()
      }
    }
  }

  /**
   * @param {string} name
   * @param {any} value
   */
  #setAttribute(name, value) {
    if (!name) return

    this.#attributes[name] = (typeof value === 'string') ? value.trim() : value
  }

  /**
   * @param {() => void} stage
   */
  #setStage(stage) {
    // Actions to do before a given stage is set
    if (stage === this.#stageAttrName) {
      this.#attrName = ''
      this.#attrValue = ''
      this.#attrQuote = ''
    }

    // Set the stage
    this.#stage = stage
  }

  /**
   * @param {string} name
   * @param {any} value
   */
  #setStyle(name, value) {
    if (!name) return

    this.#styles[name] = (typeof value === 'string') ? value.trim() : value
  }

  #stageAttrName() {
    if (isWhitespace(this.#char)) {
      // just skip
    }
    else if (this.#char === '/') {
      if (SELF_CLOSING_TAGS.has(this.#tagName)) {
        this.#makeNewElement()
      }

      this.#setStage(this.#stageTagToClose)
    }
    else if (this.#char === '>') {
      this.#makeNewElement()

      this.#setStage(this.#stageNothing)
    }
    else if (this.#char === '=') {
      this.#setStage(this.#stageAttrOpenQuote)
    }
    else {
      this.#attrName += this.#char
    }
  }

  #stageAttrOpenQuote() {
    if (isWhitespace(this.#char)) {
      // just skip
    }
    else if (this.#char === '\'' || this.#char === '"') {
      this.#attrQuote = this.#char

      this.#setStage(
        (this.#attrName === 'style')
          ? this.#stageStyleAttrName
          : this.#stageAttrValue,
      )
    }
    else {
      /*
       * Value without quotes.
       *
       * Whitespaces are allowed before the value, but not after.
       * For that reason, the quote would be a whitespace here.
       */

      this.#attrQuote = ' '
      this.#attrValue = this.#appendData(this.#attrValue, this.#char)

      this.#setStage(this.#stageAttrValue)
    }
  }

  #stageAttrValue() {
    if (this.#char === '>' && this.#charPrevious !== '/') {
      /*
       * When '>' is found, but the attribute wasn't closed
       * properly.
       *
       * This could happen if the quote is an empty space,
       * for example: <...attr=true>
       * Or even unclosed quote, for example: <...attr="value>
       */
      if (this.#attrQuote && this.#attrName && this.#attrValue) {
        this.#setAttribute(this.#attrName, this.#attrValue)
      }

      this.#attrName = ''
      this.#attrValue = ''
      this.#attrQuote = ''

      this.#setStage(this.#stageNothing)

      this.#makeNewElement()
    }
    else if (
      this.#char === this.#attrQuote // <...id="value"...>
      || ( // <...id=value ...>
        this.#attrQuote === ' '
        && isWhitespace(this.#char)
      )
    ) {
      this.#setAttribute(this.#attrName, this.#attrValue)

      this.#setStage(this.#stageAttrName)
    }
    else {
      if (
        typeof this.#char === 'object'
        || typeof this.#char === 'function'
      ) {
        this.#attrValue = this.#char
      }
      else {
        this.#attrValue += this.#char
      }
    }
  }

  #stageNothing() {
    if (isWhitespace(this.#char)) {
      // just skip
    }
    else if (this.#char === '<') {
      this.#tagName = ''
      this.#attributes = {}

      this.#setStage(this.#stageTag)
    }
    else {
      /*
       * In HTML, when there are multiple spaces before or after a text,
       * only one can be visualized.
       */
      if (this.#charPrevious === ' ') {
        this.#textContents = this.#charPrevious + this.#char
      }
      else {
        this.#textContents = this.#char
      }

      this.#tagName = ''
      this.#attributes = {}

      this.#makeNewElement()

      this.#setStage(this.#stageTextContents)
    }
  }

  #stageStyleAttrName() {
    if (isWhitespace(this.#char)) {
      // just skip
    }
    else if (this.#char === '>') {
      this.#setStage(this.#stageNothing)
    }
    else if (
      this.#char === this.#attrQuote // <...id="value"...>
      || ( // <...id=value ...>
        this.#attrQuote === ' '
        && isWhitespace(this.#char)
      )
    ) {
      this.#setStage(this.#stageAttrName)
    }
    else if (this.#char === ':') {
      this.#setStage(this.#stageStyleAttrValue)
    }
    else {
      this.#styleAttrName += this.#char
    }
  }

  #stageStyleAttrValue() {
    if (this.#char === '>') {
      this.#setStage(this.#stageNothing)
    }
    else if (this.#char === ';') {
      this.#setStyle(this.#styleAttrName, this.#styleAttrValue)

      this.#styleAttrName = ''
      this.#styleAttrValue = ''

      this.#setStage(this.#stageStyleAttrName)
    }
    else if (this.#char === this.#attrQuote) {
      this.#setStyle(this.#styleAttrName, this.#styleAttrValue)

      this.#styleAttrName = ''
      this.#styleAttrValue = ''

      this.#setStage(this.#stageAttrName)
    }
    else {
      this.#styleAttrValue = this.#appendData(this.#styleAttrValue, this.#char)
    }
  }

  /**
   * In this stage we have just detected "<" and we are in HTML tag.
   * This tag could be a new tag, or it could be the closing tag.
   *
   * @returns {void}
   * @throws {Error}
   */
  #stageTag() {
    if (isWhitespace(this.#char)) {
      if (this.#tagName !== '') {
        this.#setStage(this.#stageAttrName)
      }
    }
    else if (this.#char === '/' && SELF_CLOSING_TAGS.has(this.#tagName)) {
      /*
       * If there was a text node just before the tag, it would
       * be the current element.
       * But the text node is at the same leve. So, change the
       * current element to the parent.
       */
      if (!this.#currentElement.tagName) {
        this.#currentElement = this.#currentElement.parent
      }

      this.#makeNewElement()

      this.#setStage(this.#stageTagToClose)
    }
    else if (this.#char === '>') {
      if (!this.#tagName) {
        throw new Error('Expected tag name, found >')
      }

      /*
       * If there was a text node just before the tag, it would
       * be the current element.
       * But the text node is at the same leve. So, change the
       * current element to the parent.
       */
      if (!this.#currentElement.tagName) {
        this.#currentElement = this.#currentElement.parent
      }

      this.#makeNewElement()

      this.#setStage(this.#stageNothing)
    }
    else if (this.#charPrevious === '<' && this.#char === '/') {
      if (!this.#tagName) {
        // throw new Error('no tag name')
      }

      this.#tagNameClosing = ''

      this.#setStage(this.#stageTagToClose)
    }
    else {
      this.#tagName += this.#char
    }
  }

  #stageTagToClose() {
    if (isWhitespace(this.#char)) {
      // just skip
    }
    else if (this.#char === '>') {
      if (
        this.#currentElement.tagName // Empty if text node
        && this.#currentElement.tagName !== '-'
        && !SELF_CLOSING_TAGS.has(this.#currentElement.tagName)
        && this.#currentElement.tagName !== this.#tagNameClosing
      ) {
        throw new Error(`Expected ${this.#currentElement.tagName} tag to be closed, but ${this.#tagNameClosing} found`)
      }

      this.#tagName = ''
      this.#tagNameClosing = ''

      if (
        !this.#currentElement.tagName // Text node
      ) {
        this.#currentElement = this.#currentElement.parent.parent
      }
      else {
        this.#currentElement = this.#currentElement.parent
      }

      this.#setStage(this.#stageNothing)
    }
    else {
      this.#tagNameClosing += this.#char
    }
  }

  #stageTextContents() {
    if (this.#char === '<') {
      // Reset what was possibly used for text node
      this.#attributes = {}
      this.#currentElement.attributes['textContent'] = this.#textContents

      this.#setStage(this.#stageTag)
    }
    else {
      this.#textContents = this.#appendData(this.#textContents, this.#char)

      if (!this.#currentElement.tagName) {
        this.#currentElement.attributes['textContent'] = this.#textContents
      }
    }
  }
}

export { HtmlTemplateParser }
