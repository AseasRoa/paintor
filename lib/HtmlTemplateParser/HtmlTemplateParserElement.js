class HtmlTemplateParserElement {
  tagName = '-'

  /** @type {HtmlTemplateParserElement} */
  parent = this

  /** @type {HtmlTemplateParserElement[]} */
  children = []

  /** @type {Object<string, any>} */
  attributes = {}

  /**
   * Create a new instance of this class, but also put it
   * into the list of children of the current instance
   *
   * @param {HtmlTemplateParserElement} parent
   * @param {Object<string, any>} attributes
   * @returns {HtmlTemplateParserElement}
   */
  newChild(parent, attributes) {
    const child = new HtmlTemplateParserElement()

    child.parent = parent
    child.attributes = attributes

    this.children.push(child)

    return child
  }
}

export { HtmlTemplateParserElement }
