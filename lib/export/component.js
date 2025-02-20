import { Composition } from '../Composition/Composition.js'
import { compose } from './compose.js'

/**
 * @param {...Composable} from
 * @returns {Composition}
 * @deprecated
 */
function component(...from) {
  return compose(...from)
}

/**
 * @param {any} composition
 * @returns {boolean}
 * @deprecated
 */
function isComponent(composition) {
  return composition instanceof Composition
}

export { component, isComponent }
