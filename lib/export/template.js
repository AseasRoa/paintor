import { ifUndefinedGetQueuedCss } from '../TemplateRenderer/functions.js'

const symTemplate = Symbol('Template')

/**
 * Used for components where template() is not returned,just used
 *
 * @type {Template[]}
 */
const templateQueue = []

/**
 * @returns {void}
 */
function cleanupTemplateQueue() {
  templateQueue.length = 0
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
   * as a Template function.
   *
   * Descriptor properties defaults to false and undefined,
   * so there is no need to set them here. Save some space.
   */
  Object.defineProperty(from, symTemplate, {})

  templateQueue.push(from)

  // Assign css for this template
  const css = ifUndefinedGetQueuedCss()

  if (css) {
    // @ts-expect-error
    from.css = css
  }

  return from
}

/**
 * @param {any} input
 * @returns {boolean}
 */
function isTemplate(input) {
  return ((typeof input === 'function') && (symTemplate in input))
}

export { cleanupTemplateQueue, isTemplate, template, templateQueue }
