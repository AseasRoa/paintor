/**
 * @typedef {import('../types/index.d.ts').createState} CreateState
 */

/**
 * @typedef {import('../types/index.d.ts').paintor} Paintor
 */

/**
 * @typedef {function} Contents
 * @param {Paintor} paintor
 */

/**
 * A function that binds the property of a html element with element from a state
 * @typedef {function} BindFunction
 * @param {HTMLElement} [element]
 * @returns {*}
 */

/**
 * Used in "if" statement for the condition parameter
 * @typedef {function} StatementBindFunction
 * @param {HTMLElement} [element]
 * @returns {boolean}
 */

/**
 * @typedef {function} StatementCallback
 * @param {boolean} allow
 * @returns {void}
 */

/**
 * A single subscriptions record
 * @typedef {Object} Subscription
 * @property {HTMLElement} element
 * @property {string} propertyName
 * @property {string} subPropertyName
 * @property {BindFunction} bindFunction
 * @property {function} [statementCallback]
 */

/**
 * @typedef {Object<string, Subscription[]>} Subscriptions
 */

/**
 * @typedef {{}} State
 */

/**
 * @typedef {Object<string, State>} States
 */
