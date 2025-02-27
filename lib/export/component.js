const symTemplate = Symbol('Template')

/**
 * Used for components where css() is not returned,just used
 *
 * @type {({ strings: (string | string[]), keys: any })[]}
 */
export const cssQueue = []

/**
 * Used for components where template() is not returned,just used
 *
 * @type {Template[]}
 */
export const templateQueue = []

/**
 * @type {(() => void)[]}
 */
export const onMountQueue = []

/**
 * @param {() => void} callback
 */
export function onMount(callback) {
  onMountQueue.push(callback)
}

/**
 * @param {string | string[]} strings
 * @param {...*} keys
 * @returns {void}
 */
export function css(strings, ...keys) {
  cssQueue.push({ strings, keys })
}

/**
 * @returns {void}
 */
export function cleanupTemplateQueue() {
  templateQueue.length = 0
}

/**
 * Create a template function
 *
 * @param {Template} from
 * @returns {Template}
 */
export function template(from) {
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
  const css = cssQueue.pop()

  if (css) {
    // @ts-expect-error
    from.css = css
    cssQueue.length = 0
  }

  // onMount
  const onMount = onMountQueue.pop()

  if (onMount) {
    // @ts-expect-error
    from.onMount = onMount
    onMountQueue.length = 0
  }

  return from
}

/**
 * @param {any} input
 * @returns {boolean}
 */
export function isTemplate(input) {
  return ((typeof input === 'function') && (symTemplate in input))
}
