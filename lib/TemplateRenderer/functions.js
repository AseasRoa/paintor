import { isTemplate, templateQueue } from '../export/component.js'

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
export function execHandler(tree, handler, ...handlerArgs) {
  let result = undefined

  if (typeof handler !== 'function') {
    return
  }

  // @ts-expect-error
  if (handler.css) {
    // @ts-expect-error
    tree.$css(handler.css.strings, handler.css.keys)
  }

  result = (isTemplate(handler))
    ? handler(tree)
    : handler(...handlerArgs)

  return result
}

/**
 * @param {TemplateTree} tree
 * @param {Template} template
 * @returns {any}
 */
export function execTemplate(tree, template) {
  // @ts-expect-error
  const _cssClassNameBefore = tree._cssClassName

  // @ts-expect-error
  if (template.css) {
    // @ts-expect-error
    tree.$css(template.css.strings, template.css.keys)
  }

  const result = template(tree)

  // @ts-expect-error
  tree._cssClassName = _cssClassNameBefore

  // @ts-expect-error
  if (template.onMount) {
    // @ts-expect-error
    template.onMount()
  }

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
      result = execTemplate(tree, result)

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
