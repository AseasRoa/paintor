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

type PaintorTemplateTree = TemplateTree
type PaintorTemplate = Template

interface Component {
  createTemplate: Template,
  useTranslations : (...translations: Translation[]) => Component,
  compose: (...templates: (Template | Component)[]) => Component,
  static: (on?: boolean) => Component,
  paint: (container: string | HTMLElement | HTMLElement[] | HTMLCollection) => void,
  appendTo: (container: string | HTMLElement) => void,
  getHtml: (options?: { indent?:string }) => string,
  getStaticHtml: (options?: { indent?:string }) => string,
  template: Template
}

declare module 'paintor' {
  export { Component } from 'src/index.js'

  export function compose(...templates: (Template | Component)[]): Component
  export function compose(templates: (Template | Component)[]): Component

  /**
   * @template T
   * @param {T} object Your input object or array
   * @returns {T} A proxy object/array that looks the same as the input object/array
   */
  export function createState<T>(object : T) : T

  export function createTemplate(template: Template) : Template

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
    compose: typeof compose,
    createState: typeof createState,
    createTemplate: typeof createTemplate,
    fetchTranslations: typeof fetchTranslations,
    Component: Component
  }
}
