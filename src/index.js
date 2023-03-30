import { Paintor } from './Paintor.js'
import { createState } from './State.js'
import { fetchTranslations } from './Translation.js'

/**
 * @param {(Template | Paintor)[]} templates
 * @returns {Paintor}
 */
function compose(...templates) {
  return new Paintor().compose(...templates)
}

/**
 * @param {Template} template
 * @returns {Template}
 */
function createTemplate(template) {
  return template
}

const paintor = { compose, createState, createTemplate, fetchTranslations, Paintor }

export default paintor
export { paintor, compose, createState, createTemplate, fetchTranslations, Paintor }
