import { Paintor } from './Paintor.js'
import { createState } from './State.js'
import { createTranslation } from './Translation.js'

/**
 * @param {Template} template
 * @returns {Template}
 */
// eslint-disable-next-line @typescript-eslint/no-shadow
const createTemplate = (template) => {
  return template
}

/**
 * @param {string} [container]
 * @returns {void | string}
 */
const paintor = function (container = '') {
  /**
   * Current version
   */
  return new Paintor().paint(container)
}

/**
 * @param {...Template} templates
 * @returns {Paintor}
 */
paintor.compose = function (...templates) {
  return new Paintor().compose(...templates)
}

/**
 * @param {...Translation} translations
 * @returns {Paintor}
 */
paintor.useTranslations = function (...translations) {
  return new Paintor().useTranslations(...translations)
}

paintor.createTemplate = createTemplate

const compose = paintor.compose

export default paintor
export { paintor, compose, createState, createTemplate, createTranslation, Paintor }
