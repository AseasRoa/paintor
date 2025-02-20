/**
 * @readonly
 * @enum {number}
 */
export const EnumStateAction = {
  CREATE: 1,
  READ: 2,
  UPDATE: 3,
  DELETE: 4,
  ARRAY_COPY_WITHIN: 5,
  ARRAY_LENGTH: 6,
  ARRAY_PUSH: 7,
  ARRAY_REVERSE: 8,
  ARRAY_SORT: 9,
  ARRAY_SPLICE: 10,
  ARRAY_SWAP: 11,
}

/**
 * @readonly
 */
export const EnumSystemProps = {
  if: Symbol('prop-if'),
  for: Symbol('prop-for'),
  reactive: Symbol('prop-reactive')
}
export const symAccess = Symbol('Access')
export const symObserverAccessProp = Symbol('ObserverAccessProp')
export const symEmptyHandlerElements = Symbol('EmptyHandlerElements')
