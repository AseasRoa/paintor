import { getStateProps } from './stateProps.js'
import { StateProxy } from './StateProxy.js'

/**
 * @template {TargetObject} T
 * @param {T} object
 * Your input object or array
 * @returns {T}
 * A proxy object/array that looks the same as the input object/array
 * @throws {Error}
 */
export function state(object) {
  if (!(object instanceof Object) && !Array.isArray(object)) {
    throw new Error('state() only accepts Object or Array')
  }

  const stateProps = getStateProps(object)
  const stateProxy = new StateProxy()
  const rootKey = '' // It could be a name, but empty string works just fine
  const objectToWrap = (stateProps) ? stateProps.target : object
  const wrappedObject = { '': objectToWrap }

  return stateProxy.createProxy(wrappedObject, '', null)[rootKey]
}
