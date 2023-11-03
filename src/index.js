import { Component } from './Component.js'
import { state } from './state.js'
import { fetchTranslations } from './Translation.js'
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
 * @param {Function} func
 * @returns {boolean}
 */
function isTemplate(func) {
  return (func instanceof Function) && (symTemplateFunction in func)
}

const paintor = { component, state, isTemplate, template, fetchTranslations, Component }

export default paintor
export { paintor, component, state, isTemplate, template, fetchTranslations, Component }
