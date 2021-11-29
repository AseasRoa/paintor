import { VirtualDocument, VirtualElement } from './VirtualDOM/VirtualDocument.js'

/** @typedef {import('../types/index.d.ts').paintor} PaintorFunction */

/** @typedef {import('../types/index.d.ts').Paintor} Paintor */

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

/** @typedef {Object<string, Subscription[]>} Subscriptions */

/** @typedef {Object<string, any>} State */

/** @typedef {Object<string, State>} States */

/** @typedef {Document | VirtualDocument} TheGlobal */

/** @typedef {HTMLElement | VirtualElement} TheElement */

/** @typedef {'browser' | 'server'} EnvironmentMode */
