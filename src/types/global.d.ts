type Elements = import('./WebApi/Elements').Elements
type Statements = import('./Statements').Statements

type State = Record<any, any> | Array<any> | Set<any> | Map<any, any>
type States = Record<string, State>
type Tree = Elements & Statements
type Template = (tree : Tree) => HTMLElement | HTMLElement[] | string | Paintor | Paintor[] | Template | void
type Translation = Record<string, any>

type PaintorTree = Tree
type PaintorTemplate = Template

interface Paintor {
  (container: string | HTMLElement): void | string,
  createTemplate: PaintorTemplate,
  useTranslations : (...translations: Translation[]) => Paintor,
  compose: (...templates: Template[]) => Paintor,
  static: (on?: boolean) => Paintor,
  paint: (container: string | HTMLElement) => void,
  appendTo: (container: string | HTMLElement) => void,
  getHtml: (options?: { indent?:string }) => string,
  getStaticHtml: (options?: { indent?:string }) => string
}

declare module 'paintor' {
  function createTemplate(template: Template) : Template

  /**
   * @template T
   * @param {T} object Your input object or array
   * @returns {T} A proxy object/array that looks the same as the input object/array
   */
  function createState<T>(object : T) : T

  /**
   * @template T
   * @param {T} defaultPaths
   * One or more paths to files, exporting an object as default.
   * The file name of each path will be replaced with the user's locale, so the actual file from
   * which the translation is read could be different. But if a file for the user's locale doesn't
   * exist, the provided file name will be used.
   * @returns {Promise<Translation>}
   */
  function createTranslation(...defaultPaths: string[]) : Promise<Translation>

  /**
   * @param {Template} templates
   * @returns {Paintor}
   */
  function compose(...templates: Template[]): Paintor

  const paintor: Paintor // & ((container: string | HTMLElement) => PaintorInterface)
}
