import { Composition } from '../Composition/Composition.js'

/**
 * @param {...Composable} from
 * @returns {Composition}
 */
export function compose(...from) {
  const composition = new Composition()
  composition.useComposables(...from)

  return composition
}

/**
 * @param {any} composition
 * @returns {boolean}
 */
export function isComposition(composition) {
  return composition instanceof Composition
}

export { Composition }
