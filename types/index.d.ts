/**
 * This file contains types, exported and used by other modules.
 */

import {
  Component,
  ObserverListener,
  ObserverType,
  State,
  StyleRules,
  Template,
  Translation
} from './types'

/**
 * Try to fetch one or more translations, depending on the user's locale.
 *
 * @template T
 * @param {T} defaultPaths
 * One or more paths to files, exporting an object as default.
 * The file name of each path will be replaced with the user's locale, so the actual file from
 * which the translation is read could be different. But if a file for the user's locale doesn't
 * exist, the provided file name will be used.
 * @returns {Promise<Translation>}
 */
export function fetchTranslations(...defaultPaths: string[]) : Promise<Translation[]>

/**
 * Checks whether the input value is a component.
 */
export function isComponent(component: any) : boolean

/**
 * Checks whether the input value is a template.
 */
export function isTemplate(func: any) : boolean

/**
 * Create a component.
 */
export function component(...from: (Template | Component)[]): Component
export function component(from: (Template | Component)[]): Component

/**
 * Create a state, which is a proxy of the input object or array.
 */
export function state<STATE>(object : STATE) : STATE

/**
 * Create a style object, containing CSS rules.
 */
export function style<
  RULES extends Partial<StyleRules>
>(rules : RULES) : RULES

/**
 * Create a template function.
 */
export function template(from: Template) : Template

export function on<
  Input extends Array<any>
>(from: Input) : {
  create(
    listener: (
      event: {
        target: Input,
        state: Input,
        key: string,
        value: Input[number],
        oldValue: Input[number] | undefined,
      }
    ) => void
  ) : void,
  change(
    listener: (
      event: {
        target: Input,
        state: Input,
        key: string,
        value: Input[number],
        oldValue: Input[number] | undefined,
      }
    ) => void
  ) : void,
  delete(
    listener: (
      event: {
        target: Input,
        state: Input,
        key: string,
        value: Input[number],
        oldValue: Input[number] | undefined,
      }
    ) => void
  ) : void,
  set(
    listener: (
      event: {
        target: Input,
        state: Input,
        key: string,
        value: Input[number],
        oldValue: Input[number] | undefined,
      }
    ) => void
  ) : void,
}
export function on<
  Input extends Record<any, any>,
  K extends keyof Input
>(from: Input) : {
  create(
    listener: (
      event: {
        target: Input,
        state: Input,
        key: K,
        value: Input[K],
        oldValue: Input[number] | undefined
      }
    ) => void
  ) : void,
  change(
    listener: (
      event: {
        target: Input,
        state: Input,
        key: K,
        value: Input[K],
        oldValue: Input[number] | undefined
      }
    ) => void
  ) : void,
  delete(
    listener: (
      event: {
        target: Input,
        state: Input,
        key: K,
        value: Input[K],
        oldValue: Input[number] | undefined
      }
    ) => void
  ) : void,
  set(
    listener: (
      event: {
        target: Input,
        state: Input,
        key: K,
        value: Input[K],
        oldValue: Input[number] | undefined
      }
    ) => void
  ) : void,
}
export function on<
  Input extends any
>(from: Input) : {
  create(
    listener: (
      event: {
        target: Input,
        state: Input,
        key: string,
        value: Input,
        oldValue: Input | undefined
      }
    ) => void
  ) : void,
  change(
    listener: (
      event: {
        target: Input,
        state: Input,
        key: string,
        value: Input,
        oldValue: Input | undefined
      }
    ) => void
  ) : void,
  delete(
    listener: (
      event: {
        target: Input,
        state: Input,
        key: string,
        value: Input,
        oldValue: Input | undefined
      }
    ) => void
  ) : void,
  set(
    listener: (
      event: {
        target: Input,
        state: Input,
        key: string,
        value: Input,
        oldValue: Input | undefined
      }
    ) => void
  ) : void,
}
export function on<
  Input extends any
>(from: Input) : {
  create(
    listener: (
      event: {
        target: Input,
        state: Input,
        key: string,
        value: Input,
        oldValue: Input | undefined
      }
    ) => void
  ) : void,
  change(
    listener: (
      event: {
        target: Input,
        state: Input,
        key: string,
        value: Input,
        oldValue: Input | undefined
      }
    ) => void
  ) : void,
  delete(
    listener: (
      event: {
        target: Input,
        state: Input,
        key: string,
        value: Input,
        oldValue: Input | undefined
      }
    ) => void
  ) : void,
  set(
    listener: (
      event: {
        target: Input,
        state: Input,
        key: string,
        value: Input,
        oldValue: Input | undefined
      }
    ) => void
  ) : void,
}

export function off(
  stateOrProp: State | any,
  type: ObserverType,
  listener: ObserverListener
) : void

export const paintor: {
  component: typeof component,
  fetchTranslations: typeof fetchTranslations,
  on: typeof on,
  off: typeof off,
  state: typeof state,
  template: typeof template,
}

export { Template }
