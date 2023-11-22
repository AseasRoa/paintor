/**
 * This file must be an ambient module
 *
 * @see https://www.typescriptlang.org/docs/handbook/modules/reference.html#ambient-modules
 */

type Elements = import('./WebApi/Elements').Elements
type Statements = import('./Statements').Statements

type State = Record<any, any> | Array<any> | Set<any> | Map<any, any>
type States = Record<string, State>
type TemplateTree = Elements & Statements
type Template = (tree : TemplateTree) => (
  void
  | string
  | HTMLElement | HTMLElement[]
  | Component | Component[]
  | Template | Template[]
)
type Translation = Record<string, any>

interface Component {
  // component: (...from: (Template | Component)[]) => Component,
  clear: () => void,
  html: (options?: { indent?:string }) => string,
  paint: (container: string | HTMLElement | HTMLElement[] | HTMLCollection) => void,
  static: (on?: boolean) => Component,
  staticHtml: (options?: { indent?:string }) => string,
  template: Template,
  useTranslations : (...translations: Translation[]) => Component,
}

declare module 'paintor' {
  export { Component } from 'src/Component.js'

  export function component(...from: (Template | Component)[]): Component
  export function component(from: (Template | Component)[]): Component

  /**
   * @template T
   * @param {T} object Your input object or array
   * @returns {T} A proxy object/array that looks the same as the input object/array
   */
  export function state<T>(object : T) : T

  export function isTemplate(func: Template) : boolean
  export function template<T extends Template>(from: T) : T

  /**
   * @template T
   * @param {T} defaultPaths
   * One or more paths to files, exporting an object as default.
   * The file name of each path will be replaced with the user's locale, so the actual file from
   * which the translation is read could be different. But if a file for the user's locale doesn't
   * exist, the provided file name will be used.
   * @returns {Promise<Translation>}
   */
  export function fetchTranslations(...defaultPaths: string[]) : Promise<Translation[]>

  export const paintor: {
    component: typeof component,
    fetchTranslations: typeof fetchTranslations,
    state: typeof state,
    template: typeof template,
    Component: Component
  }
}
