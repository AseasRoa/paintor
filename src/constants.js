export const symSubscribe = Symbol('symSubscribe')
export const symSubscribed = Symbol('symSubscribed')

export const symStateId    = Symbol('symStateId')

export const symArrayAccess  = Symbol('symArrayAccess')
export const symObjectAccess = Symbol('symObjectAccess')

export const symTemplateFunction = Symbol('symTemplateFunction')

/**
 * @readonly
 * @enum {number}
 */
export const EnumStateAction = Object.freeze({
  CREATE: 1,
  READ: 2,
  UPDATE: 3,
  DELETE: 4,
})
