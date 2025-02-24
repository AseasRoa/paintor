import { cssQueue } from '../export/css.js'
import { isTemplate, templateQueue } from '../export/template.js'

/**
 * @param {boolean} [getOldest]
 * Use shift() instead of pop() when getting the template from the queue.
 */
export function ifUndefinedGetQueuedCss(
  getOldest = false
) {
  if (cssQueue.length > 0) {
    return (getOldest) ? cssQueue.shift() : cssQueue.pop()
  }

  return undefined
}

/**
 * @template T
 * @param {T} maybeTemplate
 * @param {boolean} [getOldest]
 * Use shift() instead of pop() when getting the template from the queue.
 * @returns {T | Template | void}
 */
export function ifUndefinedGetQueuedTemplate(
  maybeTemplate,
  getOldest = false
) {
  if (templateQueue.length > 0) {
    if (maybeTemplate === undefined) {
      return (getOldest) ? templateQueue.shift() : templateQueue.pop()
    }
    else if (isTemplate(maybeTemplate)) {
      // Still remove a template, which is most likely directly returned
      (getOldest) ? templateQueue.shift() : templateQueue.pop()

      return maybeTemplate
    }
  }

  return maybeTemplate
}

/**
 * @param {TemplateTree} tree
 * @param {((...args: any[]) => any)} handler
 * @param {...any} handlerArgs
 * @returns {any}
 */
export function runHandler(tree, handler, ...handlerArgs) {
  let result = undefined

  if (typeof handler !== 'function') {
    return
  }

  result = (isTemplate(handler))
    ? handler(tree)
    : handler(...handlerArgs)

  return result
}

/**
 * @param {TemplateTree} tree
 * @param {Template|void|boolean} result
 * @returns {void|boolean}
 */
export function resultResolver(tree, result) {
  // Support recursive templates
  while (true) {
    if (Array.isArray(result)) {
      for (const res of result) {
        resultResolver(tree, res)
      }

      break
    }

    if (
      typeof result === 'function'
      && isTemplate(result)
    ) {
      // @ts-expect-error
      result = result(tree)

      continue
    }

    if (
      typeof result === 'boolean'
      || typeof result === 'string'
      || typeof result === 'number'
    ) {
      return result
    }

    break
  }
}
