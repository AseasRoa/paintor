import { Component } from './Component.js'
import { state } from './state.js'
import { fetchTranslations } from './Translation.js'

/**
 * @param {...(Template | Template[] | Component | Component[])} from
 * @returns {Component}
 */
function component(...from) {
  return new Component().useTemplates(...from)
}

/**
 * @param {Template} from
 * @returns {Template}
 */
function template(from) {
  return from
}

const paintor = { component, state, template, fetchTranslations, Component }

export default paintor
export { paintor, component, state, template, fetchTranslations, Component }
