import { Component } from '../Component/Component.js'
import { compose } from './compose.js'

/**
 * @param {...(Template | Template[] | Component | Component[])} from
 * @returns {Component}
 * @deprecated
 */
function component(...from) {
  return compose(...from)
}

/**
 * @param {any} component
 * @returns {boolean}
 */
function isComponent(component) {
  return component instanceof Component
}

export { component, Component, isComponent }
