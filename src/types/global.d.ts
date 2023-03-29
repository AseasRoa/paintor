type Elements = import('./WebApi/Elements').Elements
type Statements = import('./Statements').Statements

type State = Record<any, any> | Array<any> | Set<any> | Map<any, any>
type States = Record<string, State>
type TemplateTree = Elements & Statements
type Template = (tree : TemplateTree) => (
  void
  | string
  | HTMLElement | HTMLElement[]
  | Paintor | Paintor[]
  | Template | Template[]
)
type Translation = Record<string, any>

type PaintorTemplateTree = TemplateTree
type PaintorTemplate = Template

interface Paintor {
  createTemplate: Template,
  useTranslations : (...translations: Translation[]) => Paintor,
  compose: (...templates: Template[]) => Paintor,
  static: (on?: boolean) => Paintor,
  paint: (container: string | HTMLElement | HTMLElement[] | HTMLCollection) => void,
  appendTo: (container: string | HTMLElement) => void,
  getHtml: (options?: { indent?:string }) => string,
  getStaticHtml: (options?: { indent?:string }) => string
}

declare module 'paintor' {
  function compose(...templates: Template[]): Paintor
  function compose(templates: Template[]): Paintor

  /**
   * @template T
   * @param {T} object Your input object or array
   * @returns {T} A proxy object/array that looks the same as the input object/array
   */
  function createState<T>(object : T) : T

  function createTemplate(template: Template) : Template

  /**
   * @template T
   * @param {T} defaultPaths
   * One or more paths to files, exporting an object as default.
   * The file name of each path will be replaced with the user's locale, so the actual file from
   * which the translation is read could be different. But if a file for the user's locale doesn't
   * exist, the provided file name will be used.
   * @returns {Promise<Translation>}
   */
  function fetchTranslations(...defaultPaths: string[]) : Promise<Translation[]>

  const paintor: {
    compose: typeof compose,
    createState: typeof createState,
    createTemplate: typeof createTemplate,
    fetchTranslations: typeof fetchTranslations
  }
}
