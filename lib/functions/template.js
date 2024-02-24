const symTemplate = Symbol('Template')

/**
 * Create a template function
 *
 * @param {Template} from
 * @returns {Template}
 */
function template(from) {
  /**
   * Mark the function, so it can be recognized later
   * as a Template function.
   *
   * Descriptor properties defaults to false and undefined,
   * so there is no need to set them here. Save some space.
   */
  Object.defineProperty(from, symTemplate, {})

  return from
}

/**
 * @param {any} template
 * @returns {boolean}
 */
function isTemplate(template) {
  return ((typeof template === 'function') && (symTemplate in template))
}

export { template, isTemplate }
