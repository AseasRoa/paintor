import { Component } from '../Component/Component.js'

/**
 * @param {...(Template | Template[] | Component | Component[])} from
 * @returns {Component}
 */
function compose(...from) {
  const component = new Component()
  component.state = undefined
  // @ts-expect-error
  component.template = undefined
  component.useTemplates(...from)

  return component
}

export { compose }
