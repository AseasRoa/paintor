import { PaintorWrapper } from './PaintorWrapper.js'
import { StateSubscriptions } from './StateSubscriptions.js'
import { isBrowserEnvironment, theGlobalScope } from './functions.js'
import './typedefs.js'

const isBrowser = isBrowserEnvironment()

/** @type {PaintorFunction} */
const paintor = function paintor(target, states, contents) {
  const { mode } = paintor
  const theGlobal = theGlobalScope(isBrowser, mode)

  const result = new PaintorWrapper({
    target,
    states,
    contents,
    theGlobal,
  })

  if (mode === 'server')
    return result.getHtmlCode()

  return result
}

/**
 * @template T
 * @param {T} object - A generic parameter that flows through to the return type
 * @return {T}
 */
const createState = function createState(object) {
  const stateSubscriptions = new StateSubscriptions(object)

  return stateSubscriptions.getState()
}

paintor.mode = (isBrowser) ? 'browser' : 'server'
paintor.state = createState
paintor.createState = createState

export default paintor
export { paintor, createState }
