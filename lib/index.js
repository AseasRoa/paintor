import { Component } from './Component.js'
import { state } from './state.js'
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
 * Returns the input function, but marked to be used easily in Paintor
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
  state,
  isComponent,
  isTemplate,
  template,
  fetchTranslations,
  Component
}

export default paintor
export {
  paintor,
  component,
  state,
  isComponent,
  isTemplate,
  template,
  fetchTranslations,
  Component
}
