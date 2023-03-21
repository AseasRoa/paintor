import { Paintor } from './Paintor.js'
import { createState } from './State.js'
import { createTranslation } from './Translation.js'

/**
 * @param {...Template} templates
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

const paintor = { compose, createState, createTemplate, createTranslation }

export default paintor
export { paintor, compose, createState, createTemplate, createTranslation, Paintor }
