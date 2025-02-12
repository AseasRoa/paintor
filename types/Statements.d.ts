/**
 * @see https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
 * @see https://www.typescriptlang.org/docs/handbook/utility-types.html
 */

import { Reactive } from './common'
import { Template } from './types'
import { StatementsDeprecated } from './StatementsDeprecated'

export interface Statements extends StatementsDeprecated {
  /**
   * @since 1.5.0
   */
  $if: {
    (
      condition: Reactive<boolean>,
      handler: Template,
      elseHandler?: Template,
    ): HTMLElement[]
  }

  $each: {
    /**
     * Calls the handler function for each element in the input Object or Map.
     *
     * @since 1.5.0
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
     * @since 1.5.0
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
     * @since 1.5.0
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
     * @since 1.5.0
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
      * @since 1.5.0
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
      * @since 1.5.0
      */
    <
      Input extends Set<any>
    >(
      set: Input,
      handler: (
        value: Input extends Set<infer V> ? V : never,
        key: number
      ) => boolean | any,
      handlerOnEmpty?: () => void
    ): HTMLElement[] | Error

    /**
      * Calls the handler function for each element in the input Map.
      *
      * @since 1.5.0
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
      * @since 1.5.0
      */
    <
      Input extends Record<keyof any, any>,
      Key extends keyof Input
    >(
      object: Input,
      handler: ((value?: Input[Key], key?: Key) => (boolean | any)),
      handlerOnEmpty?: () => void,
    ): (HTMLElement[]|Error)
  }

  $state: {
    /**
      * Calls a callback function for each element in the state,
      * when the state is an Array.
      *
      * @since 1.5.0
      */
    <Input extends Array<any>>(
      arrayState: Input,
      handler: ((state: Input) => (Template|void)),
      handlerOnEmpty?: () => void,
    ): (HTMLElement[]|Error)

    /**
     * Calls a callback function for each element in the state,
     * when the state is an Object.
     *
     * @since 1.5.0
     */
    <Input extends Record<keyof any, any>>(
      objectState: Input,
      handler: ((state: Input) => (Template|void)),
      handlerOnEmpty?: () => void,
    ): (HTMLElement[]|Error)
  }

  /**
   * Run the handler repeatedly for each number between "from"
   * and "to", including "from" and "to".
   *
   * @since 1.5.0
   */
  $repeat(
    from: Reactive<number>,
    to: Reactive<number>,
    handler: (key: number) => boolean | any
  ): (HTMLElement[]|Error)

  /**
   * @since 1.5.0
   */
  $css(sheet: CSSStyleSheet | string | string[]): void

  /**
   * @since 1.5.0
   */
  $html(htmlString: string): HTMLElement[];

  /**
   * @since 1.5.0
   */
  $html(str: TemplateStringsArray, ...keys: any[]): HTMLElement[];
}
