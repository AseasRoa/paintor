/**
 * @see https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
 * @see https://www.typescriptlang.org/docs/handbook/utility-types.html
 */

import { Reactive } from './common'
import { Template } from './types'

export interface StatementsDeprecated {
  /**
   * @deprecated Replaced with $if() in 1.5.0
   */
  if (
    condition: Reactive<boolean>,
    handler: Template,
    elseHandler?: Template,
  ): HTMLElement[]

  forEach: {
    /**
     * Calls the handler function for each element in the input Object or Map.
     *
     * @deprecated Replaced with $each() in 1.5.0
     */
    <
      Input extends (...args: any[]) => Array<any>
    >(
      func: Input,
      handler: (
        value: ReturnType<Input>[number],
        key: string
      ) => boolean | any,
      handlerOnEmpty?: () => void
    ): HTMLElement[] | Error

    /**
     * Calls the handler function for each element in the input Object or Map.
     *
     * @deprecated Replaced with $each() in 1.5.0
     */
      <
        Input extends (...args: any[]) => Set<any>
      >(
      func: Input,
      handler: (
        value: ReturnType<Input> extends Set<infer V> ? V : never,
        key: number
      ) => boolean | any,
      handlerOnEmpty?: () => void
    ): HTMLElement[] | Error

    /**
     * Calls the handler function for each element in the input Object or Map.
     *
     * @deprecated Replaced with $each() in 1.5.0
     */
      <
        Input extends (...args: any[]) => Map<any, any>
      >(
      func: Input,
      handler: (
        value: ReturnType<Input> extends Map<any, infer V> ? V : never,
        key: ReturnType<Input> extends Map<infer K, any> ? K : never
      ) => boolean | any,
      handlerOnEmpty?: () => void
    ): HTMLElement[] | Error

    /**
     * Calls the handler function for each element in the input Object or Map.
     *
     * @deprecated Replaced with $each() in 1.5.0
     */
      <
        Input extends (...args: any[]) => Record<keyof any, any>
      >(
      func: Input,
      handler: (
        value: ReturnType<Input> extends Record<PropertyKey, infer V> ? V : never,
        key: ReturnType<Input> extends Record<infer K, infer V> ? K : never
      ) => boolean | any,
      handlerOnEmpty?: () => void
    ): HTMLElement[] | Error

    /**
     * Calls the handler function for each element in the input Array.
     *
     * @deprecated Replaced with $each() in 1.5.0
     */
      <
        Input extends Array<any>
      >(
      array: Input,
      handler: (
        value: Input[number],
        key: string
      ) => boolean | any,
      handlerOnEmpty?: () => void
    ): HTMLElement[] | Error

    /**
     * Calls the handler function for each element in the input Set.
     *
     * @deprecated Replaced with $each() in 1.5.0
     */
      <
        Input extends Set<any>
      >(
      set: Input,
      handler: (value: Input extends Set<infer V> ? V : never, key: number) => boolean | any,
      handlerOnEmpty?: () => void
    ): HTMLElement[] | Error

    /**
     * Calls the handler function for each element in the input Map.
     *
     * @deprecated Replaced with $each() in 1.5.0
     */
      <
        Input extends Map<any, any>,
        Key extends keyof Input
      >(
      map: Input,
      handler: (
        value: Input extends Map<any, infer V> ? V : never,
        key: Input extends Map<infer K, any> ? K : never
      ) => boolean | any,
      handlerOnEmpty?: () => void
    ): HTMLElement[] | Error

    /**
     * Calls the handler function for each element in the input Object.
     *
     * @deprecated Replaced with $each() in 1.5.0
     */
      <
        Input extends Record<keyof any, any>,
        Key extends keyof Input
      >(
      object: Input,
      handler: (
        value: Input[Key],
        key: Key
      ) => boolean | any,
      handlerOnEmpty?: () => void
    ): HTMLElement[] | Error
  }

  forState: {
    /**
     * Calls the handler function for each element in the state,
     * when the state is an Array.
     *
     * @deprecated Replaced with $state() in 1.5.0
     */
    <
      Input extends Array<any>
    >(
      array: Input,
      handler: ((state: Input) => (Template|void)),
      handlerOnEmpty?: () => void
    ): HTMLElement[] | Error

    /**
     * Calls the handler function for each element in the state,
     * when the state is an Object.
     *
     * @deprecated Replaced with $state() in 1.5.0
     */
    <
      Input extends Record<(string | number | symbol), any>,
    >(
      object: Input,
      handler: ((state: Input) => (Template|void)),
      handlerOnEmpty?: () => void
    ): HTMLElement[] | Error
  }

  /**
   * @deprecated Replaced with $for() in 1.5.0
   */
  for(
    from: Reactive<number>,
    to: Reactive<number>,
    handler: (key: number) => boolean | any
  ): HTMLElement[] | Error
}
