import { Composition } from '../Composition/Composition.js'

/**
 * @param {...Composable} from
 * @returns {Composition}
 */
function compose(...from) {
  const composition = new Composition()
  composition.useComposables(...from)

  return composition
}

/**
 * @param {any} composition
 * @returns {boolean}
 */
function isComposition(composition) {
  return composition instanceof Composition
}

export { compose, Composition, isComposition }
