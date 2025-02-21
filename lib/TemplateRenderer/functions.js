import { isTemplate, templateQueue } from '../export/template.js'

/**
 * @param {undefined | ((...args: any[]) => any)} handler
 * @param {boolean} [getOldest]
 * Use shift() instead of pop() when getting the template from the queue.
 * @returns {((...args: any[]) => any)}
 */
export function ifUndefinedGetQueuedTemplate(handler, getOldest = false) {
  // @ts-expect-error
  return (
    handler === undefined
    && templateQueue.length > 0
  )
    ? (getOldest) ? templateQueue.shift() : templateQueue.pop()
    : handler
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
