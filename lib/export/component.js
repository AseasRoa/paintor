import { Component } from '../Component.js'

/**
 * @param {...(Template | Template[] | Component | Component[])} from
 * @returns {Component}
 */
function component(...from) {
  return new Component().useTemplates(...from)
}

/**
 * @param {any} component
 * @returns {boolean}
 */
function isComponent(component) {
  return component instanceof Component
}

export { component, Component, isComponent }
