import { Paintor } from './Paintor.js'
import { createState } from './State.js'
import { createTranslation } from './Translation.js'

/**
 * @param {Model} model
 * @returns {Model}
 */
// eslint-disable-next-line @typescript-eslint/no-shadow
const createModel = (model) => {
  return model
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
 * @param {...Model} models
 * @returns {Paintor}
 */
paintor.compose = function (...models) {
  return new Paintor().compose(...models)
}

/**
 * @param {...Translation} translations
 * @returns {Paintor}
 */
paintor.useTranslations = function (...translations) {
  return new Paintor().useTranslations(...translations)
}

paintor.createModel = createModel

const compose = paintor.compose

export default paintor
export { paintor, compose, createState, createModel, createTranslation, Paintor }
