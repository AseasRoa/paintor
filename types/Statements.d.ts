/**
 * @see https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
 * @see https://www.typescriptlang.org/docs/handbook/utility-types.html
 */

import { Reactive } from './common'
import { Template } from './types'

export interface Statements {
  /**
   * @since 1.5.0
   */
  $if (
    condition: boolean | Reactive<boolean>,
    handler: (() => void | Template) | Template,
    elseHandler?: (() => void | Template) | Template,
  ) : HTMLElement[]

  /**
   * Calls a callback function for each element in the input Object or Map.
   *
   * @since 1.5.0
   */
  $each<
    Input extends (...args: any) => Array<>
  >(
    func : Input,
    handler : (
      value : ReturnType<Input>[number],
      key : string
    ) => boolean | any,
    handlerOnEmpty?: () => void
  ) : HTMLElement[] | Error

  /**
   * Calls a callback function for each element in the input Object or Map.
   *
   * @since 1.5.0
   */
  $each<
    Input extends (...args: any) => Set<>
  >(
    func : Input,
    handler : (
      value : ReturnType<Input> extends Set<infer V> ? V : never,
      key : number
    ) => boolean | any,
    handlerOnEmpty?: () => void
  ) : HTMLElement[] | Error

  /**
   * Calls a callback function for each element in the input Object or Map.
   *
   * @since 1.5.0
   */
  $each<
    Input extends (...args: any) => Map<>
  >(
    func : Input,
    handler : (
      value : ReturnType<Input> extends Map<any, infer V> ? V : never,
      key : ReturnType<Input> extends Map<infer K, any> ? K : never
    ) => boolean | any,
    handlerOnEmpty?: () => void
  ) : HTMLElement[] | Error

  /**
   * Calls a callback function for each element in the input Object or Map.
   *
   * @since 1.5.0
   */
  $each<
    Input extends (...args: any) => Object<>
  >(
    func : Input,
    handler : (
      value : ReturnType<Input> extends Object<PropertyKey, infer V> ? V : never,
      key : ReturnType<Input> extends Object<infer K, infer V> ? K : never
    ) => boolean | any,
    handlerOnEmpty?: () => void
  ) : HTMLElement[] | Error

  /**
   * Calls a callback function for each element in the input Array.
   *
   * @since 1.5.0
   */
  $each<
    Input extends Array<>
  >(
    array : Input,
    handler : (
      value : Input[number],
      key : string
    ) => boolean | any,
    handlerOnEmpty?: () => void
  ) : HTMLElement[] | Error

  /**
   * Calls a callback function for each element in the input Set.
   *
   * @since 1.5.0
   */
  $each<
    Input extends Set<>
  >(
    set : Input,
    handler : (value : Input extends Set<infer V> ? V : never, key : number) => boolean | any,
    handlerOnEmpty?: () => void
  ) : HTMLElement[] | Error

  /**
   * Calls a callback function for each element in the input Map.
   *
   * @since 1.5.0
   */
  $each<
    Input extends Map<>,
    Key extends keyof Input
  >(
    map : Input,
    handler : (
      value : Input extends Map<any, infer V> ? V : never,
      key : Input extends Map<infer K, any> ? K : never
    ) => boolean | any,
    handlerOnEmpty?: () => void
  ) : HTMLElement[] | Error

  /**
   * Calls a callback function for each element in the input Object.
   *
   * @since 1.5.0
   */
  $each<
    Input extends Object<>,
    Key extends keyof Input
  >(
    object : Input,
    handler : (
      value : Input[Key],
      key : Key
    ) => boolean | any,
    handlerOnEmpty?: () => void
  ) : HTMLElement[] | Error

  /**
   * Calls a callback function for each element in the state,
   * when the state is an Array.
   *
   * @since 1.5.0
   */
  $state<
    Input extends Array<>
  >(
    array : Input,
    handler: Template | ((state: Input) => Template) | ((state: Input) => void),
    handlerOnEmpty?: () => void
  ) : HTMLElement[] | Error

  /**
   * Calls a callback function for each element in the state,
   * when the state is a Set.
   *
   * @since 1.5.0
   */
  $state<
    Input extends Set<>
  >(
    set : Input,
    handler: Template | ((state: Input) => Template) | ((state: Input) => void),
    handlerOnEmpty?: () => void
  ) : HTMLElement[] | Error

  /**
   * Calls a callback function for each element in the state,
   * when the state is a Map.
   *
   * @since 1.5.0
   */
  $state<
    Input extends Map<>,
    Key extends keyof Input
  >(
    map : Input,
    handler: Template | ((state: Input) => Template) | ((state: Input) => void),
    handlerOnEmpty?: () => void
  ) : HTMLElement[] | Error

  /**
   * Calls a callback function for each element in the state,
   * when the state is an Object.
   *
   * @since 1.5.0
   */
  $state<
    Input extends Object<>,
    Key extends keyof Input
  >(
    object : Input,
    handler: Template | ((state: Input) => Template) | ((state: Input) => void),
    handlerOnEmpty?: () => void
  ) : HTMLElement[] | Error

  /**
   * Run the handler repeatedly for each number between "from"
   * and "to", including "from" and "to".
   *
   * @since 1.5.0
   */
  $repeat(
    from : number | Reactive<number>,
    to : number | Reactive<number>,
    handler : (key: number) => boolean | any
  ) : HTMLElement[] | Error

  /**
   * @since 1.5.0
   */
  $css(sheet: CSSStyleSheet | string | string[]): void

  /**
   * @since 1.5.0
   */
  $html(htmlString: string) : HTMLElement[];

  /**
   * @since 1.5.0
   */
  $html(str : TemplateStringsArray, ...keys : any[]) : HTMLElement[];
}
