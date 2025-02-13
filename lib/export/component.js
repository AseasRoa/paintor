import { Component } from '../Component/Component.js'

/**
 * @param {...(Template | Template[] | Component | Component[])} from
 * @returns {Component}
 */
function component(...from) {
  const component = new Component()
  component.state = undefined
  component.template = undefined
  component.useTemplates(...from)

  return component
}

/**
 * @param {any} component
 * @returns {boolean}
 */
function isComponent(component) {
  return component instanceof Component
}

export { component, Component, isComponent }
