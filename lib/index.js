import { Component } from './Component.js'
import { setState, state } from './state.js'
import { fetchTranslations } from './fetchTranslations.js'
import { symTemplateFunction } from './constants.js'

/**
 * @param {...(Template | Template[] | Component | Component[])} from
 * @returns {Component}
 */
function component(...from) {
  return new Component().useTemplates(...from)
}

/**
 * Create a template function
 *
 * @param {Template} from
 * @returns {Template}
 */
function template(from) {
  /**
   * Mark the function, so it can be recognized later
   * as a Template function
   */
  // @ts-ignore
  from[symTemplateFunction] = true

  return from
}

/**
 * @param {any} component
 * @returns {boolean}
 */
function isComponent(component) {
  return component instanceof Component
}

/**
 * @param {any} template
 * @returns {boolean}
 */
function isTemplate(template) {
  return (template instanceof Function) && (symTemplateFunction in template)
}

const paintor = {
  component,
  fetchTranslations,
  isComponent,
  isTemplate,
  setState,
  state,
  template,
  Component
}

export default paintor
export {
  paintor,
  component,
  fetchTranslations,
  isComponent,
  isTemplate,
  setState,
  state,
  template,
  Component
}
