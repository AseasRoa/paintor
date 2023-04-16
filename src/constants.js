export const symSubscribe = Symbol('symSubscribe')
export const symSubscribed = Symbol('symSubscribed')

export const symSubscriptions  = Symbol('Subscriptions')
export const symAccess  = Symbol('Access')

export const symTemplateFunction = Symbol('TemplateFunction')
export const symState = Symbol('State')

/**
 * @readonly
 * @enum {number}
 */
export const EnumStateAction = Object.freeze({
  CREATE: 1,
  READ: 2,
  UPDATE: 3,
  DELETE: 4,
  SPLICE: 5,
  SWAP: 6,
})
