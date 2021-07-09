import { PaintorWrapper } from './PaintorWrapper.js'
import { createState } from './state.js'
import './typedefs.js'

/** @type {Paintor} */
const paintor = function paintor(target, states, contents) {
  return new PaintorWrapper(target, states, contents)
}

paintor.state = createState
paintor.createState = createState

export default paintor
export { paintor, createState }
